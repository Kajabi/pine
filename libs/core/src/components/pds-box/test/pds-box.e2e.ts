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

describe('pds-box layout', () => {
  it('shrinks with flex="shrink" and holds its size with flex="none"', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-box id="row" style="width: 200px">
        <pds-box id="shrink" flex="shrink" style="width: 300px">Shrink</pds-box>
        <pds-box id="none" flex="none" style="width: 300px">None</pds-box>
      </pds-box>
    `);

    const shrink = await (await page.find('#shrink')).getComputedStyle();
    const none = await (await page.find('#none')).getComputedStyle();

    expect(shrink.getPropertyValue('flex-shrink')).toBe('1');
    expect(shrink.getPropertyValue('flex-grow')).toBe('0');
    expect(none.getPropertyValue('flex-shrink')).toBe('0');
    expect(none.getPropertyValue('flex-grow')).toBe('0');
    expect(await page.$eval('#shrink', (el) => el.getBoundingClientRect().width)).toBeLessThan(300);
    expect(await page.$eval('#none', (el) => el.getBoundingClientRect().width)).toBe(300);
  });

  it('pushes a box to the far side with margin-inline-start="auto"', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div id="wrap" style="width: 400px">
        <pds-box id="footer" fit>
          <pds-box id="delete" flex="none" style="width: 50px">Delete</pds-box>
          <pds-box id="actions" flex="none" margin-inline-start="auto" style="width: 100px">Save</pds-box>
        </pds-box>
      </div>
    `);

    const footer = await page.$eval('#footer', (el) => el.getBoundingClientRect().right);
    const actions = await page.$eval('#actions', (el) => el.getBoundingClientRect().right);

    expect(footer).toBe(await page.$eval('#wrap', (el) => el.getBoundingClientRect().right));
    expect(actions).toBe(footer);
    expect(await page.$eval('#actions', (el) => getComputedStyle(el).marginInlineStart)).not.toBe('0px');
  });

  it('pushes a box to the bottom with margin-block-start="auto"', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-box id="column" direction="column" style="height: 200px">
        <pds-box flex="none">Top</pds-box>
        <pds-box id="bottom" flex="none" margin-block-start="auto">Bottom</pds-box>
      </pds-box>
    `);

    const column = await page.$eval('#column', (el) => el.getBoundingClientRect().bottom);
    const bottom = await page.$eval('#bottom', (el) => el.getBoundingClientRect().bottom);

    expect(bottom).toBe(column);
  });

  it('sets container-type from the container prop', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-box id="inline" container="inline-size"></pds-box>
      <pds-box id="size" container="size" style="height: 40px"></pds-box>
      <pds-box id="unset"></pds-box>
    `);

    expect(await page.$eval('#inline', (el) => getComputedStyle(el).containerType)).toBe('inline-size');
    expect(await page.$eval('#size', (el) => getComputedStyle(el).containerType)).toBe('size');
    expect(await page.$eval('#unset', (el) => getComputedStyle(el).containerType)).toBe('normal');
  });

  it('keeps unwrapped text from widening a box with container="inline-size"', async () => {
    const text = 'A long single line of text that is much wider than the row it sits in';
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 300px">
        <pds-box fit>
          <pds-box id="loose"><span style="white-space: nowrap">${text}</span></pds-box>
        </pds-box>
        <pds-box fit>
          <pds-box id="contained" container="inline-size"><span style="white-space: nowrap">${text}</span></pds-box>
        </pds-box>
      </div>
    `);

    expect(await page.$eval('#loose', (el) => el.getBoundingClientRect().width)).toBeGreaterThan(300);
    expect(await page.$eval('#contained', (el) => el.getBoundingClientRect().width)).toBeLessThanOrEqual(300);
  });

  // A column parent stretches its children unless it sets `align-items`; then a child shrinks to its
  // content unless it has `fit`.
  it('fills a column parent that sets align-items only with fit', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 400px">
        <pds-box direction="column" align-items="start" fit>
          <pds-box id="loose" justify-content="space-between"><span>Delete</span><span>Save</span></pds-box>
          <pds-box id="fit" fit justify-content="space-between"><span>Delete</span><span>Save</span></pds-box>
        </pds-box>
      </div>
    `);

    expect(await page.$eval('#loose', (el) => el.getBoundingClientRect().width)).toBeLessThan(400);
    expect(await page.$eval('#fit', (el) => el.getBoundingClientRect().width)).toBe(400);
  });

  it('keeps margin auto and container after its classes are stripped', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-box class="consumer" margin-inline-start="auto" margin-block-end-md="auto" container="inline-size"></pds-box>
    `);

    await expectStylingSurvivesStrip(page, 'pds-box');
  });
});
