/**
 * Shared event-date helpers.
 *
 * `eventDate` values are stored either as `YYYY-MM-DD` (date input) or as a
 * full ISO timestamp. Date-only values are parsed as local midnight so an
 * event happening today is still considered upcoming.
 */

export function parseEventDate(value?: string | null): Date | null {
    if (!value) return null;

    const normalized =
        value.length === 10 ? `${value}T00:00:00` : value;

    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

/**
 * True when the event date has not passed yet. Events with no date, or with
 * an invalid date, are not considered upcoming.
 */
export function isUpcomingEvent(
    value?: string | null,
    now: Date = new Date()
): boolean {
    const eventDate = parseEventDate(value);

    if (!eventDate) return false;

    return (
        startOfDay(eventDate).getTime() >=
        startOfDay(now).getTime()
    );
}

/**
 * True when the event date is before today.
 */
export function isPastEvent(
    value?: string | null,
    now: Date = new Date()
): boolean {
    const eventDate = parseEventDate(value);

    if (!eventDate) return false;

    return (
        startOfDay(eventDate).getTime() <
        startOfDay(now).getTime()
    );
}
