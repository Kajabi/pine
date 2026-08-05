'use strict';

/* Standalone RuleTester run: `node no-hardcoded-a11y-string.test.cjs` */
const { RuleTester } = require('eslint');
const parser = require('@typescript-eslint/parser');
const rule = require('./no-hardcoded-a11y-string.cjs');

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
});

void parser;

ruleTester.run('no-hardcoded-a11y-string', rule, {
  valid: [
    // a prop reference (English-defaulted, consumer-overridable)
    { code: 'const a = <button aria-label={this.dismissLabel} />;' },
    // interpolated via the format helper
    { code: 'const a = <div aria-label={formatMessage(this.charCountLabel, { current, max })} />;' },
    // pluralized via the helper
    { code: 'const a = <span aria-label={pluralize(this.el, n, forms)} />;' },
    // interpolated template with NO words (pure id/handle) → dynamic, allowed
    { code: 'const a = <div aria-label={`${id}-listbox`} />;' },
    // non-targeted attribute with a literal is fine
    { code: 'const a = <button type="button" role="status" part="dismiss" />;' },
    // decorative empty alt
    { code: 'const a = <img alt="" />;' },
  ],
  invalid: [
    {
      // interpolated English baked into an a11y attribute
      code: 'const a = <div aria-label={`${n} of ${m} characters`} />;',
      errors: [{ messageId: 'interpolated' }],
    },
    {
      code: 'const a = <button aria-label="Dismiss alert" />;',
      errors: [{ messageId: 'hardcoded' }],
    },
    {
      code: 'const a = <input placeholder="Select..." />;',
      errors: [{ messageId: 'hardcoded' }],
    },
    {
      // string literal inside an expression container still counts
      code: 'const a = <button aria-label={"Selected items"} />;',
      errors: [{ messageId: 'hardcoded' }],
    },
    {
      code: 'const a = <img alt="User avatar" title="Profile" />;',
      errors: [{ messageId: 'hardcoded' }, { messageId: 'hardcoded' }],
    },
  ],
});

console.log('no-hardcoded-a11y-string: all RuleTester cases passed ✓');
