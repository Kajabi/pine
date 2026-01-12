/**
 * Stylelint plugin to enforce semantic tokens over core tokens
 *
 * Rule: pine-design-system/prefer-semantic-tokens
 *
 * Catches usage of core tokens (grey-*, white, black) and suggests semantic alternatives.
 * For Pine repo: Lints ALL files (no git diff enforcement)
 * Token mappings loaded from @kajabi-ui/styles package
 */

const stylelint = require('stylelint');

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

const ruleName = 'pine-design-system/prefer-semantic-tokens';

/**
 * Determine the context (text, background, border) from a CSS property name
 */
function getPropertyContext(prop) {
  const propLower = prop.toLowerCase();

  // Background context
  if (propLower === 'background' || propLower === 'background-color') {
    return 'background';
  }

  // Border context (includes box-shadow)
  if (
    propLower === 'border' ||
    propLower === 'border-color' ||
    (propLower.startsWith('border-') && propLower.endsWith('-color')) ||
    propLower === 'outline' ||
    propLower === 'outline-color' ||
    propLower === 'box-shadow'
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
 * Get all core token matches in a value
 */
function findCoreTokens(value) {
  const regex = /var\(--pine-color-(grey-\d{3}|grey-050|white|black)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(value)) !== null) {
    matches.push({
      full: match[0],
      token: match[1],
      index: match.index,
    });
  }

  return matches;
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
 * Build a rich error message with suggestions
 */
function buildErrorMessage(coreToken, context, primarySuggestion, allSuggestions) {
  const lines = [
    `Core token "var(--pine-color-${coreToken})" should use a semantic token.`,
    '',
  ];

  if (primarySuggestion) {
    lines.push(`Based on property context "${context || 'unknown'}", suggested replacement:`);
    lines.push(`  → var(--pine-color-${primarySuggestion})`);
  } else if (context && allSuggestions.length > 0) {
    lines.push(`No exact semantic mapping for "${coreToken}" in ${context} context.`);
    lines.push(`Available ${context} tokens (pick the closest):`);
    allSuggestions.forEach((suggestion) => {
      lines.push(`  → var(--pine-color-${suggestion})`);
    });
  }

  if (primarySuggestion) {
    const otherSuggestions = allSuggestions.filter((s) => s !== primarySuggestion);
    if (otherSuggestions.length > 0) {
      lines.push('');
      lines.push('Other possible replacements:');
      otherSuggestions.forEach((suggestion) => {
        let hint = '';
        if (suggestion.startsWith('background-')) hint = '(for backgrounds)';
        else if (suggestion.startsWith('text-inverse')) hint = '(for text on dark backgrounds)';
        else if (suggestion.startsWith('text-')) hint = '(for text)';
        else if (suggestion.startsWith('border-')) hint = '(for borders)';
        else if (suggestion.startsWith('icon-')) hint = '(for icons)';
        lines.push(`  → var(--pine-color-${suggestion}) ${hint}`);
      });
    }
  }

  lines.push('');
  lines.push(`Docs: ${tokenMappings.docsUrl}`);
  lines.push('');
  lines.push('If this is intentional (e.g., inverse context), disable with:');
  lines.push(`  /* stylelint-disable-next-line ${ruleName} -- inverse context: [reason] */`);

  return lines.join('\n');
}

module.exports = stylelint.createPlugin(ruleName, (primaryOption, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [true, false],
    });

    if (!validOptions || primaryOption === false) {
      return;
    }

    root.walkDecls((decl) => {
      const value = decl.value;
      const prop = decl.prop;

      const coreTokenMatches = findCoreTokens(value);

      if (coreTokenMatches.length === 0) {
        return;
      }

      const propertyContext = getPropertyContext(prop);

      // Collect replacements to apply in one pass
      const replacements = [];

      for (const match of coreTokenMatches) {
        const { primarySuggestion, allSuggestions } = getSuggestions(match.token, propertyContext);

        // Collect replacement if we have a primary suggestion
        if (primarySuggestion) {
          replacements.push({
            original: match.full,
            replacement: `var(--pine-color-${primarySuggestion})`
          });
        }

        // Report if not in fix mode or no primary suggestion
        if (!(context && context.fix && primarySuggestion)) {
          const message = buildErrorMessage(
            match.token,
            propertyContext,
            primarySuggestion,
            allSuggestions
          );

          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message,
            word: match.full,
          });
        }
      }

      // Apply all replacements in one pass when fixing
      if (context && context.fix && replacements.length > 0) {
        let newValue = value; // Use original value
        for (const { original, replacement } of replacements) {
          newValue = newValue.replace(original, replacement);
        }
        decl.value = newValue;
      }
    });
  };
});

module.exports.ruleName = ruleName;

