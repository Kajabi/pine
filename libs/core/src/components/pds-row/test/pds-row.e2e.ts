import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-row', () => {
  // A DOM morph makes the host match the server's HTML: its attributes stay, but the classes and
  // style properties pds-row wrote don't.
  it('puts its layout back after its classes and styles are stripped', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-row class="consumer" col-gap="md" min-height="80px" border align-items="center"></pds-row>
    `);
    const layout = (el: HTMLElement) => {
      const style = getComputedStyle(el);
      return {
        rowGapX: style.getPropertyValue('--row-gap-x'),
        minHeight: style.minHeight,
        alignItems: style.alignItems,
        borderStyle: style.borderTopStyle,
        visibility: style.visibility,
      };
    };
    const before = await page.$eval('pds-row', layout);

    await page.$eval('pds-row', (el) => {
      el.setAttribute('class', 'consumer');
      el.removeAttribute('style');
    });
    await page.waitForChanges();

    expect(await page.$eval('pds-row', layout)).toEqual(before);
    expect(await page.find('pds-row')).toHaveClasses(['consumer', 'hydrated', 'pds-row', 'pds-row--border']);
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
