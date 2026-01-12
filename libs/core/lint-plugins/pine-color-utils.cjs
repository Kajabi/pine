/**
 * Pine Color Utilities
 *
 * Provides color distance calculations and hex-to-token conversion
 * for the Pine Design System linting rules.
 */

// =============================================================================
// Regex patterns for color function detection
// =============================================================================

/**
 * Regex to match rgb() and rgba() color functions
 * Captures: rgb(r, g, b) or rgba(r, g, b, a)
 * Supports both comma and space syntax, with optional alpha
 */
const RGB_RGBA_REGEX = /rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})(?:\s*[,\/]\s*([\d.]+%?))?\s*\)/gi;

/**
 * Regex to match hsl() and hsla() color functions
 * Captures: hsl(h, s%, l%) or hsla(h, s%, l%, a)
 * Supports both comma and space syntax, with optional alpha
 */
const HSL_HSLA_REGEX = /hsla?\(\s*(\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?(?:\s*[,\/]\s*([\d.]+%?))?\s*\)/gi;

// =============================================================================
// Color conversion functions
// =============================================================================

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string (e.g., "#ffffff", "fff", "#ffffff00", "#fff0")
 * @returns {{r: number, g: number, b: number} | null}
 */
function hexToRgb(hex) {
  // Remove # if present and normalize to lowercase
  const cleanHex = hex.replace(/^#/, '').toLowerCase();

  let fullHex;
  if (cleanHex.length === 3) {
    // Expand 3-digit: "fff" -> "ffffff"
    fullHex = cleanHex.split('').map(c => c + c).join('');
  } else if (cleanHex.length === 4) {
    // Expand 4-digit RGBA: "fff0" -> "ffffff00", then take first 6 chars
    fullHex = cleanHex.split('').map(c => c + c).join('').substring(0, 6);
  } else if (cleanHex.length === 6) {
    fullHex = cleanHex;
  } else if (cleanHex.length === 8) {
    // 8-digit RRGGBBAA: strip alpha, take first 6 chars
    fullHex = cleanHex.substring(0, 6);
  } else {
    return null;
  }

  // Validate that we have exactly 6 hex characters
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
 * Convert RGB values to hex string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Hex color string (e.g., "#ffffff")
 */
function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert HSL values to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {{r: number, g: number, b: number}}
 */
function hslToRgb(h, s, l) {
  // Normalize values
  h = h % 360;
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Parse an rgb() or rgba() color string and return hex equivalent
 * @param {string} colorStr - Color string like "rgb(255, 0, 0)" or "rgba(0, 0, 0, 0.5)"
 * @returns {{hex: string, alpha: number | null, original: string} | null}
 */
function parseRgbColor(colorStr) {
  const match = colorStr.match(/rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})(?:\s*[,\/]\s*([\d.]+%?))?\s*\)/i);
  if (!match) return null;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  let alpha = null;
  if (match[4] !== undefined) {
    if (match[4].endsWith('%')) {
      alpha = parseFloat(match[4]) / 100;
    } else {
      alpha = parseFloat(match[4]);
    }
  }

  return {
    hex: rgbToHex(r, g, b),
    alpha,
    original: colorStr
  };
}

/**
 * Parse an hsl() or hsla() color string and return hex equivalent
 * @param {string} colorStr - Color string like "hsl(0, 100%, 50%)" or "hsla(0, 100%, 50%, 0.5)"
 * @returns {{hex: string, alpha: number | null, original: string} | null}
 */
function parseHslColor(colorStr) {
  const match = colorStr.match(/hsla?\(\s*(\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?(?:\s*[,\/]\s*([\d.]+%?))?\s*\)/i);
  if (!match) return null;

  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]);
  const l = parseFloat(match[3]);

  let alpha = null;
  if (match[4] !== undefined) {
    if (match[4].endsWith('%')) {
      alpha = parseFloat(match[4]) / 100;
    } else {
      alpha = parseFloat(match[4]);
    }
  }

  const rgb = hslToRgb(h, s, l);
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    alpha,
    original: colorStr
  };
}

/**
 * Extract all color function calls from a CSS value string
 * @param {string} value - CSS value string
 * @returns {Array<{type: string, hex: string, alpha: number | null, original: string, index: number}>}
 */
function extractColorFunctions(value) {
  const results = [];

  // Find all rgb/rgba matches
  let match;
  const rgbRegex = /rgba?\(\s*\d{1,3}\s*[,\s]\s*\d{1,3}\s*[,\s]\s*\d{1,3}(?:\s*[,\/]\s*[\d.]+%?)?\s*\)/gi;
  while ((match = rgbRegex.exec(value)) !== null) {
    const parsed = parseRgbColor(match[0]);
    if (parsed) {
      results.push({
        type: match[0].toLowerCase().startsWith('rgba') ? 'rgba' : 'rgb',
        hex: parsed.hex,
        alpha: parsed.alpha,
        original: match[0],
        index: match.index
      });
    }
  }

  // Find all hsl/hsla matches
  const hslRegex = /hsla?\(\s*\d{1,3}(?:\.\d+)?\s*[,\s]\s*\d{1,3}(?:\.\d+)?%?\s*[,\s]\s*\d{1,3}(?:\.\d+)?%?(?:\s*[,\/]\s*[\d.]+%?)?\s*\)/gi;
  while ((match = hslRegex.exec(value)) !== null) {
    const parsed = parseHslColor(match[0]);
    if (parsed) {
      results.push({
        type: match[0].toLowerCase().startsWith('hsla') ? 'hsla' : 'hsl',
        hex: parsed.hex,
        alpha: parsed.alpha,
        original: match[0],
        index: match.index
      });
    }
  }

  // Sort by index to maintain order
  results.sort((a, b) => a.index - b.index);
  return results;
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
 * Handles 3, 4, 6, and 8 character hex inputs
 * @param {string} hex - Hex color string
 * @returns {string} - Normalized hex string
 */
function normalizeHex(hex) {
  const cleanHex = hex.replace(/^#/, '').toLowerCase();

  let fullHex;
  if (cleanHex.length === 3) {
    // Expand 3-digit: "abc" -> "aabbcc"
    fullHex = cleanHex.split('').map(c => c + c).join('');
  } else if (cleanHex.length === 4) {
    // Expand 4-digit with alpha: "abcd" -> "aabbccdd"
    fullHex = cleanHex.split('').map(c => c + c).join('');
  } else {
    // 6 or 8 digit: keep as-is
    fullHex = cleanHex;
  }

  return `#${fullHex}`;
}

module.exports = {
  hexToRgb,
  rgbToHex,
  hslToRgb,
  parseRgbColor,
  parseHslColor,
  extractColorFunctions,
  colorDistance,
  findClosestCoreToken,
  normalizeHex,
  RGB_RGBA_REGEX,
  HSL_HSLA_REGEX,
  CLOSE_MATCH_THRESHOLD,
  WARNING_THRESHOLD
};

