/* istanbul ignore file -- page.evaluate runs in the browser; coverage globals are unavailable there */
import type { E2EPage } from '@stencil/core/testing';

/** axe-core selector path; nested arrays represent iframe/shadow boundaries. */
export type AxeTarget = (string | string[])[];

/**
 * Subset of an axe-core violation surfaced for test assertions. The shape
 * mirrors `axe.AxeResults['violations'][number]` without pulling axe-core's
 * full types into the component test surface.
 */
export interface AxeViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: AxeTarget;
    html: string;
    failureSummary?: string;
  }>;
}

export interface RunAxeOptions {
  /**
   * Limits the run to rules tagged with one or more of these values.
   * Defaults to WCAG 2.0 + 2.1 levels A and AA.
   */
  tags?: string[];

  /**
   * Per-rule overrides (e.g. `{ 'color-contrast': { enabled: false } }`).
   */
  rules?: Record<string, { enabled: boolean }>;
}

/**
 * Default tag filter applied by `runAxe`. Mirrors WCAG 2.0 + 2.1 levels A
 * and AA. Override with `{ tags: [...] }` to widen or narrow the scope.
 */
export const DEFAULT_AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;

/**
 * Page-level axe rules that fire on the bare HTML harness Stencil's E2E
 * provides (no `<title>`, no `<html lang>`, no landmarks, no `<h1>`).
 * They are disabled by default because they describe document chrome,
 * not component behavior — flagging them at component scope yields noise.
 *
 * Tests can opt back in for a specific case:
 *
 * ```ts
 * await runAxe(page, { rules: { 'document-title': { enabled: true } } });
 * ```
 */
export const DEFAULT_DISABLED_RULES = [
  'document-title',
  'html-has-lang',
  'landmark-one-main',
  'page-has-heading-one',
  'region',
] as const;

/**
 * Injects axe-core into an active Stencil E2EPage and returns any
 * accessibility violations found in the current document.
 *
 * Usage:
 *
 * ```ts
 * const page = await newE2EPage();
 * await page.setContent('<pds-button>Click me</pds-button>');
 * const violations = await runAxe(page);
 * expect(violations).toEqual([]);
 * ```
 *
 * Component tests should assert against the returned array directly so
 * each component can document its own baseline (zero violations is the
 * goal; suppressions should be deliberate and commented).
 */
export async function runAxe(page: E2EPage, options: RunAxeOptions = {}): Promise<AxeViolation[]> {
  // Resolve axe-core's UMD bundle from node_modules at test time so we
  // do not depend on a build step injecting it.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axePath = require.resolve('axe-core/axe.min.js');

  await page.addScriptTag({ path: axePath });

  const defaultRules = DEFAULT_DISABLED_RULES.reduce<Record<string, { enabled: boolean }>>(
    (acc, rule) => {
      acc[rule] = { enabled: false };
      return acc;
    },
    {},
  );

  const runOptions = {
    runOnly: {
      type: 'tag' as const,
      values: options.tags ?? [...DEFAULT_AXE_TAGS],
    },
    rules: { ...defaultRules, ...(options.rules ?? {}) },
  };

  // Embed options in a string-evaluated IIFE so Istanbul does not instrument
  // the browser-side function (cov_* globals are undefined in Puppeteer).
  const optsJson = JSON.stringify(runOptions);
  const violations = await page.evaluate(`
    (async () => {
      const opts = ${optsJson};
      const axe = window.axe;
      if (!axe) {
        throw new Error('axe-core failed to load on the page.');
      }
      const results = await axe.run(document, opts);
      return results.violations;
    })()
  `);

  return violations as AxeViolation[];
}

/**
 * Formats an axe target selector, including nested arrays for shadow DOM
 * and iframe boundaries (axe's `UnlabelledFrameSelector` shape).
 */
export function formatAxeTarget(target: AxeTarget): string {
  return target
    .map((segment) => (Array.isArray(segment) ? segment.join(' ') : segment))
    .join(' >> ');
}

/**
 * Formats an array of axe violations into a readable failure message for
 * use in test output. Returns an empty string when there are no
 * violations, so it can be passed directly into `expect(...).toBe('')`.
 */
export function formatViolations(violations: AxeViolation[]): string {
  if (violations.length === 0) return '';
  return violations
    .map((v) => {
      const targets = v.nodes.map((n) => formatAxeTarget(n.target)).join(', ');
      return `• [${v.impact ?? 'unknown'}] ${v.id} — ${v.help}\n    ${targets}\n    ${v.helpUrl}`;
    })
    .join('\n\n');
}
