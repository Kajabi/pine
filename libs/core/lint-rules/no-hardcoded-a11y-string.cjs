'use strict';

/**
 * ESLint rule: pine-i18n/no-hardcoded-a11y-string
 *
 * Flags hard-coded user-facing text on the attributes a screen reader announces
 * or a user reads (aria-label, title, alt, placeholder, …) — text a consumer
 * cannot translate unless it comes from a prop they can override. A string
 * literal on a target attribute is a finding, as is an interpolated template
 * that bakes English words into one (e.g. `aria-label={`${n} of ${m} chars`}`).
 * A prop ref or an i18n-helper call (`{this.dismissLabel}`,
 * `{formatMessage(this.characterCountLabel, vars)}`) is assumed localizable and
 * passes.
 *
 * Conditional (`a ? b : c`) and logical (`a || b`) expressions are searched on
 * both operands, so a literal hidden in a branch — `{cond ? 'Label' : undefined}`,
 * `{this.label || 'Options'}` — is still caught. Purely syntactic; no type info.
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

    const truncate = (s) => (s.length > 40 ? `${s.slice(0, 40)}…` : s);

    // A whitespace-delimited word marks human text ("of", "characters"); id
    // fragments are hyphen/underscore-joined ("-listbox") and are left alone.
    const hasWord = (s) => /(^|\s)[A-Za-z]{2,}(\s|$)/.test(s);

    // Walk an expression, collecting any baked-string findings. Recurses through
    // conditional/logical operands so a literal in any branch is still reached.
    const collectFindings = (expr, out) => {
      if (!expr) return;
      switch (expr.type) {
        case 'Literal':
          if (typeof expr.value === 'string' && expr.value.trim() !== '') {
            out.push({ messageId: 'hardcoded', value: expr.value });
          }
          return;
        case 'TemplateLiteral': {
          const staticText = expr.quasis.map((q) => q.value.cooked).join('');
          if (expr.expressions.length === 0) {
            if (staticText.trim() !== '') out.push({ messageId: 'hardcoded', value: staticText });
          } else if (hasWord(staticText)) {
            out.push({ messageId: 'interpolated', value: expr.quasis.map((q) => q.value.cooked).join('${…}') });
          }
          return;
        }
        case 'ConditionalExpression':
          collectFindings(expr.consequent, out);
          collectFindings(expr.alternate, out);
          return;
        case 'LogicalExpression':
          collectFindings(expr.left, out);
          collectFindings(expr.right, out);
          return;
        default:
          return; // identifiers, member/call expressions, etc. → assumed localizable
      }
    };

    return {
      JSXAttribute(node) {
        const name = attrName(node);
        if (!name || !attrs.has(name)) return;

        const value = node.value;
        const findings = [];
        if (value && value.type === 'Literal') {
          collectFindings(value, findings);
        } else if (value && value.type === 'JSXExpressionContainer') {
          collectFindings(value.expression, findings);
        }

        for (const f of findings) {
          context.report({
            node,
            messageId: f.messageId,
            data: { attr: name, value: truncate(f.value) },
          });
        }
      },
    };
  },
};

module.exports.DEFAULT_ATTRS = DEFAULT_ATTRS;
