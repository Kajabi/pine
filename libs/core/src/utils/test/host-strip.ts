import type { E2EPage } from '@stencil/core/testing';

// Every computed property a host class or style tends to drive, for the host and everything it renders.
const snapshotStyles = (page: E2EPage, selector: string) =>
  page.$eval(selector, (el) => {
    const nodes = [el, ...Array.from((el.shadowRoot ?? el).querySelectorAll('*'))];
    return nodes.map((node) => {
      const style = getComputedStyle(node);
      return [
        style.display, style.visibility, style.opacity, style.color, style.backgroundColor,
        style.borderTopStyle, style.borderTopColor, style.borderTopWidth, style.gap, style.paddingTop,
        style.maxWidth, style.fontWeight, style.animationName, style.cursor,
      ].join(' | ');
    });
  });

/**
 * Strips the host's `class` (keeping a `consumer` class the markup must carry) and `style`, as a
 * Turbo morph does when the server's HTML lacks what the component wrote, and expects every computed
 * style of the host and what it renders to be unchanged.
 */
export const expectStylingSurvivesStrip = async (page: E2EPage, selector: string) => {
  const before = await snapshotStyles(page, selector);

  await page.$eval(selector, (el) => {
    el.setAttribute('class', 'consumer');
    el.removeAttribute('style');
  });
  await page.waitForChanges();

  expect(await snapshotStyles(page, selector)).toEqual(before);
  expect(await page.$eval(selector, (el) => el.classList.contains('consumer'))).toBe(true);
};
