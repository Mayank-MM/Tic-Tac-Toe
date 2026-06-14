// ============================================
// Utility: Room Code Generator
// Generates unique 6-character alphanumeric codes
// ============================================

/**
 * Generates a random 6-character room code using
 * uppercase letters and numbers. Checks against
 * existing rooms to prevent duplicates.
 *
 * @param {Map} existingRooms - The rooms Map to check for collisions
 * @returns {string} A unique 6-character room code (e.g., "ABX72K")
 */
const generateRoomCode = (existingRooms) => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluded I, O, 0, 1 to avoid confusion
  const codeLength = 6;

  let code;
  do {
    code = "";
    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (existingRooms.has(code)); // Regenerate if duplicate

  return code;
};

export default generateRoomCode;
