import { readFileSync } from 'fs';
import { resolve } from 'path';
import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

interface McpPattern {
  id: string;
  code: string;
}

const { patterns } = JSON.parse(
  readFileSync(resolve(__dirname, '../mcp-patterns.json'), 'utf8'),
) as { patterns: McpPattern[] };

describe('mcp-patterns recipes', () => {
  it('loads the recipes', () => {
    expect(patterns.length).toBeGreaterThan(0);
  });

  it.each(patterns.map((pattern) => [pattern.id, pattern.code]))(
    '%s has no axe violations',
    async (_id, code) => {
      const page = await newE2EPage();
      await page.setContent(code);

      // Recipes are whole page sections, so heading levels count; runAxe leaves best-practice rules off.
      const violations = await runAxe(page, { rules: { 'heading-order': { enabled: true } } });
      expect(formatViolations(violations)).toBe('');
    },
  );
});
