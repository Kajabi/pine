'use strict';

/**
 * ESLint rule: pine-i18n/no-hardcoded-ui-string-in-logic
 *
 * The companion to no-hardcoded-a11y-string. That rule guards JSX *attributes*;
 * this one guards user-facing text baked into component *logic* — the class the
 * attribute rule structurally can't see: strings assigned to `this.<prop>` or
 * `return`ed (announcements, display/trigger text, status messages).
 *
 * Signals, tuned to keep id/CSS/enum returns out:
 *  - a template literal with interpolation whose STATIC parts contain a
 *    space-bounded word (`${x} removed`, `${n} item`) — excludes `${id}-listbox`
 *    and `calc(100vh - ${x}px)`;
 *  - a plain string literal with 2+ space-delimited words (a phrase, not an enum
 *    like `'neutral'` or a token like `'fit-content'`);
 *  - any word-bearing string assigned to a user-facing-named property
 *    (announcement/message/label/text/status/error/hint/tooltip/caption/…).
 *
 * throw/console/new Error args are never visited (not return/assignment), so dev
 * strings are excluded by construction.
 */

const USER_FACING_PROP =
  /(announcement|message|label|text|status|error|hint|tooltip|caption|description|title|placeholder)/i;

const hasSpaceBoundedWord = (s) => /(^|\s)[A-Za-z]{2,}(\s|$)/.test(s);
// A phrase = two alphabetic words separated by whitespace ("No results"), so a
// hyphen/underscore token ("fit-content", "aria_label") is NOT a phrase.
const isPhrase = (s) => /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(s);
const truncate = (s) => (s.length > 40 ? `${s.slice(0, 40)}…` : s);
const templateStatic = (tpl) => tpl.quasis.map((q) => q.value.cooked).join('');
const templatePreview = (tpl) => tpl.quasis.map((q) => q.value.cooked).join('${…}');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow hard-coded user-facing text in Pine component logic (this.* assignments / returns); drive it from a prop, interpolating with the i18n helpers.',
      recommended: false,
    },
    schema: [],
    messages: {
      logic:
        'Hard-coded UI text "{{value}}" in component logic is not localizable. ' +
        'Drive it from an English-defaulted prop and interpolate with the i18n ' +
        'formatMessage / pluralize helpers.',
    },
  },

  create(context) {
    const check = (node, valueNode, namedUserFacing) => {
      if (!valueNode) return;

      if (valueNode.type === 'Literal' && typeof valueNode.value === 'string') {
        const v = valueNode.value;
        if (v.trim() === '') return;
        if (isPhrase(v) || (namedUserFacing && hasSpaceBoundedWord(v))) {
          context.report({ node, messageId: 'logic', data: { value: truncate(v) } });
        }
        return;
      }

      if (valueNode.type === 'TemplateLiteral' && valueNode.expressions.length > 0) {
        if (hasSpaceBoundedWord(templateStatic(valueNode))) {
          context.report({ node, messageId: 'logic', data: { value: truncate(templatePreview(valueNode)) } });
        }
      }
    };

    return {
      AssignmentExpression(node) {
        const { left } = node;
        if (
          left.type === 'MemberExpression' &&
          left.object.type === 'ThisExpression' &&
          left.property.type === 'Identifier'
        ) {
          check(node, node.right, USER_FACING_PROP.test(left.property.name));
        }
      },
      ReturnStatement(node) {
        check(node, node.argument, false);
      },
    };
  },
};
