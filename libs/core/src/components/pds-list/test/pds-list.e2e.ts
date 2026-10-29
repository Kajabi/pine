import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

const ROWS = `
  <pds-list-item href="/files/1" id="file-1">
    <pds-icon slot="leading" name="file" aria-hidden="true"></pds-icon>
    Onboarding worksheet
    <span slot="description">PDF · 1.2 MB</span>
    <pds-button slot="trailing" variant="tertiary" id="download">Download</pds-button>
  </pds-list-item>
  <pds-list-item href="/files/2" id="file-2">
    <pds-icon slot="leading" name="file" aria-hidden="true"></pds-icon>
    Pricing calculator
    <span slot="description">XLSX · 84 KB</span>
  </pds-list-item>
`;

describe('pds-list', () => {
  it('exposes a list of list items to assistive technology', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-list>${ROWS}</pds-list>`);

    const snapshot = await page.accessibility.snapshot({ interestingOnly: false });
    const list = findByRole(snapshot, 'list');
    expect(list).not.toBeNull();
    // A slot shows up as a `none` node, which assistive technology skips, so look through it.
    const items = itemsOf(list);
    expect(items.map((item) => item.role)).toEqual(['listitem', 'listitem']);
    expect(findByRole(items[0], 'link').name).toBe('Onboarding worksheet');
  });

  it('follows the item link from anywhere on the row', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-list>${ROWS}</pds-list>`);
    await page.$eval('pds-list-item', (item) => {
      const link = item.shadowRoot.querySelector('a');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        (window as unknown as { clicked: string }).clicked = 'link';
      });
    });

    // The leading icon sits outside the anchor; the stretched link still takes the click.
    const icon = await page.find('pds-list-item pds-icon');
    await icon.click();
    expect(await page.evaluate(() => (window as unknown as { clicked?: string }).clicked)).toBe('link');
  });

  it('keeps trailing controls clickable without following the link', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-list>${ROWS}</pds-list>`);
    await page.evaluate(() => {
      const item = document.querySelector('pds-list-item');
      item.shadowRoot.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        (window as unknown as { followed: boolean }).followed = true;
      });
      document.getElementById('download').addEventListener('click', () => {
        (window as unknown as { downloaded: boolean }).downloaded = true;
      });
    });

    const button = await page.find('#download');
    await button.click();
    const result = await page.evaluate(() => {
      const w = window as unknown as { followed?: boolean; downloaded?: boolean };
      return { followed: !!w.followed, downloaded: !!w.downloaded };
    });
    expect(result).toEqual({ followed: false, downloaded: true });
  });

  it('puts one tab stop on each linked row, then its trailing controls', async () => {
    const page = await newE2EPage();
    await page.setContent(`<button id="before">Before</button><pds-list>${ROWS}</pds-list>`);
    await page.focus('#before');

    const stops: string[] = [];
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Tab');
      stops.push(
        await page.evaluate(() => {
          // The focused control sits in a component's shadow root; name the stop by that component.
          let el: Element | null = document.activeElement;
          while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
          const root = el?.getRootNode();
          return root instanceof ShadowRoot ? root.host.id : (el?.id ?? '');
        }),
      );
    }
    expect(stops).toEqual(['file-1', 'download', 'file-2']);
  });

  it('applies compact padding and dividers from the list to its items', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-list compact dividers>${ROWS}</pds-list>`);

    const styles = await page.evaluate(() => {
      const [first, last] = Array.from(document.querySelectorAll('pds-list-item')).map((item) =>
        getComputedStyle(item.shadowRoot.querySelector('.pds-list-item')),
      );
      return {
        firstPadding: first.paddingTop,
        firstDivider: first.borderBottomStyle,
        lastDivider: last.borderBottomStyle,
      };
    });
    expect(styles.firstPadding).toBe('8px');
    expect(styles.firstDivider).toBe('solid');
    expect(styles.lastDivider).toBe('none');
  });

  it('has no axe violations with linked rows and trailing controls', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-list border dividers>${ROWS}</pds-list>`);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with plain rows', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-list>
        <pds-list-item>Finish the onboarding worksheet<span slot="description">Due Oct 31</span></pds-list-item>
        <pds-list-item>Book your first coaching call</pds-list-item>
      </pds-list>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function itemsOf(node: any): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (node.children || []).flatMap((child: any) => (child.role === 'none' ? itemsOf(child) : [child]));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findByRole(node: any, role: string): any {
  if (!node) return null;
  if (node.role === role) return node;
  for (const child of node.children || []) {
    const hit = findByRole(child, role);
    if (hit) return hit;
  }
  return null;
}
