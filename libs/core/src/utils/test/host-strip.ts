import type { E2EPage } from '@stencil/core/testing';

// Computed properties a host class, style or attribute tends to drive, for the host and everything
// it renders (its shadow tree, or its light DOM for a shadowless component).
const snapshotStyles = (page: E2EPage, selector: string) =>
  page.$eval(selector, (el) => {
    const nodes = [el, ...Array.from((el.shadowRoot ?? el).querySelectorAll('*'))];
    return nodes.map((node) => {
      const style = getComputedStyle(node);
      // No sizes: text width shifts as web fonts load, and inner elements can be mid-animation. The
      // class check below covers what a size would have caught.
      return [
        style.display, style.visibility, style.opacity, style.position, style.clip, style.overflow, style.flexDirection, style.flex, style.minHeight, style.gap,
        style.paddingTop, style.maxWidth, style.color, style.backgroundColor, style.fontWeight,
        style.borderTopStyle, style.borderTopColor, style.borderTopWidth,
        style.borderBottomStyle, style.borderBottomColor, style.borderBottomWidth,
        style.animationName, style.cursor,
      ].join(' | ');
    });
  });

/**
 * Strips the host's `class` (keeping a `consumer` class the markup must carry), its `style`, and any
 * `removeAttributes`, as a DOM morph does when the server's HTML lacks what the component wrote.
 * Expects every class and removed attribute to come back, and every computed style of the host and
 * what it renders to be unchanged.
 */
export const expectStylingSurvivesStrip = async (
  page: E2EPage,
  selector: string,
  { removeAttributes = [] }: { removeAttributes?: string[] } = {},
) => {
  const host = (names: string[]) =>
    page.$eval(
      selector,
      (el, attrs: string[]) => ({
        classes: Array.from(el.classList).sort(),
        attributes: attrs.map((name) => [name, el.getAttribute(name)]),
      }),
      names,
    );
  const before = { host: await host(removeAttributes), styles: await snapshotStyles(page, selector) };

  await page.$eval(
    selector,
    (el, attrs: string[]) => {
      el.setAttribute('class', 'consumer');
      el.removeAttribute('style');
      attrs.forEach((name) => el.removeAttribute(name));
    },
    removeAttributes,
  );
  await page.waitForChanges();

  expect(await host(removeAttributes)).toEqual(before.host);
  expect(await snapshotStyles(page, selector)).toEqual(before.styles);
};
