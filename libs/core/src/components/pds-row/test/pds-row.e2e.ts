import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';

describe('pds-row', () => {
  // A DOM morph makes the host match the server's HTML: its attributes stay, but the classes and
  // style properties pds-row wrote don't.
  it('puts its layout back after its classes and styles are stripped', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-row class="consumer" col-gap="md" min-height="80px" border align-items="center"></pds-row>
    `);
    const rowGap = () => page.$eval('pds-row', (el) => getComputedStyle(el).getPropertyValue('--row-gap-x'));
    const gapBefore = await rowGap();

    await expectStylingSurvivesStrip(page, 'pds-row');

    expect(await rowGap()).toBe(gapBefore);
  });

  it('has no accessibility violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-row col-gap="md">
        <pds-box size="6">Column one</pds-box>
        <pds-box size="6">Column two</pds-box>
      </pds-row>
    `);

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
