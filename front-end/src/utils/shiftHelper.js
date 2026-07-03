/**
 * Helper to check if a user is currently within their assigned shift.
 * If no shift start/end times are configured, defaults to true (always in shift).
 * Handles overnight shifts (e.g., 22:00 to 06:00) correctly.
 * 
 * @param {Object} user - The user object from auth context
 * @returns {Boolean} - True if in shift, False otherwise
 */
export const isUserInShift = (user) => {
  if (!user || !user.shiftStart || !user.shiftEnd) {
    return true; // No shift assigned = unrestricted/always active
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = user.shiftStart.split(":").map(Number);
  const [endH, endM] = user.shiftEnd.split(":").map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    // Normal daytime shift (e.g. 08:00 - 16:00)
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Overnight shift (e.g. 22:00 - 06:00)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
};
