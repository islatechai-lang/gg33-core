// Helper utilities for explore endpoints
export function reduceToSingleDigit(num: number, preserveMasterNumbers = true): number {
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

export function getLifePath(dateStr: string | Date): number {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 1;
    const month = reduceToSingleDigit(d.getUTCMonth() + 1, true);
    const day = reduceToSingleDigit(d.getUTCDate(), true);
    const yearSum = d.getUTCFullYear().toString().split('').reduce((sum, char) => sum + parseInt(char), 0);
    const year = reduceToSingleDigit(yearSum, true);
    return reduceToSingleDigit(month + day + year, true);
}

export function getVedicNakshatra(birthDate: Date): { nakshatra: string; deity: string; traits: string[]; karmicPath: string } {
    // Simplified mock using Day of Year to cycle through the 27 Nakshatras
    // Real Vedic astrology requires exact time, lat/long, and an ephemeris for the Moon's longitude.
    const start = new Date(birthDate.getUTCFullYear(), 0, 0);
    const diff = birthDate.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const nakshatras = [
        { n: 'Ashwini', d: 'Ashwini Kumaras', t: ['Pioneer Spirit', 'Rapid Healer', 'Restless'], k: 'To initiate new cycles with sustained discipline.' },
        { n: 'Bharani', d: 'Yama', t: ['Transformation', 'Extremes', 'Creative'], k: 'To learn the balance between life, death, and transformation.' },
        { n: 'Krittika', d: 'Agni', t: ['Sharp', 'Purifying', 'Protective'], k: 'To use the fire of truth to cut through illusion.' },
        { n: 'Rohini', d: 'Brahma', t: ['Charming', 'Materially successful', 'Creative'], k: 'To overcome jealousy and focus on devotion.' },
        { n: 'Mrigashira', d: 'Soma', t: ['Curious', 'Searching', 'Gentle'], k: 'To seek the truth without getting lost in endless wandering.' },
        { n: 'Ardra', d: 'Rudra', t: ['Intense', 'Analytical', 'Transformative'], k: 'To find peace after facing the storms of life.' },
        { n: 'Punarvasu', d: 'Aditi', t: ['Nurturing', 'Philosophical', 'Optimistic'], k: 'To provide safe harbor while maintaining freedom.' },
        { n: 'Pushya', d: 'Brihaspati', t: ['Caring', 'Spiritual', 'Helpful'], k: 'To nourish others without expecting return.' },
        { n: 'Ashlesha', d: 'Nagas', t: ['Mystical', 'Intense', 'Protective'], k: 'To master the ego and embrace spiritual wisdom.' }
        // We loop these 9 for a mock if we don't list all 27.
    ];

    const index = dayOfYear % nakshatras.length;
    const selected = nakshatras[index];

    return {
        nakshatra: selected.n,
        deity: selected.d,
        traits: selected.t,
        karmicPath: 'Your soul incarnated to ' + selected.k.toLowerCase()
    };
}

export const pythagorean: Record<string, number> = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
};
