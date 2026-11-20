import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, describe, it } from 'node:test';
import { readComponentFile, readDocPage, readInside } from '../load.mjs';

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

describe('readInside', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'docs-check-'));
  const inside = path.join(root, 'inside');
  mkdirSync(inside);
  writeFileSync(path.join(inside, 'page.mdx'), 'inside');
  writeFileSync(path.join(root, 'secret.mdx'), 'outside');
  symlinkSync(path.join(root, 'secret.mdx'), path.join(inside, 'link.mdx'));
  symlinkSync(path.join(inside, 'page.mdx'), path.join(inside, 'alias.mdx'));
  after(() => rmSync(root, { recursive: true, force: true }));
  const isMdx = (target) => target.endsWith('.mdx');

  it('reads a file, or a symlink to a file, that resolves inside the folder', () => {
    assert.equal(readInside(inside, path.join(inside, 'page.mdx'), isMdx, 'an MDX page'), 'inside');
    assert.equal(readInside(inside, path.join(inside, 'alias.mdx'), isMdx, 'an MDX page'), 'inside');
  });

  it('refuses a symlink inside the folder that resolves outside it', () => {
    assert.throws(() => readInside(inside, path.join(inside, 'link.mdx'), isMdx, 'an MDX page'), /isn't an MDX page/);
  });
});
