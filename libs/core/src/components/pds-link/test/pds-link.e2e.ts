import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link></pds-link>');
    const element = await page.find('pds-link');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the href', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link href="#some-bookmark-link"></pds-link>');
    const component = await page.find('pds-link');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-link >>> a');
    expect(element.textContent).toEqual(`#some-bookmark-link`);

    component.setProperty('href', '#my-new-bookmark');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`#my-new-bookmark`);
  });

  it('renders the slot when used', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link href="#some-bookmark-link">This is slot content</pds-link>');
    const component = await page.find('pds-link');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-link');
    expect(element.textContent).toEqual(`This is slot content`);
  });
});

describe('pds-link whole-row click area', () => {
  // A consumer makes a whole row clickable by stretching the link part's ::after over the row.
  // That only works while the anchor isn't itself a containing block, so the focused anchor
  // keeps its ring on top with `isolation` instead of `position`.
  const setUpRow = async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <button id="before">before</button>
      <div class="row" style="position: relative; display: flex; gap: 12px; align-items: center; padding: 24px; width: 480px;">
        <span>leading</span>
        <pds-link href="#row-target">The title</pds-link>
        <button id="trailing" style="margin-left: auto; position: relative; z-index: 1;">trailing</button>
      </div>
    `);
    await page.addStyleTag({
      content: '.row pds-link::part(link)::after { content: ""; position: absolute; inset: 0; }',
    });
    await page.waitForChanges();
    return page;
  };

  const focusLinkFromKeyboard = async (page: Awaited<ReturnType<typeof setUpRow>>) => {
    // Tab from the button, so the link gets :focus-visible rather than a click's focus.
    await page.focus('#before');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    expect(await page.evaluate(() => document.querySelector('pds-link').shadowRoot.activeElement?.tagName)).toBe('A');
  };

  const measure = (page: Awaited<ReturnType<typeof setUpRow>>) =>
    page.evaluate(() => {
      const anchor = document.querySelector('pds-link').shadowRoot.querySelector('a');
      const after = getComputedStyle(anchor, '::after');
      const row = document.querySelector('.row').getBoundingClientRect();
      return {
        afterWidth: Math.round(parseFloat(after.width) || 0),
        rowWidth: Math.round(row.width),
        anchorPosition: getComputedStyle(anchor).position,
        anchorIsolation: getComputedStyle(anchor).isolation,
      };
    });

  it('keeps a stretched click area over the row when the link has keyboard focus', async () => {
    const page = await setUpRow();

    const resting = await measure(page);
    expect(resting.afterWidth).toBeGreaterThan(resting.rowWidth - 10);

    await focusLinkFromKeyboard(page);

    const focused = await measure(page);
    expect(focused.anchorPosition).toBe('static');
    expect(focused.afterWidth).toBeGreaterThan(focused.rowWidth - 10);
  });

  it('keeps the focus ring in its own stacking context, so it paints above its neighbours', async () => {
    const page = await setUpRow();

    await focusLinkFromKeyboard(page);

    expect((await measure(page)).anchorIsolation).toBe('isolate');
  });

  it('leaves a raised trailing control clickable while the link has keyboard focus', async () => {
    const page = await setUpRow();

    await focusLinkFromKeyboard(page);

    const hit = await page.evaluate(() => {
      const box = document.querySelector('#trailing').getBoundingClientRect();
      return document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)?.id;
    });
    expect(hit).toBe('trailing');
  });
});

describe('pds-link accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-link href="#section">Read more</pds-link>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-link external label', () => {
  const linkNames = (node) => [node.role === 'link' ? node.name : null, ...(node.children ?? []).flatMap(linkNames)].filter(Boolean);

  it('tells screen reader users an external link opens in a new tab', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-link href="https://example.com" external>Docs</pds-link>');

    const tree = await page.accessibility.snapshot();
    expect(linkNames(tree)).toEqual(['Docs (opens in a new tab)']);
  });

  it('has no axe violations on an external link', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-link href="https://example.com" external>Docs</pds-link>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
