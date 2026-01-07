/**
 * Pine Color Utilities
 *
 * Provides color distance calculations and hex-to-token conversion
 * for the Pine Design System linting rules.
 */

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string (e.g., "#ffffff" or "ffffff")
 * @returns {{r: number, g: number, b: number} | null}
 */
function hexToRgb(hex) {
  // Remove # if present and normalize to lowercase
  const cleanHex = hex.replace(/^#/, '').toLowerCase();

  // Handle shorthand hex (e.g., "fff" -> "ffffff")
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;

  if (!/^[0-9a-f]{6}$/.test(fullHex)) {
    return null;
  }

  return {
    r: parseInt(fullHex.substring(0, 2), 16),
    g: parseInt(fullHex.substring(2, 4), 16),
    b: parseInt(fullHex.substring(4, 6), 16)
  };
}

/**
 * Calculate Euclidean distance between two colors in RGB space
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {number} - Distance (0 = identical, max ~441 for black to white)
 */
function colorDistance(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) {
    return Infinity;
  }

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

/**
 * Threshold for "close enough" color matches
 * A distance of 15 allows for very minor variations (e.g., #374047 vs #373f47)
 * Max RGB distance is ~441 (black to white)
 */
const CLOSE_MATCH_THRESHOLD = 15;

/**
 * Threshold for "acceptable" matches with a warning
 * Colors beyond this are likely intentionally different
 */
const WARNING_THRESHOLD = 30;

// Cache for flattened token lookup (avoids re-computing on every call)
let flattenedTokensCache = null;
let lastHexToCore = null;

/**
 * Get or create flattened token lookup from hexToCore mapping
 */
function getFlattenedTokens(hexToCore) {
  // Return cached version if hexToCore hasn't changed
  if (flattenedTokensCache && lastHexToCore === hexToCore) {
    return flattenedTokensCache;
  }

  // Flatten all color families into a single lookup
  const allTokens = {};
  for (const [family, tokens] of Object.entries(hexToCore)) {
    for (const [tokenHex, tokenName] of Object.entries(tokens)) {
      allTokens[tokenHex] = tokenName;
    }
  }

  // Cache for future calls
  flattenedTokensCache = allTokens;
  lastHexToCore = hexToCore;

  return allTokens;
}

/**
 * Find the closest core token for a given hex color
 * @param {string} hex - The hex color to match
 * @param {Object} hexToCore - Mapping of hex values to core token names
 * @returns {{token: string, hex: string, distance: number, isExact: boolean, isClose: boolean} | null}
 */
function findClosestCoreToken(hex, hexToCore) {
  if (!hex || !hexToCore) {
    return null;
  }

  const normalizedHex = hex.toLowerCase().replace(/^#/, '');
  const searchHex = `#${normalizedHex}`;

  // Use cached flattened tokens
  const allTokens = getFlattenedTokens(hexToCore);

  // Fast path: check for exact match first
  if (allTokens[searchHex]) {
    return {
      token: allTokens[searchHex],
      hex: searchHex,
      distance: 0,
      isExact: true,
      isClose: true,
      needsWarning: false,
      isFar: false
    };
  }

  let closest = null;
  let minDistance = Infinity;

  for (const [coreHex, tokenName] of Object.entries(allTokens)) {
    const distance = colorDistance(searchHex, coreHex);

    if (distance < minDistance) {
      minDistance = distance;
      closest = {
        token: tokenName,
        hex: coreHex,
        distance: distance
      };
    }
  }

  if (!closest) {
    return null;
  }

  return {
    ...closest,
    isExact: minDistance === 0,
    isClose: minDistance <= CLOSE_MATCH_THRESHOLD,
    needsWarning: minDistance > CLOSE_MATCH_THRESHOLD && minDistance <= WARNING_THRESHOLD,
    isFar: minDistance > WARNING_THRESHOLD
  };
}

/**
 * Normalize hex color to lowercase with # prefix
 * @param {string} hex - Hex color string
 * @returns {string} - Normalized hex string
 */
function normalizeHex(hex) {
  const cleanHex = hex.replace(/^#/, '').toLowerCase();
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;
  return `#${fullHex}`;
}

module.exports = {
  hexToRgb,
  colorDistance,
  findClosestCoreToken,
  normalizeHex,
  CLOSE_MATCH_THRESHOLD,
  WARNING_THRESHOLD
};

