/**
 * ESLint plugin to enforce Pine design system color tokens in JavaScript/TypeScript
 *
 * Rules:
 *   - pine-colors/no-hardcoded-colors: Blocks hex colors in JS/TS
 *   - pine-colors/prefer-semantic-tokens: Blocks core tokens, suggests semantic tokens
 *
 * For Pine repo: Lints ALL files (no git diff enforcement)
 * Token mappings loaded from @kajabi-ui/styles package
 */

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

// =============================================================================
// Helper functions
// =============================================================================

/**
 * Determine the context (text, background, border) from a JS property name
 */
function getPropertyContext(propName) {
  if (!propName || typeof propName !== 'string') return null;

  const propLower = propName.toLowerCase();

  // Background context
  if (propLower === 'backgroundcolor' || propLower === 'background') {
    return 'background';
  }

  // Border context (includes box-shadow)
  if (
    propLower === 'bordercolor' ||
    propLower === 'border' ||
    propLower === 'outlinecolor' ||
    propLower === 'outline' ||
    propLower === 'boxshadow' ||
    propLower.includes('bordercolor')
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
 * Find all core token matches in a string value
 */
function findCoreTokens(value) {
  if (typeof value !== 'string') return [];

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
 * Get the primary suggestion based on context
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
 * Build error message for prefer-semantic-tokens rule
 */
function buildSemanticErrorMessage(coreToken, context, primarySuggestion, allSuggestions) {
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
  lines.push('  // eslint-disable-next-line pine-colors/prefer-semantic-tokens -- inverse context: [reason]');

  return lines.join('\n');
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

/**
 * Try to determine the property context from the parent nodes
 */
function getContextFromParents(node) {
  let current = node;

  while (current && current.parent) {
    const parent = current.parent;

    if (parent.type === 'Property' && parent.key) {
      const keyName = parent.key.name || parent.key.value;
      const ctx = getPropertyContext(keyName);
      if (ctx) return ctx;
    }

    if (parent.type === 'JSXAttribute' && parent.name) {
      const attrName = parent.name.name;
      const ctx = getPropertyContext(attrName);
      if (ctx) return ctx;
    }

    current = parent;
  }

  return null;
}

// =============================================================================
// Rules
// =============================================================================

module.exports = {
  rules: {
    // =========================================================================
    // Rule 1: no-hardcoded-colors
    // =========================================================================
    'no-hardcoded-colors': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow hard-coded hex colors. Use Pine design system tokens instead.',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: 'code',
        messages: {
          noHexColor: '{{message}}',
        },
        schema: [],
      },
      create(context) {
        function containsHexColor(str) {
          if (typeof str !== 'string') return false;
          const hexColorRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
          return hexColorRegex.test(str);
        }

        function isPineColorVariable(str) {
          if (typeof str !== 'string') return false;
          return str.includes('var(--pine-color-') || str.includes('--pine-color-');
        }

        function extractHexColors(str) {
          if (typeof str !== 'string') return [];
          const hexColorRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
          return str.match(hexColorRegex) || [];
        }

        function reportHexViolation(node, hex, fullValue, propertyContext) {
          const match = findClosestCoreToken(hex, tokenMappings.hexToCore);
          const message = buildHexErrorMessage(hex, match, propertyContext);
          const suggestionData = getHexSuggestion(hex, propertyContext);

          let fixer = null;
          if (suggestionData && suggestionData.autoFix && suggestionData.suggestion) {
            fixer = (fixerObj) => {
              const newValue = fullValue.replace(hex, suggestionData.suggestion);
              if (node.type === 'Literal') {
                const sourceCode = context.getSourceCode();
                const nodeText = sourceCode.getText(node);
                const quote = nodeText[0];
                return fixerObj.replaceText(node, `${quote}${newValue}${quote}`);
              }
              return fixerObj.replaceText(node, `'${newValue}'`);
            };
          }

          context.report({
            node,
            messageId: 'noHexColor',
            data: { message },
            fix: fixer,
          });
        }

        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              if (node.parent) {
                const parentType = node.parent.type;
                if (parentType === 'Property' || parentType === 'JSXAttribute' || parentType === 'VariableDeclarator') {
                  return;
                }
                if (parentType === 'JSXExpressionContainer' &&
                    node.parent.parent && node.parent.parent.type === 'JSXAttribute') {
                  return;
                }
              }

              const hexColors = extractHexColors(node.value);
              const propertyContext = getContextFromParents(node);

              hexColors.forEach((hex) => {
                if (!isPineColorVariable(node.value)) {
                  reportHexViolation(node, hex, node.value, propertyContext);
                }
              });
            }
          },

          TemplateLiteral(node) {
            const fullText = context.getSourceCode().getText(node);
            const hexColors = extractHexColors(fullText);
            const propertyContext = getContextFromParents(node);

            hexColors.forEach((hex) => {
              if (!isPineColorVariable(fullText)) {
                const match = findClosestCoreToken(hex, tokenMappings.hexToCore);
                const message = buildHexErrorMessage(hex, match, propertyContext);

                context.report({
                  node,
                  messageId: 'noHexColor',
                  data: { message },
                });
              }
            });
          },

          Property(node) {
            if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
              const hexColors = extractHexColors(node.value.value);
              const keyName = node.key && (node.key.name || node.key.value);
              const propertyContext = getPropertyContext(keyName);

              hexColors.forEach((hex) => {
                if (!isPineColorVariable(node.value.value)) {
                  reportHexViolation(node.value, hex, node.value.value, propertyContext);
                }
              });
            }
          },

          VariableDeclarator(node) {
            if (node.init) {
              if (node.init.type === 'Literal' && typeof node.init.value === 'string') {
                const hexColors = extractHexColors(node.init.value);
                const propertyContext = getContextFromParents(node.init);

                hexColors.forEach((hex) => {
                  if (!isPineColorVariable(node.init.value)) {
                    reportHexViolation(node.init, hex, node.init.value, propertyContext);
                  }
                });
              }
            }
          },

          JSXAttribute(node) {
            const attrName = node.name && node.name.name;
            const propertyContext = getPropertyContext(attrName);

            if (node.value) {
              if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
                const hexColors = extractHexColors(node.value.value);
                hexColors.forEach((hex) => {
                  if (!isPineColorVariable(node.value.value)) {
                    reportHexViolation(node.value, hex, node.value.value, propertyContext);
                  }
                });
              }

              if (node.value.type === 'JSXExpressionContainer' && node.value.expression) {
                const expr = node.value.expression;
                if (expr.type === 'Literal' && typeof expr.value === 'string') {
                  const hexColors = extractHexColors(expr.value);
                  hexColors.forEach((hex) => {
                    if (!isPineColorVariable(expr.value)) {
                      reportHexViolation(expr, hex, expr.value, propertyContext);
                    }
                  });
                }
              }
            }
          },
        };
      },
    },

    // =========================================================================
    // Rule 2: prefer-semantic-tokens
    // =========================================================================
    'prefer-semantic-tokens': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prefer semantic Pine tokens over core tokens (grey-*, white, black).',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: 'code',
        messages: {
          preferSemantic: '{{message}}',
        },
        schema: [],
      },
      create(context) {
        function checkValue(node, value, propertyContext) {
          if (typeof value !== 'string') return;

          const coreTokenMatches = findCoreTokens(value);
          if (coreTokenMatches.length === 0) return;

          for (const match of coreTokenMatches) {
            const { primarySuggestion, allSuggestions } = getSuggestions(match.token, propertyContext);

            const message = buildSemanticErrorMessage(
              match.token,
              propertyContext,
              primarySuggestion,
              allSuggestions
            );

            context.report({
              node,
              messageId: 'preferSemantic',
              data: { message },
              fix: primarySuggestion
                ? (fixer) => {
                    const newValue = value.replace(
                      match.full,
                      `var(--pine-color-${primarySuggestion})`
                    );
                    if (node.type === 'Literal') {
                      const quote = context.getSourceCode().getText(node)[0];
                      return fixer.replaceText(node, `${quote}${newValue}${quote}`);
                    }
                    return fixer.replaceText(node, `'${newValue}'`);
                  }
                : null,
            });
          }
        }

        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              const propertyContext = getContextFromParents(node);
              checkValue(node, node.value, propertyContext);
            }
          },

          TemplateLiteral(node) {
            if (node.expressions.length === 0 && node.quasis.length === 1) {
              const value = node.quasis[0].value.cooked;
              const propertyContext = getContextFromParents(node);
              checkValue(node, value, propertyContext);
            }
          },
        };
      },
    },
  },
};

