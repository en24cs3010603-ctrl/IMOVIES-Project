/**
 * file: src/utils/dateUtils.ts
 * Date and Showtime Validation Helpers
 */

/**
 * Checks whether a given show date (YYYY-MM-DD) and time (e.g. "07:30 PM", "19:30")
 * is in the past compared to the current client timestamp.
 */
export const isPastShowtime = (dateStr: string, timeStr: string): boolean => {
  if (!dateStr) return false;
  try {
    let hours = 0;
    let minutes = 0;

    if (timeStr) {
      const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
        const meridiem = match[3] ? match[3].toUpperCase() : null;
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
      }
    }

    const showDate = new Date(
      `${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
    );

    if (isNaN(showDate.getTime())) {
      // Fallback: compare date-only (00:00:00 today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const parsedDate = new Date(dateStr);
      return parsedDate < today;
    }

    return showDate.getTime() < Date.now();
  } catch {
    return false;
  }
};
