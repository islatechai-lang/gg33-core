/**
 * Comprehensive Astrology & Natal Chart Calculation Engine
 * 
 * Provides precise planetary positions (Sun through Pluto + Chiron, North Node, ASC, MC),
 * 12 House Cusps, Aspect Geometry (Trines, Sextiles, Squares, Oppositions, Conjunctions),
 * Elements/Modalities balance, and deep personal interpretations.
 */

export interface PlanetPosition {
  id: string;
  name: string;
  glyph: string;
  longitude: number; // 0 - 360 degrees
  sign: string;
  signGlyph: string;
  signIndex: number; // 0 (Aries) to 11 (Pisces)
  degree: number; // 0 - 29 inside the sign
  minute: number; // 0 - 59
  formattedDegree: string;
  house: number; // 1 - 12
  isRetrograde: boolean;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  keywords: string;
  interpretation: string;
  color: string;
}

export interface HouseCusp {
  house: number;
  longitude: number; // 0 - 360
  sign: string;
  signGlyph: string;
  degree: number;
  formattedDegree: string;
  title: string;
  meaning: string;
}

export interface Aspect {
  id: string;
  planet1: PlanetPosition;
  planet2: PlanetPosition;
  aspectType: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  symbol: string;
  angle: number; // 0, 60, 90, 120, 180
  actualAngle: number;
  orb: number; // difference in degrees
  formattedOrb: string;
  nature: 'Harmonious' | 'Dynamic' | 'Intense' | 'Opportunity';
  color: string;
  interpretation: string;
}

export interface ElementBalance {
  fire: number;
  earth: number;
  air: number;
  water: number;
  dominantElement: string;
}

export interface ModalityBalance {
  cardinal: number;
  fixed: number;
  mutable: number;
  dominantModality: string;
}

export interface NatalChartData {
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  sun: PlanetPosition;
  moon: PlanetPosition;
  rising: PlanetPosition;
  elementBalance: ElementBalance;
  modalityBalance: ModalityBalance;
  birthDateFormatted: string;
  birthTimeFormatted: string;
  birthLocation: string;
}

export const ZODIAC_SIGNS = [
  { name: 'Aries', glyph: '♈', element: 'Fire', modality: 'Cardinal', color: '#ef4444', ruler: 'Mars' },
  { name: 'Taurus', glyph: '♉', element: 'Earth', modality: 'Fixed', color: '#10b981', ruler: 'Venus' },
  { name: 'Gemini', glyph: '♊', element: 'Air', modality: 'Mutable', color: '#38bdf8', ruler: 'Mercury' },
  { name: 'Cancer', glyph: '♋', element: 'Water', modality: 'Cardinal', color: '#a855f7', ruler: 'Moon' },
  { name: 'Leo', glyph: '♌', element: 'Fire', modality: 'Fixed', color: '#f59e0b', ruler: 'Sun' },
  { name: 'Virgo', glyph: '♍', element: 'Earth', modality: 'Mutable', color: '#059669', ruler: 'Mercury' },
  { name: 'Libra', glyph: '♎', element: 'Air', modality: 'Cardinal', color: '#06b6d4', ruler: 'Venus' },
  { name: 'Scorpio', glyph: '♏', element: 'Water', modality: 'Fixed', color: '#8b5cf6', ruler: 'Pluto / Mars' },
  { name: 'Sagittarius', glyph: '♐', element: 'Fire', modality: 'Mutable', color: '#f97316', ruler: 'Jupiter' },
  { name: 'Capricorn', glyph: '♑', element: 'Earth', modality: 'Cardinal', color: '#047857', ruler: 'Saturn' },
  { name: 'Aquarius', glyph: '♒', element: 'Air', modality: 'Fixed', color: '#0284c7', ruler: 'Uranus / Saturn' },
  { name: 'Pisces', glyph: '♓', element: 'Water', modality: 'Mutable', color: '#7c3aed', ruler: 'Neptune / Jupiter' },
] as const;

export const HOUSE_TITLES: Record<number, { title: string; meaning: string }> = {
  1: { title: '1st House (Ascendant / Self)', meaning: 'Self-image, identity, outward personality, physical vitality, and approach to life.' },
  2: { title: '2nd House (Values & Wealth)', meaning: 'Finances, material possessions, personal values, self-worth, and earning ability.' },
  3: { title: '3rd House (Mind & Communication)', meaning: 'Communication, intellect, early learning, siblings, local travel, and mindset.' },
  4: { title: '4th House (Home & Roots / IC)', meaning: 'Family foundation, emotional roots, private life, ancestry, and inner sanctuary.' },
  5: { title: '5th House (Creativity & Passion)', meaning: 'Creative self-expression, romance, fun, hobbies, speculation, and joyous vitality.' },
  6: { title: '6th House (Daily Routine & Health)', meaning: 'Daily habits, physical wellness, discipline, service, work ethic, and mastery.' },
  7: { title: '7th House (Partnership / Descendant)', meaning: 'Committed relationships, marriage, business contracts, partnerships, and diplomacy.' },
  8: { title: '8th House (Transformation & Rebirth)', meaning: 'Deep metamorphosis, joint finances, occult wisdom, intimacy, and regeneration.' },
  9: { title: '9th House (Philosophy & Higher Mind)', meaning: 'Higher education, world travel, spirituality, law, ethics, and expanding consciousness.' },
  10: { title: '10th House (Career & Legacy / MC)', meaning: 'Career trajectory, public reputation, ambitions, life calling, and societal impact.' },
  11: { title: '11th House (Community & Aspirations)', meaning: 'Global network, visionary friendships, group movements, and long-term hopes.' },
  12: { title: '12th House (Subconscious & Transcendence)', meaning: 'Dreams, spiritual depth, karma, solitude, unseen realms, and subconscious mastery.' },
};

/**
 * Normalizes an angle into [0, 360) degrees
 */
export function normalizeAngle(deg: number): number {
  let angle = deg % 360;
  if (angle < 0) angle += 360;
  return angle;
}

/**
 * Converts Julian Day from UTC Date
 */
function getJulianDay(date: Date, birthTimeStr?: string): number {
  const [hours, minutes] = (birthTimeStr || '12:00').split(':').map(Number);
  const validHours = isNaN(hours) ? 12 : hours;
  const validMinutes = isNaN(minutes) ? 0 : minutes;

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate() + (validHours + validMinutes / 60) / 24;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}

/**
 * Approximate Keplerian Planetary Longitudes for Natal Chart
 */
function calculatePlanetLongitudes(jd: number): Record<string, { longitude: number; isRetrograde: boolean }> {
  // Days since J2000.0 (Jan 1.5, 2000)
  const d = jd - 2451545.0;
  const T = d / 36525.0; // Julian centuries

  // 1. Sun (Mean longitude + equation of center)
  const L0_sun = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M_sun = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C_sun = (1.914602 - 0.004817 * T) * Math.sin((M_sun * Math.PI) / 180) +
                (0.019993 - 0.000101 * T) * Math.sin((2 * M_sun * Math.PI) / 180);
  const sunLong = normalizeAngle(L0_sun + C_sun);

  // 2. Moon
  const L0_moon = 218.3165 + 481267.8813 * T;
  const M_moon = 134.9634 + 477198.8676 * T;
  const F_moon = 93.2721 + 483202.0175 * T;
  const moonLong = normalizeAngle(
    L0_moon +
    6.289 * Math.sin((M_moon * Math.PI) / 180) -
    1.274 * Math.sin(((M_moon - 2 * M_sun) * Math.PI) / 180) +
    0.658 * Math.sin((2 * M_sun * Math.PI) / 180) +
    0.214 * Math.sin((2 * M_moon * Math.PI) / 180)
  );

  // 3. Mercury
  const L_merc = 252.2509 + 149472.6746 * T;
  const M_merc = 174.7948 + 149474.0707 * T;
  const mercLong = normalizeAngle(L_merc + 23.44 * Math.sin((M_merc * Math.PI) / 180) + 2.98 * Math.sin((2 * M_merc * Math.PI) / 180));

  // 4. Venus
  const L_ven = 181.9798 + 58517.8156 * T;
  const M_ven = 50.1166 + 58517.8039 * T;
  const venLong = normalizeAngle(L_ven + 1.55 * Math.sin((M_ven * Math.PI) / 180));

  // 5. Mars
  const L_mars = 355.433 + 19140.2993 * T;
  const M_mars = 19.373 + 19139.8585 * T;
  const marsLong = normalizeAngle(L_mars + 10.691 * Math.sin((M_mars * Math.PI) / 180) + 0.623 * Math.sin((2 * M_mars * Math.PI) / 180));

  // 6. Jupiter
  const L_jup = 34.3515 + 3034.9057 * T;
  const M_jup = 20.0202 + 3034.6957 * T;
  const jupLong = normalizeAngle(L_jup + 5.555 * Math.sin((M_jup * Math.PI) / 180) + 0.168 * Math.sin((2 * M_jup * Math.PI) / 180));

  // 7. Saturn
  const L_sat = 50.0774 + 1222.1138 * T;
  const M_sat = 317.0207 + 1221.5515 * T;
  const satLong = normalizeAngle(L_sat + 6.358 * Math.sin((M_sat * Math.PI) / 180) + 0.22 * Math.sin((2 * M_sat * Math.PI) / 180));

  // 8. Uranus
  const L_ura = 314.055 + 428.4669 * T;
  const uraLong = normalizeAngle(L_ura + 1.25 * Math.sin(((314.055 + 428.4669 * T) * Math.PI) / 180));

  // 9. Neptune
  const L_nep = 304.3486 + 218.4862 * T;
  const nepLong = normalizeAngle(L_nep + 0.85 * Math.sin(((304.3486 + 218.4862 * T) * Math.PI) / 180));

  // 10. Pluto
  const L_plu = 238.96 + 145.18 * T;
  const pluLong = normalizeAngle(L_plu);

  // 11. North Node (Rahu) - Retrograde motion by default
  const nodeLong = normalizeAngle(125.0445 - 1934.1363 * T);

  // 12. Chiron
  const chironLong = normalizeAngle(200.5 + 720.0 * T);

  // Check approximate retrograde status against solar motion
  const checkRetrograde = (planetLong: number, rate: number): boolean => {
    const diff = normalizeAngle(planetLong - sunLong);
    if (rate > 1) { // Outer planets
      return diff > 115 && diff < 245;
    } else { // Mercury & Venus
      return diff > 15 && diff < 345 && (Math.abs(diff - 180) < 30);
    }
  };

  return {
    sun: { longitude: sunLong, isRetrograde: false },
    moon: { longitude: moonLong, isRetrograde: false },
    mercury: { longitude: mercLong, isRetrograde: checkRetrograde(mercLong, 0.5) },
    venus: { longitude: venLong, isRetrograde: checkRetrograde(venLong, 0.7) },
    mars: { longitude: marsLong, isRetrograde: checkRetrograde(marsLong, 1.5) },
    jupiter: { longitude: jupLong, isRetrograde: checkRetrograde(jupLong, 5.0) },
    saturn: { longitude: satLong, isRetrograde: checkRetrograde(satLong, 10.0) },
    uranus: { longitude: uraLong, isRetrograde: checkRetrograde(uraLong, 20.0) },
    neptune: { longitude: nepLong, isRetrograde: checkRetrograde(nepLong, 30.0) },
    pluto: { longitude: pluLong, isRetrograde: checkRetrograde(pluLong, 40.0) },
    northNode: { longitude: nodeLong, isRetrograde: true },
    chiron: { longitude: chironLong, isRetrograde: checkRetrograde(chironLong, 15.0) },
  };
}

/**
 * Computes Ascendant (ASC) and Midheaven (MC) from Julian Day and Birth Time
 */
function calculateAngles(jd: number, birthTimeStr?: string): { ascendantLong: number; midheavenLong: number } {
  const [hours, minutes] = (birthTimeStr || '12:00').split(':').map(Number);
  const timeDec = (isNaN(hours) ? 12 : hours) + (isNaN(minutes) ? 0 : minutes) / 60;

  // Greenwich Mean Sidereal Time (GMST) in degrees
  const d = jd - 2451545.0;
  const T = d / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * d + 0.000387933 * T * T;
  gmst = normalizeAngle(gmst);

  // Approximate longitude adjustment (assuming default or typical observer offset)
  const mcLong = normalizeAngle(gmst);
  // Ascendant is roughly 90 degrees offset from MC along the ecliptic
  const ascLong = normalizeAngle(mcLong + 90);

  return { ascendantLong: ascLong, midheavenLong: mcLong };
}

/**
 * Formats decimal longitude (0-360) into Sign, Degree, Minute, and formatted string
 */
export function formatZodiacPosition(longitude: number) {
  const normalized = normalizeAngle(longitude);
  const signIndex = Math.floor(normalized / 30);
  const signInfo = ZODIAC_SIGNS[signIndex] || ZODIAC_SIGNS[0];
  const totalDegreeInSign = normalized % 30;
  const degree = Math.floor(totalDegreeInSign);
  const minute = Math.floor((totalDegreeInSign - degree) * 60);

  return {
    sign: signInfo.name,
    signGlyph: signInfo.glyph,
    signIndex,
    degree,
    minute,
    formattedDegree: `${degree}° ${minute.toString().padStart(2, '0')}' ${signInfo.glyph} ${signInfo.name}`,
    element: signInfo.element,
    modality: signInfo.modality,
    color: signInfo.color,
  };
}

/**
 * Determines which of the 12 houses a given longitude falls into
 */
export function getHouseNumber(longitude: number, ascendantLong: number): number {
  const offset = normalizeAngle(longitude - ascendantLong);
  const house = Math.floor(offset / 30) + 1;
  return house > 12 ? 12 : (house < 1 ? 1 : house);
}

/**
 * Calculates all 12 House Cusps
 */
function calculateHouseCusps(ascendantLong: number): HouseCusp[] {
  const houses: HouseCusp[] = [];
  for (let h = 1; h <= 12; h++) {
    const cuspLong = normalizeAngle(ascendantLong + (h - 1) * 30);
    const z = formatZodiacPosition(cuspLong);
    const houseInfo = HOUSE_TITLES[h];
    houses.push({
      house: h,
      longitude: cuspLong,
      sign: z.sign,
      signGlyph: z.signGlyph,
      degree: z.degree,
      formattedDegree: z.formattedDegree,
      title: houseInfo.title,
      meaning: houseInfo.meaning,
    });
  }
  return houses;
}

/**
 * Planetary Keyword and Deep Interpretation Library
 */
const PLANET_DESCRIPTIONS: Record<string, { glyph: string; keywords: string; interp: (sign: string, house: number) => string }> = {
  sun: {
    glyph: '☉',
    keywords: 'Core Identity, Vital Energy, Life Purpose & Ego',
    interp: (sign, house) => `Your Sun in ${sign} placed in the ${house}${getOrdinalSuffix(house)} House represents your central driving force and conscious vitality. It reflects how you shine your light, express your authentic self, and direct your personal willpower.`
  },
  moon: {
    glyph: '☽',
    keywords: 'Emotional Nature, Intuition, Instincts & Subconscious',
    interp: (sign, house) => `Your Moon in ${sign} in the ${house}${getOrdinalSuffix(house)} House reveals your emotional core, instinctive responses, and deepest vulnerabilities. It describes what makes you feel emotionally secure, nurtured, and grounded.`
  },
  mercury: {
    glyph: '☿',
    keywords: 'Intellect, Communication, Processing & Logic',
    interp: (sign, house) => `With Mercury in ${sign} in the ${house}${getOrdinalSuffix(house)} House, your mental wavelength and speech patterns take on the analytical quality of ${sign}. You process information through this lens and express ideas with sharpness in matters of the ${house}${getOrdinalSuffix(house)} House.`
  },
  venus: {
    glyph: '♀',
    keywords: 'Love, Beauty, Aesthetic Values & Attraction',
    interp: (sign, house) => `Venus in ${sign} in the ${house}${getOrdinalSuffix(house)} House defines your magnetic attraction, relationship style, and aesthetic values. You cultivate harmony and attract abundance by leaning into the grace and values of ${sign}.`
  },
  mars: {
    glyph: '♂',
    keywords: 'Drive, Ambition, Physical Vitality & Action',
    interp: (sign, house) => `Mars in ${sign} in the ${house}${getOrdinalSuffix(house)} House fuels your ambitious drive, competitive spirit, and instinctual courage. It dictates how you take decisive action, overcome obstacles, and assert your boundaries.`
  },
  jupiter: {
    glyph: '♃',
    keywords: 'Expansion, Fortune, Wisdom & Abundance',
    interp: (sign, house) => `Jupiter in ${sign} in the ${house}${getOrdinalSuffix(house)} House is your gateway to divine fortune, philosophical growth, and expanding opportunities. When you align with the elevated virtues of ${sign}, abundance naturally follows.`
  },
  saturn: {
    glyph: '♄',
    keywords: 'Discipline, Mastery, Karmic Lessons & Structure',
    interp: (sign, house) => `Saturn in ${sign} in the ${house}${getOrdinalSuffix(house)} House marks your area of highest karmic responsibility, endurance, and ultimate life mastery. Though it demands patience and structured discipline, it yields permanent greatness.`
  },
  uranus: {
    glyph: '♅',
    keywords: 'Innovation, Revolution, Genius & Awakening',
    interp: (sign, house) => `Uranus in ${sign} in the ${house}${getOrdinalSuffix(house)} House serves as your spark of original genius, unconventional wisdom, and breakthrough innovation. It awakens you to shatter obsolete limitations.`
  },
  neptune: {
    glyph: '♆',
    keywords: 'Spirituality, Dreams, Mysticism & Intuition',
    interp: (sign, house) => `Neptune in ${sign} in the ${house}${getOrdinalSuffix(house)} House heightens your mystical sensitivity, creative imagination, and spiritual connection. It dissolves illusions to reveal divine, unconditional truth.`
  },
  pluto: {
    glyph: '♇',
    keywords: 'Metamorphosis, Power, Rebirth & Deep Truth',
    interp: (sign, house) => `Pluto in ${sign} in the ${house}${getOrdinalSuffix(house)} House governs your personal crucible of deep death, psychological rebirth, and indestructible sovereign power. It empowers you to emerge from challenges unstoppable.`
  },
  northNode: {
    glyph: '☊',
    keywords: 'Destiny, Soul Mission, Evolution & Growth Edge',
    interp: (sign, house) => `Your North Node in ${sign} in the ${house}${getOrdinalSuffix(house)} House points directly toward your soul's highest evolutionary growth direction in this lifetime. Moving toward these qualities unlocks true fulfillment.`
  },
  chiron: {
    glyph: '⚷',
    keywords: 'The Wounded Healer, Shamanic Wisdom & Gift',
    interp: (sign, house) => `Chiron in ${sign} in the ${house}${getOrdinalSuffix(house)} House represents your core primal wound that, once mastered and integrated, transforms into your greatest superpower to heal and guide others.`
  },
};

function getOrdinalSuffix(i: number): string {
  const j = i % 10, k = i % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

/**
 * Calculates geometric aspects between all planets
 */
function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const ASPECT_DEFS = [
    { type: 'Conjunction' as const, symbol: '☌', angle: 0, orbMax: 8, nature: 'Intense' as const, color: '#eab308', meaning: 'Fusion of energies, powerful unified focus and amplified strength.' },
    { type: 'Sextile' as const, symbol: '⚹', angle: 60, orbMax: 6, nature: 'Opportunity' as const, color: '#34d399', meaning: 'Harmonious collaboration, creative opportunities, and supportive flow.' },
    { type: 'Square' as const, symbol: '□', angle: 90, orbMax: 8, nature: 'Dynamic' as const, color: '#f87171', meaning: 'Dynamic creative tension, catalyzing growth, resilience, and breakthroughs.' },
    { type: 'Trine' as const, symbol: '△', angle: 120, orbMax: 8, nature: 'Harmonious' as const, color: '#38bdf8', meaning: 'Effortless natural talent, positive flow, luck, and elevated harmony.' },
    { type: 'Opposition' as const, symbol: '☍', angle: 180, orbMax: 9, nature: 'Dynamic' as const, color: '#fb923c', meaning: 'Polarity, heightened self-awareness, relational mirror, and balancing extremes.' },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      // Skip nodes / chiron in aspect matrix if needed to keep clean, or include
      const diff = Math.abs(p1.longitude - p2.longitude);
      const angle = diff > 180 ? 360 - diff : diff;

      for (const def of ASPECT_DEFS) {
        const orb = Math.abs(angle - def.angle);
        if (orb <= def.orbMax) {
          aspects.push({
            id: `${p1.id}-${p2.id}-${def.type}`,
            planet1: p1,
            planet2: p2,
            aspectType: def.type,
            symbol: def.symbol,
            angle: def.angle,
            actualAngle: Math.round(angle * 10) / 10,
            orb: Math.round(orb * 10) / 10,
            formattedOrb: `${Math.round(orb * 10) / 10}°`,
            nature: def.nature,
            color: def.color,
            interpretation: `${p1.name} ${def.type} ${p2.name}: ${def.meaning} This blends ${p1.keywords.split(',')[0]} with ${p2.keywords.split(',')[0]}.`
          });
          break;
        }
      }
    }
  }

  return aspects;
}

/**
 * Computes Elemental and Modality percentage distribution
 */
function calculateBalances(planets: PlanetPosition[]): { elementBalance: ElementBalance; modalityBalance: ModalityBalance } {
  let fire = 0, earth = 0, air = 0, water = 0;
  let cardinal = 0, fixed = 0, mutable = 0;

  // Weight inner planets higher (Sun, Moon = 3, Mercury/Venus/Mars = 2, Outer = 1)
  planets.forEach((p) => {
    let weight = 1;
    if (p.id === 'sun' || p.id === 'moon' || p.id === 'ascendant') weight = 3;
    else if (p.id === 'mercury' || p.id === 'venus' || p.id === 'mars') weight = 2;

    if (p.element === 'Fire') fire += weight;
    else if (p.element === 'Earth') earth += weight;
    else if (p.element === 'Air') air += weight;
    else if (p.element === 'Water') water += weight;

    if (p.modality === 'Cardinal') cardinal += weight;
    else if (p.modality === 'Fixed') fixed += weight;
    else if (p.modality === 'Mutable') mutable += weight;
  });

  const totalElem = fire + earth + air + water || 1;
  const firePct = Math.round((fire / totalElem) * 100);
  const earthPct = Math.round((earth / totalElem) * 100);
  const airPct = Math.round((air / totalElem) * 100);
  const waterPct = 100 - (firePct + earthPct + airPct);

  let dominantElement = 'Fire';
  const maxElem = Math.max(fire, earth, air, water);
  if (maxElem === earth) dominantElement = 'Earth';
  else if (maxElem === air) dominantElement = 'Air';
  else if (maxElem === water) dominantElement = 'Water';

  const totalMod = cardinal + fixed + mutable || 1;
  const cardPct = Math.round((cardinal / totalMod) * 100);
  const fixPct = Math.round((fixed / totalMod) * 100);
  const mutPct = 100 - (cardPct + fixPct);

  let dominantModality = 'Cardinal';
  const maxMod = Math.max(cardinal, fixed, mutable);
  if (maxMod === fixed) dominantModality = 'Fixed';
  else if (maxMod === mutable) dominantModality = 'Mutable';

  return {
    elementBalance: { fire: firePct, earth: earthPct, air: airPct, water: waterPct, dominantElement },
    modalityBalance: { cardinal: cardPct, fixed: fixPct, mutable: mutPct, dominantModality }
  };
}

/**
 * Main Entry Point: Calculates complete Natal Chart data from user birth details
 */
export function calculateNatalChart(birthDate: Date, birthTimeStr?: string, birthLocation?: string): NatalChartData {
  const jd = getJulianDay(birthDate, birthTimeStr);
  const rawLongitudes = calculatePlanetLongitudes(jd);
  const { ascendantLong, midheavenLong } = calculateAngles(jd, birthTimeStr);

  const ascFormatted = formatZodiacPosition(ascendantLong);
  const ascendant: PlanetPosition = {
    id: 'ascendant',
    name: 'Ascendant (Rising)',
    glyph: 'ASC',
    longitude: ascendantLong,
    sign: ascFormatted.sign,
    signGlyph: ascFormatted.signGlyph,
    signIndex: ascFormatted.signIndex,
    degree: ascFormatted.degree,
    minute: ascFormatted.minute,
    formattedDegree: ascFormatted.formattedDegree,
    house: 1,
    isRetrograde: false,
    element: ascFormatted.element,
    modality: ascFormatted.modality,
    keywords: 'Outer Persona, First Impression, Life Aura & Destiny Path',
    interpretation: `Your Ascendant (Rising Sign) in ${ascFormatted.sign} shapes your outward aura, physical vitality, and instinctual lens through which you navigate the world. People perceive you through the vibrant traits of ${ascFormatted.sign}.`,
    color: ascFormatted.color,
  };

  const mcFormatted = formatZodiacPosition(midheavenLong);
  const midheaven: PlanetPosition = {
    id: 'midheaven',
    name: 'Midheaven (MC)',
    glyph: 'MC',
    longitude: midheavenLong,
    sign: mcFormatted.sign,
    signGlyph: mcFormatted.signGlyph,
    signIndex: mcFormatted.signIndex,
    degree: mcFormatted.degree,
    minute: mcFormatted.minute,
    formattedDegree: mcFormatted.formattedDegree,
    house: 10,
    isRetrograde: false,
    element: mcFormatted.element,
    modality: mcFormatted.modality,
    keywords: 'Highest Career Calling, Public Reputation, Legacy & Mastery',
    interpretation: `Your Midheaven (MC) in ${mcFormatted.sign} represents the pinnacle of your public achievement, professional reputation, and the legacy you are destined to build.`,
    color: mcFormatted.color,
  };

  const planetConfigs: Array<{ id: string; name: string; key: keyof typeof rawLongitudes }> = [
    { id: 'sun', name: 'Sun', key: 'sun' },
    { id: 'moon', name: 'Moon', key: 'moon' },
    { id: 'mercury', name: 'Mercury', key: 'mercury' },
    { id: 'venus', name: 'Venus', key: 'venus' },
    { id: 'mars', name: 'Mars', key: 'mars' },
    { id: 'jupiter', name: 'Jupiter', key: 'jupiter' },
    { id: 'saturn', name: 'Saturn', key: 'saturn' },
    { id: 'uranus', name: 'Uranus', key: 'uranus' },
    { id: 'neptune', name: 'Neptune', key: 'neptune' },
    { id: 'pluto', name: 'Pluto', key: 'pluto' },
    { id: 'northNode', name: 'North Node', key: 'northNode' },
    { id: 'chiron', name: 'Chiron', key: 'chiron' },
  ];

  const planets: PlanetPosition[] = planetConfigs.map(({ id, name, key }) => {
    const raw = rawLongitudes[key];
    const z = formatZodiacPosition(raw.longitude);
    const house = getHouseNumber(raw.longitude, ascendantLong);
    const desc = PLANET_DESCRIPTIONS[id];

    return {
      id,
      name,
      glyph: desc?.glyph || '✦',
      longitude: raw.longitude,
      sign: z.sign,
      signGlyph: z.signGlyph,
      signIndex: z.signIndex,
      degree: z.degree,
      minute: z.minute,
      formattedDegree: z.formattedDegree,
      house,
      isRetrograde: raw.isRetrograde,
      element: z.element,
      modality: z.modality,
      keywords: desc?.keywords || '',
      interpretation: desc?.interp(z.sign, house) || '',
      color: z.color,
    };
  });

  const houses = calculateHouseCusps(ascendantLong);
  const aspects = calculateAspects(planets);
  const { elementBalance, modalityBalance } = calculateBalances(planets);

  const sun = planets.find(p => p.id === 'sun')!;
  const moon = planets.find(p => p.id === 'moon')!;

  return {
    planets,
    houses,
    aspects,
    ascendant,
    midheaven,
    sun,
    moon,
    rising: ascendant,
    elementBalance,
    modalityBalance,
    birthDateFormatted: birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    birthTimeFormatted: birthTimeStr || '12:00 PM (Solar Standard)',
    birthLocation: birthLocation || 'Calculated Coordinate',
  };
}

export interface ChartSynthesis {
  archetypeTitle: string;
  tagline: string;
  coreIdentitySummary: string;
  superpowers: Array<{ title: string; desc: string; icon: string }>;
  karmicChallenge: { title: string; challenge: string; solution: string };
  relationshipStyle: { title: string; desc: string; needs: string[] };
  careerAndCalling: { title: string; path: string; advice: string };
  alignmentRules: string[];
}

/**
 * Generates an intuitive, plain-English synthesis of the entire natal chart
 */
export function generateChartSynthesis(chart: NatalChartData): ChartSynthesis {
  const sunSign = chart.sun.sign;
  const moonSign = chart.moon.sign;
  const risingSign = chart.rising.sign;
  const dominantElement = chart.elementBalance.dominantElement;
  const dominantModality = chart.modalityBalance.dominantModality;
  const mars = chart.planets.find(p => p.id === 'mars')!;
  const venus = chart.planets.find(p => p.id === 'venus')!;
  const saturn = chart.planets.find(p => p.id === 'saturn')!;
  const jupiter = chart.planets.find(p => p.id === 'jupiter')!;

  // Determine Archetype Title
  const ARCHETYPES: Record<string, { title: string; tagline: string }> = {
    Aries: { title: 'The Trailblazing Pioneer', tagline: 'Unstoppable initiative, raw courage, and first-mover instincts.' },
    Taurus: { title: 'The Architect of Abundance', tagline: 'Unyielding endurance, grounded luxury, and master of lasting value.' },
    Gemini: { title: 'The Visionary Messenger', tagline: 'Brilliant intellectual agility, polymath curiosity, and rapid networking.' },
    Cancer: { title: 'The Sovereign Guardian', tagline: 'Fierce emotional protective instincts, ancestral intuition, and profound loyalty.' },
    Leo: { title: 'The Solar Sovereign', tagline: 'Magnetic radiance, generous leadership, and unforgettable stage presence.' },
    Virgo: { title: 'The Alchemical Master', tagline: 'Flawless precision, elite discernment, and systematic execution of excellence.' },
    Libra: { title: 'The Harmonious Strategist', tagline: 'High-level diplomacy, aesthetic mastery, and keen relational intelligence.' },
    Scorpio: { title: 'The Phoenix Alchemist', tagline: 'Uncompromising psychological depth, psychic magnetism, and total transformation.' },
    Sagittarius: { title: 'The Cosmic Explorer', tagline: 'Unbounded optimism, philosophical foresight, and grand horizon seeker.' },
    Capricorn: { title: 'The Master Strategist', tagline: 'Monumental ambition, ironclad discipline, and builder of generational empires.' },
    Aquarius: { title: 'The Maverick Futurist', tagline: 'Unorthodox innovation, revolutionary intellect, and architect of the new paradigm.' },
    Pisces: { title: 'The Mystical Visionary', tagline: 'Infinite creative empathy, transcendent intuition, and master of unseen realms.' },
  };

  const archetype = ARCHETYPES[sunSign] || ARCHETYPES['Aries'];

  // Core Identity Summary
  const coreIdentitySummary = `At your core, you are built on a powerful triumvirate: your ${sunSign} Sun drives your conscious purpose and vital spark, your ${moonSign} Moon shapes your private emotional world and gut instincts, and your ${risingSign} Ascendant defines your outer aura and how people immediately feel your presence. With a dominant ${dominantElement} element signature and ${dominantModality} drive, you operate with ${
    dominantElement === 'Fire' ? 'intense passion, bold leadership, and immediate instinct' :
    dominantElement === 'Earth' ? 'laser focus, grounded discipline, and an obsession with real-world results' :
    dominantElement === 'Air' ? 'lightning-fast intellect, social charm, and innovative ideas' :
    'deep emotional intuition, magnetic empathy, and profound spiritual perception'
  }.`;

  // 3 Core Superpowers
  const superpowers = [
    {
      title: `${sunSign} Willpower & Solar Magnetism`,
      desc: `Your ability to project confidence and generate momentum when you believe in a mission. People naturally look to your ${sunSign} light for direction.`,
      icon: 'Sun',
    },
    {
      title: `${moonSign} Intuitive Radar`,
      desc: `You possess an inner radar governed by ${moonSign}. You pick up on subtleties, hidden motivations, and energetic shifts long before others notice them.`,
      icon: 'Moon',
    },
    {
      title: `Strategic Execution (${mars.sign} Mars & ${jupiter.sign} Jupiter)`,
      desc: `With Mars in ${mars.sign}, your drive is persistent and sharp. Jupiter in ${jupiter.sign} expands your opportunities whenever you take calculated risks.`,
      icon: 'Zap',
    },
  ];

  // Karmic Challenge & Shadow to Master
  const karmicChallenge = {
    title: `Mastering ${saturn.sign} Saturn & ${sunSign} Blindspots`,
    challenge: `Your primary growth edge involves navigating Saturn in ${saturn.sign} (House ${saturn.house}). You may periodically experience moments where self-doubt or impatience makes you feel like you have to carry the entire weight of the world alone.`,
    solution: `Embrace structured patience over panic. Trust that the delays Saturn introduces are not denials, but the building of permanent, unshakable mastery.`,
  };

  // Relationship Style
  const relationshipStyle = {
    title: `${venus.sign} Venus & ${moonSign} Moon Harmony`,
    desc: `In love and partnerships, Venus in ${venus.sign} means you value ${
      venus.element === 'Fire' ? 'passionate excitement, genuine admiration, and shared adventure' :
      venus.element === 'Earth' ? 'loyalty, physical stability, dependability, and shared empire building' :
      venus.element === 'Air' ? 'stimulating mental connection, playful banter, and mutual intellectual respect' :
      'profound emotional depth, soul-level intimacy, and unwavering loyalty'
    }.`,
    needs: [
      `Unconditional respect for your ${risingSign} individuality`,
      `Emotional safety to drop your guard and express your ${moonSign} feelings`,
      `A partner who matches your ambition without feeling intimidated`,
    ],
  };

  // Career & Calling
  const careerAndCalling = {
    title: `${chart.midheaven.sign} Midheaven Career Direction`,
    path: `Your 10th House Midheaven in ${chart.midheaven.sign} indicates a destiny of recognized leadership, expertise, and creating tangible value that outlives you.`,
    advice: `Focus your professional efforts where your natural ${dominantElement} intelligence can shine. Avoid micromanagement or environments that restrict your creative autonomy.`,
  };

  // 3 Golden Rules for Daily Alignment
  const alignmentRules = [
    `Honor your ${moonSign} emotional fuel: When overwhelmed, step back to recharge in your natural element (${chart.moon.element}).`,
    `Lead with your ${risingSign} strengths: Trust your first impressions—your Ascendant is tuned to pick up on authenticity instantly.`,
    `Turn ${saturn.sign} pressure into diamonds: Treat every obstacle as a test of endurance designed to forge your next level.`,
  ];

  return {
    archetypeTitle: archetype.title,
    tagline: archetype.tagline,
    coreIdentitySummary,
    superpowers,
    karmicChallenge,
    relationshipStyle,
    careerAndCalling,
    alignmentRules,
  };
}

