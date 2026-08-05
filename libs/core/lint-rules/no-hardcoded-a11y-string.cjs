'use strict';

/**
 * ESLint rule: pine-i18n/no-hardcoded-a11y-string
 *
 * Flags hard-coded user-facing text on Pine components — the attributes that a
 * screen reader announces or a user reads but that a consumer cannot translate
 * unless the value is a prop (English-defaulted) they can override. A string
 * LITERAL on one of the target attributes is a finding; a JSX expression (a prop
 * ref, or the i18n helpers — e.g. `{this.dismissLabel}` /
 * `{formatMessage(this.charCountLabel, vars)}`) is assumed localizable and passes.
 *
 * Audit-first (mirrors sage-lint): run as a warning + burndown, flip to error in
 * CI once the backlog is drained. Purely syntactic — no type info required.
 */

const DEFAULT_ATTRS = [
  'aria-label',
  'aria-description',
  'aria-roledescription',
  'aria-placeholder',
  'aria-valuetext',
  'title',
  'alt',
  'placeholder',
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow hard-coded user-facing / a11y string literals on Pine components; expose them as a prop (English-defaulted) so consumers can localize them.',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          attributes: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      hardcoded:
        'Hard-coded "{{attr}}" text "{{value}}" is not localizable. Expose it as a ' +
        'prop with an English default so consumers can pass a translation.',
      interpolated:
        'Interpolated "{{attr}}" text ("{{value}}") bakes English words into an a11y ' +
        'attribute. Expose the template as a prop and interpolate with the i18n ' +
        'formatMessage / pluralize helpers so the surrounding words are localizable.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const attrs = new Set(options.attributes || DEFAULT_ATTRS);

    const attrName = (node) => {
      const n = node.name;
      if (!n) return null;
      if (n.type === 'JSXIdentifier') return n.name;
      if (n.type === 'JSXNamespacedName') return `${n.namespace.name}:${n.name.name}`;
      return null;
    };

    // Returns the literal string value, or null if the value is dynamic/absent.
    const literalString = (valueNode) => {
      if (!valueNode) return null;
      if (valueNode.type === 'Literal' && typeof valueNode.value === 'string') {
        return valueNode.value;
      }
      if (valueNode.type === 'JSXExpressionContainer') {
        const e = valueNode.expression;
        if (e.type === 'Literal' && typeof e.value === 'string') return e.value;
        // template literal with no interpolations, e.g. {`Selected items`}
        if (e.type === 'TemplateLiteral' && e.expressions.length === 0) {
          return e.quasis.map((q) => q.value.cooked).join('');
        }
      }
      return null;
    };

    // An interpolated template whose static parts contain English words baked
    // into an a11y attribute, e.g. `${n} of ${m} characters`. Returns a preview
    // string, or null when the template is purely dynamic (IDs, no words).
    const interpolatedWithWords = (valueNode) => {
      if (!valueNode || valueNode.type !== 'JSXExpressionContainer') return null;
      const e = valueNode.expression;
      if (e.type !== 'TemplateLiteral' || e.expressions.length === 0) return null;
      // Preserve the original static text (no injected separators) and look for a
      // whitespace-delimited word. Sentences have space-bounded words ("of",
      // "characters"); id fragments are hyphen/underscore-joined ("-listbox") and
      // are left alone.
      const staticText = e.quasis.map((q) => q.value.cooked).join('');
      if (!/(^|\s)[A-Za-z]{2,}(\s|$)/.test(staticText)) return null;
      return e.quasis.map((q) => q.value.cooked).join('${…}');
    };

    const truncate = (s) => (s.length > 40 ? `${s.slice(0, 40)}…` : s);

    return {
      JSXAttribute(node) {
        const name = attrName(node);
        if (!name || !attrs.has(name)) return;

        const value = literalString(node.value);
        if (value !== null) {
          if (value.trim() === '') return; // empty (e.g. decorative alt="") → not user text
          context.report({
            node,
            messageId: 'hardcoded',
            data: { attr: name, value: truncate(value) },
          });
          return;
        }

        const interpolated = interpolatedWithWords(node.value);
        if (interpolated !== null) {
          context.report({
            node,
            messageId: 'interpolated',
            data: { attr: name, value: truncate(interpolated) },
          });
        }
      },
    };
  },
};

module.exports.DEFAULT_ATTRS = DEFAULT_ATTRS;
