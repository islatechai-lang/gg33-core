// GG33 Comprehensive Numerology & Astrology Calculation System

// ============================================
// TYPES & INTERFACES
// ============================================

export interface FullProfile {
  // Core Numbers (from birth date)
  lifePathNumber: number;
  attitudeNumber: number;
  generationNumber: number;
  dayOfBirthNumber: number;

  // Name Numbers (from full name)
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  maturityNumber: number;

  // Astrology
  chineseZodiac: ChineseZodiac;
  westernZodiac: WesternZodiac;

  // Energy
  energySignature: string;
  dailyEnergy: number;

  // Insights
  personality: PersonalityInsights;
}

export interface ChineseZodiac {
  animal: string;
  element: string;
  yinYang: string;
  traits: string[];
}

export interface WesternZodiac {
  sign: string;
  element: string;
  modality: string;
  rulingPlanet: string;
}

export interface PersonalityInsights {
  paragraph: string;
  strengths: string[];
  challenges: string[];
  bestDays: number[];
  luckyColors: string[];
}

export interface NumerologyProfile {
  lifePathNumber: number;
  chineseZodiac: ChineseZodiac;
  energySignature: string;
  personality: {
    strengths: string[];
    challenges: string[];
    bestDays: number[];
    luckyColors: string[];
  };
}

// ============================================
// LETTER TO NUMBER MAPPING (Pythagorean System)
// ============================================

const letterValues: Record<string, number> = {
  'A': 1, 'J': 1, 'S': 1,
  'B': 2, 'K': 2, 'T': 2,
  'C': 3, 'L': 3, 'U': 3,
  'D': 4, 'M': 4, 'V': 4,
  'E': 5, 'N': 5, 'W': 5,
  'F': 6, 'O': 6, 'X': 6,
  'G': 7, 'P': 7, 'Y': 7,
  'H': 8, 'Q': 8, 'Z': 8,
  'I': 9, 'R': 9,
};

const vowels = ['A', 'E', 'I', 'O', 'U'];

// ============================================
// CORE REDUCTION FUNCTION
// ============================================

function reduceToSingleDigit(num: number, preserveMasterNumbers = true): number {
  if (num === 0) return 0;
  let n = Math.abs(num);
  while (n > 9) {
    if (preserveMasterNumbers && (n === 11 || n === 22 || n === 33)) {
      return n;
    }
    n = n.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return n;
}

// ============================================
// LIFE PATH NUMBER (from birth date)
// ============================================

export function calculateLifePathNumber(birthDate: Date): number {
  // Use UTC components to avoid timezone shifts
  const month = birthDate.getUTCMonth() + 1;
  const day = birthDate.getUTCDate();
  const year = birthDate.getUTCFullYear();

  // Reduce each component separately first
  const monthReduced = reduceToSingleDigit(month, true);
  const dayReduced = reduceToSingleDigit(day, true);

  // For year, sum digits first then reduce
  const yearDigitsSum = year.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
  const yearReduced = reduceToSingleDigit(yearDigitsSum, true);

  // Sum and reduce
  const total = monthReduced + dayReduced + yearReduced;
  return reduceToSingleDigit(total, true);
}

// ============================================
// EXPRESSION NUMBER (from full name - all letters)
// ============================================

export function calculateExpressionNumber(fullName: string): number {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');

  let total = 0;
  for (const letter of cleanName) {
    total += letterValues[letter] || 0;
  }

  return reduceToSingleDigit(total, true);
}

// ============================================
// SOUL URGE NUMBER (from vowels only)
// ============================================

export function calculateSoulUrgeNumber(fullName: string): number {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');

  let total = 0;
  for (const letter of cleanName) {
    if (vowels.includes(letter)) {
      total += letterValues[letter] || 0;
    }
  }

  return reduceToSingleDigit(total, true);
}

// ============================================
// PERSONALITY NUMBER (from consonants only)
// ============================================

export function calculatePersonalityNumber(fullName: string): number {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');

  let total = 0;
  for (const letter of cleanName) {
    if (!vowels.includes(letter)) {
      total += letterValues[letter] || 0;
    }
  }

  return reduceToSingleDigit(total, true);
}

// ============================================
// MATURITY NUMBER (Life Path + Expression)
// ============================================

export function calculateMaturityNumber(lifePathNumber: number, expressionNumber: number): number {
  // Use base values for master numbers in calculation
  const lp = lifePathNumber > 9 ? reduceToSingleDigit(lifePathNumber, false) : lifePathNumber;
  const exp = expressionNumber > 9 ? reduceToSingleDigit(expressionNumber, false) : expressionNumber;

  return reduceToSingleDigit(lp + exp, true);
}

// ============================================
// ATTITUDE NUMBER (Month + Day of birth)
// ============================================

export function calculateAttitudeNumber(birthDate: Date): number {
  const month = birthDate.getUTCMonth() + 1;
  const day = birthDate.getUTCDate();

  const total = month + day;
  return reduceToSingleDigit(total, true);
}

// ============================================
// GENERATION NUMBER (Year of birth reduced)
// ============================================

export function calculateGenerationNumber(birthDate: Date): number {
  const year = birthDate.getUTCFullYear();

  // Sum all digits of the year
  const yearSum = year.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
  return reduceToSingleDigit(yearSum, true);
}

// ============================================
// DAY OF BIRTH NUMBER (Birth day reduced)
// ============================================

export function calculateDayOfBirthNumber(birthDate: Date): number {
  const day = birthDate.getUTCDate();
  return reduceToSingleDigit(day, true);
}

// ============================================
// CHINESE ZODIAC
// ============================================

const chineseAnimals = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

const chineseElements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export function calculateChineseZodiac(birthDate: Date): ChineseZodiac {
  const year = birthDate.getUTCFullYear();
  const animalIndex = (year - 4) % 12;
  const elementIndex = Math.floor((year - 4) % 10 / 2);
  const yinYang = year % 2 === 0 ? 'Yang' : 'Yin';

  const animal = chineseAnimals[animalIndex];
  const element = chineseElements[elementIndex];

  return {
    animal,
    element,
    yinYang,
    traits: getAnimalTraits(animal),
  };
}

function getAnimalTraits(animal: string): string[] {
  const traits: Record<string, string[]> = {
    'Rat': ['Clever', 'Quick-witted', 'Resourceful', 'Versatile'],
    'Ox': ['Diligent', 'Dependable', 'Strong', 'Determined'],
    'Tiger': ['Brave', 'Confident', 'Competitive', 'Unpredictable'],
    'Rabbit': ['Gentle', 'Quiet', 'Elegant', 'Kind'],
    'Dragon': ['Confident', 'Intelligent', 'Enthusiastic', 'Ambitious'],
    'Snake': ['Enigmatic', 'Intelligent', 'Wise', 'Intuitive'],
    'Horse': ['Animated', 'Active', 'Energetic', 'Free-spirited'],
    'Goat': ['Calm', 'Gentle', 'Creative', 'Thoughtful'],
    'Monkey': ['Sharp', 'Smart', 'Curious', 'Playful'],
    'Rooster': ['Observant', 'Hardworking', 'Courageous', 'Talented'],
    'Dog': ['Loyal', 'Honest', 'Helpful', 'Faithful'],
    'Pig': ['Compassionate', 'Generous', 'Diligent', 'Calm'],
  };

  return traits[animal] || ['Mysterious', 'Unique'];
}

// ============================================
// WESTERN ZODIAC
// ============================================

interface ZodiacInfo {
  sign: string;
  element: string;
  modality: string;
  rulingPlanet: string;
  traits: string[];
}

const zodiacSigns: ZodiacInfo[] = [
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

// Date ranges for zodiac signs (month, day)
const zodiacDateRanges: [number, number, number, number][] = [
  [12, 22, 1, 19],   // Capricorn: Dec 22 - Jan 19
  [1, 20, 2, 18],    // Aquarius: Jan 20 - Feb 18
  [2, 19, 3, 20],    // Pisces: Feb 19 - Mar 20
  [3, 21, 4, 19],    // Aries: Mar 21 - Apr 19
  [4, 20, 5, 20],    // Taurus: Apr 20 - May 20
  [5, 21, 6, 20],    // Gemini: May 21 - Jun 20
  [6, 21, 7, 22],    // Cancer: Jun 21 - Jul 22
  [7, 23, 8, 22],    // Leo: Jul 23 - Aug 22
  [8, 23, 9, 22],    // Virgo: Aug 23 - Sep 22
  [9, 23, 10, 22],   // Libra: Sep 23 - Oct 22
  [10, 23, 11, 21],  // Scorpio: Oct 23 - Nov 21
  [11, 22, 12, 21],  // Sagittarius: Nov 22 - Dec 21
];

export function calculateWesternZodiac(birthDate: Date): WesternZodiac {
  const month = birthDate.getUTCMonth() + 1;
  const day = birthDate.getUTCDate();

  for (let i = 0; i < zodiacDateRanges.length; i++) {
    const [startMonth, startDay, endMonth, endDay] = zodiacDateRanges[i];

    // Handle Capricorn which spans year boundary
    if (startMonth > endMonth) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return zodiacSigns[i];
      }
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)) {
        return zodiacSigns[i];
      }
    }
  }

  // Default to Capricorn
  return zodiacSigns[0];
}

// ============================================
// NUMBER MEANINGS
// ============================================

interface NumberMeaning {
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  bestDays: number[];
  luckyColors: string[];
  keywords: string[];
}

const numberMeanings: Record<number, NumberMeaning> = {
  1: {
    title: 'The Pioneer',
    description: 'Natural-born leaders with original ideas and strong determination. You carve your own path and inspire others to follow.',
    strengths: ['Leadership', 'Innovation', 'Independence', 'Courage', 'Originality'],
    challenges: ['Impatience', 'Stubbornness', 'Self-criticism', 'Domineering tendencies'],
    bestDays: [1, 10, 19, 28],
    luckyColors: ['Gold', 'Orange', 'Yellow'],
    keywords: ['Initiative', 'Ambition', 'Individuality'],
  },
  2: {
    title: 'The Diplomat',
    description: 'Peacemakers with a gift for cooperation and balance. You bring harmony to all situations and excel in partnerships.',
    strengths: ['Diplomacy', 'Intuition', 'Partnership', 'Sensitivity', 'Cooperation'],
    challenges: ['Indecision', 'Over-sensitivity', 'Self-doubt', 'Dependency'],
    bestDays: [2, 11, 20, 29],
    luckyColors: ['Silver', 'White', 'Light Blue'],
    keywords: ['Balance', 'Harmony', 'Receptivity'],
  },
  3: {
    title: 'The Communicator',
    description: 'Creative expressionists who inspire others. Your words and ideas light up the world and bring joy to those around you.',
    strengths: ['Creativity', 'Self-expression', 'Optimism', 'Joy', 'Charisma'],
    challenges: ['Scattered energy', 'Superficiality', 'Moodiness', 'Exaggeration'],
    bestDays: [3, 12, 21, 30],
    luckyColors: ['Purple', 'Pink', 'Turquoise'],
    keywords: ['Expression', 'Creativity', 'Sociability'],
  },
  4: {
    title: 'The Builder',
    description: 'Master organizers who create lasting foundations. You turn dreams into reality through dedication and hard work.',
    strengths: ['Stability', 'Organization', 'Dedication', 'Practicality', 'Reliability'],
    challenges: ['Rigidity', 'Stubbornness', 'Limitation', 'Resistance to change'],
    bestDays: [4, 13, 22, 31],
    luckyColors: ['Green', 'Brown', 'Blue'],
    keywords: ['Foundation', 'Structure', 'Discipline'],
  },
  5: {
    title: 'The Freedom Seeker',
    description: 'Adventurous spirits who embrace change. You thrive on variety and new experiences, bringing excitement wherever you go.',
    strengths: ['Versatility', 'Adventure', 'Freedom', 'Curiosity', 'Adaptability'],
    challenges: ['Restlessness', 'Inconsistency', 'Excess', 'Impulsiveness'],
    bestDays: [5, 14, 23],
    luckyColors: ['Turquoise', 'Light Blue', 'Silver'],
    keywords: ['Freedom', 'Change', 'Adventure'],
  },
  6: {
    title: 'The Nurturer',
    description: 'Compassionate caretakers who create beauty and harmony. Your love heals and your presence brings comfort to all.',
    strengths: ['Responsibility', 'Love', 'Service', 'Healing', 'Harmony'],
    challenges: ['Perfectionism', 'Self-sacrifice', 'Control', 'Over-protectiveness'],
    bestDays: [6, 15, 24],
    luckyColors: ['Blue', 'Pink', 'Green'],
    keywords: ['Nurturing', 'Responsibility', 'Domesticity'],
  },
  7: {
    title: 'The Seeker',
    description: 'Deep thinkers on a spiritual quest for truth. You see beyond the surface and possess profound wisdom.',
    strengths: ['Analysis', 'Spirituality', 'Wisdom', 'Intuition', 'Research'],
    challenges: ['Isolation', 'Skepticism', 'Aloofness', 'Overthinking'],
    bestDays: [7, 16, 25],
    luckyColors: ['Purple', 'Violet', 'Pearl'],
    keywords: ['Spirituality', 'Analysis', 'Introspection'],
  },
  8: {
    title: 'The Powerhouse',
    description: 'Natural achievers with business acumen. You manifest abundance and success through determination and vision.',
    strengths: ['Ambition', 'Authority', 'Abundance', 'Achievement', 'Executive ability'],
    challenges: ['Materialism', 'Workaholism', 'Power struggles', 'Ruthlessness'],
    bestDays: [8, 17, 26],
    luckyColors: ['Black', 'Dark Blue', 'Brown'],
    keywords: ['Power', 'Success', 'Material mastery'],
  },
  9: {
    title: 'The Humanitarian',
    description: 'Old souls with universal compassion. You serve humanity with wisdom and your generosity knows no bounds.',
    strengths: ['Compassion', 'Wisdom', 'Generosity', 'Idealism', 'Universal love'],
    challenges: ['Martyrdom', 'Letting go', 'Impracticality', 'Moodiness'],
    bestDays: [9, 18, 27],
    luckyColors: ['Gold', 'Red', 'Pink'],
    keywords: ['Humanitarianism', 'Completion', 'Universal love'],
  },
  11: {
    title: 'The Illuminator',
    description: 'Master number of spiritual insight and inspiration. You light the way for others with your visionary gifts.',
    strengths: ['Inspiration', 'Intuition', 'Illumination', 'Vision', 'Spiritual insight'],
    challenges: ['Nervous energy', 'Self-doubt', 'Impracticality', 'Sensitivity'],
    bestDays: [11, 22, 29],
    luckyColors: ['White', 'Silver', 'Gold'],
    keywords: ['Illumination', 'Inspiration', 'Idealism'],
  },
  22: {
    title: 'The Master Builder',
    description: 'Master number combining vision with action. You build empires that serve humanity with practical wisdom.',
    strengths: ['Mastery', 'Vision', 'Practicality', 'Leadership', 'Large-scale achievement'],
    challenges: ['Overwhelm', 'Self-pressure', 'Extremes', 'Controlling tendencies'],
    bestDays: [4, 22, 31],
    luckyColors: ['Gold', 'Coral', 'Cream'],
    keywords: ['Master Builder', 'Practical idealism', 'Large undertakings'],
  },
  33: {
    title: 'The Master Teacher',
    description: 'Rarest master number of unconditional love. You uplift all of humanity through selfless service and wisdom.',
    strengths: ['Healing', 'Blessing', 'Teaching', 'Selflessness', 'Spiritual mastery'],
    challenges: ['Martyrdom', 'Perfectionism', 'Self-sacrifice', 'Emotional burden'],
    bestDays: [3, 6, 33],
    luckyColors: ['Turquoise', 'Pink', 'Gold'],
    keywords: ['Master Teacher', 'Cosmic parent', 'Selfless service'],
  },
};

export function getLifePathMeaning(number: number): NumberMeaning {
  return numberMeanings[number] || numberMeanings[9];
}

export function getNumberMeaning(number: number): NumberMeaning {
  return numberMeanings[number] || numberMeanings[9];
}

// ============================================
// ENERGY SIGNATURE
// ============================================

export function calculateEnergySignature(birthDate: Date): string {
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const zodiac = calculateChineseZodiac(birthDate);

  const energyMap: Record<number, string> = {
    1: 'Fire Initiator',
    2: 'Water Harmonizer',
    3: 'Air Creator',
    4: 'Earth Stabilizer',
    5: 'Wind Changer',
    6: 'Heart Healer',
    7: 'Mind Seeker',
    8: 'Power Manifester',
    9: 'Soul Completer',
    11: 'Light Bearer',
    22: 'Reality Architect',
    33: 'Love Teacher',
  };

  return `${zodiac.element} ${energyMap[lifePathNumber] || 'Energy'}`;
}

// ============================================
// DAILY ENERGY SCORE
// ============================================

export function calculateDailyEnergyScore(birthDate: Date, targetDate: Date = new Date()): number {
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const personalYear = calculatePersonalYear(birthDate, targetDate);
  const personalMonth = calculatePersonalMonth(birthDate, targetDate);
  const personalDay = calculatePersonalDay(birthDate, targetDate);
  const universalDay = calculateLifePathNumber(targetDate);

  // Base score
  let score = 50;

  // Life path alignment with universal day
  if (lifePathNumber === universalDay) score += 20;
  else if (Math.abs(lifePathNumber - universalDay) <= 2) score += 10;

  // Personal cycles alignment
  if (personalDay === lifePathNumber) score += 15;
  if (personalMonth === lifePathNumber) score += 10;
  if (personalYear === lifePathNumber) score += 5;

  // Master number bonus
  if ([11, 22, 33].includes(universalDay)) score += 5;
  if ([11, 22, 33].includes(lifePathNumber)) score += 3;

  // Clamp between 0-100
  return Math.max(0, Math.min(100, score));
}

function calculatePersonalYear(birthDate: Date, targetDate: Date): number {
  const month = birthDate.getUTCMonth() + 1;
  const day = birthDate.getUTCDate();
  const year = targetDate.getUTCFullYear();

  return reduceToSingleDigit(month + day + year, true);
}

function calculatePersonalMonth(birthDate: Date, targetDate: Date): number {
  const personalYear = calculatePersonalYear(birthDate, targetDate);
  const month = targetDate.getUTCMonth() + 1;

  return reduceToSingleDigit(personalYear + month, true);
}

function calculatePersonalDay(birthDate: Date, targetDate: Date): number {
  const personalMonth = calculatePersonalMonth(birthDate, targetDate);
  const day = targetDate.getUTCDate();

  return reduceToSingleDigit(personalMonth + day, true);
}

// ============================================
// GENERATE PERSONALITY PARAGRAPH
// ============================================

export function generatePersonalityParagraph(
  fullName: string,
  birthDate: Date
): string {
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const expressionNumber = calculateExpressionNumber(fullName);
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
  const maturityNumber = calculateMaturityNumber(lifePathNumber, expressionNumber);

  const lifePathMeaning = getNumberMeaning(lifePathNumber);
  const expressionMeaning = getNumberMeaning(expressionNumber);
  const soulUrgeMeaning = getNumberMeaning(soulUrgeNumber);
  const maturityMeaning = getNumberMeaning(maturityNumber);

  const firstName = fullName.split(' ')[0];

  // Build a personalized paragraph
  let paragraph = `${firstName}'s Life Path Number ${lifePathNumber} suggests a foundational desire for ${lifePathMeaning.keywords.join(', ').toLowerCase()}. `;
  paragraph += `You are a natural ${lifePathMeaning.title.toLowerCase().replace('the ', '')}, someone who thrives on ${lifePathMeaning.strengths[0].toLowerCase()} and ${lifePathMeaning.strengths[1].toLowerCase()}. `;

  if ([11, 22, 33].includes(expressionNumber)) {
    paragraph += `However, the Expression Number ${expressionNumber}, a Master Number, elevates this with a powerful ${expressionMeaning.keywords[0].toLowerCase()} quality. `;
    paragraph += `You possess a unique ability to bridge the material and spiritual, often having profound insights and a vision for the greater good. `;
  } else {
    paragraph += `Your Expression Number ${expressionNumber} reveals how you present yourself to the world through ${expressionMeaning.keywords[0].toLowerCase()} and ${expressionMeaning.strengths[0].toLowerCase()}. `;
  }

  paragraph += `Your Soul Urge ${soulUrgeNumber} reinforces a deep craving for ${soulUrgeMeaning.keywords[0].toLowerCase()}, desiring ${soulUrgeMeaning.strengths[0].toLowerCase()} in all endeavors. `;
  paragraph += `The Maturity Number ${maturityNumber} indicates that as you grow, you will increasingly embody ${maturityMeaning.strengths[0].toLowerCase()}, ${maturityMeaning.strengths[1].toLowerCase()}, and a strong sense of ${maturityMeaning.keywords[0].toLowerCase()}, becoming a pillar of support for others.`;

  return paragraph;
}

// ============================================
// GENERATE COMPREHENSIVE INSIGHTS
// ============================================

export function generateComprehensiveInsights(
  fullName: string,
  birthDate: Date
): PersonalityInsights {
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const expressionNumber = calculateExpressionNumber(fullName);
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
  const westernZodiac = calculateWesternZodiac(birthDate);
  const chineseZodiac = calculateChineseZodiac(birthDate);

  const lifePathMeaning = getNumberMeaning(lifePathNumber);
  const expressionMeaning = getNumberMeaning(expressionNumber);
  const soulUrgeMeaning = getNumberMeaning(soulUrgeNumber);

  // Get western zodiac traits from the zodiacSigns array
  const westernZodiacInfo = zodiacSigns.find(z => z.sign === westernZodiac.sign);
  const westernTraits = westernZodiacInfo?.traits || [];

  // Combine strengths from multiple sources
  const allStrengths = [
    ...lifePathMeaning.strengths.slice(0, 2),
    ...expressionMeaning.strengths.slice(0, 2),
    ...soulUrgeMeaning.strengths.slice(0, 1),
    ...westernTraits.slice(0, 1),
    ...chineseZodiac.traits.slice(0, 1),
  ];

  // Combine challenges
  const allChallenges = [
    ...lifePathMeaning.challenges.slice(0, 2),
    ...expressionMeaning.challenges.slice(0, 2),
    ...soulUrgeMeaning.challenges.slice(0, 1),
    `Balancing ${lifePathMeaning.keywords[0]} with ${expressionMeaning.keywords[0]}`,
    'Potential for overthinking',
  ];

  // Generate paragraph
  const paragraph = generatePersonalityParagraph(fullName, birthDate);

  // Deduplicate arrays
  const uniqueStrengths = Array.from(new Set(allStrengths)).slice(0, 7);
  const uniqueChallenges = Array.from(new Set(allChallenges)).slice(0, 7);
  const uniqueColors = Array.from(new Set([...lifePathMeaning.luckyColors, ...expressionMeaning.luckyColors.slice(0, 1)]));

  return {
    paragraph,
    strengths: uniqueStrengths,
    challenges: uniqueChallenges,
    bestDays: lifePathMeaning.bestDays,
    luckyColors: uniqueColors,
  };
}

// ============================================
// FULL PROFILE CALCULATION
// ============================================

export function calculateFullProfile(birthDate: Date): NumerologyProfile {
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const chineseZodiac = calculateChineseZodiac(birthDate);
  const energySignature = calculateEnergySignature(birthDate);
  const meaning = getLifePathMeaning(lifePathNumber);

  return {
    lifePathNumber,
    chineseZodiac,
    energySignature,
    personality: {
      strengths: meaning.strengths,
      challenges: meaning.challenges,
      bestDays: meaning.bestDays,
      luckyColors: meaning.luckyColors,
    },
  };
}

export function calculateComprehensiveProfile(
  fullName: string,
  birthDate: Date,
  birthTime?: string,
  birthLocation?: string
): FullProfile {
  // Core Numbers (from birth date)
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const attitudeNumber = calculateAttitudeNumber(birthDate);
  const generationNumber = calculateGenerationNumber(birthDate);
  const dayOfBirthNumber = calculateDayOfBirthNumber(birthDate);

  // Name Numbers (from full name)
  const expressionNumber = calculateExpressionNumber(fullName);
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
  const personalityNumber = calculatePersonalityNumber(fullName);
  const maturityNumber = calculateMaturityNumber(lifePathNumber, expressionNumber);

  const chineseZodiac = calculateChineseZodiac(birthDate);
  const westernZodiac = calculateWesternZodiac(birthDate);

  const energySignature = calculateEnergySignature(birthDate);
  const dailyEnergy = calculateDailyEnergyScore(birthDate);

  const personality = generateComprehensiveInsights(fullName, birthDate);

  return {
    // Core Numbers
    lifePathNumber,
    attitudeNumber,
    generationNumber,
    dayOfBirthNumber,
    // Name Numbers
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
    maturityNumber,
    // Astrology
    chineseZodiac,
    westernZodiac,
    // Energy
    energySignature,
    dailyEnergy,
    // Insights
    personality,
  };
}

// ============================================
// DAILY ENERGY (for DailyEnergy component)
// ============================================

export function calculateDailyEnergy(date: Date = new Date()): {
  universalDay: number;
  theme: string;
  advice: string;
  dos: string[];
  donts: string[];
} {
  const dayNumber = calculateLifePathNumber(date);

  const dailyThemes: Record<number, {
    theme: string;
    advice: string;
    dos: string[];
    donts: string[];
  }> = {
    1: {
      theme: 'New Beginnings',
      advice: 'Start fresh projects and take initiative. Your leadership shines today.',
      dos: ['Launch new ventures', 'Take the lead', 'Set intentions', 'Be assertive'],
      donts: ['Follow blindly', 'Procrastinate', 'Be passive', 'Doubt yourself'],
    },
    2: {
      theme: 'Cooperation',
      advice: 'Focus on partnerships and diplomacy. Patience brings rewards.',
      dos: ['Collaborate', 'Listen deeply', 'Seek balance', 'Show sensitivity'],
      donts: ['Force outcomes', 'Go it alone', 'Be impatient', 'Ignore details'],
    },
    3: {
      theme: 'Expression',
      advice: 'Creativity flows freely. Express yourself and spread joy.',
      dos: ['Create art', 'Socialize', 'Express feelings', 'Play'],
      donts: ['Suppress creativity', 'Isolate', 'Overthink', 'Be too serious'],
    },
    4: {
      theme: 'Foundation',
      advice: 'Build solid foundations. Hard work pays off today.',
      dos: ['Organize', 'Plan ahead', 'Work steadily', 'Be practical'],
      donts: ['Cut corners', 'Avoid work', 'Be rigid', 'Resist structure'],
    },
    5: {
      theme: 'Change',
      advice: 'Embrace change and adventure. Freedom brings growth.',
      dos: ['Try new things', 'Travel', 'Be flexible', 'Take risks'],
      donts: ['Cling to routine', 'Be reckless', 'Overindulge', 'Fear change'],
    },
    6: {
      theme: 'Love & Service',
      advice: 'Focus on home, family, and service to others.',
      dos: ['Nurture relationships', 'Create beauty', 'Help others', 'Balance give/take'],
      donts: ['Neglect self', 'Control others', 'Perfectionism', 'Martyr yourself'],
    },
    7: {
      theme: 'Reflection',
      advice: 'Seek inner wisdom. Spiritual insights come through solitude.',
      dos: ['Meditate', 'Study', 'Trust intuition', 'Seek truth'],
      donts: ['Avoid introspection', 'Be superficial', 'Isolate too much', 'Overthink'],
    },
    8: {
      theme: 'Achievement',
      advice: 'Focus on material goals and career advancement.',
      dos: ['Make deals', 'Lead projects', 'Manifest abundance', 'Assert authority'],
      donts: ['Abuse power', 'Be greedy', 'Ignore ethics', 'Overwork'],
    },
    9: {
      theme: 'Completion',
      advice: 'Release what no longer serves you. Give generously.',
      dos: ['Let go', 'Be charitable', 'Complete projects', 'Forgive'],
      donts: ['Hold grudges', 'Start new things', 'Be selfish', 'Cling to past'],
    },
  };

  const lookupNumber = dayNumber > 9 ? (dayNumber === 11 ? 2 : dayNumber === 22 ? 4 : 6) : dayNumber;
  const daily = dailyThemes[lookupNumber] || dailyThemes[1];

  return {
    universalDay: dayNumber,
    ...daily,
  };
}

// ============================================
// COMPATIBILITY - COMPREHENSIVE SYSTEM
// ============================================

export interface DimensionScore {
  score: number;
  level: 'Low' | 'Moderate' | 'Good' | 'Excellent';
  person1Value: number;
  person2Value: number;
  insight: string;
}

export interface ZodiacCompatibility {
  chineseScore: number;
  chineseLevel: 'Challenging' | 'Neutral' | 'Harmonious' | 'Excellent';
  chineseInsight: string;
  westernScore: number;
  westernLevel: 'Challenging' | 'Neutral' | 'Harmonious' | 'Excellent';
  westernInsight: string;
  elementHarmony: string;
}

export interface ComprehensiveCompatibility {
  overallScore: number;
  level: 'Avoid' | 'Challenging' | 'Neutral' | 'Harmonious' | 'Ideal';
  description: string;

  dimensions: {
    lifePath: DimensionScore;
    expression: DimensionScore;
    soulUrge: DimensionScore;
    personality: DimensionScore;
    attitude: DimensionScore;
    dayOfBirth: DimensionScore;
  };

  zodiac: ZodiacCompatibility;

  strengths: string[];
  challenges: string[];
  growthOpportunities: string[];
  communicationTips: string[];

  person1Profile: FullProfile;
  person2Profile: FullProfile;
}

// Life Path compatibility matrix - based on numerology traditions
const lifePathCompatibility: Record<number, { ideal: number[]; good: number[]; challenging: number[] }> = {
  1: { ideal: [3, 5], good: [1, 7, 9], challenging: [4, 6, 8] },
  2: { ideal: [4, 8], good: [2, 6, 9], challenging: [5, 7] },
  3: { ideal: [1, 5], good: [3, 6, 9], challenging: [4, 7, 8] },
  4: { ideal: [2, 8], good: [4, 6, 7], challenging: [1, 3, 5] },
  5: { ideal: [1, 3], good: [5, 7, 9], challenging: [2, 4, 6] },
  6: { ideal: [2, 9], good: [3, 4, 6], challenging: [1, 5, 7] },
  7: { ideal: [4, 5], good: [1, 7, 9], challenging: [2, 3, 6, 8] },
  8: { ideal: [2, 4], good: [6, 8], challenging: [1, 3, 7, 9] },
  9: { ideal: [2, 6], good: [1, 3, 5, 9], challenging: [4, 7, 8] },
  11: { ideal: [2, 6, 9], good: [4, 7, 11], challenging: [1, 5, 8] },
  22: { ideal: [4, 6, 8], good: [2, 22], challenging: [1, 3, 5, 7] },
  33: { ideal: [6, 9], good: [2, 3, 33], challenging: [1, 4, 5, 7, 8] },
};

// Chinese zodiac animal compatibility
const chineseAnimalCompatibility: Record<string, { best: string[]; good: string[]; challenging: string[] }> = {
  'Rat': { best: ['Dragon', 'Monkey'], good: ['Ox', 'Rat', 'Pig'], challenging: ['Horse', 'Rooster'] },
  'Ox': { best: ['Snake', 'Rooster'], good: ['Rat', 'Ox', 'Rabbit'], challenging: ['Goat', 'Horse', 'Dog'] },
  'Tiger': { best: ['Horse', 'Dog'], good: ['Dragon', 'Pig'], challenging: ['Monkey', 'Snake'] },
  'Rabbit': { best: ['Goat', 'Pig'], good: ['Dog', 'Rabbit', 'Ox'], challenging: ['Rooster', 'Dragon'] },
  'Dragon': { best: ['Rat', 'Monkey'], good: ['Tiger', 'Snake', 'Pig'], challenging: ['Dog', 'Rabbit'] },
  'Snake': { best: ['Ox', 'Rooster'], good: ['Dragon', 'Horse'], challenging: ['Tiger', 'Pig'] },
  'Horse': { best: ['Tiger', 'Goat'], good: ['Dog', 'Dragon'], challenging: ['Rat', 'Ox'] },
  'Goat': { best: ['Rabbit', 'Horse'], good: ['Pig', 'Goat'], challenging: ['Ox', 'Dog', 'Rat'] },
  'Monkey': { best: ['Rat', 'Dragon'], good: ['Snake', 'Monkey'], challenging: ['Tiger', 'Pig'] },
  'Rooster': { best: ['Ox', 'Snake'], good: ['Dragon', 'Rooster'], challenging: ['Rabbit', 'Dog', 'Rat'] },
  'Dog': { best: ['Tiger', 'Rabbit'], good: ['Horse', 'Dog', 'Pig'], challenging: ['Dragon', 'Ox', 'Goat', 'Rooster'] },
  'Pig': { best: ['Rabbit', 'Goat'], good: ['Tiger', 'Rat', 'Dragon', 'Dog'], challenging: ['Snake', 'Monkey'] },
};

// Western zodiac element compatibility
const westernElementCompatibility: Record<string, { harmonious: string[]; neutral: string[]; challenging: string[] }> = {
  'Fire': { harmonious: ['Fire', 'Air'], neutral: ['Earth'], challenging: ['Water'] },
  'Earth': { harmonious: ['Earth', 'Water'], neutral: ['Fire'], challenging: ['Air'] },
  'Air': { harmonious: ['Air', 'Fire'], neutral: ['Water'], challenging: ['Earth'] },
  'Water': { harmonious: ['Water', 'Earth'], neutral: ['Air'], challenging: ['Fire'] },
};

// Western zodiac modality compatibility
const westernModalityCompatibility: Record<string, { harmonious: string[]; challenging: string[] }> = {
  'Cardinal': { harmonious: ['Fixed', 'Mutable'], challenging: ['Cardinal'] },
  'Fixed': { harmonious: ['Cardinal', 'Mutable'], challenging: ['Fixed'] },
  'Mutable': { harmonious: ['Cardinal', 'Fixed'], challenging: ['Mutable'] },
};

function calculateNumberCompatibility(num1: number, num2: number, context: string): DimensionScore {
  // Normalize master numbers for comparison
  const n1 = num1 > 9 ? (num1 === 11 ? 2 : num1 === 22 ? 4 : 6) : num1;
  const n2 = num2 > 9 ? (num2 === 11 ? 2 : num2 === 22 ? 4 : 6) : num2;

  const compat = lifePathCompatibility[num1] || lifePathCompatibility[n1];

  let score = 50;
  let level: 'Low' | 'Moderate' | 'Good' | 'Excellent' = 'Moderate';

  if (num1 === num2) {
    score = 85;
    level = 'Excellent';
  } else if (compat?.ideal.includes(num2) || compat?.ideal.includes(n2)) {
    score = 90;
    level = 'Excellent';
  } else if (compat?.good.includes(num2) || compat?.good.includes(n2)) {
    score = 70;
    level = 'Good';
  } else if (compat?.challenging.includes(num2) || compat?.challenging.includes(n2)) {
    score = 35;
    level = 'Low';
  }

  const insights = getNumberCompatibilityInsight(num1, num2, context, level);

  return {
    score,
    level,
    person1Value: num1,
    person2Value: num2,
    insight: insights,
  };
}

function getNumberCompatibilityInsight(num1: number, num2: number, context: string, level: string): string {
  const contextInsights: Record<string, Record<string, string>> = {
    lifePath: {
      'Excellent': `Your life purposes are deeply aligned. Both paths support each other's growth.`,
      'Good': `Your life directions complement each other with room for mutual growth.`,
      'Moderate': `Different life paths can bring new perspectives and learning opportunities.`,
      'Low': `Your life directions may sometimes pull in different ways. Conscious effort needed.`,
    },
    expression: {
      'Excellent': `Your communication styles are naturally in sync. Easy expression together.`,
      'Good': `You communicate well with some adaptation. Understanding comes naturally.`,
      'Moderate': `Different expression styles can enrich conversations with effort.`,
      'Low': `Communication may require patience. Learn each other's language.`,
    },
    soulUrge: {
      'Excellent': `Your hearts desire the same things. Deep emotional connection likely.`,
      'Good': `Your inner desires are compatible. Emotional understanding flows well.`,
      'Moderate': `Different inner motivations can create depth when understood.`,
      'Low': `Your heart's desires differ. Respecting each other's needs is essential.`,
    },
    personality: {
      'Excellent': `You present yourselves to the world similarly. Natural social harmony.`,
      'Good': `Your outer personalities complement each other well in social settings.`,
      'Moderate': `Different social styles can balance each other out.`,
      'Low': `Your public personas may sometimes clash. Embrace the differences.`,
    },
    attitude: {
      'Excellent': `Your daily approaches to life are beautifully aligned.`,
      'Good': `Your attitudes complement each other in day-to-day interactions.`,
      'Moderate': `Different daily rhythms can work with understanding.`,
      'Low': `Your daily approaches differ. Finding common ground is key.`,
    },
    dayOfBirth: {
      'Excellent': `Your natural talents and birth energies harmonize wonderfully.`,
      'Good': `Your birth day energies support and enhance each other.`,
      'Moderate': `Different birth energies bring variety to the relationship.`,
      'Low': `Your birth energies may create friction. Awareness helps.`,
    },
  };

  return contextInsights[context]?.[level] || `Compatibility is ${level.toLowerCase()} in this dimension.`;
}

function calculateChineseZodiacCompatibility(z1: ChineseZodiac, z2: ChineseZodiac): { score: number; level: 'Challenging' | 'Neutral' | 'Harmonious' | 'Excellent'; insight: string } {
  const compat = chineseAnimalCompatibility[z1.animal];

  let score = 50;
  let level: 'Challenging' | 'Neutral' | 'Harmonious' | 'Excellent' = 'Neutral';
  let insight = '';

  // Animal compatibility
  if (z1.animal === z2.animal) {
    score = 75;
    level = 'Harmonious';
    insight = `Two ${z1.animal}s understand each other's nature deeply.`;
  } else if (compat?.best.includes(z2.animal)) {
    score = 90;
    level = 'Excellent';
    insight = `${z1.animal} and ${z2.animal} are traditionally considered ideal partners in Chinese astrology.`;
  } else if (compat?.good.includes(z2.animal)) {
    score = 70;
    level = 'Harmonious';
    insight = `${z1.animal} and ${z2.animal} share a natural affinity and supportive energy.`;
  } else if (compat?.challenging.includes(z2.animal)) {
    score = 35;
    level = 'Challenging';
    insight = `${z1.animal} and ${z2.animal} may experience some friction, but this creates growth opportunities.`;
  } else {
    insight = `${z1.animal} and ${z2.animal} have a balanced, neutral relationship.`;
  }

  // Element bonus
  const elementCompat: Record<string, string[]> = {
    'Wood': ['Water', 'Fire'],
    'Fire': ['Wood', 'Earth'],
    'Earth': ['Fire', 'Metal'],
    'Metal': ['Earth', 'Water'],
    'Water': ['Metal', 'Wood'],
  };

  if (z1.element === z2.element) {
    score += 5;
  } else if (elementCompat[z1.element]?.includes(z2.element)) {
    score += 10;
  }

  score = Math.min(100, score);

  return { score, level, insight };
}

function calculateWesternZodiacCompatibility(z1: WesternZodiac, z2: WesternZodiac): { score: number; level: 'Challenging' | 'Neutral' | 'Harmonious' | 'Excellent'; insight: string } {
  let score = 50;
  let level: 'Challenging' | 'Neutral' | 'Harmonious' | 'Excellent' = 'Neutral';

  const elemCompat = westernElementCompatibility[z1.element];
  const modCompat = westernModalityCompatibility[z1.modality];

  // Element compatibility
  if (z1.element === z2.element) {
    score += 15;
  } else if (elemCompat?.harmonious.includes(z2.element)) {
    score += 25;
  } else if (elemCompat?.challenging.includes(z2.element)) {
    score -= 10;
  }

  // Modality compatibility
  if (modCompat?.harmonious.includes(z2.modality)) {
    score += 15;
  } else if (modCompat?.challenging.includes(z2.modality)) {
    score -= 5;
  }

  // Same sign bonus
  if (z1.sign === z2.sign) {
    score += 10;
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 80) level = 'Excellent';
  else if (score >= 60) level = 'Harmonious';
  else if (score >= 40) level = 'Neutral';
  else level = 'Challenging';

  const insight = z1.sign === z2.sign
    ? `Two ${z1.sign}s share the same cosmic DNA and understand each other intuitively.`
    : `${z1.sign} (${z1.element}/${z1.modality}) and ${z2.sign} (${z2.element}/${z2.modality}) ${level === 'Excellent' ? 'create a powerful cosmic harmony.' :
      level === 'Harmonious' ? 'flow together naturally.' :
        level === 'Neutral' ? 'bring different but balanced energies.' :
          'may need to work on understanding their different cosmic rhythms.'
    }`;

  return { score, level, insight };
}

function generateStrengths(dimensions: ComprehensiveCompatibility['dimensions'], zodiac: ZodiacCompatibility): string[] {
  const strengths: string[] = [];

  if (dimensions.lifePath.level === 'Excellent' || dimensions.lifePath.level === 'Good') {
    strengths.push('Aligned life purposes create a strong foundation');
  }
  if (dimensions.soulUrge.level === 'Excellent' || dimensions.soulUrge.level === 'Good') {
    strengths.push('Deep emotional understanding and shared inner values');
  }
  if (dimensions.expression.level === 'Excellent' || dimensions.expression.level === 'Good') {
    strengths.push('Natural communication flow and mutual understanding');
  }
  if (dimensions.personality.level === 'Excellent' || dimensions.personality.level === 'Good') {
    strengths.push('Harmonious social presence as a pair');
  }
  if (dimensions.attitude.level === 'Excellent' || dimensions.attitude.level === 'Good') {
    strengths.push('Compatible daily rhythms and approaches');
  }
  if (zodiac.chineseLevel === 'Excellent' || zodiac.chineseLevel === 'Harmonious') {
    strengths.push('Favorable Chinese zodiac pairing');
  }
  if (zodiac.westernLevel === 'Excellent' || zodiac.westernLevel === 'Harmonious') {
    strengths.push('Cosmic harmony in Western astrology');
  }

  if (strengths.length === 0) {
    strengths.push('Opportunity for growth through differences');
  }

  return strengths.slice(0, 5);
}

function generateChallenges(dimensions: ComprehensiveCompatibility['dimensions'], zodiac: ZodiacCompatibility): string[] {
  const challenges: string[] = [];

  if (dimensions.lifePath.level === 'Low') {
    challenges.push('Life directions may pull in different ways');
  }
  if (dimensions.soulUrge.level === 'Low') {
    challenges.push('Inner desires and emotional needs differ');
  }
  if (dimensions.expression.level === 'Low') {
    challenges.push('Communication styles require adaptation');
  }
  if (dimensions.personality.level === 'Low') {
    challenges.push('Social approaches may sometimes clash');
  }
  if (dimensions.attitude.level === 'Low') {
    challenges.push('Daily rhythms and habits may differ');
  }
  if (zodiac.chineseLevel === 'Challenging') {
    challenges.push('Chinese zodiac indicates friction areas');
  }
  if (zodiac.westernLevel === 'Challenging') {
    challenges.push('Elemental energies require balance');
  }

  return challenges.slice(0, 4);
}

function generateGrowthOpportunities(dimensions: ComprehensiveCompatibility['dimensions']): string[] {
  const opportunities: string[] = [];

  if (dimensions.lifePath.level === 'Moderate' || dimensions.lifePath.level === 'Low') {
    opportunities.push('Learn to appreciate different life approaches');
  }
  if (dimensions.expression.level === 'Moderate' || dimensions.expression.level === 'Low') {
    opportunities.push('Develop new communication skills together');
  }
  if (dimensions.soulUrge.level === 'Moderate' || dimensions.soulUrge.level === 'Low') {
    opportunities.push('Explore each other\'s emotional depths');
  }
  if (dimensions.personality.level === 'Moderate' || dimensions.personality.level === 'Low') {
    opportunities.push('Expand social horizons through different perspectives');
  }

  opportunities.push('Use differences as teachers for personal growth');
  opportunities.push('Build bridges through patience and understanding');

  return opportunities.slice(0, 4);
}

function generateCommunicationTips(p1: FullProfile, p2: FullProfile): string[] {
  const tips: string[] = [];

  // Based on Expression numbers
  const exp1 = p1.expressionNumber;
  const exp2 = p2.expressionNumber;

  if (exp1 === 1 || exp2 === 1) {
    tips.push('Give space for individual expression and leadership');
  }
  if (exp1 === 2 || exp2 === 2) {
    tips.push('Practice active listening and create safe spaces for sharing');
  }
  if (exp1 === 3 || exp2 === 3) {
    tips.push('Use creativity and humor to lighten conversations');
  }
  if (exp1 === 4 || exp2 === 4) {
    tips.push('Be practical and clear when discussing important matters');
  }
  if (exp1 === 5 || exp2 === 5) {
    tips.push('Keep communication fresh and avoid routine');
  }
  if (exp1 === 6 || exp2 === 6) {
    tips.push('Show care and concern in your words');
  }
  if (exp1 === 7 || exp2 === 7) {
    tips.push('Allow time for reflection before expecting responses');
  }
  if (exp1 === 8 || exp2 === 8) {
    tips.push('Be direct but tactful about practical matters');
  }
  if (exp1 === 9 || exp2 === 9) {
    tips.push('Connect through shared ideals and bigger picture discussions');
  }

  tips.push('Acknowledge and validate different communication styles');

  return tips.slice(0, 4);
}

export function calculateComprehensiveCompatibility(
  name1: string,
  date1: Date,
  name2: string,
  date2: Date
): ComprehensiveCompatibility {
  // Calculate full profiles for both
  const p1 = calculateComprehensiveProfile(name1, date1);
  const p2 = calculateComprehensiveProfile(name2, date2);

  // Calculate dimension scores
  const dimensions = {
    lifePath: calculateNumberCompatibility(p1.lifePathNumber, p2.lifePathNumber, 'lifePath'),
    expression: calculateNumberCompatibility(p1.expressionNumber, p2.expressionNumber, 'expression'),
    soulUrge: calculateNumberCompatibility(p1.soulUrgeNumber, p2.soulUrgeNumber, 'soulUrge'),
    personality: calculateNumberCompatibility(p1.personalityNumber, p2.personalityNumber, 'personality'),
    attitude: calculateNumberCompatibility(p1.attitudeNumber, p2.attitudeNumber, 'attitude'),
    dayOfBirth: calculateNumberCompatibility(p1.dayOfBirthNumber, p2.dayOfBirthNumber, 'dayOfBirth'),
  };

  // Calculate zodiac compatibility
  const chineseCompat = calculateChineseZodiacCompatibility(p1.chineseZodiac, p2.chineseZodiac);
  const westernCompat = calculateWesternZodiacCompatibility(p1.westernZodiac, p2.westernZodiac);

  const zodiac: ZodiacCompatibility = {
    chineseScore: chineseCompat.score,
    chineseLevel: chineseCompat.level,
    chineseInsight: chineseCompat.insight,
    westernScore: westernCompat.score,
    westernLevel: westernCompat.level,
    westernInsight: westernCompat.insight,
    elementHarmony: `${p1.chineseZodiac.element} meets ${p2.chineseZodiac.element}`,
  };

  // Calculate weighted overall score
  const weights = {
    lifePath: 0.25,
    expression: 0.15,
    soulUrge: 0.20,
    personality: 0.10,
    attitude: 0.10,
    dayOfBirth: 0.05,
    chinese: 0.10,
    western: 0.05,
  };

  const overallScore = Math.round(
    dimensions.lifePath.score * weights.lifePath +
    dimensions.expression.score * weights.expression +
    dimensions.soulUrge.score * weights.soulUrge +
    dimensions.personality.score * weights.personality +
    dimensions.attitude.score * weights.attitude +
    dimensions.dayOfBirth.score * weights.dayOfBirth +
    zodiac.chineseScore * weights.chinese +
    zodiac.westernScore * weights.western
  );

  // Determine overall level
  let level: 'Avoid' | 'Challenging' | 'Neutral' | 'Harmonious' | 'Ideal';
  if (overallScore < 30) level = 'Avoid';
  else if (overallScore < 45) level = 'Challenging';
  else if (overallScore < 60) level = 'Neutral';
  else if (overallScore < 80) level = 'Harmonious';
  else level = 'Ideal';

  const descriptions: Record<typeof level, string> = {
    'Avoid': 'This pairing presents significant challenges that require careful navigation. Growth is possible but demands conscious effort and mutual understanding.',
    'Challenging': 'There are friction points in this relationship, but they offer valuable opportunities for personal growth. Patience and open communication are essential.',
    'Neutral': 'A balanced connection with potential in both directions. Your compatibility depends greatly on how you choose to navigate your differences.',
    'Harmonious': 'Your energies flow together naturally. This pairing supports mutual growth and understanding, with natural resonance in key areas.',
    'Ideal': 'Exceptional alignment across multiple dimensions! Your energies amplify each other\'s strengths, creating a powerful and supportive connection.',
  };

  return {
    overallScore,
    level,
    description: descriptions[level],
    dimensions,
    zodiac,
    strengths: generateStrengths(dimensions, zodiac),
    challenges: generateChallenges(dimensions, zodiac),
    growthOpportunities: generateGrowthOpportunities(dimensions),
    communicationTips: generateCommunicationTips(p1, p2),
    person1Profile: p1,
    person2Profile: p2,
  };
}

// Keep the simple compatibility function for backward compatibility
export function calculateCompatibility(date1: Date, date2: Date): {
  score: number;
  level: 'Avoid' | 'Challenging' | 'Neutral' | 'Harmonious' | 'Ideal';
  description: string;
  strengths: string[];
  challenges: string[];
} {
  const result = calculateComprehensiveCompatibility('Person 1', date1, 'Person 2', date2);
  return {
    score: result.overallScore,
    level: result.level,
    description: result.description,
    strengths: result.strengths,
    challenges: result.challenges,
  };
}
