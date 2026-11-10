/**
 * Jest configuration for `test-storybook` (the accessibility gate).
 *
 * The test-runner picks this file up automatically because it sits in the
 * Storybook config dir and matches `test-runner-jest*` — this is the runner's
 * documented "eject" escape hatch, reached via `test-storybook --eject`.
 *
 * The only change from the default is swapping the runner's own
 * `playwright/jest-setup.js` for `a11y-setup.js`; see that file for why.
 */
import { getJestConfig } from '@storybook/test-runner';
import { fileURLToPath } from 'node:url';

const defaultConfig = getJestConfig();

/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  ...defaultConfig,
  setupFilesAfterEnv: [
    fileURLToPath(new URL('./a11y-setup.js', import.meta.url)),
    ...defaultConfig.setupFilesAfterEnv.filter((setupFile) => !setupFile.endsWith('playwright/jest-setup.js')),
  ],
};
