import { format, parseISO, isValid } from 'date-fns';

/**
 * Parses a date string (YYYY-MM-DD or ISO) into a UTC Date object at 00:00 UTC.
 */
export function parseUTCDate(dateStr: string | Date | undefined): Date {
    if (!dateStr) return new Date();

    if (dateStr instanceof Date) {
        // If it's already a date, ensure we treat its components as UTC
        return new Date(Date.UTC(
            dateStr.getUTCFullYear(),
            dateStr.getUTCMonth(),
            dateStr.getUTCDate()
        ));
    }

    // Handle YYYY-MM-DD strings
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }

    // Fallback for ISO strings or other formats
    const parsed = parseISO(dateStr);
    if (isValid(parsed)) {
        return new Date(Date.UTC(
            parsed.getUTCFullYear(),
            parsed.getUTCMonth(),
            parsed.getUTCDate()
        ));
    }

    return new Date();
}

/**
 * Formats a Date object into a YYYY-MM-DD string based on its UTC components.
 */
export function formatUTCDate(date: Date): string {
    if (!isValid(date)) return '';
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Returns a human-readable date string (e.g., "Jul 1, 1990") based on UTC components.
 */
export function displayUTCDate(date: Date | string | undefined, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }): string {
    if (!date) return '';
    const d = typeof date === 'string' ? parseUTCDate(date) : date;
    if (!isValid(d)) return '';

    // Use Intl.DateTimeFormat with timeZone: 'UTC' to force UTC display
    return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(d);
}

/**
 * Gets the current date in UTC at 00:00.
 */
export function getUTCToday(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
