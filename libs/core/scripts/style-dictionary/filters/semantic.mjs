 import fs from 'fs-extra';

 import { basePath } from '../utils.mjs';

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
  (themeable = false, currentBrand = '') =>
  (token) => {
    const tokenThemable = token.attributes?.themeable;

    // For non-themeable tokens, include from base/semantic
    if (!themeable) {
      // If token has no themeable attribute and is in base/semantic, treat as non-themeable
      if (tokenThemable === undefined) {
        return token.filePath.includes(`${basePath}/base/semantic`);
      }
      return !tokenThemable && token.filePath.includes(`${basePath}/base/semantic`);
    }

    // For themeable tokens, include from brand-specific files
    // Check both the brand directory and any subdirectories
    return tokenThemable && (
      token.filePath.includes(`${basePath}/${currentBrand}.json`) ||
      token.filePath.includes(`${basePath}/${currentBrand}/`)
    );
  };
