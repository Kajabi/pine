/**
 * Jest `setupFilesAfterEnv` shim for the accessibility gate.
 *
 * Stands in for `@storybook/test-runner`'s own `playwright/jest-setup.js`.
 * That file discovers hooks by calling `getTestRunnerConfig()`, which asks
 * Storybook to import `<configDir>/test-runner.js` — and Storybook 10's loader
 * calls `module.register()`, which Jest 30 rejects, failing every story suite
 * before a single test runs. We register the same hooks directly instead, and
 * reproduce the two globals the transformed story tests rely on.
 *
 * @see a11y-hooks.js              — the axe gate itself
 * @see test-runner-jest.config.js — swaps this file in for the default setup
 */
import { setPreVisit, setPostVisit, setupPage } from '@storybook/test-runner';
import { preVisit, postVisit } from './a11y-hooks.js';

setPreVisit(preVisit);
setPostVisit(postVisit);

// Required by the transformed story tests in both file and index.json modes.
globalThis.__sbSetupPage = setupPage;
globalThis.__sbCollectCoverage = process.env.STORYBOOK_COLLECT_COVERAGE === 'true';
