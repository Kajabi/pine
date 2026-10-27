import { newE2EPage } from '@stencil/core/testing';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-box per-side borders', () => {
  // A DOM morph makes the host match the server's HTML: its attributes stay, but the classes and
  // style properties pds-box wrote don't.
  describe('after its classes and styles are stripped', () => {
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

      await expectStylingSurvivesStrip(page, 'pds-box');
    });

    // Another script that removes a class every time the box puts it back would keep both running
    // forever in microtasks; the box gives up after a few rounds instead of hanging the page.
    it('gives up, and keeps the page responsive, when a script keeps removing its classes', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-box display="flex" gap="md"></pds-box>');
      await page.evaluate(() => {
        const w = window as unknown as { pineWarnings: string[] };
        w.pineWarnings = [];
        const warn = console.warn;
        console.warn = (...args: unknown[]) => {
          w.pineWarnings.push(String(args[0] === '%s' ? args[1] : args[0]));
          warn(...args);
        };
      });

      await page.$eval('pds-box', (el) => {
        // Only when it's there: `classList.remove` of a missing class still counts as a class change,
        // so an unconditional remove would loop on its own.
        new MutationObserver(() => {
          if (el.classList.contains('pds-box-gap-md')) el.classList.remove('pds-box-gap-md');
        }).observe(el, { attributes: true, attributeFilter: ['class'] });
        el.classList.remove('pds-box-gap-md');
      });
      await page.waitForChanges();

      expect(await page.evaluate(() => 'responsive')).toBe('responsive');
      expect((await page.evaluate(() => (window as unknown as { pineWarnings: string[] }).pineWarnings)).filter((text) => text.startsWith('pds-box: stopped restoring'))).toHaveLength(1);
      // The other script wins.
      expect(await page.$eval('pds-box', (el) => el.classList.contains('pds-box-gap-md'))).toBe(false);
    });

    // Stripping every class fights the box's own restore and the page-wide one for Stencil's classes
    // at once. Both give up, with one warning between them.
    it('warns once when a script keeps stripping every class, Stencil\'s included', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-box display="flex" gap="md"></pds-box>');
      await page.evaluate(() => {
        const w = window as unknown as { pineWarnings: string[] };
        w.pineWarnings = [];
        const warn = console.warn;
        console.warn = (...args: unknown[]) => {
          w.pineWarnings.push(String(args[0] === '%s' ? args[1] : args[0]));
          warn(...args);
        };
      });

      await page.$eval('pds-box', (el) => {
        const fighter = new MutationObserver(() => {
          if (el.className !== '') el.className = '';
        });
        fighter.observe(el, { attributes: true, attributeFilter: ['class'] });
        (window as unknown as { fighter: MutationObserver }).fighter = fighter;
        el.className = '';
      });
      await page.waitForChanges();

      expect(await page.evaluate(() => 'responsive')).toBe('responsive');
      expect((await page.evaluate(() => (window as unknown as { pineWarnings: string[] }).pineWarnings)).filter((text) => text.startsWith('pds-box: stopped'))).toHaveLength(1);
      expect(await page.$eval('pds-box', (el) => el.className)).toBe('');

      // Once the script stops, the next class change brings the box back, Stencil's classes included.
      await page.$eval('pds-box', (el) => {
        (window as unknown as { fighter: MutationObserver }).fighter.disconnect();
        el.className = 'consumer';
      });
      await page.waitForChanges();
      const classes = await page.$eval('pds-box', (el) => Array.from(el.classList));
      expect(classes).toEqual(expect.arrayContaining(['consumer', 'hydrated', 'pds-box-gap-md']));
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

describe('pds-box display="contents"', () => {
  it('renders no box, so its children lay out in the parent', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-box id="parent" display="flex" gap="md">
        <pds-box id="wrapper" display="contents" padding="lg" border="true" size="6">
          <pds-box id="a" min-width="40px" min-height="20px"></pds-box>
          <pds-box id="b" min-width="40px" min-height="20px"></pds-box>
        </pds-box>
      </pds-box>
    `);
    await page.waitForChanges();

    const layout = await page.evaluate(() => {
      const wrapper = document.getElementById('wrapper')!;
      const a = document.getElementById('a')!.getBoundingClientRect();
      const b = document.getElementById('b')!.getBoundingClientRect();
      const parent = document.getElementById('parent')!.getBoundingClientRect();
      return {
        display: getComputedStyle(wrapper).display,
        wrapperRect: wrapper.getBoundingClientRect().width + wrapper.getBoundingClientRect().height,
        // The parent's gap separates the wrapper's children, and the wrapper's padding adds nothing.
        between: b.left - a.right,
        parentGap: parseFloat(getComputedStyle(document.getElementById('parent')!).columnGap),
        offset: a.left - parent.left,
      };
    });

    expect(layout.display).toBe('contents');
    expect(layout.wrapperRect).toBe(0);
    expect(layout.parentGap).toBeGreaterThan(0);
    expect(layout.between).toBe(layout.parentGap);
    expect(layout.offset).toBe(0);
  });

  it('stays contents inside a pds-row with a column size', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-row><pds-box id="wrapper" display="contents" size-md="6"><span>Item</span></pds-box></pds-row>
    `);
    await page.waitForChanges();

    expect(await page.$eval('#wrapper', (el) => getComputedStyle(el).display)).toBe('contents');
  });

  it('has no accessibility violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-box display="flex" gap="sm">
        <pds-box display="contents"><pds-text>Item 1</pds-text><pds-text>Item 2</pds-text></pds-box>
      </pds-box>
    `);
    await page.waitForChanges();

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
