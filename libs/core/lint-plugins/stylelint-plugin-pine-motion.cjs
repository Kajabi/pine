/**
 * Stylelint plugin to enforce Pine motion duration tokens.
 *
 * Flags hard-coded time values in `transition` / `transition-duration`
 * declarations and points to the `--pine-motion-duration-*` tokens, so
 * component transitions stay consistent and inherit the `prefers-reduced-motion`
 * override.
 *
 * Scope (deliberate):
 *   - Only `transition` / `transition-duration`. Keyframe `animation` durations
 *     (spinners, progress bars, etc.) are bespoke ongoing motion, not interaction
 *     transitions, and are intentionally out of scope.
 *   - `0` / `0s` / `0ms` are always allowed.
 *   - Values that exactly match a token (120ms/200ms/300ms and their `s` forms)
 *     get an autofix to the token var. Off-grid values (e.g. 0.15s) have no exact
 *     token; they must use the nearest token or carry a justified
 *     `stylelint-disable-next-line` with a comment.
 */
const stylelint = require('stylelint');

const ruleName = 'pine-design-system/no-hardcoded-motion';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (message) => message,
});

// Properties whose hard-coded timing should use a motion token.
const TIMING_PROPS = new Set(['transition', 'transition-duration']);

// Exact literal → `--pine-motion-duration-*` token name (both ms and s spellings).
const DURATION_TOKENS = {
  '120ms': 'fast',
  '0.12s': 'fast',
  '.12s': 'fast',
  '200ms': 'base',
  '0.2s': 'base',
  '.2s': 'base',
  '300ms': 'slow',
  '0.3s': 'slow',
  '.3s': 'slow',
};

// Matches a CSS time value (e.g. `200ms`, `0.2s`, `.15s`). The leading
// negative lookbehind prevents matching time-like substrings inside
// identifiers / custom-property names (e.g. `var(--app-delay-200ms)`).
const TIME_REGEX = /(?<![\w-])(\d*\.?\d+)(ms|s)\b/g;

function isZeroTime(raw) {
  return /^0*\.?0+(ms|s)$/.test(raw);
}

module.exports = stylelint.createPlugin(ruleName, (primaryOption, _secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption,
      possible: [true, false],
    });

    if (!validOptions || primaryOption === false) {
      return;
    }

    root.walkDecls((decl) => {
      if (!TIMING_PROPS.has(decl.prop.toLowerCase())) {
        return;
      }

      const value = decl.value;
      const replacements = [];
      let match;

      TIME_REGEX.lastIndex = 0;
      while ((match = TIME_REGEX.exec(value)) !== null) {
        const raw = match[0];
        if (isZeroTime(raw)) {
          continue;
        }

        const token = DURATION_TOKENS[raw];
        const tokenVar = token ? `var(--pine-motion-duration-${token})` : null;

        const message = tokenVar
          ? `Hard-coded transition duration "${raw}" should use the motion token ${tokenVar}.`
          : `Hard-coded transition duration "${raw}" has no exact Pine motion token ` +
            `(fast 120ms / base 200ms / slow 300ms). Use the nearest token, or add a ` +
            `justified \`stylelint-disable-next-line ${ruleName}\` when an off-grid value is intentional.`;

        if (tokenVar && context && context.fix) {
          // Record position + length so the fix is applied by index (not by a
          // first-match string replace, which could rewrite the wrong
          // occurrence in a multi-segment shorthand).
          replacements.push({ index: match.index, length: raw.length, replacement: tokenVar });
          continue;
        }

        stylelint.utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.rejected(message),
          word: raw,
        });
      }

      if (context && context.fix && replacements.length > 0) {
        // Apply right-to-left so earlier indices stay valid as the string length changes.
        let newValue = value;
        for (const { index, length, replacement } of replacements.reverse()) {
          newValue = newValue.slice(0, index) + replacement + newValue.slice(index + length);
        }
        decl.value = newValue;
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
