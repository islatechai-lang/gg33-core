// Western Zodiac Symbols (Unicode)
export const westernZodiacSymbols: Record<string, string> = {
  'Aries': '♈',
  'Taurus': '♉',
  'Gemini': '♊',
  'Cancer': '♋',
  'Leo': '♌',
  'Virgo': '♍',
  'Libra': '♎',
  'Scorpio': '♏',
  'Sagittarius': '♐',
  'Capricorn': '♑',
  'Aquarius': '♒',
  'Pisces': '♓',
};

// Chinese Zodiac Animal Representations
export const chineseZodiacSymbols: Record<string, string> = {
  'Rat': '🐀',
  'Ox': '🐂',
  'Tiger': '🐅',
  'Rabbit': '🐇',
  'Dragon': '🐉',
  'Snake': '🐍',
  'Horse': '🐎',
  'Goat': '🐐',
  'Monkey': '🐒',
  'Rooster': '🐓',
  'Dog': '🐕',
  'Pig': '🐖',
};

export function getWesternZodiacSymbol(sign: string): string {
  return westernZodiacSymbols[sign] || '★';
}

export function getChineseZodiacSymbol(animal: string): string {
  return chineseZodiacSymbols[animal] || '★';
}
