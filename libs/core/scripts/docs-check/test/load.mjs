import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readDocPage } from '../load.mjs';

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
