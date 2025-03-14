 import fs from 'fs-extra';

 import { basePath } from '../utils.mjs';

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
  (themeable = false, currentBrand = '') =>
  (token) => {
    const tokenThemable = Boolean(token.attributes.themeable);

    // For non-themeable tokens, include from base/semantic
    if (!themeable) {
      return !tokenThemable && token.filePath.includes(`base/semantic`);
    }

    // For themeable tokens, include from brand-specific files
    // But only include tokens from the current brand's file
    return tokenThemable &&
           token.filePath.includes(`brand/${currentBrand}`);
  };
