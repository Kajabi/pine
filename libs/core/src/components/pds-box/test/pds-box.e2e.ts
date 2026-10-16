import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-box per-side borders', () => {
  // A DOM morph makes the host match the server's HTML: its attributes stay, but the classes and
  // style properties pds-box wrote don't.
  describe('after its classes and styles are stripped', () => {
    const layout = () => (el: HTMLElement) => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        flexDirection: style.flexDirection,
        gap: style.gap,
        padding: style.padding,
        backgroundColor: style.backgroundColor,
        minHeight: style.minHeight,
        flex: style.flex,
        visibility: style.visibility,
      };
    };
    const strip = (el: Element) => {
      el.setAttribute('class', 'consumer');
      el.removeAttribute('style');
    };

    it('puts its layout back and keeps the consumer\'s class', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-box class="consumer" display="flex" direction="column" gap="md" padding="sm"
          background-color="#ff0000" min-height="100px" flex="2 1 0px"></pds-box>
      `);
      const before = await page.$eval('pds-box', layout());

      await page.$eval('pds-box', strip);
      await page.waitForChanges();

      expect(await page.$eval('pds-box', layout())).toEqual(before);
      const box = await page.find('pds-box');
      expect(box).toHaveClasses(['consumer', 'hydrated', 'pds-box-gap-md']);
    });

    it('still takes a changed attribute afterwards', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-box display="flex" gap="md"></pds-box>');

      await page.$eval('pds-box', strip);
      await page.waitForChanges();
      await page.$eval('pds-box', (el) => el.setAttribute('gap', 'lg'));
      await page.waitForChanges();

      const box = await page.find('pds-box');
      expect(box).toHaveClasses(['pds-box-gap-lg', 'pds-box--display-flex']);
      expect(box).not.toHaveClass('pds-box-gap-md');
    });

    // A morph strips the classes and changes the attribute in one go, so the restore puts back the
    // old gap class before Stencil re-renders with the new one.
    it('takes an attribute changed in the same step as the strip', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-box display="flex" gap="md" min-height="40px"></pds-box>');

      await page.$eval('pds-box', (el) => {
        el.setAttribute('class', '');
        el.removeAttribute('style');
        el.setAttribute('gap', 'lg');
        el.setAttribute('min-height', '80px');
      });
      await page.waitForChanges();

      const box = await page.find('pds-box');
      expect(box).toHaveClasses(['pds-box-gap-lg', 'pds-box--display-flex', 'hydrated']);
      expect(box).not.toHaveClass('pds-box-gap-md');
      expect(await page.$eval('pds-box', (el) => getComputedStyle(el).minHeight)).toBe('80px');
    });
  });

  it('applies a border only to the side that is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border-block-end="true">Box</pds-box>');

    const styles = await (await page.find('#target')).getComputedStyle();

    expect(styles.getPropertyValue('border-block-end-width')).toBe('1px');
    expect(styles.getPropertyValue('border-block-start-width')).toBe('0px');
    expect(styles.getPropertyValue('border-inline-start-width')).toBe('0px');
    expect(styles.getPropertyValue('border-inline-end-width')).toBe('0px');
  });

  it('removes a single side when it is set to false alongside border', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border="true" border-block-end="false">Box</pds-box>');

    const styles = await (await page.find('#target')).getComputedStyle();

    expect(styles.getPropertyValue('border-block-end-width')).toBe('0px');
    expect(styles.getPropertyValue('border-block-start-width')).toBe('1px');
    expect(styles.getPropertyValue('border-inline-start-width')).toBe('1px');
    expect(styles.getPropertyValue('border-inline-end-width')).toBe('1px');
  });

  it('uses border-color on a per-side border', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box id="target" border-inline-start="true" border-color="#0072ef">Box</pds-box>');

    const styles = await (await page.find('#target')).getComputedStyle();

    expect(styles.getPropertyValue('border-inline-start-color')).toBe('rgb(0, 114, 239)');
  });

  it('has no accessibility violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-box border-block-end="true">Box</pds-box>');

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
