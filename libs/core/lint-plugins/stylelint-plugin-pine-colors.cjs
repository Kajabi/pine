/**
 * Stylelint plugin to enforce Pine design system color tokens
 * Blocks hard-coded hex colors and suggests Pine tokens
 *
 * For Pine repo: Lints ALL files (no git diff enforcement)
 * Token mappings loaded from @kajabi-ui/styles package
 */

const stylelint = require('stylelint');
const { findClosestCoreToken, WARNING_THRESHOLD } = require('./pine-color-utils.cjs');

// Load token mappings from @kajabi-ui/styles
let tokenMappings;
const path = require('path');

// Try multiple locations for the token mappings
const possiblePaths = [
  // Published package export
  () => require('@kajabi-ui/styles/lint-mappings'),
  // node_modules dist folder
  () => require(path.resolve(__dirname, '../../../../node_modules/@kajabi-ui/styles/dist/tokens/pine-token-mappings.json')),
  // Local ds-tokens development (sibling repo)
  () => require(path.resolve(__dirname, '../../../../ds-tokens/packages/styles/dist/tokens/pine-token-mappings.json')),
];

for (const tryLoad of possiblePaths) {
  try {
    tokenMappings = tryLoad();
    break;
  } catch (e) {
    // Continue to next path
  }
}

if (!tokenMappings) {
  console.error('Failed to load pine-token-mappings.json from @kajabi-ui/styles');
  tokenMappings = { mappings: {}, ambiguous: {}, hexToCore: {}, docsUrl: '' };
}

const ruleName = 'pine-design-system/no-hardcoded-colors';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejectedHex: (message) => message,
});

// =============================================================================
// Helper functions
// =============================================================================

/**
 * Determine the context (text, background, border) from a CSS property name
 */
function getPropertyContext(propName) {
  if (!propName || typeof propName !== 'string') return null;

  const propLower = propName.toLowerCase();

  // Background context
  if (propLower === 'background-color' || propLower === 'background') {
    return 'background';
  }

  // Border context (includes box-shadow as it typically uses border-like colors)
  if (
    propLower === 'border-color' ||
    propLower === 'border' ||
    propLower === 'outline-color' ||
    propLower === 'outline' ||
    propLower === 'box-shadow' ||
    (propLower.includes('border-') && propLower.includes('-color'))
  ) {
    return 'border';
  }

  // Text context
  if (propLower === 'color' || propLower === 'fill') {
    return 'text';
  }

  return null;
}

/**
 * Get all available semantic tokens for a given context
 */
function getContextTokens(context) {
  if (!context || !tokenMappings.mappings[context]) return [];
  return Object.values(tokenMappings.mappings[context]);
}

/**
 * Get the primary suggestion based on context, and all possible suggestions
 */
function getSuggestions(coreToken, context) {
  let primarySuggestion = null;
  if (context && tokenMappings.mappings[context]) {
    primarySuggestion = tokenMappings.mappings[context][coreToken];
  }

  let allSuggestions = [];

  if (context) {
    if (primarySuggestion) {
      allSuggestions = [primarySuggestion];
    } else {
      allSuggestions = getContextTokens(context);
    }
  } else {
    allSuggestions = tokenMappings.ambiguous[coreToken]
      ? [...tokenMappings.ambiguous[coreToken]]
      : [];

    if (!primarySuggestion && allSuggestions.length === 0) {
      for (const ctx of ['text', 'background', 'border']) {
        if (tokenMappings.mappings[ctx] && tokenMappings.mappings[ctx][coreToken]) {
          primarySuggestion = tokenMappings.mappings[ctx][coreToken];
          allSuggestions = [primarySuggestion];
          break;
        }
      }
    }
  }

  return { primarySuggestion, allSuggestions };
}

/**
 * Build an error message for a hardcoded hex color with closest token suggestion
 */
function buildHexErrorMessage(hex, match, context) {
  const lines = [];

  if (!match) {
    lines.push(`Hard-coded hex color "${hex}" is not allowed.`);
    lines.push('Use Pine design system tokens like var(--pine-color-*) instead.');
    lines.push('');
    lines.push(`Docs: ${tokenMappings.docsUrl}`);
    return lines.join('\n');
  }

  const coreToken = match.token;
  const coreTokenVar = `var(--pine-color-${coreToken})`;
  const { primarySuggestion, allSuggestions } = getSuggestions(coreToken, context);

  if (match.isExact) {
    lines.push(`Hard-coded hex color "${hex}" should use Pine token.`);
  } else if (match.isClose) {
    lines.push(`Hard-coded hex color "${hex}" is close to Pine token "${coreToken}".`);
  } else if (match.needsWarning) {
    lines.push(`Hard-coded hex color "${hex}" - closest Pine token is "${coreToken}".`);
    lines.push(`⚠️  Note: Color differs slightly from Pine token (distance: ${match.distance.toFixed(0)})`);
  } else {
    lines.push(`Hard-coded hex color "${hex}" - closest Pine token is "${coreToken}".`);
    lines.push(`⚠️  Warning: Color differs significantly from Pine token (distance: ${match.distance.toFixed(0)})`);
    lines.push('   Consider if this should be a custom color or if a closer Pine token exists.');
  }

  lines.push('');

  if (primarySuggestion) {
    lines.push(`Suggested: var(--pine-color-${primarySuggestion})`);
    if (!match.isExact && match.token) {
      lines.push(`  (via core token: ${coreTokenVar})`);
    }
  } else if (allSuggestions.length > 0 && context) {
    lines.push(`Available ${context} tokens:`);
    allSuggestions.forEach((suggestion) => {
      lines.push(`  → var(--pine-color-${suggestion})`);
    });
  } else {
    lines.push(`Suggested: ${coreTokenVar}`);
    if (coreToken.startsWith('grey-') || coreToken === 'white' || coreToken === 'black') {
      lines.push('  (No semantic mapping available - consider if a semantic token fits your use case)');
    }
  }

  lines.push('');
  lines.push(`Docs: ${tokenMappings.docsUrl}`);

  return lines.join('\n');
}

/**
 * Get the suggested replacement value for a hex color
 */
function getHexSuggestion(hex, context) {
  const match = findClosestCoreToken(hex, tokenMappings.hexToCore);

  if (!match) {
    return null;
  }

  if (match.isFar) {
    return { match, suggestion: null, autoFix: false };
  }

  const coreToken = match.token;
  const { primarySuggestion } = getSuggestions(coreToken, context);

  if (primarySuggestion) {
    return {
      match,
      suggestion: `var(--pine-color-${primarySuggestion})`,
      autoFix: match.isExact || match.isClose,
    };
  }

  return {
    match,
    suggestion: `var(--pine-color-${coreToken})`,
    autoFix: match.isExact || match.isClose,
  };
}

// =============================================================================
// Main Plugin
// =============================================================================

module.exports = stylelint.createPlugin(ruleName, (primaryOption, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [true, false],
    });

    if (!validOptions) {
      return;
    }

    if (primaryOption === false) {
      return;
    }

    root.walkDecls((decl) => {
      const value = decl.value;
      const prop = decl.prop;
      const propertyContext = getPropertyContext(prop);

      // Skip if value contains Pine CSS variable (already using the system)
      if (value.includes('var(--pine-color-')) {
        return;
      }

      // Check for hex colors (# followed by 3, 4, 6, or 8 hex digits)
      const hexColorRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
      const hexMatches = [];
      let hexMatch;

      while ((hexMatch = hexColorRegex.exec(value)) !== null) {
        hexMatches.push({
          hex: hexMatch[0],
          index: hexMatch.index
        });
      }

      // Collect replacements to apply in one pass
      const replacements = [];

      for (const { hex, index } of hexMatches) {
        const beforeHex = value.substring(0, index);

        // Check if hex is inside a comment (basic check)
        const commentCount = (beforeHex.match(/\/\*/g) || []).length;
        const commentEndCount = (beforeHex.match(/\*\//g) || []).length;

        if (commentCount <= commentEndCount) {
          const match = findClosestCoreToken(hex, tokenMappings.hexToCore);
          const message = buildHexErrorMessage(hex, match, propertyContext);
          const suggestionData = getHexSuggestion(hex, propertyContext);

          const shouldFix = suggestionData && suggestionData.autoFix && suggestionData.suggestion;

          if (shouldFix) {
            // Collect replacement for later batch application
            replacements.push({ original: hex, replacement: suggestionData.suggestion });
          }

          if (!shouldFix || !(context && context.fix)) {
            stylelint.utils.report({
              ruleName,
              result,
              node: decl,
              message: messages.rejectedHex(message),
              word: hex,
            });
          }
        }
      }

      // Apply all replacements in one pass when fixing
      if (context && context.fix && replacements.length > 0) {
        let newValue = value; // Use original value, not mutated decl.value
        for (const { original, replacement } of replacements) {
          newValue = newValue.replace(original, replacement);
        }
        decl.value = newValue;
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;

