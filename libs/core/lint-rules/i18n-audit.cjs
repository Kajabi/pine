#!/usr/bin/env node
'use strict';

/**
 * P3 i18n enforcement audit — burndown runner.
 *
 * Runs pine-i18n/no-hardcoded-a11y-string over every real component .tsx
 * (excluding test/docs/stories) and prints the burndown grouped by component.
 * Audit-only: exits 0 by default. Pass --error to exit non-zero when any
 * finding remains (the CI-gate mode, once the backlog is drained).
 *
 * Usage:
 *   node libs/core/lint-rules/i18n-audit.cjs
 *   node libs/core/lint-rules/i18n-audit.cjs --error
 */

const fs = require('fs');
const path = require('path');
const { Linter } = require('eslint');
const parser = require('@typescript-eslint/parser');

const RULES = {
  'pine-i18n/no-hardcoded-a11y-string': require('./no-hardcoded-a11y-string.cjs'),
  'pine-i18n/no-hardcoded-ui-string-in-logic': require('./no-hardcoded-ui-string-in-logic.cjs'),
};
const RULE_IDS = Object.keys(RULES);

const CORE_ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(CORE_ROOT, 'src', 'components');
const errorMode = process.argv.includes('--error');

const linter = new Linter();
linter.defineParser('ts', parser);
for (const [id, rule] of Object.entries(RULES)) linter.defineRule(id, rule);

const config = {
  parser: 'ts',
  parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
  rules: Object.fromEntries(RULE_IDS.map((id) => [id, 'error'])),
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && full.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const isSource = (f) => !/[\\/](test|docs|stories)[\\/]/.test(f) && !/\.(spec|e2e)\./.test(f);
const componentOf = (f) => (f.match(/components[\\/]([^\\/]+)[\\/]/) || [, '(root)'])[1];

const files = walk(COMPONENTS_DIR).filter(isSource);

const byComponent = {};
let total = 0;

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  const messages = linter.verify(code, config, { filename: file });
  const hits = messages.filter((m) => RULE_IDS.includes(m.ruleId));
  if (hits.length === 0) continue;
  const comp = componentOf(file);
  byComponent[comp] = (byComponent[comp] || []).concat(
    hits.map((h) => ({ loc: `${path.relative(CORE_ROOT, file)}:${h.line}`, message: h.message })),
  );
  total += hits.length;
}

const components = Object.keys(byComponent).sort(
  (a, b) => byComponent[b].length - byComponent[a].length,
);

process.stdout.write('\n=== pine-i18n baked-string burndown ===\n');
process.stdout.write(
  `scanned ${files.length} component source files · ${total} finding(s) across ${components.length} component(s)\n\n`,
);
for (const comp of components) {
  const hits = byComponent[comp];
  process.stdout.write(`  ${comp} (${hits.length})\n`);
  for (const h of hits) process.stdout.write(`    - ${h.loc}\n`);
}
if (total === 0) process.stdout.write('  ✅ no hard-coded a11y strings — inventory clean.\n');
process.stdout.write('\n');

if (errorMode && total > 0) process.exit(1);
