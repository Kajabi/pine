import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readComponentFile, readDocPage } from '../load.mjs';

describe('readDocPage', () => {
  it('reads an MDX page under libs/core/src', () => {
    assert.match(readDocPage('libs/core/src/components/pds-button/docs/pds-button.mdx'), /<DocCanvas/);
  });

  it('refuses any other path', () => {
    for (const file of [
      'libs/core/package.json',
      'libs/core/src/../../../package.json',
      'libs/core/src/../README.mdx',
      'libs/core/srcx/page.mdx',
      '../outside.mdx',
      '/etc/passwd',
    ]) {
      assert.throws(() => readDocPage(file), /isn't an MDX page under libs\/core\/src/, file);
    }
  });
});

describe('readComponentFile', () => {
  it('reads a TypeScript file under libs/core/src/components', () => {
    assert.match(readComponentFile('libs/core/src/components/pds-button/pds-button.tsx'), /@Component/);
  });

  it('refuses any other path', () => {
    for (const file of [
      'libs/core/src/components/pds-button/docs/pds-button.mdx',
      'libs/core/src/components/../utils/utils.ts',
      'libs/core/src/components/pds-button/pds-button.tsx.map',
      'libs/core/src/stories/_helpers/index.tsx',
      'libs/core/src/componentsx/pds-button.tsx',
      '../outside.tsx',
      '/etc/passwd.tsx',
    ]) {
      assert.throws(() => readComponentFile(file), /isn't a TypeScript file under libs\/core\/src\/components/, file);
    }
  });
});
