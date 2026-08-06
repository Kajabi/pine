'use strict';

/* Standalone RuleTester run: `node no-hardcoded-ui-string-in-logic.test.cjs` */
const { RuleTester } = require('eslint');
const rule = require('./no-hardcoded-ui-string-in-logic.cjs');

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
});

ruleTester.run('no-hardcoded-ui-string-in-logic', rule, {
  valid: [
    // enum / single-word returns
    { code: 'function f() { return "neutral"; }' },
    { code: 'function f() { return "fit-content"; }' },
    // id + css templates (no space-bounded word)
    { code: 'function f() { return `${this.componentId}-listbox`; }' },
    { code: 'class C { m() { this.contentMaxHeight = `calc(100vh - ${x}px)`; } }' },
    { code: 'function f() { return `var(--pine-dimension-${gap})`; }' },
    // driven from a prop via the i18n helpers
    { code: 'class C { m() { this.removalAnnouncement = formatMessage(this.itemRemovedLabel, { item }); } }' },
    { code: 'function f() { return pluralize(this.el, n, forms); }' },
    // single-word assignment to a non-user-facing prop
    { code: 'class C { m() { this.variant = "default"; } }' },
  ],
  invalid: [
    {
      // announcement template (single static word, interpolated)
      code: 'class C { m() { this.removalAnnouncement = `${item.text} removed`; } }',
      errors: [{ messageId: 'logic' }],
    },
    {
      // pluralized display text returned from a method
      code: 'function f() { return `${count} item`; }',
      errors: [{ messageId: 'logic' }],
    },
    {
      // 2-word phrase returned
      code: 'function f() { return "No results found"; }',
      errors: [{ messageId: 'logic' }],
    },
    {
      // word-bearing string on a user-facing-named prop (single word ok via name signal)
      code: 'class C { m() { this.errorMessage = "Required"; } }',
      errors: [{ messageId: 'logic' }],
    },
  ],
});

console.log('no-hardcoded-ui-string-in-logic: all RuleTester cases passed ✓');
