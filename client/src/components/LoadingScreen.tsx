import { useState, useEffect, useRef } from 'react';
import { Sparkles, Star, Moon, Sun, Zap } from 'lucide-react';
import { calculateComprehensiveProfile } from '@/lib/numerology';
import { ProfileData } from '@/components/ProfileSetup';

interface LoadingScreenProps {
  onComplete: () => void;
  profile?: ProfileData;
}

const PERSONALITY_CACHE_KEY = 'gg33-personality-insights';

const loadingStages = [
  { message: 'Mapping your numerology grid...', icon: Star, duration: 800 },
  { message: 'Calculating your cosmic signature...', icon: Sparkles, duration: 900 },
  { message: 'Generating your personal insights...', icon: Zap, duration: 1500 },
  { message: 'Charting your daily energy...', icon: Moon, duration: 1500 },
  { message: 'Finalizing your profile...', icon: Sun, duration: 500 },
];

export function LoadingScreen({ onComplete, profile }: LoadingScreenProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [aiReady, setAiReady] = useState(false);
  const aiGenerationStarted = useRef(false);

  // Generate AI insights when profile is available
  useEffect(() => {
    if (!profile || aiGenerationStarted.current) return;
    aiGenerationStarted.current = true;

    const generateInsights = async () => {
      const todayKey = new Date().toISOString().split('T')[0];
      
      // Check if we already have cached data for THIS specific odisId - if so, skip generation
      try {
        const cachedPersonality = localStorage.getItem(PERSONALITY_CACHE_KEY);
        
        if (cachedPersonality) {
          const personality = JSON.parse(cachedPersonality);
          
          // Cache key MUST include odisId to avoid false matches after reset
          const expectedProfileKey = `${profile.odisId}-${profile.fullName}`;
          
          if (personality.profileKey === expectedProfileKey) {
            setAiReady(true);
            return;
          }
        }
      } catch (e) {
        // If cache check fails, continue with generation
      }

      const fullProfile = calculateComprehensiveProfile(
        profile.fullName,
        profile.birthDate,
        profile.birthTime,
        profile.birthLocation
      );

      const aiProfileData = {
        name: profile.fullName.split(' ')[0],
        birthDate: profile.birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        lifePathNumber: fullProfile.lifePathNumber,
        expressionNumber: fullProfile.expressionNumber,
        soulUrgeNumber: fullProfile.soulUrgeNumber,
        personalityNumber: fullProfile.personalityNumber,
        maturityNumber: fullProfile.maturityNumber,
        westernZodiac: fullProfile.westernZodiac.sign,
        westernElement: fullProfile.westernZodiac.element,
        chineseZodiac: fullProfile.chineseZodiac.animal,
        chineseElement: fullProfile.chineseZodiac.element,
      };

      try {
        // Generate and save personality insights to database
        const personalityRes = await fetch('/api/personality', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            odisId: profile.odisId,
            profile: aiProfileData,
          }),
        });
        if (personalityRes.ok) {
          const personalityData = await personalityRes.json();
          localStorage.setItem(PERSONALITY_CACHE_KEY, JSON.stringify({
            data: personalityData.insight || personalityData,
            profileKey: `${profile.odisId}-${profile.fullName}`,
          }));
        }
      } catch (error) {
        console.error('Error generating AI insights:', error);
      } finally {
        // Always set aiReady to true, even if AI calls fail
        // This prevents the loading screen from hanging
        setAiReady(true);
      }
    };

    generateInsights();
  }, [profile]);

  useEffect(() => {
    const totalDuration = loadingStages.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Calculate current stage
      let accumulatedDuration = 0;
      for (let i = 0; i < loadingStages.length; i++) {
        accumulatedDuration += loadingStages[i].duration;
        if (elapsed < accumulatedDuration) {
          setCurrentStage(i);
          break;
        }
      }

      // Only complete when both animation is done AND AI is ready (or no profile)
      if (elapsed >= totalDuration) {
        clearInterval(interval);
        if (!profile || aiReady) {
          setTimeout(onComplete, 300);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, profile, aiReady]);

  // If animation is done but AI is still loading, wait for AI
  useEffect(() => {
    if (progress >= 100 && aiReady && profile) {
      setTimeout(onComplete, 300);
    }
  }, [progress, aiReady, onComplete, profile]);

  const stage = loadingStages[currentStage];
  const StageIcon = stage.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      data-testid="loading-screen"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-amber-a3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-violet-a3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-amber-a2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center space-y-8 px-4 max-w-md">
        <div className="w-24 h-24 mx-auto rounded-xl bg-gold-gradient flex items-center justify-center shadow-2xl animate-scale-in">
          <StageIcon className="w-12 h-12 text-gray-1 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-5 font-semibold gradient-text animate-fade-in">
            Reading Your Energy
          </h2>
          <p className="text-3 text-gray-11 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {stage.message}
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-full h-2 bg-gray-a3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold-gradient rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-1 text-gray-10">
            {Math.round(progress)}% complete
          </p>
        </div>

        <div className="flex justify-center gap-3">
          {loadingStages.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 ${
                  i < currentStage 
                    ? 'bg-amber-9 text-gray-1' 
                    : i === currentStage 
                      ? 'bg-amber-a4 text-amber-9 animate-pulse' 
                      : 'bg-gray-a3 text-gray-9'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
