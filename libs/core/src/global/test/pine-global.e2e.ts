import { newE2EPage } from '@stencil/core/testing';

// Strings, not functions: see `host-strip.ts` for why page code is passed as a string.
const classesOf = (selector: string) => `Array.from(document.querySelector('${selector}').classList).sort()`;

describe('keepPineHydrated', () => {
  // None of these restore their own host, so only the global observer can bring `hydrated` back.
  // pds-radio-group is scoped, so it also needs its `sc-` classes.
  const components = [
    ['pds-button', '<pds-button class="consumer">Save</pds-button>'],
    ['pds-input', '<pds-input class="consumer" component-id="name" label="Name"></pds-input>'],
    ['pds-alert', '<pds-alert class="consumer" heading="Saved"></pds-alert>'],
    ['pds-accordion', '<pds-accordion class="consumer"><span slot="label">More</span>Body</pds-accordion>'],
    [
      'pds-radio-group',
      '<pds-radio-group class="consumer" name="size" label="Size"><pds-radio component-id="s" value="s" label="Small"></pds-radio></pds-radio-group>',
    ],
  ];

  it.each(components)('keeps %s visible after a DOM morph strips its classes', async (tag, markup) => {
    const page = await newE2EPage();
    await page.setContent(markup);
    // Stencil's own classes. Classes a component renders onto its host (`pds-alert`) are its own
    // restore's job, and none of these style anything.
    const stencilClasses = async () =>
      ((await page.evaluate(classesOf(tag))) as string[]).filter((name) => name === 'hydrated' || name.startsWith('sc-'));
    const before = await stencilClasses();
    expect(before).toContain('hydrated');

    await page.evaluate(`document.querySelector('${tag}').className = 'consumer'`);
    await page.waitForChanges();

    expect(await stencilClasses()).toEqual(before);
    expect(await page.evaluate(`getComputedStyle(document.querySelector('${tag}')).visibility`)).toBe('visible');
  });

  it("leaves a consumer's own classes removed", async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button class="consumer extra">Save</pds-button>');

    await page.evaluate(`document.querySelector('pds-button').classList.remove('extra')`);
    await page.waitForChanges();

    expect(await page.evaluate(classesOf('pds-button'))).toEqual(['consumer', 'hydrated']);
  });

  it('leaves elements other than Pine components alone', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button>Save</pds-button><div class="hydrated sc-pds-div"></div>');

    await page.evaluate(`document.querySelector('div').className = ''`);
    await page.waitForChanges();

    expect(await page.evaluate(classesOf('div'))).toEqual([]);
  });
});
