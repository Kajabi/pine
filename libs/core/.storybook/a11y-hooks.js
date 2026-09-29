/**
 * Pine's automated accessibility gate — the axe audit run against every story.
 *
 * Every story is rendered in a real (headless Chromium) browser with the full
 * Pine theme loaded, then audited with axe-core. This is the themed counterpart
 * to `src/utils/test/axe.ts`, which runs axe inside Stencil's bare E2E harness
 * and therefore has to disable `color-contrast` (see the note in that file).
 * Here the global stylesheet and fonts are present, so contrast *is* measured.
 *
 * Pre-existing violations are tolerated via `a11y-baseline.json` — a story/rule
 * allowlist. A violation whose rule is not already recorded for that story fails
 * the run, and the baseline is only ever pruned, never appended to by hand.
 *
 * Note the granularity: matching is per story *and rule*, not per element. A
 * story already baselined for `color-contrast` still fails on a new `select-name`,
 * but a *second* `color-contrast` failure on a different element inside that same
 * story is absorbed by the existing entry. Tightening this to node level is the
 * obvious next step once the current backlog is burnt down.
 *
 * Run it with `npm run test.a11y` (from `libs/core`) — the runner script starts
 * a static server for `storybook-static` and drives these hooks.
 *
 * ## Why this is not `.storybook/test-runner.js`
 *
 * `@storybook/test-runner` normally auto-loads `<configDir>/test-runner.js`.
 * It cannot here: Storybook 10's module loader calls `module.register()` before
 * importing that file, and Jest 30 (bundled inside the test-runner) refuses
 * `module.register()` outright, so *every* story suite fails to start. The file
 * is therefore named `a11y-hooks.js` — invisible to that auto-loader — and is
 * wired in explicitly by `a11y-setup.js` via `test-runner-jest.config.js`, the
 * test-runner's own supported "eject" escape hatch.
 *
 * When a Storybook upgrade fixes that loader, this can be renamed back to
 * `test-runner.js` and `a11y-setup.js` / `test-runner-jest.config.js` deleted.
 *
 * @see a11y-setup.js              — registers these hooks with the test-runner
 * @see test-runner-jest.config.js — Jest config override that loads the setup
 * @see ../scripts/a11y.mjs        — orchestrator (server + baseline diffing)
 * @see a11y-baseline.json         — allowlisted pre-existing violations
 * @see ../src/utils/test/axe.ts   — component-level (Stencil E2E) axe helper
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getStoryContext, waitForPageReady } from '@storybook/test-runner';

const require = createRequire(import.meta.url);
const currentDir = dirname(fileURLToPath(import.meta.url));

/** axe-core's UMD bundle, resolved from node_modules at run time. */
const AXE_SCRIPT_PATH = require.resolve('axe-core/axe.min.js');

/** Story/rule allowlist of violations that already existed when the gate landed. */
const BASELINE_PATH = join(currentDir, 'a11y-baseline.json');

/**
 * Where each worker drops its per-story result shard. The orchestrator merges
 * these to report stale baseline entries and to regenerate the baseline.
 * Set by `scripts/a11y.mjs`; when unset (e.g. running `test-storybook` directly)
 * results are simply not recorded.
 */
const RESULTS_DIR = process.env.PINE_A11Y_RESULTS_DIR;

/** Record-only mode: collect violations for a baseline refresh, never fail. */
const UPDATE_MODE = process.env.PINE_A11Y_UPDATE === '1';

/**
 * WCAG 2.0 + 2.1 levels A and AA. Kept in sync with `DEFAULT_AXE_TAGS` in
 * `src/utils/test/axe.ts` — both harnesses audit the same conformance target.
 */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Rules that describe the *page* Storybook renders a story into, not the story
 * itself. A story is a fragment mounted into `#storybook-root`, so it can never
 * legitimately supply a main landmark or an `<h1>`, and flagging it for their
 * absence is noise rather than a finding.
 *
 * Unlike the Stencil E2E harness, `color-contrast` is deliberately NOT disabled
 * here: the themed Storybook page is the one place Pine can measure it honestly.
 */
const DISABLED_RULES = ['landmark-one-main', 'page-has-heading-one', 'region'];

/**
 * Pine renders through Stencil's async task queue, so a story is not finished
 * painting when Playwright considers the page loaded. Every audit therefore
 * waits for hydration and then samples axe several times, keeping only the
 * rules every sample agrees on — see `collectViolations`.
 */
const AXE_SAMPLES = 3;
const AXE_SAMPLE_GAP_MS = 150;
const HYDRATION_TIMEOUT_MS = 10_000;

const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) : { stories: {} };

/**
 * Reads the story's `a11y` parameter, honouring the same shape
 * `@storybook/addon-a11y` uses so the panel and the gate stay consistent.
 *
 * Only `a11y.disable` opts a story out. `a11y.test` is deliberately ignored: it
 * configures how the *addon* grades its own run (`'todo'` vs `'error'`), which
 * says nothing about whether this gate should audit the story. Opting out of the
 * gate is `a11y.disable`, or a per-rule override — see `axeOptionsFor`.
 */
function a11yParametersFor(storyContext) {
  const params = storyContext.parameters?.a11y ?? {};
  const ruleOverrides = Array.isArray(params.config?.rules) ? params.config.rules : [];
  return { disabled: params.disable === true, ruleOverrides };
}

/** Builds the axe `run` options for one story. */
function axeOptionsFor(ruleOverrides) {
  const rules = {};
  for (const id of DISABLED_RULES) rules[id] = { enabled: false };
  for (const rule of ruleOverrides) {
    if (rule?.id) rules[rule.id] = { enabled: rule.enabled !== false };
  }
  return { runOnly: { type: 'tag', values: AXE_TAGS }, rules };
}

/** Formats one axe target selector; nested arrays are shadow-DOM boundaries. */
function formatTarget(target) {
  return (target ?? []).map((segment) => (Array.isArray(segment) ? segment.join(' ') : segment)).join(' >> ');
}

/** Human-readable failure report for the violations that are not allowlisted. */
function formatViolations(storyId, violations) {
  const body = violations
    .map((v) => {
      const targets = v.nodes.map((n) => formatTarget(n.target)).join(', ');
      return `  • [${v.impact ?? 'unknown'}] ${v.id} — ${v.help}\n      ${targets}\n      ${v.helpUrl}`;
    })
    .join('\n\n');

  return [
    `New accessibility violation(s) in story "${storyId}":`,
    '',
    body,
    '',
    'Fix the violation, or — if it is a deliberate, justified exception —',
    'document it on the story:',
    '',
    "  parameters: { a11y: { config: { rules: [{ id: '<rule-id>', enabled: false }] } } }",
    '',
    'See CONTRIBUTING.md § Accessibility gate.',
  ].join('\n');
}

/** Persists one story's result so the orchestrator can diff against the baseline. */
function recordResult(storyId, ruleIds) {
  if (!RESULTS_DIR) return;
  mkdirSync(RESULTS_DIR, { recursive: true });
  const fileName = `${storyId.replace(/[^a-z0-9-]/gi, '_')}.json`;
  writeFileSync(join(RESULTS_DIR, fileName), JSON.stringify({ storyId, ruleIds }));
}

/** Runs axe over the story root and returns its violations. */
function runAxe(page, options) {
  return page.evaluate(async (axeOptions) => {
    if (!window.axe) throw new Error('axe-core failed to load on the page.');
    const results = await window.axe.run('#storybook-root', axeOptions);
    return results.violations;
  }, options);
}

/**
 * Waits until every Pine element in the story — shadow roots included — carries
 * Stencil's `hydrated` class, then lets two frames pass so the resulting layout
 * and styles are painted. Auditing before this point is what made the gate
 * report violations that vanished a tick later.
 *
 * A story that never hydrates (or renders no Pine elements at all) simply falls
 * through on the timeout rather than failing the run; axe still audits whatever
 * did render.
 */
async function waitForPineHydration(page, storyId) {
  const allHydrated = () => {
    const root = document.querySelector('#storybook-root');
    if (!root) return false;

    const pending = [root];
    while (pending.length > 0) {
      const node = pending.pop();
      if (node.tagName?.toLowerCase().startsWith('pds-') && !node.classList.contains('hydrated')) {
        return false;
      }
      pending.push(...node.children);
      if (node.shadowRoot) pending.push(...node.shadowRoot.children);
    }
    return true;
  };

  try {
    await page.waitForFunction(allHydrated, undefined, { timeout: HYDRATION_TIMEOUT_MS });
  } catch {
    // Timed out — audit what rendered rather than failing on the wait itself.
    // Say so, though: an unhydrated page can under-report violations, so a run
    // that recorded a baseline while this was firing is not trustworthy.
    console.warn(`[a11y] "${storyId}" did not finish hydrating in ${HYDRATION_TIMEOUT_MS}ms — auditing it as rendered; results may be incomplete.`);
  }

  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

/**
 * Samples axe `AXE_SAMPLES` times and returns only the violations whose rule
 * appears in *every* sample.
 *
 * Intersecting rather than unioning is deliberate. A handful of Pine stories
 * (async comboboxes, transitioning filters, conditionally rendered sort icons)
 * report a violation on one sample and not the next; failing a PR on that noise
 * would make the gate worse than useless. A violation that is genuinely present
 * reproduces on every sample, so nothing real is dropped.
 */
async function collectViolations(page, options) {
  const samples = [];
  for (let i = 0; i < AXE_SAMPLES; i += 1) {
    if (i > 0) await page.waitForTimeout(AXE_SAMPLE_GAP_MS);
    samples.push(await runAxe(page, options));
  }

  const [first, ...rest] = samples;
  const inEverySample = (ruleId) => rest.every((sample) => sample.some((v) => v.id === ruleId));
  return first.filter((violation) => inEverySample(violation.id));
}

export async function preVisit(page) {
  await page.addScriptTag({ path: AXE_SCRIPT_PATH });
}

export async function postVisit(page, context) {
  const storyContext = await getStoryContext(page, context);
  const { disabled, ruleOverrides } = a11yParametersFor(storyContext);

  if (disabled) {
    recordResult(context.id, []);
    return;
  }

  // Settle the page before auditing: network idle and fonts loaded, then Pine's
  // own hydration. Both matter — `color-contrast` in particular is meaningless
  // against unstyled or mid-transition markup.
  await waitForPageReady(page);
  await waitForPineHydration(page, context.id);

  const violations = await collectViolations(page, axeOptionsFor(ruleOverrides));

  const ruleIds = [...new Set(violations.map((v) => v.id))].sort();
  recordResult(context.id, ruleIds);

  if (UPDATE_MODE) return;

  const allowed = new Set(baseline.stories?.[context.id] ?? []);
  const unexpected = violations.filter((v) => !allowed.has(v.id));
  if (unexpected.length > 0) {
    throw new Error(formatViolations(context.id, unexpected));
  }
}
