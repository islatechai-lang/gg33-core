import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, generateOdisId } from "./storage";
import { firebaseAuthMiddleware, requireFirebaseAuth, type AuthenticatedRequest } from "./firebaseAuth";
import { whopSdk, checkAccess, getWhopUserProfile } from "./whop";
import { generatePersonalityInsights, generateDailyEnergy, generateCompatibilityInsights, generateChatResponse, generateChatResponseWithContext, generateChatResponseStream, buildUserContext, generateWithFallback, type UserNumerologyProfile, type CompatibilityProfile, type ChatMessage } from "./gemini";
import { parsedCues, totalCuesCount, type ParsedCue } from "./cuesData";
import { Resend } from 'resend';
import { parseUTCDate } from '../shared/dateUtils';
import { reduceToSingleDigit, getLifePath, getVedicNakshatra, pythagorean } from './exploreUtils';
import { sendDailyEnergyResetNotifications, sendDailyEnergyReminders } from "./notifications";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(firebaseAuthMiddleware);

  // Get current user profile by odisId
  app.get("/api/profile/:odisId", async (req, res) => {
    const { odisId } = req.params;

    try {
      const user = await storage.getUserByOdisId(odisId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  // Create new user profile (generates odisId)
  app.post("/api/profile", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    const { fullName, birthDate, birthTime, birthLocation } = req.body;

    if (!fullName || !birthDate) {
      return res.status(400).json({ error: "Missing required fields: fullName and birthDate" });
    }

    try {
      const firebaseUid = req.user!.uid;
      const email = req.user!.email;

      // Check if user already exists
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      if (user) {
        return res.json({ success: true, user });
      }

      const odisId = generateOdisId();

      user = await storage.createUser({
        odisId,
        fullName,
        birthDate: parseUTCDate(birthDate),
        birthTime,
        birthLocation,
        firebaseUid,
        email,
      });
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Get user by Firebase UID (protected - only own profile)
  app.get("/api/profile/firebase/:firebaseUid", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    const { firebaseUid } = req.params;

    if (req.user!.uid !== firebaseUid) {
      return res.status(403).json({ error: "You can only access your own profile" });
    }

    try {
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error("Error getting user by Firebase UID:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Get current authenticated user's profile (or request onboarding)
  app.get("/api/me", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    const firebaseUid = req.user?.uid;

    if (!firebaseUid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      // Check if user exists in our database
      const user = await storage.getUserByFirebaseUid(firebaseUid);

      if (user) {
        res.json({ user, needsOnboarding: false });
      } else {
        // User doesn't exist yet - they need to complete onboarding
        res.json({
          user: null,
          needsOnboarding: true,
          firebaseUser: req.user
        });
      }
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Update existing user profile
  app.put("/api/profile/:odisId", requireFirebaseAuth, async (req, res) => {
    const { odisId } = req.params;
    const { fullName, birthDate, birthTime, birthLocation } = req.body;

    try {
      const user = await storage.updateUser(odisId, {
        fullName,
        birthDate: birthDate ? parseUTCDate(birthDate) : undefined,
        birthTime,
        birthLocation,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, user });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Get daily energy reading for a user on a specific date
  app.get("/api/daily-energy/:odisId/:date", async (req, res) => {
    const { odisId, date } = req.params;

    try {
      const energy = await storage.getDailyEnergy(odisId, date);
      if (!energy) {
        return res.status(404).json({ error: "No reading found for this date" });
      }
      res.json({ energy });
    } catch (error) {
      console.error("Error getting daily energy:", error);
      res.status(500).json({ error: "Failed to get daily energy" });
    }
  });

  // Generate and save daily energy reading
  app.post("/api/daily-energy", async (req, res) => {
    const { odisId, profile, personalDayNumber, universalDayNumber, energyScore, todayDate, date } = req.body;

    if (!odisId || !profile || !personalDayNumber || !universalDayNumber || !date) {
      return res.status(400).json({ error: "Missing required data" });
    }

    try {
      // First check if we already have a reading for today
      const existing = await storage.getDailyEnergy(odisId, date);
      if (existing) {
        return res.json({ energy: existing, cached: true });
      }

      // Generate new reading using AI
      const aiReading = await generateDailyEnergy(profile, personalDayNumber, universalDayNumber, todayDate);

      // Save to database
      const savedEnergy = await storage.saveDailyEnergy({
        odisId,
        date,
        personalDayNumber,
        universalDayNumber,
        energyScore: aiReading.energyScore,
        theme: aiReading.theme,
        description: aiReading.description,
        dos: aiReading.dos,
        donts: aiReading.donts,
        focusArea: aiReading.focusArea,
        affirmation: aiReading.affirmation,
      });

      res.json({ energy: savedEnergy, cached: false });
    } catch (error) {
      console.error("Error generating/saving daily energy:", error);
      res.status(500).json({ error: "Failed to generate daily energy" });
    }
  });

  // Get personality insight for a user
  app.get("/api/personality/:odisId", async (req, res) => {
    const { odisId } = req.params;

    try {
      const insight = await storage.getPersonalityInsight(odisId);
      if (!insight) {
        return res.status(404).json({ error: "No personality insight found" });
      }
      res.json({ insight });
    } catch (error) {
      console.error("Error getting personality insight:", error);
      res.status(500).json({ error: "Failed to get personality insight" });
    }
  });

  // Generate and save personality insight
  app.post("/api/personality", async (req, res) => {
    const { odisId, profile } = req.body;

    if (!odisId || !profile) {
      return res.status(400).json({ error: "Missing required data" });
    }

    try {
      // First check if we already have an insight
      const existing = await storage.getPersonalityInsight(odisId);
      if (existing) {
        return res.json({ insight: existing, cached: true });
      }

      // Generate new insight using AI
      const aiInsight = await generatePersonalityInsights(profile);

      // Save to database
      const savedInsight = await storage.savePersonalityInsight({
        odisId,
        overview: aiInsight.overview,
        strengths: aiInsight.strengths,
        challenges: aiInsight.challenges,
        lifeLesson: aiInsight.lifeLesson,
        careerPaths: aiInsight.careerPaths,
        relationshipStyle: aiInsight.relationshipStyle,
        spiritualGifts: aiInsight.spiritualGifts,
        profileSnapshot: {
          fullName: profile.name,
          birthDate: profile.birthDate,
          lifePathNumber: profile.lifePathNumber,
          expressionNumber: profile.expressionNumber,
          soulUrgeNumber: profile.soulUrgeNumber,
          westernZodiac: profile.westernZodiac,
          chineseZodiac: profile.chineseZodiac,
        },
      });

      res.json({ insight: savedInsight, cached: false });
    } catch (error) {
      console.error("Error generating/saving personality insight:", error);
      res.status(500).json({ error: "Failed to generate personality insight" });
    }
  });

  app.get("/api/access/:resourceId", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    const { resourceId } = req.params;
    const firebaseUid = req.user!.uid;

    // Look up the user in our DB to get their odisId for access checks
    const user = await storage.getUserByFirebaseUid(firebaseUid);
    const userId = user?.odisId || firebaseUid;

    const access = await checkAccess(resourceId, userId);
    res.json(access);
  });

  app.get("/api/whop/user/:userId", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;

    try {
      const whopProfile = await getWhopUserProfile(userId);
      if (!whopProfile) {
        return res.status(404).json({ error: "Whop user not found" });
      }
      res.json({ profile: whopProfile });
    } catch (error) {
      console.error("Error fetching Whop user profile:", error);
      res.status(500).json({ error: "Failed to fetch Whop user profile" });
    }
  });

  // Comprehensive compatibility analysis with AI insights
  app.post("/api/compatibility", async (req, res) => {
    try {
      const { person1, person2 } = req.body;

      if (!person1 || !person2 || !person1.name || !person2.name || !person1.birthDate || !person2.birthDate) {
        return res.status(400).json({ error: "Missing required profile data for both persons" });
      }

      // Build CompatibilityProfile objects for AI
      const profile1: CompatibilityProfile = {
        name: person1.name,
        lifePathNumber: person1.lifePathNumber,
        expressionNumber: person1.expressionNumber,
        soulUrgeNumber: person1.soulUrgeNumber,
        personalityNumber: person1.personalityNumber,
        attitudeNumber: person1.attitudeNumber,
        dayOfBirthNumber: person1.dayOfBirthNumber,
        westernZodiac: person1.westernZodiac,
        westernElement: person1.westernElement,
        chineseZodiac: person1.chineseZodiac,
        chineseElement: person1.chineseElement,
        energySignature: person1.energySignature,
      };

      const profile2: CompatibilityProfile = {
        name: person2.name,
        lifePathNumber: person2.lifePathNumber,
        expressionNumber: person2.expressionNumber,
        soulUrgeNumber: person2.soulUrgeNumber,
        personalityNumber: person2.personalityNumber,
        attitudeNumber: person2.attitudeNumber,
        dayOfBirthNumber: person2.dayOfBirthNumber,
        westernZodiac: person2.westernZodiac,
        westernElement: person2.westernElement,
        chineseZodiac: person2.chineseZodiac,
        chineseElement: person2.chineseElement,
        energySignature: person2.energySignature,
      };

      const overallScore = req.body.overallScore || 50;
      const level = req.body.level || 'Neutral';

      const aiInsights = await generateCompatibilityInsights(profile1, profile2, overallScore, level);

      res.json({
        success: true,
        insights: aiInsights
      });
    } catch (error) {
      console.error("Error generating compatibility insights:", error);
      res.status(500).json({ error: "Failed to generate compatibility insights" });
    }
  });

  // Legacy AI endpoints (kept for any direct usage)
  app.post("/api/ai/personality", async (req, res) => {
    try {
      const profile: UserNumerologyProfile = req.body;

      if (!profile.name || !profile.lifePathNumber) {
        return res.status(400).json({ error: "Missing required profile data" });
      }

      const insights = await generatePersonalityInsights(profile);
      res.json(insights);
    } catch (error) {
      console.error("Error generating personality insights:", error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  app.post("/api/ai/daily-energy", async (req, res) => {
    try {
      const { profile, personalDayNumber, universalDayNumber, todayDate } = req.body;

      if (!profile || !personalDayNumber || !universalDayNumber) {
        return res.status(400).json({ error: "Missing required data" });
      }

      const energy = await generateDailyEnergy(profile, personalDayNumber, universalDayNumber, todayDate);
      res.json(energy);
    } catch (error) {
      console.error("Error generating daily energy:", error);
      res.status(500).json({ error: "Failed to generate daily energy" });
    }
  });

  // CueChats - Initialize chat session (builds user context once)
  app.post("/api/chat/init", async (req, res) => {
    const { odisId } = req.body;

    if (!odisId) {
      return res.status(400).json({ error: "Missing odisId" });
    }

    try {
      const user = await storage.getUserByOdisId(odisId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Build the user context once - this does all the expensive calculations
      const { systemContext, firstName } = buildUserContext({
        fullName: user.fullName,
        birthDate: user.birthDate,
        birthTime: user.birthTime || undefined,
        birthLocation: user.birthLocation || undefined,
      });

      res.json({
        success: true,
        systemContext,
        firstName,
        message: `Chat initialized for ${firstName}. Your profile context is now loaded.`
      });
    } catch (error) {
      console.error("Error initializing chat:", error);
      res.status(500).json({ error: "Failed to initialize chat" });
    }
  });

  // CueChats - Session-based chat (uses pre-computed context - more efficient)
  app.post("/api/chat/session", async (req, res) => {
    const { message, systemContext, firstName, conversationHistory } = req.body;

    if (!message || !systemContext || !firstName) {
      return res.status(400).json({ error: "Missing required data. Please start a new chat." });
    }

    try {
      // Validate and normalize conversation history
      const normalizedHistory: ChatMessage[] = [];
      if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory) {
          if (msg && typeof msg.content === 'string' && (msg.role === 'user' || msg.role === 'assistant')) {
            normalizedHistory.push({
              role: msg.role,
              content: msg.content,
            });
          }
        }
      }

      const response = await generateChatResponseWithContext(
        message,
        systemContext,
        firstName,
        normalizedHistory
      );

      res.json({ response: response.message });
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // CueChats - Legacy AI Chat endpoint (kept for backward compatibility)
  app.post("/api/chat", async (req, res) => {
    const { odisId, message, conversationHistory } = req.body;

    if (!odisId || !message) {
      return res.status(400).json({ error: "Missing required data" });
    }

    try {
      const user = await storage.getUserByOdisId(odisId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validate and normalize conversation history
      const normalizedHistory: ChatMessage[] = [];
      if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory) {
          if (msg && typeof msg.content === 'string' && (msg.role === 'user' || msg.role === 'assistant')) {
            normalizedHistory.push({
              role: msg.role,
              content: msg.content,
            });
          }
        }
      }

      const response = await generateChatResponse(
        message,
        {
          fullName: user.fullName,
          birthDate: user.birthDate,
          birthTime: user.birthTime || undefined,
          birthLocation: user.birthLocation || undefined,
        },
        normalizedHistory
      );

      res.json({ response: response.message });
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // CueChats - Streaming AI Chat endpoint for faster responses
  app.post("/api/chat/stream", async (req, res) => {
    const { odisId, message, conversationHistory } = req.body;

    if (!odisId || !message) {
      return res.status(400).json({ error: "Missing required data" });
    }

    try {
      const user = await storage.getUserByOdisId(odisId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validate and normalize conversation history
      const normalizedHistory: ChatMessage[] = [];
      if (Array.isArray(conversationHistory)) {
        for (const msg of conversationHistory) {
          if (msg && typeof msg.content === 'string' && (msg.role === 'user' || msg.role === 'assistant')) {
            normalizedHistory.push({
              role: msg.role,
              content: msg.content,
            });
          }
        }
      }

      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = generateChatResponseStream(
        message,
        {
          fullName: user.fullName,
          birthDate: user.birthDate,
          birthTime: user.birthTime || undefined,
          birthLocation: user.birthLocation || undefined,
        },
        normalizedHistory
      );

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error generating chat stream:", error);
      res.write(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`);
      res.end();
    }
  });

  // Course Progress API (in-memory)
  app.get("/api/progress/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;
      const progress = await storage.getCourseProgress(courseId);
      res.json(progress);
    } catch (error) {
      console.error("Error getting course progress:", error);
      res.status(500).json({ error: "Failed to get progress" });
    }
  });

  app.post("/api/progress/complete", async (req, res) => {
    try {
      const { courseId, lessonId } = req.body;
      if (!courseId || !lessonId) {
        return res.status(400).json({ error: "Missing courseId or lessonId" });
      }
      await storage.markLessonComplete(courseId, lessonId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      res.status(500).json({ error: "Failed to mark lesson complete" });
    }
  });

  app.get("/api/explore/yearly-forecast/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const year = new Date().getFullYear();
    const l = parseInt(lifePath) || 1;
    // Accurate Personal Year: sum of birth month + birth day (reduced) + current year (reduced)
    // Since we only have Life Path (which is month + day + year), we can approximate by:
    // Personal Year = reduced(Month + Day + CurrentYear)
    // Mathematical shortcut if we only know LP: PersonalYear = reduced(LP - reduced(BirthYear) + reduced(CurrentYear))
    // To make it simple and deterministic given just LP, we use a standard progression:
    const personalYearNumber = reduceToSingleDigit(l + reduceToSingleDigit(year));

    const yearTitles: Record<number, string> = { 1: 'New Beginnings', 2: 'Partnership & Patience', 3: 'Creative Expression', 4: 'Building Foundations', 5: 'Change & Freedom', 6: 'Love & Responsibility', 7: 'Introspection & Wisdom', 8: 'Abundance & Power', 9: 'Completion & Release' };
    const luckyMonths = [reduceToSingleDigit(personalYearNumber + 1), reduceToSingleDigit(personalYearNumber + 5), reduceToSingleDigit(personalYearNumber + 9)];
    const challengeMonths = [reduceToSingleDigit(personalYearNumber + 4), reduceToSingleDigit(personalYearNumber + 8)];

    res.json({
      year,
      personalYearNumber,
      title: `The Year of ${yearTitles[personalYearNumber] || 'Growth'}`,
      description: `This year brings a powerful shift in your energetic resonance. With a Personal Year number of ${personalYearNumber}, you are entering a cycle focused on overarching growth aligned with your Life Path ${l}. Prepare to shed old patterns and embrace incoming cosmic opportunities.`,
      quarters: [
        { quarter: 'Q1 (Jan-Mar)', theme: 'Planting Seeds', advice: 'Focus on setting intentions and initiating new connections.' },
        { quarter: 'Q2 (Apr-Jun)', theme: 'Cultivation', advice: 'Nurture your projects. Patience is your strongest asset now.' },
        { quarter: 'Q3 (Jul-Sep)', theme: 'Harvest & Tests', advice: 'You will see the fruits of your labor, but expect unexpected challenges.' },
        { quarter: 'Q4 (Oct-Dec)', theme: 'Reflection', advice: 'Review the year, consolidate your gains, and prepare for the next cycle.' }
      ],
      keyDates: [
        { month: 'January', event: 'New Year energy reset — set your annual intention on the 1st', type: 'opportunity' },
        { month: 'March', event: `Personal Month ${reduceToSingleDigit(personalYearNumber + 3)} brings an energy shift — pivot or accelerate`, type: 'turning-point' },
        { month: 'June', event: 'Mid-year alignment check — reassess your trajectory', type: 'review' },
        { month: 'September', event: `Personal Month ${reduceToSingleDigit(personalYearNumber + 9)} echoes your Personal Year — maximum amplitude`, type: 'peak' },
        { month: 'December', event: 'Year completion — release what no longer serves you before the next cycle', type: 'release' }
      ],
      luckyMonths: luckyMonths.map(m => ({ month: m, name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] || 'Dec' })),
      challengeMonths: challengeMonths.map(m => ({ month: m, name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] || 'Dec' }))
    });
  });

  app.post("/api/explore/yearly-forecast/interact", async (req, res) => {
    try {
      const { lifePath, goal } = req.body;
      const year = new Date().getFullYear();
      const l = parseInt(lifePath) || 1;
      const personalYearNumber = reduceToSingleDigit(l + reduceToSingleDigit(year));

      const prompt = `You are an expert numerologist. The user is a Life Path ${l} and is currently in a Personal Year ${personalYearNumber} (${year}).
      
      Their specific goal for this year is: "${goal}"
      
      Provide a highly personalized 4-5 sentence strategic roadmap on how they can use the specific energetic frequency of their Personal Year ${personalYearNumber} to achieve this goal. Be practical, mystical, and direct. Do not use generic filler. Focus on action items perfectly suited for a Life Path ${l} navigating a Personal Year ${personalYearNumber}.`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating yearly forecast AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/monthly-forecast/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const l = parseInt(lifePath) || 1;
    const d = new Date();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const personalYearNumber = reduceToSingleDigit(l + reduceToSingleDigit(year));
    const personalMonthNumber = reduceToSingleDigit(personalYearNumber + month);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const weekLabels = ['Week 1 (1st-7th)', 'Week 2 (8th-14th)', 'Week 3 (15th-21st)', 'Week 4 (22nd-End)'];
    const weekThemes = [
      { focus: 'Initiation', tip: 'Set your monthly intention. The first week carries the strongest seeding energy.' },
      { focus: 'Building', tip: 'Double down on what you started. Momentum is building beneath the surface.' },
      { focus: 'Testing', tip: 'Expect friction — this is the universe stress-testing your commitment.' },
      { focus: 'Completion', tip: 'Harvest results and rest. Prepare mentally for the next monthly cycle.' }
    ];
    const luckyDays = [reduceToSingleDigit(personalMonthNumber), reduceToSingleDigit(personalMonthNumber + 9), reduceToSingleDigit(personalMonthNumber + 18)].filter(d => d >= 1 && d <= 28);
    const affirmations: Record<number, string> = {
      1: 'I am the architect of my reality. Every action I take creates my world.',
      2: 'I attract harmonious partnerships that elevate my soul mission.',
      3: 'My creative expression flows freely and touches everyone it meets.',
      4: 'I build unshakable foundations that support generations.',
      5: 'I embrace change with courage and excitement.',
      6: 'Love flows through me and into everything I create.',
      7: 'I trust my inner wisdom above all external noise.',
      8: 'Abundance is my birthright. I am worthy of material and spiritual wealth.',
      9: 'I release what no longer serves me with grace and gratitude.'
    };

    res.json({
      monthName: months[month - 1],
      personalMonthNumber,
      summary: `This month your energy peaks around the frequency of ${personalMonthNumber}. This vibration perfectly complements your Life Path ${l}'s natural rhythm.`,
      opportunities: [
        personalMonthNumber === 1 ? 'Starting new ventures' : personalMonthNumber === 2 ? 'Forming deep partnerships' : 'Creative expression',
        'Networking with high-vibration individuals',
        'Healing past relationship wounds'
      ],
      challenges: ['Over-committing your energy', 'Ignoring intuitive red flags', 'Financial impulsivity'],
      weeklyBreakdown: weekLabels.map((label, i) => ({ week: label, ...weekThemes[i] })),
      affirmation: affirmations[personalMonthNumber] || affirmations[1],
      luckyDays
    });
  });

  app.post("/api/explore/monthly-forecast/interact", async (req, res) => {
    try {
      const { lifePath, obstacle } = req.body;
      const l = parseInt(lifePath) || 1;
      const d = new Date();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const personalYearNumber = reduceToSingleDigit(l + reduceToSingleDigit(year));
      const personalMonthNumber = reduceToSingleDigit(personalYearNumber + month);

      const prompt = `You are a visionary numerologist and problem solver. The user is a Life Path ${l} and is currently in a Personal Month ${personalMonthNumber}.
      
      They are facing this specific obstacle right now: "${obstacle}"
      
      Provide a precise 3-4 sentence strategy on how they can overcome or reframe this obstacle by leveraging the specific energy of their Personal Month ${personalMonthNumber}. Be insightful, empowering, and use numerological principles to give them an exact energetic hack to solve this.`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating monthly forecast AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/home-picker/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const l = parseInt(lifePath) || 1;

    let envs = [];
    if ([1, 5, 8].includes(l)) {
      envs = [{ type: 'Bustling City Centers', description: 'Provides the high-tempo and business opportunity your nervous system craves.' }, { type: 'Modern Lofts', description: 'Clean geometry and open space.' }];
    } else if ([2, 6, 9].includes(l)) {
      envs = [{ type: 'Serene Suburbs', description: 'Allows you to build deep community and family roots.' }, { type: 'Nature-Adjacent', description: 'Near parks or water to soothe your empathetic field.' }];
    } else if ([3, 33].includes(l)) {
      envs = [{ type: 'Artistic Districts', description: 'Inspires your immense need for creative output.' }, { type: 'Vibrant Communities', description: 'Keeps your social energy high.' }];
    } else {
      envs = [{ type: 'Mountain & Grounded', description: 'Aligns with your analytical and structural soul urge.' }, { type: 'Quiet Retreats', description: 'Provides solitude for deep work.' }];
    }

    const fengShuiTips = [
      { area: 'Front Door', tip: `Paint or decorate with colors that resonate with Life Path ${l}. This is where energy enters your space.` },
      { area: 'Bedroom', tip: 'Remove electronics and place your bed so it faces your personal power direction (based on your LP).' },
      { area: 'Kitchen', tip: 'Keep the stove clean and all burners working — this directly affects your wealth frequency.' },
      { area: 'Home Office', tip: `Place your desk facing the door. Position personal lucky objects related to number ${l} on the desk.` }
    ];
    const goodHouseNumbers = [l, reduceToSingleDigit(l + 2), reduceToSingleDigit(l + 4), 11, 22].filter((v, i, a) => a.indexOf(v) === i);
    const avoidHouseNumbersRaw = [reduceToSingleDigit(10 - l), l === 8 ? 4 : l === 4 ? 8 : reduceToSingleDigit(l + 5)].filter((v, i, a) => a.indexOf(v) === i && v !== l);
    const avoidHouseNumbers = avoidHouseNumbersRaw.filter(v => !goodHouseNumbers.includes(v));

    res.json({
      overview: `Your Life Path ${l} thrives in environments that balance stimulation with grounding. The energetic blueprint of your ideal home requires a specific mathematical resonance.`,
      environments: envs,
      goodHouseNumbers,
      fengShuiTips,
      avoidHouseNumbers
    });
  });

  app.post("/api/explore/home-picker/interact", async (req, res) => {
    try {
      const { lifePath, input } = req.body;
      const l = parseInt(lifePath) || 1;

      const prompt = `You are an expert numerologist and feng shui master. The user is a Life Path ${l}.
      
      They are considering moving to or living in this specific location/environment: "${input}"
      
      Provide a precise 3-4 sentence evaluation of how this location's energetic signature naturally aligns (or misaligns) with a Life Path ${l}. Give them specific advice on how to harmonize with this environment, or what specific area of the home they should focus their energetic intention on. Do not give generic real estate advice, focus purely on the numerological/energetic resonance.`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating home picker AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/cars/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const l = parseInt(lifePath) || 1;

    let types = [];
    let colors = [];

    if ([1, 8].includes(l)) {
      types = [{ category: 'Luxury Sedans', reason: 'Matches your need for executive presence.', examples: ['Mercedes S-Class', 'BMW 7 Series'] }, { category: 'Sport Cars', reason: 'Fulfills your desire for speed and leadership.', examples: ['Porsche 911'] }];
      colors = ['Obsidian Black', 'Chrome Silver', 'Deep Crimson'];
    } else if ([4, 22].includes(l)) {
      types = [{ category: 'Reliable SUVs', reason: 'Provides the structure and safety you seek.', examples: ['Toyota Land Cruiser', 'Volvo XC90'] }, { category: 'Practical Sedans', reason: 'Logical and efficient.', examples: ['Honda Accord'] }];
      colors = ['Earthy Brown', 'Forest Green', 'Slate Grey'];
    } else if ([5].includes(l)) {
      types = [{ category: 'Off-Road / Adventure', reason: 'Accommodates your sudden urges to travel.', examples: ['Jeep Wrangler', 'Ford Bronco'] }, { category: 'Convertibles', reason: 'Gives you the feeling of absolute freedom.', examples: ['Mazda MX-5'] }];
      colors = ['Electric Blue', 'Vibrant Yellow', 'Metallic Silver'];
    } else {
      types = [{ category: 'Eco/Electric', reason: 'Resonates with your conscious and caring vibration.', examples: ['Tesla Model Y', 'Lucid Air'] }, { category: 'Comfort Cruisers', reason: 'A peaceful sanctuary on wheels.', examples: ['Lexus ES'] }];
      colors = ['Pearl White', 'Sapphire Blue', 'Soft Lavender'];
    }

    const luckyPlateDigits = [l, reduceToSingleDigit(l + 3), reduceToSingleDigit(l * 3)].filter((v, i, a) => a.indexOf(v) === i);
    const directions: Record<number, string> = { 1: 'North', 2: 'South-West', 3: 'East', 4: 'South', 5: 'All (your freedom number)', 6: 'North-West', 7: 'West', 8: 'North-East', 9: 'South-East' };

    res.json({
      overview: `A vehicle is an extension of your aura. For Life Path ${l}, your car needs to reflect your inner drive and provide the right energetic protection on the road.`,
      types,
      colors,
      luckyPlateDigits,
      idealDriveDirection: directions[l] || 'North',
      avoidNote: `Avoid purchasing a vehicle on a day that reduces to ${reduceToSingleDigit(10 - l)} — this frequency conflicts with your Life Path.`
    });
  });

  app.post("/api/explore/cars/interact", async (req, res) => {
    try {
      const { lifePath, input } = req.body;
      const l = parseInt(lifePath) || 1;

      const prompt = `You are a mystical numerologist that reads the energy of material objects. The user is a Life Path ${l}.
      
      They are considering buying or driving this specific vehicle: "${input}"
      
      Provide a highly precise 3-4 sentence energetic evaluation. Does this specific car model align with the core frequency of a Life Path ${l}? What specific interior or exterior color should they choose for this exact vehicle to maximize their manifestations and personal protection while driving it?`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating cars AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/lucky-number/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const l = parseInt(lifePath) || 1;
    const birthDate = req.query.birthDate as string || null;

    // Primary is the life path itself
    const primary = l;

    // Secondary numbers derived mathematically
    const secondary = [
      l === 1 ? 8 : reduceToSingleDigit(l + 7),
      reduceToSingleDigit(l * 2) === l ? reduceToSingleDigit(l + 3) : reduceToSingleDigit(l * 2),
      l === 9 ? 3 : reduceToSingleDigit(l + 4)
    ].filter((v, i, a) => a.indexOf(v) === i && v !== primary);

    // Build calculation methods with step-by-step breakdowns
    const calculations: any[] = [];

    // Method 1: Life Path Method
    calculations.push({
      method: 'Life Path Number',
      description: 'Your primary lucky number derived from your entire birth date',
      result: l,
      steps: [`Your Life Path = ${l}`, `This is your most powerful personal frequency`],
      icon: 'star'
    });

    // Method 2: Birth Day Compound (the "Michael Jordan 23" method)
    if (birthDate) {
      const bd = new Date(birthDate);
      if (!isNaN(bd.getTime())) {
        const month = bd.getUTCMonth() + 1;
        const day = bd.getUTCDate();
        const year = bd.getUTCFullYear();
        const lastDigitMonth = month % 10;
        const lastDigitYear = year % 10;
        const compound = lastDigitMonth * 10 + lastDigitYear;
        const dayCompound = day;
        calculations.push({
          method: 'Birth Day Compound',
          description: 'Last digit of your birth month combined with last digit of birth year (the "jersey number" method)',
          result: compound,
          steps: [
            `Birth month: ${month} → last digit: ${lastDigitMonth}`,
            `Birth year: ${year} → last digit: ${lastDigitYear}`,
            `Compound: ${lastDigitMonth} and ${lastDigitYear} = ${compound}`,
            `Example: Michael Jordan born 02/17/1963 → 2 and 3 = 23`
          ],
          icon: 'zap'
        });

        // Method 3: Fadic Number
        const allDigits = `${month}${day}${year}`.split('').map(Number);
        const fadicSum = allDigits.reduce((s, d) => s + d, 0);
        const fadicReduced = reduceToSingleDigit(fadicSum, false);
        calculations.push({
          method: 'Fadic Number',
          description: 'Sum of ALL digits in your birth date reduced to a single digit',
          result: fadicReduced,
          steps: [
            `Birth date digits: ${allDigits.join(' + ')}`,
            `Sum: ${fadicSum}`,
            fadicSum > 9 ? `Reduced: ${fadicSum} → ${fadicReduced}` : `Already single digit: ${fadicReduced}`
          ],
          icon: 'hash'
        });

        // Method 4: Day of Birth Power
        calculations.push({
          method: 'Birth Day Number',
          description: 'Your raw birth day carries its own lucky frequency',
          result: dayCompound > 9 ? reduceToSingleDigit(dayCompound, true) : dayCompound,
          steps: [
            `Born on the ${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}`,
            dayCompound > 9 ? `${day} → ${reduceToSingleDigit(dayCompound, true)} (reduced)` : `Single digit: ${dayCompound}`,
            `This number reflects your natural talents and abilities`
          ],
          icon: 'calendar'
        });

        // Method 5: Karmic Debt Check
        const rawLifePathSum = month + day + allDigits.slice(String(month).length + String(day).length).reduce((s, d) => s + d, 0);
        const karmicNumbers = [13, 14, 16, 19];
        const hasKarmic = karmicNumbers.find(k => fadicSum === k || rawLifePathSum === k || day === k);
        calculations.push({
          method: 'Karmic Debt Check',
          description: 'Certain compound numbers (13, 14, 16, 19) carry special karmic significance',
          result: hasKarmic || 'None',
          steps: hasKarmic ? [
            `Raw sum detected: ${hasKarmic}`,
            `Karmic Debt ${hasKarmic}: ${hasKarmic === 13 ? 'Hard work and transformation required' : hasKarmic === 14 ? 'Lesson in freedom and moderation' : hasKarmic === 16 ? 'Ego dissolution and spiritual awakening' : 'Independence through selfless service'}`,
            `This is not negative — it's your accelerated growth path`
          ] : [
            `No karmic debt numbers (13, 14, 16, 19) found in your birth date`,
            `Your numerical path is unencumbered`,
            `Focus on manifesting freely with your lucky numbers`
          ],
          icon: 'circle'
        });
      }
    }

    // If no birth date provided, add generic methods
    if (calculations.length === 1) {
      calculations.push({
        method: 'Destiny Compound',
        description: 'Secondary frequencies derived from your Life Path harmonics',
        result: secondary.join(', '),
        steps: [
          `Life Path ${l} × 2 = ${l * 2} → reduced: ${reduceToSingleDigit(l * 2)}`,
          `Life Path ${l} + 7 = ${l + 7} → reduced: ${reduceToSingleDigit(l + 7)}`,
          `These numbers amplify your primary frequency`
        ],
        icon: 'grid'
      });
    }

    // Power days: days of the month that resonate
    const powerDays = [l, l + 9, l + 18].filter(d => d >= 1 && d <= 31);
    powerDays.push(reduceToSingleDigit(l + 2) + 9);
    powerDays.push(reduceToSingleDigit(l + 5) + 18);
    const uniquePowerDays = Array.from(new Set(powerDays.filter(d => d >= 1 && d <= 31))).sort((a, b) => a - b);

    // Avoid numbers
    const avoidNumbers = [
      l === 1 ? 6 : l === 2 ? 5 : l === 3 ? 8 : l === 4 ? 5 : l === 5 ? 4 : l === 6 ? 1 : l === 7 ? 2 : l === 8 ? 3 : 5,
      reduceToSingleDigit(10 - l)
    ].filter((v, i, a) => a.indexOf(v) === i && v !== l);

    // Manifestation tips per LP
    const tips: Record<number, string> = {
      1: 'Write your goals on the 1st of each month. Your initiating energy is strongest at the start of cycles.',
      2: 'Pair up with someone for manifestation work. Your power doubles in partnership.',
      3: 'Speak your desires aloud — your voice carries creation frequency.',
      4: 'Build a physical vision board. Your Earth energy needs tangible anchors.',
      5: 'Change your environment when manifesting. Movement unlocks your frequency.',
      6: 'Manifest through acts of service. What you give, returns amplified.',
      7: 'Meditate on your numbers in solitude. Your inner world shapes outer reality.',
      8: 'Write your lucky numbers on checks or financial documents. Your power is material.',
      9: 'Release old desires to make room. Your number completes cycles before starting new ones.'
    };

    res.json({
      primary,
      secondary,
      calculations,
      powerDays: uniquePowerDays,
      avoidNumbers,
      manifestationTip: tips[l] || tips[1],
      howToUse: 'Write your primary number on a piece of paper and keep it in your wallet. Use your secondary numbers when selecting dates, flight seat assignments, or times to initiate important emails.'
    });
  });

  app.post("/api/explore/lucky-number/interact", async (req, res) => {
    try {
      const { lifePath, input } = req.body;
      const l = parseInt(lifePath) || 1;

      const prompt = `You are a master of numerological synchronicities. The user is a Life Path ${l}.
      
      They are asking about a specific number or date that has been appearing in their life: "${input}"
      
      Provide a precise 3-4 sentence decoding of this synchronicity. How does this specific number or date relate to their core Life Path ${l} frequency? Is it a warning, a green light, or a specific energetic marker they should pay attention to right now?`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating lucky number AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/letterology", (req, res) => {
    const fullName = typeof req.query.name === 'string' ? req.query.name : 'Unknown';
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || 'Unknown';

    const cleanFirstName = firstName.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const letters = cleanFirstName.split('').map(char => ({
      char,
      value: pythagorean[char] || 0
    }));

    if (letters.length === 0) {
      return res.json({
        letters: [{ char: 'A', value: 1 }],
        cornerstone: { char: 'A', meaning: 'Originality' },
        capstone: { char: 'A', meaning: 'Completion' },
        summary: 'Name analysis requires alphabetic characters.'
      });
    }

    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const firstVowel = letters.find(l => vowels.includes(l.char));

    const meanings: Record<string, string> = {
      'A': 'Ambitious and independent. You initiate with force.',
      'B': 'Sensitive and cooperative. You seek harmony.',
      'C': 'Creative and expressive. You bring joy to projects.',
      'D': 'Practical and grounded. You build solid foundations.',
      'E': 'Versatile and freedom-loving. You adapt quickly.',
      'F': 'Responsible and nurturing. You care for the details.',
      'G': 'Analytical and introspective. You seek inner truth.',
      'H': 'Authoritative and efficient. You aim for big results.',
      'I': 'Idealistic and compassionate. You work with vision.',
      'J': 'Inventive and self-motivated. A natural leader.',
      'K': 'Intuitive and inspirational. You act as a catalyst.',
      'L': 'Intellectual and friendly. You gather information.',
      'M': 'Hard-working and stable. The "worker bee" energy.',
      'N': 'Dynamic and unconventional. You think outside the box.',
      'O': 'Patience and service. You are the backbone.',
      'P': 'Philosophical and studious. You look for deep meaning.',
      'Q': 'Unique and influential. You have a rare perspective.',
      'R': 'Resilient and intense. You finish with great power.',
      'S': 'Charismatic and emotional. You prefer to work solo.',
      'T': 'Cooperative and team-oriented. You work through others.',
      'U': 'Lucky and artistic. You have a natural flow.',
      'V': 'Visionary and master builder. Long-term focus.',
      'W': 'Experimental and purposeful. You seek experience.',
      'X': 'Exceptional and helpful. You are a natural teacher.',
      'Y': 'Mystical and questioning. You look for the why.',
      'Z': 'Optimistic and hopeful. You see the light ahead.'
    };

    // Use the full name for the core 3 pillars (to match user profile)
    const cleanFullName = (req.query.name as string || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
    const fullNameLetters = cleanFullName.split('');

    // Calculate expression number (FULL NAME sum reduced)
    const totalFullNameSum = fullNameLetters.reduce((sum: number, char: string) => sum + (pythagorean[char] || 0), 0);
    const expressionNumber = reduceToSingleDigit(totalFullNameSum, true);

    // Vowel sum = Soul Urge Number (FULL NAME)
    const fullNameVowels = fullNameLetters.filter((char: string) => vowels.includes(char));
    const vowelSum = fullNameVowels.reduce((sum: number, char: string) => sum + (pythagorean[char] || 0), 0);
    const soulUrgeNumber = reduceToSingleDigit(vowelSum, true);

    // Consonant sum = Personality Number (FULL NAME)
    const fullNameConsonants = fullNameLetters.filter((char: string) => !vowels.includes(char));
    const consonantSum = fullNameConsonants.reduce((sum: number, char: string) => sum + (pythagorean[char] || 0), 0);
    const personalityNumber = reduceToSingleDigit(consonantSum, true);

    // Name energy rating
    const nameEnergy = expressionNumber >= 7 ? 'High Power' : expressionNumber >= 4 ? 'Balanced' : 'Grounding';

    res.json({
      fullName,
      firstName,
      letters: letters.slice(0, 15),
      cornerstone: {
        char: letters[0].char,
        meaning: meanings[letters[0].char] || 'A unique starting vibration.'
      },
      capstone: {
        char: letters[letters.length - 1].char,
        meaning: meanings[letters[letters.length - 1].char] || 'A unique closing vibration.'
      },
      soulUrge: firstVowel ? {
        char: firstVowel.char,
        meaning: `The first vowel '${firstVowel.char}' reveals your soul's deepest desire: ${firstVowel.char === 'A' ? 'Independence and achievement.' :
          firstVowel.char === 'E' ? 'Freedom and variety.' :
            firstVowel.char === 'I' ? 'Recognition and creativity.' :
              firstVowel.char === 'O' ? 'Responsibility and stability.' :
                'Understanding and esoteric wisdom.'
          }`
      } : null,
      expressionNumber,
      expressionBreakdown: `Sum of full name letters (${totalFullNameSum}) reduced to ${expressionNumber}. ${expressionNumber}: Your Expression Number reveals the talents and abilities you were born with.`,
      soulUrgeNumber,
      soulUrgeBreakdown: `Sum of vowels in full name (${vowelSum}) reduced to ${soulUrgeNumber}. Soul Urge ${soulUrgeNumber}: This is what truly motivates you at the deepest level — your innermost desires and dreams.`,
      personalityNumber,
      personalityBreakdown: `Sum of consonants in full name (${consonantSum}) reduced to ${personalityNumber}. Personality ${personalityNumber}: This is the mask you show the world — how others perceive you before they know you deeply.`,
      nameEnergy,
      summary: `Analyzing "${firstName}" within the context of your full vibrational signature: Your name starts with the ${letters[0].char} (Cornerstone), showing how you start things, and ends with ${letters[letters.length - 1].char} (Capstone), showing how you finish. This creates a powerful ${letters[0].value} to ${letters[letters.length - 1].value} numerical transit in everything you do.`
    });
  });

  app.post("/api/explore/letterology/interact", async (req, res) => {
    try {
      const { input } = req.body; // 'input' is the name they want to analyze

      const prompt = `You are an elite Pythagorean Numerologist and Letterology expert. The user is asking for a deep reading on the resonance of the name: "${input}"
      
      Analyze the name based on these factors:
      1. Component Letters: The physical vibration of the specific alphabet characters.
      2. Numerical Sequence: The 1-9 frequency of the name.
      3. Practical Verdict: Is this name better for business, fame, spiritual work, or family?
      
      Provide a highly valuable, punchy, and professional 4-5 sentence analysis. Avoid generic flattery—be precise about what this name attracts and what its weaknesses are. Does it attract power (8), stability (4), or change (5)? Give a final "Power Verdict" for the name "${input}".`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating letterology AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/matrix-numbers/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const l = parseInt(lifePath) || 1;

    // Matrix Activation Ages are mathematically derived from Life Path and Universal Constants
    // Standard peaks are often multiples of the life path or harmonic intervals like 27, 36, 45, 54
    const age1 = 18;
    const age2 = 27;
    const age3 = 36;
    const age4 = 45;
    const age5 = 54;
    const age6 = 63;

    // Determine current phase if birthDate is available
    const birthDateStr = req.query.birthDate as string || null;
    let currentPhase = null;
    if (birthDateStr) {
      const bd = new Date(birthDateStr);
      if (!isNaN(bd.getTime())) {
        const currentAge = new Date().getFullYear() - bd.getUTCFullYear();
        const milestones = [age1, age2, age3, age4, age5, age6];
        const nextMilestone = milestones.find(m => m > currentAge);
        const prevMilestone = milestones.slice().reverse().find(m => m <= currentAge);
        currentPhase = {
          currentAge,
          nextGateway: nextMilestone || 'Mastery achieved',
          yearsToNext: nextMilestone ? nextMilestone - currentAge : 0,
          lastGateway: prevMilestone || 'Not yet reached',
          phase: currentAge < 18 ? 'Pre-Activation' : currentAge < 27 ? 'The Awakening' : currentAge < 36 ? 'The Ascension' : currentAge < 45 ? 'The Mastery' : currentAge < 54 ? 'The Integration' : currentAge < 63 ? 'The Wisdom' : 'The Transcendence'
        };
      }
    }

    res.json({
      lifePath: l,
      intro: `Your Personal Matrix is the hidden mathematical code that activates at specific ages. As a Life Path ${l}, these "Matrix Gateways" are when your core frequency hits its maximum amplitude and reality becomes most malleable.`,
      sequence: [age1, age2, age3, age4, age5, age6],
      milestones: [
        { age: age1, title: 'The Awakening', description: 'The first whisper of your true purpose. Seeds of awareness are planted during this gateway.' },
        { age: age2, title: 'The Reset', description: 'Your first major Matrix gateway where old karmic patterns are purged to make way for your true purpose.' },
        { age: age3, title: 'The Peak', description: 'The absolute zenith of your earthly manifestation power. Your Life Path frequency is at its loudest.' },
        { age: age4, title: 'The Shift', description: 'A period of profound internal restructuring where your secondary energy signatures begin to dominate.' },
        { age: age5, title: 'The Master', description: 'Full integration of your numerical blueprint. You move from being a passenger to an architect of the matrix.' },
        { age: age6, title: 'The Transcendence', description: 'Wisdom crystallizes. You become a frequency beacon for others walking the same Life Path.' }
      ],
      currentPhase
    });
  });

  app.post("/api/explore/matrix-numbers/interact", async (req, res) => {
    try {
      const { lifePath, input } = req.body;
      const l = parseInt(lifePath) || 1;

      const prompt = `You are a digital mystic and matrix architect. The user is a Life Path ${l}.
      
      They are asking about this specific age or life period: "${input}"
      
      Provide a highly precise 4-5 sentence analysis of why this age is a "Matrix Gateway" for a Life Path ${l}. 
      1. What specific numerical frequency is active at "${input}" for them?
      2. How can they "hack" their current reality at this age?
      3. Give them one specific "Matrix Key" (action) they should take immediately to manifest faster.
      
      BE VALUABLE AND ACTIONABLE. Avoid generic talk. Use the language of code and mathematics.`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating matrix numbers AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/cue-cards/draw", (req, res) => {
    const cards = [
      { suit: 'SWORDS OF INTELLECT', type: 'action', cardName: 'The Alchemist', message: 'You have the power to transform current leaden circumstances into golden opportunities through a shift in perspective.', keyword: 'Transmutation' },
      { suit: 'CUPS OF EMOTION', type: 'intuition', cardName: 'The Deep Diver', message: 'Do not fear the emotional depths today. What surfaces is ready to be healed.', keyword: 'Subconscious' },
      { suit: 'WANDS OF FIRE', type: 'action', cardName: 'The Catalyst', message: 'Take the bold leap. The energetic currents are fully supporting dramatic forward movement.', keyword: 'Initiation' },
      { suit: 'PENTACLES OF EARTH', type: 'intuition', cardName: 'The Architect', message: 'Slow down and secure your foundations. Quality over speed is your mantra right now.', keyword: 'Stability' },
      { suit: 'SWORDS OF INTELLECT', type: 'action', cardName: 'The Mirror', message: 'What you see in others right now is a direct reflection of what you need to heal within yourself.', keyword: 'Reflection' },
      { suit: 'CUPS OF EMOTION', type: 'intuition', cardName: 'The River', message: 'Stop resisting the current of change. Surrender to the flow and you will arrive exactly where you need to be.', keyword: 'Surrender' },
      { suit: 'WANDS OF FIRE', type: 'action', cardName: 'The Phoenix', message: 'What has burned down is making space for your most powerful rebirth. Rise now.', keyword: 'Rebirth' },
      { suit: 'PENTACLES OF EARTH', type: 'intuition', cardName: 'The Seed', message: 'Something planted months ago is about to break through the surface. Patience is rewarded today.', keyword: 'Germination' },
      { suit: 'SWORDS OF INTELLECT', type: 'action', cardName: 'The Decoder', message: 'Pay attention to patterns and synchronicities today. The universe is sending you encrypted messages.', keyword: 'Synchronicity' },
      { suit: 'CUPS OF EMOTION', type: 'intuition', cardName: 'The Healer', message: 'Your presence alone is medicine for someone today. Show up fully and authentically.', keyword: 'Presence' },
      { suit: 'WANDS OF FIRE', type: 'action', cardName: 'The Disruptor', message: 'Break one rule today that has been keeping you small. Your rebellion is divinely guided.', keyword: 'Liberation' },
      { suit: 'PENTACLES OF EARTH', type: 'intuition', cardName: 'The Keeper', message: 'Protect your energy fiercely today. Not everyone deserves access to your inner world.', keyword: 'Boundaries' }
    ];
    res.json(cards[Math.floor(Math.random() * cards.length)]);
  });

  app.post("/api/explore/cue-cards/interact", async (req, res) => {
    try {
      const { cardName, suit, message, input } = req.body;

      const prompt = `You are an expert card reader and intuitive. The user just drew this card: "${cardName}" of the "${suit}" (Message: "${message}").
      
      Their specific question or situation is: "${input}"
      
      Provide a precise 3-4 sentence interpretation. How does the specific energy of "${cardName}" directly answer their question? Give them one specific "Cue" (action) they should take in the next 24 hours to align with this card's guidance.`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating cue cards AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/dream-interpreter/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const l = parseInt(lifePath) || 1;
    res.json({
      intro: `As a Life Path ${l}, your dreamscape isn't just random brain static; it's a specific frequency receptor. You are highly prone to prophetic and lucid dreams right now.`,
      commonDreams: [
        { symbol: 'Flying or Levitation', meaning: 'You are transcending a previous limitation or earthly worry.', shift: 'Your energy centers are opening.', frequency: 'Very Common' },
        { symbol: 'Water (Oceans/Rivers)', meaning: 'Your subconscious is processing dense emotional trauma from the past year.', shift: 'A major purification phase.', frequency: 'Common' },
        { symbol: 'Being Chased', meaning: 'You are avoiding a karmic lesson that your Life Path requires you to face.', shift: 'Time to ground and confront.', frequency: 'Common' },
        { symbol: 'Teeth Falling Out', meaning: 'Anxiety about loss of control or a major life transition that feels forced.', shift: 'Your identity is being restructured — surrender to the upgrade.', frequency: 'Very Common' },
        { symbol: 'Deceased Loved Ones', meaning: 'A message from the ancestral realm. Pay attention to what they say or show you.', shift: 'The veil is thin for you right now. Record everything.', frequency: 'Significant' },
        { symbol: 'Empty Houses / Unknown Rooms', meaning: 'Undiscovered parts of your psyche are ready to be explored and integrated.', shift: 'Hidden talents and memories are surfacing for activation.', frequency: 'Moderate' }
      ],
      lucidDreamTip: `As a Life Path ${l}, try setting an intention before sleep: "I will remember my dreams and receive guidance." Keep a journal by your bed and write immediately upon waking.`,
      bestSleepHours: l <= 4 ? '10pm - 6am' : l <= 7 ? '11pm - 7am' : '9pm - 5am'
    });
  });

  app.post("/api/explore/dream-interpreter/interact", async (req, res) => {
    try {
      const { lifePath, input } = req.body;
      const l = parseInt(lifePath) || 1;

      const prompt = `You are a mystical dream alchemist. The user is a Life Path ${l}.
      
      They just had this dream: "${input}"
      
      Provide a highly precise 3-4 sentence decoding of the symbols in this dream. How does the specific message of this dream relate to their Life Path ${l} journey? Give them one specific "Dream Action" they should take today to ground the wisdom of this dream into their physical reality.`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating dream interpreter AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/energy-insights/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const energySignature = req.query.energy as string || 'Fire';
    const l = parseInt(lifePath) || 1;

    // Determine aura mock color
    let hexCode = '#FFD700';
    let auraColor = 'Golden Yellow';
    if (energySignature.includes('Water') || l === 2 || l === 6) { hexCode = '#4169E1'; auraColor = 'Royal Blue'; }
    if (energySignature.includes('Earth') || l === 4 || l === 8) { hexCode = '#228B22'; auraColor = 'Forest Green'; }
    if (energySignature.includes('Fire') || l === 1 || l === 9) { hexCode = '#FF4500'; auraColor = 'Crimson Red'; }
    if (energySignature.includes('Air') || l === 3 || l === 5 || l === 7) { hexCode = '#E6E6FA'; auraColor = 'Lavender'; }

    const chakras: Record<string, { name: string; status: string; tip: string }> = {
      'Fire': { name: 'Solar Plexus (Manipura)', status: 'Dominant', tip: 'Your power center is naturally strong. Focus on heart chakra to balance.' },
      'Water': { name: 'Sacral (Svadhisthana)', status: 'Dominant', tip: 'Your emotional center leads. Strengthen root chakra for grounding.' },
      'Earth': { name: 'Root (Muladhara)', status: 'Dominant', tip: 'You are naturally grounded. Open your throat chakra for expression.' },
      'Air': { name: 'Throat (Vishuddha)', status: 'Dominant', tip: 'Communication flows freely. Balance with sacral chakra for emotional depth.' }
    };
    const elKey = energySignature.includes('Water') ? 'Water' : energySignature.includes('Earth') ? 'Earth' : energySignature.includes('Air') ? 'Air' : 'Fire';
    const crystalData: Record<string, { stone: string; reason: string }[]> = {
      'Fire': [
        { stone: 'Carnelian', reason: 'Anchors your drive and boosts vitality.' },
        { stone: 'Citrine', reason: 'Magnifies your solar plexus power and wealth flow.' },
        { stone: 'Sunstone', reason: 'Keeps your inner fire radiant and optimistic.' }
      ],
      'Water': [
        { stone: 'Moonstone', reason: 'Balances your emotional tides and intuition.' },
        { stone: 'Sodalite', reason: 'Brings logic and peace to your empathetic field.' },
        { stone: 'Aquamarine', reason: 'Purifies your communication and calms the soul.' }
      ],
      'Earth': [
        { stone: 'Black Tourmaline', reason: 'Grounds your energy into material stability.' },
        { stone: 'Smoky Quartz', reason: 'Transmutes stress into practical action.' },
        { stone: 'Tiger\'s Eye', reason: 'Harmonizes your willpower with structural reality.' }
      ],
      'Air': [
        { stone: 'Amethyst', reason: 'Refines your mental clarity and spiritual vision.' },
        { stone: 'Lapis Lazuli', reason: 'Empowers your voice and authentic expression.' },
        { stone: 'Clear Quartz', reason: 'Amplifies your fast-moving intellectual electrical field.' }
      ]
    };

    res.json({
      auraColor,
      hexCode,
      highVibe: `When aligned, you operate as a pristine conduit of ${energySignature} energy. You attract synchronicity effortlessly and inspire those around you.`,
      lowVibe: `Under stress or poor energetic hygiene, you become drained, reactive, and physically susceptible to tension mapping in your lower back or neck.`,
      regimen: `Daily 15-minute grounding meditations and avoiding highly processed low-frequency foods will keep your ${auraColor} aura resilient and bright.`,
      chakraAlignment: chakras[elKey]?.name || 'Solar Plexus',
      chakraTip: chakras[elKey]?.tip || 'Balance your core.',
      crystals: crystalData[elKey] || crystalData['Fire'],
      elementalBalance: `Primary: ${elKey}. Complement: ${elKey === 'Fire' ? 'Water' : elKey === 'Water' ? 'Fire' : elKey === 'Earth' ? 'Air' : 'Earth'}. Advice: incorporate more activities related to your complement.`,
      elementalAdvice: `To stay balanced, incorporate ${elKey === 'Fire' ? 'Water' : elKey === 'Water' ? 'Fire' : elKey === 'Earth' ? 'Air' : 'Earth'} element activities into your weekly routine.`
    });
  });

  app.post("/api/explore/energy-insights/interact", async (req, res) => {
    try {
      const { lifePath, input } = req.body;
      const l = parseInt(lifePath) || 1;

      const prompt = `You are an energetic hygiene specialist. The user is a Life Path ${l}.
      
      They are feeling this way or are in this specific situation: "${input}"
      
      Provide a precise 3-4 sentence energetic evaluation. How is their current Life Path ${l} frequency being affected? What specific, immediate energetic 'cleansing' or 'shielding' technique should they use right now to restore their aura? Be direct and highly practical.`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating energy insights AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/colorology/:lifePath", (req, res) => {
    const { lifePath } = req.params;
    const l = parseInt(lifePath) || 1;

    let colors = [];
    let avoidColors: string[] = [];
    if ([1, 9].includes(l)) {
      colors = [
        { name: 'Crimson Red', hex: '#DC143C', usage: 'Wear during important meetings', benefit: 'Enhances absolute authority and courage.' },
        { name: 'Gold', hex: '#FFD700', usage: 'Decorate your workspace', benefit: 'Stimulates financial flow and confidence.' },
        { name: 'Deep Purple', hex: '#4B0082', usage: 'Wear during meditation', benefit: 'Amplifies your natural leadership with spiritual depth.' },
        { name: 'Burnt Orange', hex: '#CC5500', usage: 'Accessories & accents', benefit: 'Fuels creativity and ambition without overpowering.' }
      ];
      avoidColors = ['Pale Pink', 'Baby Blue'];
    } else if ([2, 6].includes(l)) {
      colors = [
        { name: 'Soft Indigo', hex: '#4B0082', usage: 'Wear during deep conversations', benefit: 'Enhances intuition and emotional connection.' },
        { name: 'Seafoam Green', hex: '#20B2AA', usage: 'Use in your bedroom', benefit: 'Promotes deep healing and peace.' },
        { name: 'Rose Quartz', hex: '#F7CAC9', usage: 'Everyday wear', benefit: 'Opens your heart center and attracts loving relationships.' },
        { name: 'Soft Silver', hex: '#C0C0C0', usage: 'Jewelry & accessories', benefit: 'Enhances moon energy and intuitive receptivity.' }
      ];
      avoidColors = ['Bright Red', 'Neon Yellow'];
    } else if ([3, 5].includes(l)) {
      colors = [
        { name: 'Vibrant Yellow', hex: '#FFFF00', usage: 'Wear when socializing', benefit: 'Magnetizes people to your energy field and enhances joy.' },
        { name: 'Electric Blue', hex: '#7DF9FF', usage: 'Use for creative endeavors', benefit: 'Stimulates rapid communication and ideation.' },
        { name: 'Coral', hex: '#FF7F50', usage: 'Casual and social events', benefit: 'Boosts charisma and warmth in social situations.' },
        { name: 'Turquoise', hex: '#40E0D0', usage: 'Travel & adventure', benefit: 'Aligns your throat chakra for authentic self-expression.' }
      ];
      avoidColors = ['Dark Brown', 'Charcoal Grey'];
    } else if ([4, 8].includes(l)) {
      colors = [
        { name: 'Forest Green', hex: '#228B22', usage: 'Wear when handling finances', benefit: 'Grounds your energy into material reality.' },
        { name: 'Earth Brown', hex: '#8B4513', usage: 'Decorate your home', benefit: 'Provides stability and structural strength.' },
        { name: 'Navy Blue', hex: '#000080', usage: 'Professional settings', benefit: 'Projects authority and trustworthiness.' },
        { name: 'Emerald', hex: '#50C878', usage: 'Goal-setting sessions', benefit: 'Attracts prosperity and long-term abundance.' }
      ];
      avoidColors = ['Hot Pink', 'Neon Orange'];
    } else {
      colors = [
        { name: 'Amethyst', hex: '#9966CC', usage: 'Wear during meditation', benefit: 'Connects you to higher spiritual realms.' },
        { name: 'Pearl White', hex: '#F0EAD6', usage: 'Use anywhere', benefit: 'Purifies your aura from lower vibrations.' },
        { name: 'Midnight Blue', hex: '#191970', usage: 'Evening and reflection', benefit: 'Deepens your connection to cosmic wisdom.' },
        { name: 'Champagne', hex: '#F7E7CE', usage: 'Special occasions', benefit: 'Blends elegance with spiritual softness.' }
      ];
      avoidColors = ['Bright Red', 'Electric Green'];
    }

    res.json({
      overview: `Colors are simply visible frequencies. For Life Path ${l}, wearing or surrounding yourself with these specific wavelengths hacks your energetic state.`,
      colors,
      avoidColors,
      combinationTip: `For maximum impact, combine ${colors[0].name} with ${colors[1].name}. This pairing creates a harmonic resonance that amplifies your Life Path ${l} frequency by aligning both your outer expression and inner state.`
    });
  });

  app.post("/api/explore/colorology/interact", async (req, res) => {
    try {
      const { lifePath, input } = req.body;
      const l = parseInt(lifePath) || 1;

      const prompt = `You are a master of color frequency and manifestation. The user is a Life Path ${l}.
      
      They have an upcoming event or specific need: "${input}"
      
      Provide a highly precise 3-4 sentence color prescription. What exact shade or color combination should they wear to this event to maximize their Life Path ${l} impact? How will this specific color interact with their personal aura to ensure they achieve their desired outcome?`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating colorology AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/vedic-astrology/:birthDate", (req, res) => {
    const birthDate = new Date(req.params.birthDate);
    const result = getVedicNakshatra(isNaN(birthDate.getTime()) ? new Date() : birthDate);

    const nakshatraGems: Record<string, string> = {
      'Ashwini': 'Cat\'s Eye', 'Bharani': 'Diamond', 'Krittika': 'Ruby',
      'Rohini': 'Pearl', 'Mrigashira': 'Coral', 'Ardra': 'Hessonite',
      'Punarvasu': 'Yellow Sapphire', 'Pushya': 'Blue Sapphire', 'Ashlesha': 'Mercury Stone'
    };
    const nakshatraPlanets: Record<string, string> = {
      'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
      'Rohini': 'Moon', 'Mrigashira': 'Mars', 'Ardra': 'Rahu',
      'Punarvasu': 'Jupiter', 'Pushya': 'Saturn', 'Ashlesha': 'Mercury'
    };
    const nakshatraMantras: Record<string, string> = {
      'Ashwini': 'Om Ashwini Kumarabhyam Namah', 'Bharani': 'Om Yamaya Namah', 'Krittika': 'Om Agnaye Namah',
      'Rohini': 'Om Brahmane Namah', 'Mrigashira': 'Om Somaya Namah', 'Ardra': 'Om Rudraya Namah',
      'Punarvasu': 'Om Aditaye Namah', 'Pushya': 'Om Brihaspataye Namah', 'Ashlesha': 'Om Nagadevaya Namah'
    };

    res.json({
      ...result,
      rulingPlanet: nakshatraPlanets[result.nakshatra] || 'Ketu',
      luckyGem: nakshatraGems[result.nakshatra] || 'Cat\'s Eye',
      mantra: nakshatraMantras[result.nakshatra] || 'Om Namah Shivaya',
      planetaryInfluence: `${nakshatraPlanets[result.nakshatra] || 'Ketu'} governs your Nakshatra, shaping your karmic lessons, relationships, and spiritual evolution. Wearing ${nakshatraGems[result.nakshatra] || 'Cat\'s Eye'} can strengthen this planetary connection.`
    });
  });

  app.post("/api/explore/vedic-astrology/interact", async (req, res) => {
    try {
      const { birthDate, input } = req.body;

      const prompt = `You are an expert Vedic Astrologer (Jyotish). The user has their chart snapshot (Nakshatra, Deity, etc.) based on their birth date.
      
      Their specific question or area of life focus is: "${input}"
      
      Provide a precise 3-4 sentence Vedic interpretation. How do the shifting cosmic currents affect them right now? Give them one specific Vedic remedy (Upaya)—like a specific color to wear, a small ritual, or a mindset shift—to harmonize with their chart today.`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating vedic AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/all-about-you/:odisId", async (req, res) => {
    const { odisId } = req.params;
    const user = await storage.getUserByOdisId(odisId);
    if (!user || !user.birthDate) return res.status(404).json({ error: "User or birth data not found" });

    // Assuming we have the numerology functions available to calculate this properly
    // We already have some logic in gemini.ts for this, but let's do a fast generation here
    const birthDate = new Date(user.birthDate);
    const lifePath = getLifePath(birthDate);

    // Archetype and element
    let archetype = 'The Pioneer';
    let element = 'Fire';
    let easternDesc = 'Independent and dynamic.';

    if ([2, 6].includes(lifePath)) { archetype = 'The Healer'; element = 'Water'; easternDesc = 'Deeply feeling and deeply caring.'; }
    if ([3, 5].includes(lifePath)) { archetype = 'The Communicator'; element = 'Air'; easternDesc = 'Rapid intellect and social charm.'; }
    if ([4, 8].includes(lifePath)) { archetype = 'The Builder'; element = 'Earth'; easternDesc = 'Structural mastery and material success.'; }
    if ([7, 9].includes(lifePath)) { archetype = 'The Mystic Seeker'; element = 'Aether'; easternDesc = 'Philosophical depth and spiritual connection.'; }
    if ([11, 22, 33].includes(lifePath)) { archetype = 'The Master Teacher'; element = 'Spirit'; easternDesc = 'Incarnated for global impact and paradigm shifts.'; }

    // Calculate actual Soul Urge and Personality from name
    const vowelChars = ['A', 'E', 'I', 'O', 'U'];
    const nameUpper = (user.fullName || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
    const nameLetters = nameUpper.split('');
    const vowelVals = nameLetters.filter(c => vowelChars.includes(c)).map(c => pythagorean[c] || 0);
    const consonantVals = nameLetters.filter(c => !vowelChars.includes(c)).map(c => pythagorean[c] || 0);
    const soulUrgeNum = reduceToSingleDigit(vowelVals.reduce((s, v) => s + v, 0), true);
    const personalityNum = reduceToSingleDigit(consonantVals.reduce((s, v) => s + v, 0), true);
    const expressionNum = reduceToSingleDigit(nameLetters.map(c => pythagorean[c] || 0).reduce((s, v) => s + v, 0), true);

    // Chinese zodiac animals
    const zodiacAnimals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Sheep'];
    const chineseZodiac = zodiacAnimals[birthDate.getUTCFullYear() % 12];
    // Chinese element
    const chineseElements = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];
    const chineseElement = chineseElements[birthDate.getUTCFullYear() % 10];

    res.json({
      fullName: user.fullName || odisId,
      lifePath,
      archetype,
      chineseZodiac,
      chineseElement,
      easternDescription: easternDesc,
      element,
      summaryDirective: `To align your earthly actions with the higher frequency of ${archetype}, using your core ${element} energy.`,
      pillars: [
        { title: 'Destiny', value: lifePath.toString(), subtitle: archetype },
        { title: 'Soul Urge', value: soulUrgeNum.toString(), subtitle: soulUrgeNum <= 3 ? 'Independence & Action' : soulUrgeNum <= 6 ? 'Harmony & Service' : 'Wisdom & Spiritual Growth' },
        { title: 'Personality', value: personalityNum.toString(), subtitle: personalityNum <= 3 ? 'Dynamic Presence' : personalityNum <= 6 ? 'Approachable & Warm' : 'Mysterious & Deep' },
        { title: 'Expression', value: expressionNum.toString(), subtitle: expressionNum <= 3 ? 'Natural Leader' : expressionNum <= 6 ? 'Creative Builder' : 'Visionary Thinker' }
      ],
      coreNumbers: {
        lifePath,
        soulUrge: soulUrgeNum,
        personality: personalityNum,
        expression: expressionNum
      },
      soulUrgeNumber: soulUrgeNum,
      personalityNumber: personalityNum,
      expressionNumber: expressionNum,
      strengths: [
        lifePath <= 3 ? 'Natural leadership and initiative' : lifePath <= 6 ? 'Deep empathy and creative vision' : 'Analytical brilliance and spiritual insight',
        element === 'Fire' ? 'Unstoppable drive and passion' : element === 'Water' ? 'Emotional intelligence and healing' : element === 'Earth' ? 'Practical genius and material mastery' : element === 'Air' ? 'Communication and intellectual agility' : 'Transcendent awareness and teaching ability'
      ],
      growthAreas: [
        lifePath <= 3 ? 'Learning patience and collaboration' : lifePath <= 6 ? 'Setting boundaries and self-care' : 'Opening up emotionally and trusting others',
        element === 'Fire' ? 'Managing impulsivity' : element === 'Water' ? 'Avoiding emotional overwhelm' : element === 'Earth' ? 'Embracing change and flexibility' : element === 'Air' ? 'Grounding ideas into reality' : 'Balancing spirit with practical needs'
      ]
    });
  });

  app.post("/api/explore/all-about-you/interact", async (req, res) => {
    try {
      const { lifePath, archetype, element, input } = req.body;

      const prompt = `You are a cosmic guide reading a soul's DNA profile. The user is a Life Path ${lifePath}, known as "${archetype}" with an emphasis on "${element}" energy.
      
      They are asking deeply about themselves: "${input}"
      
      Provide a highly precise 3-4 sentence spiritual analysis. How does their unique archetypal signature answer this question? What is the most important "Soul Directive" they need to hear right now to fully step into their power as a ${archetype}?`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating all-about-you AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });

  app.get("/api/explore/saturn-insights/:birthDate", (req, res) => {
    const birthYear = new Date(req.params.birthDate || Date.now()).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    let state = 'Pre-Return';
    if (age >= 28 && age <= 30) state = 'Active Saturn Return';
    if (age > 30 && age < 56) state = 'Post-Return Integration';
    if (age >= 56 && age <= 60) state = 'Second Saturn Return';
    if (age > 60) state = 'Saturn Mastery';

    let headline = 'The Great Taskmaster';
    let overview = `Saturn represents karma, discipline, and boundaries. Your relationship with Saturn dictates how easily you manifest your goals in the dense 3D reality.`;
    let lesson = 'You are learning to transmute chaos into structure. Saturn is forcing you to take radical responsibility for your own energetic boundaries.';
    let reward = 'Indestructible self-trust, mastery over your chosen field, and generational wealth alignment.';

    if (state === 'Active Saturn Return') {
      headline = 'The Crucible of Adulthood';
      overview = 'You are currently in the eye of the storm. Saturn is stripping away everything that is not aligned with your true soul contract.';
    } else if (state === 'Second Saturn Return') {
      headline = 'The Master Phase';
      overview = 'Saturn is checking your homework. This is a time of incredible harvest, assuming you integrated the lessons of your first return.';
    }

    // Build Saturn timeline
    const timeline = [
      { age: 7, title: 'First Square', description: 'First glimpse of responsibility and how you handle authority figures.', status: age >= 7 ? 'completed' : 'upcoming' },
      { age: 14, title: 'Opposition', description: 'Rebellion against structures. Identity crisis and the need for independence.', status: age >= 14 ? 'completed' : 'upcoming' },
      { age: 21, title: 'Second Square', description: 'Reality check on your path. Career and relationship decisions crystallize.', status: age >= 21 ? 'completed' : 'upcoming' },
      { age: 29, title: 'First Saturn Return', description: 'THE major life audit. Everything not aligned with your true purpose is removed.', status: age >= 28 && age <= 30 ? 'active' : age > 30 ? 'completed' : 'upcoming' },
      { age: 36, title: 'Third Square', description: 'Testing the structures you built post-return. Mid-life recalibration.', status: age >= 36 ? 'completed' : 'upcoming' },
      { age: 44, title: 'Second Opposition', description: 'Deep questioning of legacy and purpose. What are you building for the long term?', status: age >= 44 ? 'completed' : 'upcoming' },
      { age: 51, title: 'Fourth Square', description: 'Final preparation for the second return. Mastery or crisis — your choice.', status: age >= 51 ? 'completed' : 'upcoming' },
      { age: 58, title: 'Second Saturn Return', description: 'The elder\'s initiation. Harvest of a lifetime of karmic work.', status: age >= 56 && age <= 60 ? 'active' : age > 60 ? 'completed' : 'upcoming' }
    ];

    res.json({
      state,
      headline,
      overview,
      lesson,
      reward,
      age,
      timeline,
      nextMilestoneYear: new Date().getFullYear() + ((29.5 - (age % 29.5)) % 29.5 || 29.5).toFixed(0),
      nextMilestoneEvent: 'Major karmic review and structural upgrade of your life path.'
    });
  });

  app.post("/api/explore/saturn-insights/interact", async (req, res) => {
    try {
      const { birthDate, state, input } = req.body;

      const prompt = `You are a karmic strategist and master of Saturnian cycles. The user is in this Saturnian phase: "${state}".
      
      They are facing this specific challenge or question: "${input}"
      
      Provide a precise 3-4 sentence analysis. How is Saturn using this specific situation to test their foundations? What is the single most important "Structural Shift" they must make in their life right now to turn this challenge into a long-term reward?`;

      const responseText = await generateWithFallback(prompt);
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error generating saturn insights AI interaction:', error);
      res.status(500).json({ error: 'Failed to generate insight.' });
    }
  });
  // --- END NEW EXPLORE ENDPOINTS ---

  // Cues Database API with search, filtering, and pagination
  app.get("/api/cues", (req, res) => {
    try {
      const {
        q = '',
        type = '',
        lifePath = '',
        energy = '',
        category = '',
        country = '',
        page = '1',
        pageSize = '30',
      } = req.query as Record<string, string>;

      const pageNum = Math.max(1, parseInt(page) || 1);
      const size = Math.min(100, Math.max(1, parseInt(pageSize) || 30));

      // Filter cues
      let filtered = parsedCues;

      // Text search (name, description, category)
      if (q) {
        const searchTerm = q.toLowerCase();
        filtered = filtered.filter(cue =>
          cue.name.toLowerCase().includes(searchTerm) ||
          (cue.description && cue.description.toLowerCase().includes(searchTerm)) ||
          (cue.category && cue.category.toLowerCase().includes(searchTerm))
        );
      }

      // Filter by type
      if (type) {
        const types = type.split(',').map(t => t.trim());
        filtered = filtered.filter(cue => types.includes(cue.type));
      }

      // Filter by life path number
      if (lifePath) {
        const numbers = lifePath.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (numbers.length > 0) {
          filtered = filtered.filter(cue => numbers.includes(cue.lifePathNumber));
        }
      }

      // Filter by energy signature
      if (energy) {
        const energyTerm = energy.toLowerCase();
        filtered = filtered.filter(cue =>
          cue.energySignature.toLowerCase().includes(energyTerm)
        );
      }

      // Filter by category
      if (category) {
        const categories = category.split(',').map(c => c.trim().toLowerCase());
        filtered = filtered.filter(cue =>
          cue.category && categories.some(c => cue.category!.toLowerCase().includes(c))
        );
      }

      // Filter by country
      if (country) {
        const countries = country.split(',').map(c => c.trim().toLowerCase());
        filtered = filtered.filter(cue =>
          cue.country && countries.some(c => cue.country!.toLowerCase().includes(c))
        );
      }

      // Calculate pagination
      const total = filtered.length;
      const totalPages = Math.ceil(total / size);
      const startIndex = (pageNum - 1) * size;
      const endIndex = startIndex + size;
      const items = filtered.slice(startIndex, endIndex);

      res.json({
        items,
        total,
        page: pageNum,
        pageSize: size,
        totalPages,
        hasMore: pageNum < totalPages,
      });
    } catch (error) {
      console.error("Error fetching cues:", error);
      res.status(500).json({ error: "Failed to fetch cues" });
    }
  });

  // Get single cue by ID with enhanced data
  app.get("/api/cues/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const cue = parsedCues.find(c => c.id === id);

    if (!cue) {
      return res.status(404).json({ error: "Cue not found" });
    }

    // Parse date for zodiac calculations
    const date = parseUTCDate(cue.foundedOrBirth);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    // Chinese Zodiac calculation (matches client/src/lib/numerology.ts)
    const chineseAnimals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const chineseElements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    // Proper modulo that handles all years correctly
    const animalIndex = ((year - 4) % 12 + 12) % 12;
    const elementIndex = Math.floor((((year - 4) % 10 + 10) % 10) / 2);
    const chineseZodiac = {
      animal: chineseAnimals[animalIndex],
      element: chineseElements[elementIndex],
      yinYang: year % 2 === 0 ? 'Yang' : 'Yin'
    };

    // Western Zodiac calculation (matches client/src/lib/numerology.ts)
    const zodiacSigns = [
      { sign: 'Capricorn', element: 'Earth', modality: 'Cardinal', rulingPlanet: 'Saturn', traits: ['Ambitious', 'Disciplined', 'Patient'] },
      { sign: 'Aquarius', element: 'Air', modality: 'Fixed', rulingPlanet: 'Uranus', traits: ['Innovative', 'Independent', 'Humanitarian'] },
      { sign: 'Pisces', element: 'Water', modality: 'Mutable', rulingPlanet: 'Neptune', traits: ['Intuitive', 'Compassionate', 'Artistic'] },
      { sign: 'Aries', element: 'Fire', modality: 'Cardinal', rulingPlanet: 'Mars', traits: ['Bold', 'Ambitious', 'Energetic'] },
      { sign: 'Taurus', element: 'Earth', modality: 'Fixed', rulingPlanet: 'Venus', traits: ['Reliable', 'Patient', 'Devoted'] },
      { sign: 'Gemini', element: 'Air', modality: 'Mutable', rulingPlanet: 'Mercury', traits: ['Adaptable', 'Curious', 'Communicative'] },
      { sign: 'Cancer', element: 'Water', modality: 'Cardinal', rulingPlanet: 'Moon', traits: ['Nurturing', 'Protective', 'Intuitive'] },
      { sign: 'Leo', element: 'Fire', modality: 'Fixed', rulingPlanet: 'Sun', traits: ['Confident', 'Creative', 'Generous'] },
      { sign: 'Virgo', element: 'Earth', modality: 'Mutable', rulingPlanet: 'Mercury', traits: ['Analytical', 'Practical', 'Diligent'] },
      { sign: 'Libra', element: 'Air', modality: 'Cardinal', rulingPlanet: 'Venus', traits: ['Diplomatic', 'Fair', 'Social'] },
      { sign: 'Scorpio', element: 'Water', modality: 'Fixed', rulingPlanet: 'Pluto', traits: ['Passionate', 'Resourceful', 'Determined'] },
      { sign: 'Sagittarius', element: 'Fire', modality: 'Mutable', rulingPlanet: 'Jupiter', traits: ['Adventurous', 'Optimistic', 'Philosophical'] },
    ];
    const zodiacDateRanges: [number, number, number, number][] = [
      [12, 22, 1, 19], [1, 20, 2, 18], [2, 19, 3, 20], [3, 21, 4, 19],
      [4, 20, 5, 20], [5, 21, 6, 20], [6, 21, 7, 22], [7, 23, 8, 22],
      [8, 23, 9, 22], [9, 23, 10, 22], [10, 23, 11, 21], [11, 22, 12, 21],
    ];

    let westernZodiac = zodiacSigns[0];
    for (let i = 0; i < zodiacDateRanges.length; i++) {
      const [startMonth, startDay, endMonth, endDay] = zodiacDateRanges[i];
      if (startMonth > endMonth) {
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
          westernZodiac = zodiacSigns[i];
          break;
        }
      } else {
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth)) {
          westernZodiac = zodiacSigns[i];
          break;
        }
      }
    }

    // Life Path number meanings (matches client numerology)
    const lifePathMeanings: Record<number, { title: string; description: string }> = {
      1: { title: 'The Pioneer', description: 'leadership, innovation, and independence' },
      2: { title: 'The Diplomat', description: 'cooperation, balance, and intuition' },
      3: { title: 'The Communicator', description: 'creativity, self-expression, and optimism' },
      4: { title: 'The Builder', description: 'stability, dedication, and practicality' },
      5: { title: 'The Freedom Seeker', description: 'change, adventure, and versatility' },
      6: { title: 'The Nurturer', description: 'responsibility, care, and harmony' },
      7: { title: 'The Seeker', description: 'wisdom, analysis, and spiritual depth' },
      8: { title: 'The Achiever', description: 'abundance, power, and material mastery' },
      9: { title: 'The Humanitarian', description: 'compassion, wisdom, and universal love' },
      11: { title: 'The Illuminator', description: 'intuition, inspiration, and spiritual insight' },
      22: { title: 'The Master Builder', description: 'visionary manifestation and global impact' },
      33: { title: 'The Master Teacher', description: 'compassionate guidance and healing love' },
    };

    // Chinese animal traits
    const animalTraits: Record<string, string[]> = {
      'Rat': ['clever', 'quick-witted', 'resourceful'],
      'Ox': ['diligent', 'dependable', 'strong'],
      'Tiger': ['brave', 'confident', 'competitive'],
      'Rabbit': ['gentle', 'quiet', 'elegant'],
      'Dragon': ['confident', 'intelligent', 'ambitious'],
      'Snake': ['enigmatic', 'wise', 'intuitive'],
      'Horse': ['animated', 'active', 'energetic'],
      'Goat': ['calm', 'gentle', 'creative'],
      'Monkey': ['sharp', 'smart', 'curious'],
      'Rooster': ['observant', 'hardworking', 'courageous'],
      'Dog': ['loyal', 'honest', 'faithful'],
      'Pig': ['compassionate', 'generous', 'diligent'],
    };

    const lifePathInfo = lifePathMeanings[cue.lifePathNumber] || { title: 'Unique Path', description: 'distinctive energy patterns' };
    const traits = animalTraits[chineseZodiac.animal] || ['unique', 'special'];

    // Generate contextual description based on cue type
    let aboutDescription = '';
    if (cue.type === 'Location') {
      aboutDescription = `${cue.name} thrives on ${chineseZodiac.animal} & ${westernZodiac.sign} energy, aligning with ${chineseZodiac.element}'s ${chineseZodiac.animal} influence. Founded in the Year of the ${chineseZodiac.animal}, the ${westernZodiac.element.toLowerCase()}'s friendly energies have fueled its growth into a ${cue.category ? cue.category.toLowerCase() : 'significant'} powerhouse. ${chineseZodiac.animal}, ${westernZodiac.sign}, & ${lifePathInfo.title} energies flourish here, while those with opposing energies may feel constrained, often finding greater success elsewhere. Fun fact: ${cue.name}'s ${chineseZodiac.element} influence embodies its ${traits.join(', ')} energy literally!`;
    } else if (cue.type === 'Person') {
      aboutDescription = `Born under ${westernZodiac.sign} in the Year of the ${chineseZodiac.yinYang} ${chineseZodiac.element} ${chineseZodiac.animal}, this individual carries ${lifePathInfo.title} energy (Life Path ${cue.lifePathNumber}). Their ${westernZodiac.sign} nature, ruled by ${westernZodiac.rulingPlanet}, blends with the ${traits.join(' and ')} qualities of the ${chineseZodiac.animal}. This unique combination creates their ${cue.energySignature} signature, emphasizing ${lifePathInfo.description}. The ${westernZodiac.element} element enhances their ${westernZodiac.traits.join(', ').toLowerCase()} tendencies.`;
    } else {
      aboutDescription = `${cue.name} was founded under ${westernZodiac.sign} energy in the Year of the ${chineseZodiac.yinYang} ${chineseZodiac.element} ${chineseZodiac.animal}. As ${lifePathInfo.title} (Life Path ${cue.lifePathNumber}), this ${cue.category || 'brand'} embodies ${lifePathInfo.description}. The ${chineseZodiac.animal}'s ${traits.join(', ')} nature combined with ${westernZodiac.sign}'s ${westernZodiac.traits.join(', ').toLowerCase()} influence shapes its ${cue.energySignature} signature. ${westernZodiac.rulingPlanet}'s guidance supports its mission of ${cue.description || 'excellence'}.`;
    }

    res.json({
      cue: {
        ...cue,
        chineseZodiac,
        westernZodiac,
        aboutDescription,
      }
    });
  });

  // Get cues statistics
  app.get("/api/cues-stats", (_req, res) => {
    const stats = {
      total: totalCuesCount,
      byType: {
        Brand: parsedCues.filter(c => c.type === 'Brand').length,
        Location: parsedCues.filter(c => c.type === 'Location').length,
        Person: parsedCues.filter(c => c.type === 'Person').length,
      },
      byLifePath: {} as Record<number, number>,
    };

    // Count by life path
    parsedCues.forEach(cue => {
      stats.byLifePath[cue.lifePathNumber] = (stats.byLifePath[cue.lifePathNumber] || 0) + 1;
    });

    res.json(stats);
  });

  // ============================================
  // EXPLORE FEATURE ENDPOINTS
  // ============================================

  // Trending Energies - Show what energy patterns are most active today
  app.get("/api/explore/trending-energies", (_req, res) => {
    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const year = today.getFullYear();

      // Calculate universal day number
      const monthReduced = reduceNumber(month);
      const dayReduced = reduceNumber(day);
      const yearReduced = reduceNumber(year.toString().split('').reduce((s, d) => s + parseInt(d), 0));
      const universalDay = reduceNumber(monthReduced + dayReduced + yearReduced);

      // Count life paths in cues
      const lifePathCounts: Record<number, number> = {};
      parsedCues.forEach(cue => {
        lifePathCounts[cue.lifePathNumber] = (lifePathCounts[cue.lifePathNumber] || 0) + 1;
      });

      // Get top 3 life paths
      const sortedLifePaths = Object.entries(lifePathCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([num, count]) => ({ number: parseInt(num), count }));

      // Count elements (from energy signatures)
      const elementCounts: Record<string, number> = {};
      parsedCues.forEach(cue => {
        const element = cue.energySignature.split(' ')[0];
        elementCounts[element] = (elementCounts[element] || 0) + 1;
      });

      const sortedElements = Object.entries(elementCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([element, count]) => ({ element, count }));

      // Get representative cues for today's universal day
      const todaysCues = parsedCues
        .filter(c => c.lifePathNumber === universalDay)
        .slice(0, 6)
        .map(c => ({ id: c.id, name: c.name, type: c.type, energySignature: c.energySignature }));

      const lifePathMeanings: Record<number, { title: string; theme: string }> = {
        1: { title: 'The Pioneer', theme: 'Leadership and new beginnings' },
        2: { title: 'The Diplomat', theme: 'Partnership and cooperation' },
        3: { title: 'The Communicator', theme: 'Creativity and self-expression' },
        4: { title: 'The Builder', theme: 'Structure and foundation' },
        5: { title: 'The Freedom Seeker', theme: 'Change and adventure' },
        6: { title: 'The Nurturer', theme: 'Love and responsibility' },
        7: { title: 'The Seeker', theme: 'Wisdom and introspection' },
        8: { title: 'The Powerhouse', theme: 'Success and abundance' },
        9: { title: 'The Humanitarian', theme: 'Compassion and completion' },
        11: { title: 'The Illuminator', theme: 'Spiritual insight and inspiration' },
        22: { title: 'The Master Builder', theme: 'Vision manifested into reality' },
        33: { title: 'The Master Teacher', theme: 'Healing and unconditional love' },
      };

      const todayMeaning = lifePathMeanings[universalDay] || { title: 'Universal Energy', theme: 'Balanced vibrations' };

      // Add personal takeaway if lifePathNumber is provided
      const userLifePath = _req.query.lp ? parseInt(_req.query.lp as string) : null;
      let personalTakeaway = "";

      if (userLifePath) {
        if (universalDay === userLifePath) {
          personalTakeaway = `Today is a double-vibration day for you! With both the Universe and your Life Path resonating on ${universalDay}, your natural gifts are exponentially amplified. It's a "Mirror Day" where your internal soul mission perfectly aligns with the external cosmic flow. A massive opportunity for breakthrough is at your doorstep.`;
        } else if ([1, 5, 7].includes(universalDay) && [1, 5, 7].includes(userLifePath)) {
          personalTakeaway = `Today's Universal ${universalDay} energy blends harmoniously with your Life Path ${userLifePath}. Both share a vibration of independent seeking and intellectual growth. The universe is speaking your language today—use this fluid energy to make significant progress on your personal research or solo ventures.`;
        } else if ([2, 4, 8].includes(universalDay) && [2, 4, 8].includes(userLifePath)) {
          personalTakeaway = `Today is a day for building and manifesting. The Universal ${universalDay} provides a solid foundation that matches your inherent Life Path ${userLifePath} drive for structure and success. It's an excellent day for material decisions, contracts, and long-term planning.`;
        } else if ([3, 6, 9].includes(universalDay) && [3, 6, 9].includes(userLifePath)) {
          personalTakeaway = `Emotion and creativity are the themes today. Your Life Path ${userLifePath} is uniquely supported by the Universal ${universalDay}'s focus on expression and humanitarian service. Open your heart and share your vision—the world is ready to receive your light.`;
        } else {
          personalTakeaway = `Today's Universal ${universalDay} energy offers a complementary lesson to your Life Path ${userLifePath}. While you naturally lean towards one mode of being, the universe is inviting you to experiment with a different perspective today. Embrace this "growth stretch" to become a more balanced version of yourself.`;
        }
      }

      res.json({
        universalDay,
        todayTheme: todayMeaning.theme,
        todayTitle: todayMeaning.title,
        personalTakeaway,
        date: today.toISOString().split('T')[0],
        topLifePaths: sortedLifePaths.map(lp => ({
          ...lp,
          ...lifePathMeanings[lp.number]
        })),
        topElements: sortedElements,
        representativeCues: todaysCues,
      });
    } catch (error) {
      console.error("Error getting trending energies:", error);
      res.status(500).json({ error: "Failed to get trending energies" });
    }
  });

  // Helper function for number reduction
  function reduceNumber(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
    }
    return num;
  }

  // Best Days This Month - Calendar with optimal days based on user's numerology
  app.get("/api/explore/best-days/:birthDate", (req, res) => {
    try {
      const birthDate = new Date(req.params.birthDate);
      if (isNaN(birthDate.getTime())) {
        return res.status(400).json({ error: "Invalid birth date" });
      }

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Calculate user's life path number
      const birthMonth = birthDate.getMonth() + 1;
      const birthDay = birthDate.getDate();
      const birthYear = birthDate.getFullYear();
      const lifePathNumber = reduceNumber(
        reduceNumber(birthMonth) +
        reduceNumber(birthDay) +
        reduceNumber(birthYear.toString().split('').reduce((s, d) => s + parseInt(d), 0))
      );

      // Calculate personal year
      const personalYear = reduceNumber(birthMonth + birthDay + currentYear);

      // Get days in current month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const dayRatings: Array<{
        date: string;
        day: number;
        personalDay: number;
        rating: 'excellent' | 'good' | 'neutral' | 'challenging';
        theme: string;
        activities: string[];
        why: string;
        description: string;
      }> = [];

      const personalDayThemes: Record<number, { theme: string; activities: string[]; why: string; description: string }> = {
        1: {
          theme: 'New Beginnings & Assertive Leadership',
          activities: ['Launch a new project', 'Sign a fresh contract', 'Initiate difficult conversations', 'Define your personal vision'],
          why: 'The 1 energy is the spark of initiation. When your personal day aligns with this vibration, the universe supports independent action and pioneering efforts. It is a day where your individual will is amplified, making it the perfect time to break ground on something that requires pure focus and self-reliance.',
          description: 'A day of high energy and fresh starts. You are being pushed to step out of your comfort zone and take the lead. The shadows of today involve impatience or excessive ego—stay focused on constructive leadership rather than just being "first."'
        },
        2: {
          theme: 'Partnership, Diplomacy & Intuition',
          activities: ['Collaborate in a team', 'Go on a meaningful date', 'Listen more than you speak', 'Meditate on delicate decisions'],
          why: 'The 2 vibration is about the "other." In your personal cycle, this day is designed to test and refine your ability to cooperate and harmonize. It is a day where the "I" takes a backseat to the "We," allowing you to pick up on subtle emotional cues that you might otherwise miss.',
          description: 'A day for sensitivity and detail. You may find yourself more emotional or receptive today. This is not a time for forceful action, but for gentle persuasion and finding the middle ground. Trust your gut feelings; they are heightened now.'
        },
        3: {
          theme: 'Creative Expression & Social Joy',
          activities: ['Write or create art', 'Attend a social gathering', 'Public speaking or pitching', 'Engage in playful activities'],
          why: 'The 3 energy is the child of the 1 and 2—it is the manifestation of creative joy. This day supports self-expression in all its forms. The universe is practically begging you to share your light, your words, and your unique perspective with the world.',
          description: 'A vibrant day where your charisma is at its peak. Use this energy to inspire others and spread optimism. Watch out for scattered focus or being overly critical of yourself—let the creativity flow without the need for immediate perfection.'
        },
        4: {
          theme: 'Structure, Foundation & Hard Work',
          activities: ['Organize your workspace', 'Finalize a long-term plan', 'Handle administrative tasks', 'Focus on physical health habits'],
          why: 'The 4 vibration is the "square"—it represents stability and the physical realm. This day is your reality check. It provides the disciplined energy needed to turn abstract ideas into concrete results. Without 4 days, our dreams have no place to land.',
          description: 'A day of focused effort and practicality. You might feel a bit restricted or tired under this heavy vibration, but the progress you make today builds the walls of your future success. Embrace the routine and find satisfaction in a job well done.'
        },
        5: {
          theme: 'Adventure, Change & Dynamic Freedom',
          activities: ['Travel or change your environment', 'Network with new people', 'Pivot a stale strategy', 'Explore a new hobby or field'],
          why: 'The 5 energy is the midpoint of the cycle—it is the vibration of movement and non-conformity. This day is meant to break you out of any ruts you have fallen into. It supports quick thinking and the ability to adapt to sudden opportunities.',
          description: 'An unpredictable and fast-paced day. You may feel a restless urge to wander or try something radical. Say "yes" to the unexpected, but remain grounded enough not to burn bridges in your pursuit of excitement.'
        },
        6: {
          theme: 'Nurturing Harmony & Responsibility',
          activities: ['Host a family dinner', 'Volunteer or help a friend', 'Beautify your home', 'Heal a fractured relationship'],
          why: 'The 6 vibration is the heart of the numerological cycle. It focuses on duty, family, and service. This day is a reminder of your connections to others. The universe asks you to step into the role of the "nurturer," providing comfort and stability to those you care about.',
          description: 'A day where you feel most satisfied when serving a higher cause or taking care of your loved ones. You are the pillar today. Avoid the trap of over-sacrificing your own needs or becoming overly controlling in your domestic sphere.'
        },
        7: {
          theme: 'Deep Introspection & Spiritual Insight',
          activities: ['Spend time in silence', 'Read a deep philosophical text', 'Research a complex topic', 'Practice advanced meditation'],
          why: 'The 7 vibration is the seeker of truth. It pulls the energy inward, away from the noise of the material world. This day is designed for your soul to catch up with your life. It is the best time for mental breakthroughs and connecting with your higher self.',
          description: 'A quiet, contemplative day. You may feel more withdrawn or serious than usual—this is normal. Do not force social interactions; instead, honor your need for solitude. The insights you gain today will be your roadmap for the next stage of your journey.'
        },
        8: {
          theme: 'Power, Achievement & Material Mastery',
          activities: ['Make a major financial move', 'Negotiate from a position of power', 'Delegating tasks to a team', 'Visualizing long-term wealth'],
          why: 'The 8 energy is the number of karmic balance and material success. It is the most powerful vibration for dealing with money, career, and authority. On this day, your ability to manifest in the physical world is at its peak—if you have put in the work, the rewards arrive.',
          description: 'A high-stakes day of ambition and drive. You are being asked to step into your full power. The 8 demands integrity; as long as you act with honor, the success you achieve today will be long-lasting. Avoid being ruthless or overly focused on status.'
        },
        9: {
          theme: 'Humanitarian Wisdom & Conscious Completion',
          activities: ['Finish a long-standing project', 'Donate to a cause', 'Forgive someone from your past', 'Mentor someone younger'],
          why: 'The 9 vibration represents the end of a cycle and the wisdom gained from it. This day is about the "Big Picture" and universal love. It is the time to tie up loose ends and release what no longer serves you, clearing the psychic space for the next cycle to begin.',
          description: 'A day of deep compassion and global perspective. You may feel a bit detached from personal drama as you focus on the greater good. This is a day for closure and "letting go" with grace. Do not start major new ventures today; instead, polish what is finished.'
        },
        11: {
          theme: 'Illumination & Visionary Inspiration',
          activities: ['Journal your intuitive flashes', 'Teach or share a high-level concept', 'Engage in visionary brainstorming', 'Practice energy healing'],
          why: 'The Master Number 11 is a "portal" vibration. It brings a heightened level of spiritual awareness and psychic sensitivity. On this day, the veil between your conscious mind and your higher intuition is thin—you are a lightning rod for divine inspiration.',
          description: 'An intense, high-vibration day. You may feel nervous energy or a sense of "knowing" without knowing how. This is a day to inspire others through your presence. Stay grounded to avoid burnout from the electrical energy of this number.'
        },
        22: {
          theme: 'The Master Builder & Global Manifestation',
          activities: ['Working on a project with global scale', 'Philanthropy on a large level', 'Masterminding a massive system', 'Designing sustainable solutions'],
          why: 'The Master Number 22 takes the vision of the 11 and anchors it into the physical world. This is arguably the most powerful day for manifestation in the entire numerology system. It is about building something that will outlast your own lifetime.',
          description: 'A day of enormous potential and equally enormous responsibility. You are not just working for yourself today; you are building for humanity. Focus on the grandest version of your dreams and trust that you have the practical tools to make them real.'
        },
        33: {
          theme: 'Selfless Service & The Master Teacher',
          activities: ['Providing deep emotional healing to others', 'Counseling someone through a crisis', 'Acting as a pure channel for love', 'Teaching wisdom through example'],
          why: 'The Master Number 33 is the vibration of the "Cosmic Parent." It is rare and incredibly potent. This day is about unconditional love and the absolute sacrifice of the ego for the benefit of others. It represents the highest achievement of the human heart.',
          description: 'A day of profound emotional depth and healing capability. You are the "Master Teacher" today. People will be naturally drawn to your light for guidance. Your only task is to remain a humble vessel for compassion and truth.'
        },
      };

      /**
       * Generates a deep, personalized explanation for why a specific Personal Day is high-rated
       * for a specific Life Path Number.
       */
      const getPersonalizedReasoning = (lp: number, pd: number): string => {
        // Double Vibration / Alignment
        if (lp === pd) {
          return `This is a 'Mirror Day' of absolute alignment. As a Life Path ${lp}, you are naturally tuned to this vibration. Today, the external flow of the universe perfectly matches your internal soul frequency. It's a day of exponential power where your natural gifts aren't just supported—they are amplified. You don't have to swim against the current today; you ARE the current.`;
        }

        // Master Number synergy
        if ([11, 22, 33].includes(pd)) {
          return `You are walking through a 'Master Vibration' portal today. This high-frequency day acts as a spiritual catalyst for your Life Path ${lp} mission. It provides the advanced perspective and intuitive 'lightning' needed to solve complex problems that usually slow you down. Expect a breakthrough in how you view your purpose.`;
        }

        // Specific Synergies
        const synergies: Record<number, Record<number, string>> = {
          1: { 8: "Today's pioneering energy is the perfect engine for your Life Path 8 leadership. Use this fresh start to launch the big-scale visions you've been architecting." },
          3: { 5: "Your Life Path 3 charisma finds a playground in today's 5 energy of freedom. It's the ultimate day for creative networking and spontaneous expression that 'clicks' with the right people." },
          8: { 1: "The structured power of an 8 day provides the solid foundation your Life Path 1 pioneering spirit needs to actually build something that lasts, rather than just starting another project." },
          6: { 2: "The nurturing 6 vibration perfectly complements your Life Path 2 diplomacy. You have the heart and the words today to heal any division and bring people into harmony." },
          9: { 7: "Today's 9 vibration of completion allows your Life Path 7 wisdom to finally see the 'Full Picture'. It's a day of profound spiritual closure and humanitarian breakthrough." },
        };

        const synergyText = synergies[pd]?.[lp];
        if (synergyText) return synergyText;

        // Fallback for Good/Excellent ratings (Generic but personalized to LP)
        const baseReasoning = personalDayThemes[pd]?.why || "This day aligns with your personal numerological cycle.";
        return `${baseReasoning} For you as a Life Path ${lp}, this vibration helps you refine your core mission by giving you the specific ${personalDayThemes[pd]?.theme.toLowerCase()} needed at this exact point in your growth.`;
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Calculate personal month and personal day
        const personalMonth = reduceNumber(personalYear + (currentMonth + 1));
        const personalDay = reduceNumber(personalMonth + day);

        // Determine rating based on alignment
        let rating: 'excellent' | 'good' | 'neutral' | 'challenging';
        if (personalDay === lifePathNumber) {
          rating = 'excellent';
        } else if ([1, 3, 5, 9, 11, 22, 33].includes(personalDay)) {
          rating = 'excellent';
        } else if ([2, 6].includes(personalDay)) {
          rating = 'good';
        } else {
          rating = 'neutral';
        }

        const dayInfo = personalDayThemes[personalDay] || { theme: 'Balance', activities: ['Routine tasks', 'Rest'], description: 'A day for steady progress.', why: 'A period of stabilization.' };

        // Generate personalized reasoning
        const personalizedWhy = getPersonalizedReasoning(lifePathNumber, personalDay);

        dayRatings.push({
          date: dateStr,
          day,
          personalDay,
          rating,
          theme: dayInfo.theme,
          activities: dayInfo.activities,
          why: personalizedWhy,
          description: dayInfo.description,
        });
      }

      // Find best days (excellent and good)
      const bestDays = dayRatings.filter(d => d.rating === 'excellent' || d.rating === 'good');

      res.json({
        lifePathNumber,
        personalYear,
        month: currentMonth + 1,
        year: currentYear,
        monthName: new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long' }),
        days: dayRatings,
        bestDays: bestDays.slice(0, 10),
      });
    } catch (error) {
      console.error("Error getting best days:", error);
      res.status(500).json({ error: "Failed to get best days" });
    }
  });

  // Celebrity Matches - Find celebrities sharing user's energy
  app.get("/api/explore/celebrity-matches", (req, res) => {
    try {
      const { lifePathNumber, energySignature, limit = '12' } = req.query as Record<string, string>;

      const limitNum = Math.min(50, parseInt(limit) || 12);

      // Filter to persons only
      let celebrities = parsedCues.filter(c => c.type === 'Person');

      // Score and sort by match quality
      const scored = celebrities.map(celeb => {
        let score = 0;
        const matches: string[] = [];

        if (lifePathNumber && celeb.lifePathNumber === parseInt(lifePathNumber)) {
          score += 50;
          matches.push('Life Path');
        }

        if (energySignature) {
          const userElement = energySignature.split(' ')[0];
          const celebElement = celeb.energySignature.split(' ')[0];
          if (userElement === celebElement) {
            score += 30;
            matches.push('Element');
          }

          const userEnergy = energySignature.split(' ').slice(1).join(' ');
          const celebEnergy = celeb.energySignature.split(' ').slice(1).join(' ');
          if (userEnergy === celebEnergy) {
            score += 20;
            matches.push('Energy Type');
          }
        }

        return { ...celeb, score, matches };
      });

      const matches = scored
        .filter(c => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limitNum);

      res.json({
        matches: matches.map(m => ({
          id: m.id,
          name: m.name,
          type: m.type,
          category: m.category,
          country: m.country,
          lifePathNumber: m.lifePathNumber,
          energySignature: m.energySignature,
          foundedOrBirth: m.foundedOrBirth,
          score: m.score,
          matchReasons: m.matches,
        })),
        totalCelebrities: parsedCues.filter(c => c.type === 'Person').length,
      });
    } catch (error) {
      console.error("Error getting celebrity matches:", error);
      res.status(500).json({ error: "Failed to get celebrity matches" });
    }
  });

  // Travel Destinations - Curated countries with zodiac compatibility
  app.get("/api/explore/travel-destinations", (req, res) => {
    try {
      const { lifePathNumber, element, birthYear } = req.query as Record<string, string>;

      const userLifePath = lifePathNumber ? parseInt(lifePathNumber) : null;
      const userBirthYear = birthYear ? parseInt(birthYear) : null;

      // Chinese zodiac calculation
      const getChineseZodiac = (year: number): string => {
        const animals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
        return animals[year % 12];
      };

      const userZodiac = userBirthYear ? getChineseZodiac(userBirthYear) : null;

      // Zodiac compatibility - which signs thrive together
      const zodiacCompatibility: Record<string, string[]> = {
        'Rat': ['Rat', 'Ox', 'Dragon', 'Monkey'],
        'Ox': ['Rat', 'Ox', 'Snake', 'Rooster'],
        'Tiger': ['Tiger', 'Horse', 'Dog', 'Pig'],
        'Rabbit': ['Rabbit', 'Goat', 'Dog', 'Pig'],
        'Dragon': ['Rat', 'Dragon', 'Monkey', 'Rooster'],
        'Snake': ['Ox', 'Snake', 'Rooster', 'Monkey'],
        'Horse': ['Tiger', 'Horse', 'Goat', 'Dog'],
        'Goat': ['Rabbit', 'Horse', 'Goat', 'Pig'],
        'Monkey': ['Rat', 'Dragon', 'Snake', 'Monkey'],
        'Rooster': ['Ox', 'Dragon', 'Snake', 'Rooster'],
        'Dog': ['Tiger', 'Rabbit', 'Horse', 'Dog'],
        'Pig': ['Tiger', 'Rabbit', 'Goat', 'Pig'],
      };

      // Curated list of countries with significant founding/independence years
      const countries: Array<{
        name: string;
        year: number;
        description: string;
        vibe: string;
        bestFor: string;
      }> = [
          { name: 'United States', year: 1776, description: 'Born in the Year of the Monkey, the USA channels innovation, ambition, and reinvention. From Silicon Valley to Hollywood, this nation rewards clever problem-solvers and dreamers.', vibe: 'Innovation & Ambition', bestFor: 'Entrepreneurs and dreamers' },
          { name: 'France', year: 1789, description: 'The French Revolution birthed a Rooster-year nation - proud, artistic, and fiercely devoted to beauty and excellence. Paris alone defines romance and sophistication.', vibe: 'Art & Romance', bestFor: 'Artists and romantics' },
          { name: 'Japan', year: 1868, description: 'The Meiji Restoration in the Year of the Dragon launched Japan into modernity. This Dragon energy fuels its technological innovation and cultural influence.', vibe: 'Innovation & Tradition', bestFor: 'Tech lovers and culture seekers' },
          { name: 'India', year: 1947, description: 'Independence in the Year of the Pig brought abundance and spiritual depth. From yoga to Bollywood, India offers comfort, wisdom, and vibrant celebration.', vibe: 'Spirituality & Color', bestFor: 'Soul seekers and adventurers' },
          { name: 'Brazil', year: 1822, description: 'Born in the Year of the Horse, Brazil gallops with freedom, joy, and celebration. Carnival, beaches, and samba embody its passionate spirit.', vibe: 'Joy & Celebration', bestFor: 'Free spirits and dancers' },
          { name: 'Australia', year: 1901, description: 'Federation in the Year of the Ox built a nation of steady determination and laid-back ambition. From Sydney to the Outback, resilience meets adventure.', vibe: 'Adventure & Balance', bestFor: 'Nature lovers and achievers' },
          { name: 'Italy', year: 1861, description: 'Unified in the Year of the Rooster, Italy struts with pride in its art, food, and history. Every region celebrates la dolce vita with authentic flair.', vibe: 'Culture & Pleasure', bestFor: 'Foodies and history lovers' },
          { name: 'Germany', year: 1871, description: 'Born in the Year of the Goat, Germany balances creative artistry with engineering precision. From Beethoven to BMW, innovation meets craftsmanship.', vibe: 'Precision & Creativity', bestFor: 'Engineers and artists' },
          { name: 'Canada', year: 1867, description: 'Confederation in the Year of the Rabbit brought a nation of diplomatic harmony and natural beauty. Politeness and wilderness coexist perfectly.', vibe: 'Nature & Harmony', bestFor: 'Peace seekers and adventurers' },
          { name: 'Mexico', year: 1821, description: 'Independence in the Year of the Snake gave Mexico its mysterious allure and ancient wisdom. Mayan pyramids to mariachi - transformation runs deep.', vibe: 'Mystery & Tradition', bestFor: 'Culture lovers and mystics' },
          { name: 'South Korea', year: 1948, description: 'Founded in the Year of the Rat, South Korea embodies clever innovation and resourcefulness. K-pop, tech, and cuisine - always ahead of trends.', vibe: 'Trendsetting & Innovation', bestFor: 'Trendsetters and tech lovers' },
          { name: 'Spain', year: 1479, description: 'United in the Year of the Pig, Spain celebrates life with generous warmth. Flamenco, siestas, and fiestas honor pleasure without apology.', vibe: 'Passion & Celebration', bestFor: 'Party lovers and artists' },
          { name: 'Thailand', year: 1238, description: 'Ancient Sukhothai Kingdom in the Year of the Dog established loyalty, spirituality, and honest hospitality that define Thai culture today.', vibe: 'Spirituality & Warmth', bestFor: 'Spiritual seekers and foodies' },
          { name: 'United Kingdom', year: 1707, description: 'The Act of Union in the Year of the Pig united kingdoms into an empire of comfort, tradition, and global influence. Tea, royalty, and resilience.', vibe: 'Tradition & Influence', bestFor: 'History buffs and culture lovers' },
          { name: 'Greece', year: 1821, description: 'Independence in the Year of the Snake revived ancient Dragon wisdom. Birthplace of democracy, philosophy, and the Olympic spirit.', vibe: 'Wisdom & History', bestFor: 'Philosophers and beach lovers' },
          { name: 'Singapore', year: 1965, description: 'Independence in the Year of the Snake transformed a port into a financial powerhouse. Order, prosperity, and multicultural harmony thrive.', vibe: 'Prosperity & Order', bestFor: 'Business minds and foodies' },
          { name: 'UAE', year: 1971, description: 'Founded in the Year of the Pig, the UAE turned desert into luxury. Dubai and Abu Dhabi embody ambitious comfort and limitless vision.', vibe: 'Luxury & Ambition', bestFor: 'Luxury seekers and dreamers' },
          { name: 'South Africa', year: 1994, description: 'New democracy in the Year of the Dog brought loyalty to justice and rainbow nation harmony. Safari, wine, and healing converge.', vibe: 'Healing & Adventure', bestFor: 'Justice seekers and nature lovers' },
          { name: 'Egypt', year: 1922, description: 'Independence in the Year of the Dog renewed ancient mysteries. The pyramids, Nile, and pharaonic wisdom call to loyal seekers of truth.', vibe: 'Mystery & Ancient Power', bestFor: 'History lovers and mystics' },
          { name: 'Indonesia', year: 1945, description: 'Independence in the Year of the Rooster gave Indonesia its proud diversity. Bali\'s spirituality to Jakarta\'s hustle - authenticity across 17,000 islands.', vibe: 'Diversity & Spirit', bestFor: 'Island hoppers and soul seekers' },
          { name: 'Portugal', year: 1143, description: 'Europe\'s oldest nation born in the Year of the Pig pioneered global exploration with generous spirit. Fado, wine, and saudade await.', vibe: 'Exploration & Soul', bestFor: 'Romantics and explorers' },
          { name: 'Netherlands', year: 1581, description: 'Independence in the Year of the Snake brought clever trade and progressive values. Canals, art, and freedom define this innovative nation.', vibe: 'Freedom & Innovation', bestFor: 'Free thinkers and art lovers' },
          { name: 'New Zealand', year: 1907, description: 'Dominion in the Year of the Goat blessed this land with creative beauty and peaceful adventure. Middle Earth magic meets Maori wisdom.', vibe: 'Nature & Magic', bestFor: 'Adventurers and dreamers' },
          { name: 'Morocco', year: 1956, description: 'Independence in the Year of the Monkey brought clever craftsmanship and vibrant reinvention. Marrakech\'s medina swirls with ancient-modern fusion.', vibe: 'Mystery & Craftsmanship', bestFor: 'Adventurers and artists' },
        ];

      // Process each country with compatibility info
      const destinations = countries.map((country, index) => {
        const zodiacAnimal = getChineseZodiac(country.year);

        // Find all signs compatible with this country's zodiac
        const compatibleSigns: string[] = [];
        Object.entries(zodiacCompatibility).forEach(([sign, compatWith]) => {
          if (compatWith.includes(zodiacAnimal)) {
            compatibleSigns.push(sign);
          }
        });

        // Calculate score based on user's zodiac match
        let score = 70; // Base score - all destinations are good
        const isUserMatch = userZodiac ? compatibleSigns.includes(userZodiac) : false;

        if (isUserMatch) {
          score = 92; // High score for compatible users
        }

        // Add life path bonus
        const lifePathFromYear = ((country.year - 1) % 9) + 1;
        if (userLifePath && userLifePath === lifePathFromYear) {
          score = Math.min(98, score + 5);
        }

        return {
          id: index + 1,
          name: country.name,
          foundingYear: country.year,
          zodiacAnimal,
          compatibleSigns,
          description: country.description,
          vibe: country.vibe,
          bestFor: country.bestFor,
          score,
          isUserMatch,
        };
      });

      // Sort by score (user matches first) then alphabetically
      const sorted = destinations.sort((a, b) => {
        if (a.isUserMatch !== b.isUserMatch) {
          return a.isUserMatch ? -1 : 1;
        }
        return b.score - a.score;
      });

      res.json({
        destinations: sorted.map(d => ({
          id: d.id,
          name: d.name,
          foundingYear: d.foundingYear,
          zodiacAnimal: d.zodiacAnimal,
          compatibleSigns: d.compatibleSigns,
          description: d.description,
          vibe: d.vibe,
          bestFor: d.bestFor,
          score: d.score,
          isUserMatch: d.isUserMatch,
        })),
        userZodiac,
      });
    } catch (error) {
      console.error("Error getting travel destinations:", error);
      res.status(500).json({ error: "Failed to get travel destinations" });
    }
  });

  // Relationship Patterns - Compatibility tendencies
  app.get("/api/explore/relationship-patterns/:lifePathNumber", (req, res) => {
    try {
      const lifePathNumber = parseInt(req.params.lifePathNumber);

      if (isNaN(lifePathNumber) || lifePathNumber < 1 || (lifePathNumber > 9 && ![11, 22, 33].includes(lifePathNumber))) {
        return res.status(400).json({ error: "Invalid life path number" });
      }

      // Compatibility matrix based on numerology with Zodiac synergies
      const compatibilityData: Record<number, {
        best: number[];
        good: number[];
        challenging: number[];
        description: string;
        westernSigns: string[];
        chineseSigns: string[];
      }> = {
        1: {
          best: [3, 5],
          good: [1, 2, 9],
          challenging: [4, 8],
          description: 'As a natural leader, you thrive with creative and adventurous partners who appreciate your independence.',
          westernSigns: ['Aries', 'Leo', 'Sagittarius'],
          chineseSigns: ['Tiger', 'Horse', 'Monkey']
        },
        2: {
          best: [4, 8],
          good: [1, 2, 6],
          challenging: [5, 7],
          description: 'Your diplomatic nature flourishes with stable, ambitious partners who value harmony and commitment.',
          westernSigns: ['Cancer', 'Scorpio', 'Pisces'],
          chineseSigns: ['Rabbit', 'Pig', 'Ox']
        },
        3: {
          best: [1, 5, 7],
          good: [3, 6, 9],
          challenging: [4, 8],
          description: 'Your creative spirit connects best with innovative and intellectual partners who appreciate your expressiveness.',
          westernSigns: ['Gemini', 'Libra', 'Aquarius'],
          chineseSigns: ['Rooster', 'Dragon', 'Monkey']
        },
        4: {
          best: [2, 8],
          good: [4, 6, 7],
          challenging: [1, 3, 5],
          description: 'Your grounded nature pairs well with practical, ambitious partners who share your commitment to building a secure future.',
          westernSigns: ['Taurus', 'Virgo', 'Capricorn'],
          chineseSigns: ['Ox', 'Dog', 'Snake']
        },
        5: {
          best: [1, 3, 7],
          good: [5, 9],
          challenging: [2, 4, 6],
          description: 'Your adventurous spirit thrives with partners who embrace change and give you freedom to explore.',
          westernSigns: ['Gemini', 'Sagittarius', 'Aquarius'],
          chineseSigns: ['Horse', 'Monkey', 'Rat']
        },
        6: {
          best: [2, 9],
          good: [3, 4, 6],
          challenging: [1, 5, 7],
          description: 'Your nurturing heart connects deeply with compassionate partners who value family and responsibility.',
          westernSigns: ['Taurus', 'Cancer', 'Libra'],
          chineseSigns: ['Goat', 'Rabbit', 'Pig']
        },
        7: {
          best: [3, 5],
          good: [1, 7, 9],
          challenging: [2, 6, 8],
          description: 'Your introspective nature appreciates intellectual and independent partners who respect your need for space.',
          westernSigns: ['Virgo', 'Scorpio', 'Pisces'],
          chineseSigns: ['Snake', 'Rooster', 'Goat']
        },
        8: {
          best: [2, 4],
          good: [6, 8],
          challenging: [1, 3, 7],
          description: 'Your ambitious drive pairs well with practical, supportive partners who share your vision for success.',
          westernSigns: ['Leo', 'Scorpio', 'Capricorn'],
          chineseSigns: ['Tiger', 'Dragon', 'Ox']
        },
        9: {
          best: [1, 6],
          good: [2, 3, 9],
          challenging: [4, 5, 8],
          description: 'Your humanitarian heart flourishes with partners who share your idealism and compassion for others.',
          westernSigns: ['Cancer', 'Sagittarius', 'Pisces'],
          chineseSigns: ['Pig', 'Dog', 'Rabbit']
        },
        11: {
          best: [2, 6],
          good: [1, 7, 11],
          challenging: [4, 8],
          description: 'Your intuitive gifts resonate with sensitive, spiritual partners who understand your heightened awareness.',
          westernSigns: ['Aquarius', 'Pisces', 'Gemini'],
          chineseSigns: ['Horse', 'Dragon', 'Snake']
        },
        22: {
          best: [4, 8],
          good: [2, 6, 22],
          challenging: [3, 5],
          description: 'Your master builder energy pairs with practical visionaries who can help manifest your grand dreams.',
          westernSigns: ['Capricorn', 'Taurus', 'Virgo'],
          chineseSigns: ['Ox', 'Dog', 'Rooster']
        },
        33: {
          best: [6, 9],
          good: [3, 11, 33],
          challenging: [1, 8],
          description: 'Your healing presence attracts compassionate souls who share your dedication to service and unconditional love.',
          westernSigns: ['Libra', 'Pisces', 'Cancer'],
          chineseSigns: ['Goat', 'Pig', 'Rabbit']
        },
      };

      const data = compatibilityData[lifePathNumber] || compatibilityData[9];

      const lifePathMeanings: Record<number, string> = {
        1: 'The Pioneer', 2: 'The Diplomat', 3: 'The Communicator',
        4: 'The Builder', 5: 'The Freedom Seeker', 6: 'The Nurturer',
        7: 'The Seeker', 8: 'The Powerhouse', 9: 'The Humanitarian',
        11: 'The Illuminator', 22: 'The Master Builder', 33: 'The Master Teacher',
      };

      res.json({
        lifePathNumber,
        title: lifePathMeanings[lifePathNumber],
        description: data.description,
        westernSigns: data.westernSigns,
        chineseSigns: data.chineseSigns,
        bestMatches: data.best.map(n => ({ number: n, title: lifePathMeanings[n] })),
        goodMatches: data.good.map(n => ({ number: n, title: lifePathMeanings[n] })),
        challengingMatches: data.challenging.map(n => ({ number: n, title: lifePathMeanings[n] })),
        tips: [
          'Remember that any relationship can work with understanding and effort',
          'Focus on complementary strengths rather than differences',
          'Communication is key regardless of numerical compatibility',
          'Use challenges as opportunities for growth together',
        ],
      });
    } catch (error) {
      console.error("Error getting relationship patterns:", error);
      res.status(500).json({ error: "Failed to get relationship patterns" });
    }
  });

  // Career Alignment - Industries and roles matching user's energy
  app.get("/api/explore/career-alignment/:lifePathNumber", (req, res) => {
    try {
      const lifePathNumber = parseInt(req.params.lifePathNumber);

      if (isNaN(lifePathNumber) || lifePathNumber < 1 || (lifePathNumber > 9 && ![11, 22, 33].includes(lifePathNumber))) {
        return res.status(400).json({ error: "Invalid life path number" });
      }

      // Career recommendations by life path with role explanations
      const careerData: Record<number, { industries: string[]; roles: { name: string; reason: string }[]; strengths: string[]; description: string; whyTheseFit: string }> = {
        1: {
          industries: ['Technology', 'Entrepreneurship', 'Consulting', 'Sports'],
          roles: [
            { name: 'CEO', reason: 'Your natural leadership and independence make you ideal for top executive positions' },
            { name: 'Founder', reason: 'Pioneers thrive when building something from scratch on their own terms' },
            { name: 'Director', reason: 'Your decisiveness and vision guide teams toward ambitious goals' },
            { name: 'Team Lead', reason: 'Your self-starter energy inspires others to follow your initiative' },
            { name: 'Innovator', reason: 'Your pioneering spirit naturally seeks new solutions and breakthroughs' },
          ],
          strengths: ['Leadership', 'Innovation', 'Decision-making', 'Independence'],
          description: 'Your pioneering spirit makes you a natural entrepreneur and leader in any field.',
          whyTheseFit: 'As a Life Path 1, you thrive when you can chart your own course and lead by example. These roles let you leverage your natural independence and visionary thinking.'
        },
        2: {
          industries: ['Healthcare', 'Counseling', 'Human Resources', 'Diplomacy'],
          roles: [
            { name: 'Mediator', reason: 'Your innate ability to see both sides makes conflict resolution your strength' },
            { name: 'Counselor', reason: 'Your empathy and patience create safe spaces for others to open up' },
            { name: 'Partner', reason: 'You excel in collaborative roles where teamwork is essential' },
            { name: 'Coordinator', reason: 'Your diplomatic skills bring diverse groups together harmoniously' },
            { name: 'Support Specialist', reason: 'Your nurturing nature shines in helping others succeed' },
          ],
          strengths: ['Cooperation', 'Intuition', 'Diplomacy', 'Patience'],
          description: 'Your diplomatic nature excels in roles requiring partnership and emotional intelligence.',
          whyTheseFit: 'As a Life Path 2, you have a gift for creating harmony and understanding others deeply. These roles utilize your cooperative spirit and emotional sensitivity.'
        },
        3: {
          industries: ['Entertainment', 'Marketing', 'Arts', 'Media', 'Writing'],
          roles: [
            { name: 'Creative Director', reason: 'Your artistic vision and ability to inspire makes you a natural creative leader' },
            { name: 'Writer', reason: 'Your gift for expression translates beautifully into written words' },
            { name: 'Artist', reason: 'Creative self-expression is your natural way of communicating' },
            { name: 'Speaker', reason: 'Your charisma and communication skills captivate audiences' },
            { name: 'Designer', reason: 'Your eye for beauty and creativity brings ideas to visual life' },
          ],
          strengths: ['Creativity', 'Communication', 'Inspiration', 'Charisma'],
          description: 'Your creative gifts flourish in expressive roles that inspire and entertain others.',
          whyTheseFit: 'As a Life Path 3, you were born to express and create. These roles let you share your unique vision and bring joy to others through your natural talents.'
        },
        4: {
          industries: ['Engineering', 'Construction', 'Finance', 'Manufacturing'],
          roles: [
            { name: 'Engineer', reason: 'Your methodical approach and precision make technical problem-solving natural' },
            { name: 'Architect', reason: 'You excel at creating solid, lasting structures with practical purpose' },
            { name: 'Accountant', reason: 'Your attention to detail and reliability ensure accuracy in finances' },
            { name: 'Project Manager', reason: 'Your organizational skills keep complex projects on track' },
            { name: 'Analyst', reason: 'Your systematic thinking excels at breaking down complex problems' },
          ],
          strengths: ['Organization', 'Reliability', 'Precision', 'Dedication'],
          description: 'Your methodical approach builds lasting structures in any systematic field.',
          whyTheseFit: 'As a Life Path 4, you are the master builder who creates enduring value. These roles reward your dedication, precision, and ability to see projects through to completion.'
        },
        5: {
          industries: ['Travel', 'Sales', 'Journalism', 'Entertainment'],
          roles: [
            { name: 'Sales Rep', reason: 'Your adaptability and communication skills close deals naturally' },
            { name: 'Travel Agent', reason: 'Your love of adventure helps others discover new experiences' },
            { name: 'Journalist', reason: 'Your curiosity and versatility uncover compelling stories' },
            { name: 'Promoter', reason: 'Your dynamic energy and networking create buzz and excitement' },
            { name: 'Consultant', reason: 'Your variety-seeking nature thrives with diverse clients and projects' },
          ],
          strengths: ['Adaptability', 'Communication', 'Networking', 'Versatility'],
          description: 'Your adventurous spirit thrives in dynamic roles with variety and change.',
          whyTheseFit: 'As a Life Path 5, you need freedom and variety to feel alive. These roles offer the constant change and new experiences that fuel your adventurous spirit.'
        },
        6: {
          industries: ['Education', 'Healthcare', 'Hospitality', 'Social Work'],
          roles: [
            { name: 'Teacher', reason: 'Your nurturing nature creates supportive learning environments' },
            { name: 'Nurse', reason: 'Your caring heart provides comfort and healing to those in need' },
            { name: 'Therapist', reason: 'Your ability to create harmony helps others find balance' },
            { name: 'Chef', reason: 'Nurturing others through food satisfies your desire to serve' },
            { name: 'Interior Designer', reason: 'Creating beautiful, harmonious spaces brings you joy' },
          ],
          strengths: ['Nurturing', 'Responsibility', 'Service', 'Harmony'],
          description: 'Your caring nature excels in roles that serve and uplift others.',
          whyTheseFit: 'As a Life Path 6, you find deep fulfillment in caring for others and creating beauty. These roles let you make a tangible difference in people\'s lives.'
        },
        7: {
          industries: ['Research', 'Technology', 'Science', 'Academia', 'Spirituality'],
          roles: [
            { name: 'Researcher', reason: 'Your love of deep analysis uncovers truths others miss' },
            { name: 'Scientist', reason: 'Your analytical mind and curiosity drive breakthrough discoveries' },
            { name: 'Analyst', reason: 'Your ability to see patterns helps solve complex problems' },
            { name: 'Professor', reason: 'Sharing deep knowledge with seekers feeds your soul' },
            { name: 'Strategist', reason: 'Your wisdom and foresight guide long-term planning' },
          ],
          strengths: ['Analysis', 'Research', 'Intuition', 'Wisdom'],
          description: 'Your analytical mind thrives in roles requiring deep thinking and expertise.',
          whyTheseFit: 'As a Life Path 7, you seek truth and deep understanding. These roles give you the space for contemplation and mastery that your inquisitive nature craves.'
        },
        8: {
          industries: ['Finance', 'Real Estate', 'Business', 'Law'],
          roles: [
            { name: 'Executive', reason: 'Your natural authority and ambition command respect at the highest levels' },
            { name: 'Investor', reason: 'Your vision for abundance helps you spot profitable opportunities' },
            { name: 'Lawyer', reason: 'Your power and strategic thinking win cases and influence outcomes' },
            { name: 'Manager', reason: 'Your organizational abilities and authority create efficient teams' },
            { name: 'Business Owner', reason: 'Building material success comes naturally to your energy' },
          ],
          strengths: ['Ambition', 'Management', 'Vision', 'Authority'],
          description: 'Your powerhouse energy excels in positions of authority and wealth creation.',
          whyTheseFit: 'As a Life Path 8, you are here to master the material world. These roles let you exercise your natural authority and build the abundance you\'re destined for.'
        },
        9: {
          industries: ['Non-profit', 'Arts', 'Healing', 'International Relations'],
          roles: [
            { name: 'Humanitarian', reason: 'Your compassion drives you to make the world a better place' },
            { name: 'Artist', reason: 'Your wisdom and vision create work that touches universal themes' },
            { name: 'Healer', reason: 'Your gift for understanding others promotes deep transformation' },
            { name: 'Advisor', reason: 'Your broad perspective offers wisdom that guides others\' paths' },
            { name: 'Philanthropist', reason: 'Your generous heart naturally gives back to those in need' },
          ],
          strengths: ['Compassion', 'Vision', 'Wisdom', 'Generosity'],
          description: 'Your humanitarian heart finds fulfillment in roles that serve the greater good.',
          whyTheseFit: 'As a Life Path 9, you are here to serve humanity and leave a meaningful legacy. These roles channel your wisdom and compassion toward making lasting change.'
        },
        11: {
          industries: ['Spirituality', 'Arts', 'Psychology', 'Media'],
          roles: [
            { name: 'Spiritual Teacher', reason: 'Your heightened intuition guides others on their spiritual journey' },
            { name: 'Psychic', reason: 'Your sensitivity to energies provides insights beyond the ordinary' },
            { name: 'Counselor', reason: 'Your deep intuition helps others understand themselves' },
            { name: 'Artist', reason: 'Channeling inspiration into creative work comes naturally' },
            { name: 'Innovator', reason: 'Your visionary ideas illuminate new possibilities' },
          ],
          strengths: ['Intuition', 'Inspiration', 'Vision', 'Sensitivity'],
          description: 'Your illuminating presence guides others through spiritual and creative work.',
          whyTheseFit: 'As a Master Number 11, you carry heightened spiritual awareness. These roles let you channel divine inspiration and illuminate the path for others.'
        },
        22: {
          industries: ['Architecture', 'Politics', 'Large Enterprises', 'Infrastructure'],
          roles: [
            { name: 'Architect', reason: 'Your vision for large-scale creation manifests in lasting structures' },
            { name: 'Leader', reason: 'Your ability to turn vision into reality inspires large groups' },
            { name: 'Visionary', reason: 'You see possibilities that others cannot even imagine' },
            { name: 'Builder', reason: 'Creating systems and structures that endure is your purpose' },
            { name: 'Reformer', reason: 'Your practical idealism transforms institutions for the better' },
          ],
          strengths: ['Vision', 'Manifestation', 'Leadership', 'Practicality'],
          description: 'Your master builder energy creates lasting impact through large-scale projects.',
          whyTheseFit: 'As a Master Number 22, you have the rare ability to manifest grand visions. These roles let you build legacies that transform the world.'
        },
        33: {
          industries: ['Education', 'Healing', 'Spirituality', 'Community Service'],
          roles: [
            { name: 'Master Teacher', reason: 'Your wisdom and compassion uplift all who learn from you' },
            { name: 'Healer', reason: 'Your unconditional love creates profound transformation in others' },
            { name: 'Counselor', reason: 'Your deep compassion provides safe harbor for troubled souls' },
            { name: 'Spiritual Leader', reason: 'Your selfless service inspires communities toward higher purpose' },
            { name: 'Mentor', reason: 'Guiding others to their highest potential is your sacred gift' },
          ],
          strengths: ['Healing', 'Teaching', 'Compassion', 'Wisdom'],
          description: 'Your master teacher energy uplifts humanity through selfless service and wisdom.',
          whyTheseFit: 'As a Master Number 33, you carry the highest vibration of compassionate service. These roles let you heal and teach at the deepest level.'
        },
      };

      const data = careerData[lifePathNumber] || careerData[9];

      const lifePathMeanings: Record<number, string> = {
        1: 'The Pioneer', 2: 'The Diplomat', 3: 'The Communicator',
        4: 'The Builder', 5: 'The Freedom Seeker', 6: 'The Nurturer',
        7: 'The Seeker', 8: 'The Powerhouse', 9: 'The Humanitarian',
        11: 'The Illuminator', 22: 'The Master Builder', 33: 'The Master Teacher',
      };

      res.json({
        lifePathNumber,
        title: lifePathMeanings[lifePathNumber],
        description: data.description,
        whyTheseFit: data.whyTheseFit,
        industries: data.industries,
        suggestedRoles: data.roles,
        coreStrengths: data.strengths,
      });
    } catch (error) {
      console.error("Error getting career alignment:", error);
      res.status(500).json({ error: "Failed to get career alignment" });
    }
  });

  // Diagnostic endpoint to check Whop API key and company info
  app.get("/api/whop/debug", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    console.log("[Whop Debug] Starting diagnostics...");

    try {
      const { whopSdk } = await import("./whop");

      const debugInfo: any = {
        apiKeyPresent: !!process.env.WHOP_API_KEY,
        apiKeyLength: process.env.WHOP_API_KEY?.length || 0,
        apiKeyPrefix: process.env.WHOP_API_KEY?.substring(0, 10) + "...",
        appId: process.env.WHOP_APP_ID,
        viteAppId: process.env.VITE_WHOP_APP_ID,
        sdkInitialized: !!whopSdk,
        firebaseUid: req.user?.uid,
      };

      // Try to retrieve app info
      if (whopSdk) {
        try {
          console.log(`[Whop Debug] Fetching app: ${process.env.WHOP_APP_ID}`);
          const appInfo = await whopSdk.apps.retrieve(process.env.WHOP_APP_ID!);
          debugInfo.app = {
            id: appInfo.id,
            name: appInfo.name,
            companyId: (appInfo as any).company?.id || (appInfo as any).company_id,
          };
        } catch (e: any) {
          debugInfo.appError = e?.message || "Failed to fetch app";
          console.error("[Whop Debug] App fetch error:", e?.message);
        }
      }

      console.log("[Whop Debug] Results:", JSON.stringify(debugInfo, null, 2));
      res.json(debugInfo);
    } catch (error: any) {
      console.error("[Whop Debug] Error:", error);
      res.status(500).json({ error: error?.message || "Debug failed" });
    }
  });

  // Whop In-App Purchase - Create checkout configuration
  app.post("/api/checkout/create", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    const firebaseUid = req.user!.uid;
    const { odisId } = req.body;
    console.log(`[Whop Checkout] Starting checkout creation for Firebase user: ${firebaseUid}`);

    try {
      const { whopSdk } = await import("./whop");

      if (!whopSdk) {
        console.error("[Whop Checkout] SDK not initialized - missing WHOP_API_KEY or WHOP_APP_ID");
        return res.status(500).json({ error: "Whop SDK not initialized" });
      }

      const planId = "plan_rp2yShIBnW6LT";
      
      // Pass user metadata so Whop associates it with this checkout session
      const checkoutConfiguration = await whopSdk.checkoutConfigurations.create({
        plan_id: planId,
        metadata: {
          firebaseUid: firebaseUid,
          odisId: odisId || "",
          email: req.user!.email || "",
        }
      });

      console.log(`[Whop Checkout] Success! Configuration ID: ${checkoutConfiguration.id}`);

      res.json({
        id: checkoutConfiguration.id,
        planId: checkoutConfiguration.plan?.id || planId,
        url: (checkoutConfiguration as any).url || `https://whop.com/checkout/c/${checkoutConfiguration.id}`,
      });
    } catch (error: any) {
      console.error("[Whop Checkout] Error creating checkout configuration:", error?.message || error);
      res.status(error?.status || 500).json({
        error: "Failed to create checkout configuration",
        details: error?.message || "Internal error"
      });
    }
  });

  // Email notification for upgrade button clicks
  app.post("/api/notify-upgrade-click", async (req, res) => {
    try {
      const { userId, username, profilePictureUrl, odisId, fullName, email } = req.body as any;

      const resendApiKey = process.env.RESEND_API_KEY;
      const notificationEmail = process.env.NOTIFICATION_EMAIL;
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      if (!resendApiKey || !notificationEmail) {
        console.error('[Notify] Missing RESEND_API_KEY or NOTIFICATION_EMAIL');
        return res.status(500).json({ error: 'Email notification not configured' });
      }

      const resend = new Resend(resendApiKey);

      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        dateStyle: 'full',
        timeStyle: 'long'
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d4a33e; border-bottom: 2px solid #d4a33e; padding-bottom: 10px;">
            Upgrade Button Clicked
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">User Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Whop User ID:</strong></td>
                <td style="padding: 8px 0; color: #333;">${userId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Username:</strong></td>
                <td style="padding: 8px 0; color: #333;">${username || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Full Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${fullName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>ODIS ID:</strong></td>
                <td style="padding: 8px 0; color: #333;">${odisId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${email || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Timestamp:</strong></td>
                <td style="padding: 8px 0; color: #333;">${timestamp}</td>
              </tr>
            </table>
            ${profilePictureUrl ? `
              <div style="margin-top: 15px;">
                <strong style="color: #666;">Profile Picture:</strong><br/>
                <img src="${profilePictureUrl}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; margin-top: 8px; border: 2px solid #d4a33e;" />
              </div>
            ` : ''}
          </div>
          
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            This notification was sent from GG33 Pro Upgrade System
          </p>
        </div>
      `;

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: notificationEmail,
        subject: `GG33 Pro Upgrade Click - ${username || fullName || userId || 'Unknown User'}`,
        html: emailHtml,
      });

      if (error) {
        console.error('[Notify] Resend error:', error);
        return res.status(500).json({ error: 'Failed to send notification email' });
      }

      console.log('[Notify] Email sent successfully:', data?.id);
      res.json({ success: true, emailId: data?.id });
    } catch (error) {
      console.error('[Notify] Error sending notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  // Whop In-App Purchase - Upgrade user to Pro after successful payment
  app.post("/api/upgrade-to-pro", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const firebaseUid = req.user!.uid;
      const { paymentId, membershipId, receiptId, odisId } = req.body;

      console.log(`[Whop Upgrade] Request received for Firebase user ${firebaseUid}: paymentId=${paymentId}, membershipId=${membershipId}, odisId=${odisId}`);

      const { whopSdk } = await import("./whop");
      if (!whopSdk) {
        return res.status(500).json({ error: "Whop SDK not initialized" });
      }

      // Find the user in our database first
      let dbUser = await storage.getUserByFirebaseUid(firebaseUid);
      if (!dbUser && odisId) {
        dbUser = await storage.getUserByOdisId(odisId);
      }

      if (!dbUser) {
        return res.status(404).json({ error: "User profile not found. Please complete onboarding first." });
      }

      if (dbUser.isPro) {
        return res.json({ success: true, message: "User is already Pro", user: dbUser });
      }

      let isPaymentValid = false;
      let referenceId = paymentId || membershipId || receiptId;

      if (!referenceId) {
        return res.status(400).json({ error: "Missing verification parameter (paymentId, membershipId, or receiptId)" });
      }

      // 1. Verify via Payment ID (succeeded payment)
      if (paymentId || receiptId) {
        const idToCheck = paymentId || receiptId;
        console.log(`[Whop Upgrade] Verifying payment: ${idToCheck}`);
        try {
          const payment = await whopSdk.payments.retrieve(idToCheck);
          if (payment && payment.status === 'paid') {
            isPaymentValid = true;
            console.log(`[Whop Upgrade] Payment ${idToCheck} is verified paid!`);
          } else {
            console.log(`[Whop Upgrade] Payment ${idToCheck} status is: ${payment?.status}`);
          }
        } catch (err: any) {
          console.error(`[Whop Upgrade] Error retrieving payment ${idToCheck}:`, err?.message || err);
        }
      }

      // 2. Fallback: Verify via Membership ID
      if (!isPaymentValid && membershipId) {
        console.log(`[Whop Upgrade] Verifying membership: ${membershipId}`);
        try {
          const membership = await whopSdk.memberships.retrieve(membershipId);
          if (membership && (membership.status === 'active' || membership.status === 'trialing')) {
            isPaymentValid = true;
            console.log(`[Whop Upgrade] Membership ${membershipId} is verified active/trialing!`);
          } else {
            console.log(`[Whop Upgrade] Membership ${membershipId} status is: ${membership?.status}`);
          }
        } catch (err: any) {
          console.error(`[Whop Upgrade] Error retrieving membership ${membershipId}:`, err?.message || err);
        }
      }

      if (!isPaymentValid) {
        return res.status(400).json({ 
          error: "Could not verify purchase with Whop. Please make sure the payment succeeded." 
        });
      }

      // Upgrade user and store membership/payment ID
      const updatedUser = await storage.upgradeUserToPro(dbUser.odisId, referenceId);
      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to upgrade user in database" });
      }

      console.log(`[Whop Upgrade] User ${dbUser.odisId} successfully upgraded to Pro!`);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Error upgrading user to Pro:", error);
      res.status(500).json({ error: "Failed to upgrade user" });
    }
  });

  // Get user's Pro membership info including billing portal URL
  app.get("/api/membership", requireFirebaseAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const firebaseUid = req.user!.uid;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user is Pro
      const isPro = user.isPro || 
        user.odisId === 'odis_e4ef0aac-e27c-498d-a6be-ea5a248fd1b6' ||
        user.odisId === 'odis_600d1bd4-bd60-46ed-8d43-d463218128b1' ||
        user.odisId === 'odis_2827b3cb-26b7-4ac6-9100-2ffcf0dcdb63' ||
        user.odisId === 'odis_af728c65-76e4-4c20-8fc3-84b0d10bf851' ||
        user.odisId === 'odis_33d1fd75-fd80-432b-bcad-0d4bb2b47671';

      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');

      res.json({
        hasMembership: isPro,
        membershipId: (user as any).proPaymentReceiptId || "db_membership",
        status: isPro ? "active" : "inactive",
        manageUrl: "https://whop.com/hub/",
      });
    } catch (error) {
      console.error("Error getting membership status:", error);
      res.status(500).json({ error: "Failed to get membership status" });
    }
  });

  app.get("/api/cron/notifications", async (req, res) => {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const now = new Date();
    const utcHour = now.getUTCHours();
    
    try {
      if (utcHour >= 0 && utcHour < 10) {
        await sendDailyEnergyResetNotifications();
        return res.json({ success: true, type: "reset" });
      } else if (utcHour >= 10) {
        await sendDailyEnergyReminders();
        return res.json({ success: true, type: "reminder" });
      }
      res.json({ success: true, skipped: true });
    } catch (error: any) {
      console.error("Cron notifications trigger failed:", error);
      res.status(500).json({ error: error?.message || "Cron failed" });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
