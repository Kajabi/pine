import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-skeleton', () => {
  it('hydrates', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-skeleton></pds-skeleton>');

    const element = await page.find('pds-skeleton');
    expect(element).toHaveClass('hydrated');
  });

  it('paints a fill even though nothing is slotted into it', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-skeleton width="200px"></pds-skeleton>');
    await page.waitForChanges();

    const background = await page.evaluate(() => {
      const el = document.querySelector('pds-skeleton') as HTMLElement;
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(background).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('honors explicit width and height over the variant defaults', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-skeleton width="200px" height="12px"></pds-skeleton>');
    await page.waitForChanges();

    const box = await page.evaluate(() => {
      const el = document.querySelector('pds-skeleton') as HTMLElement;
      const rect = el.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    });

    expect(box.width).toBe(200);
    expect(box.height).toBe(12);
  });

  it('renders the circle variant as a square so the full border-radius reads as a circle', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-skeleton variant="circle"></pds-skeleton>');
    await page.waitForChanges();

    const box = await page.evaluate(() => {
      const el = document.querySelector('pds-skeleton') as HTMLElement;
      const rect = el.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    });

    expect(box.width).toBe(box.height);
    expect(box.width).toBeGreaterThan(0);
  });

  it('does not stretch the text variant to the viewport height', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-skeleton></pds-skeleton>');
    await page.waitForChanges();

    const height = await page.evaluate(() => {
      const el = document.querySelector('pds-skeleton') as HTMLElement;
      return Math.round(el.getBoundingClientRect().height);
    });

    expect(height).toBeGreaterThan(0);
    expect(height).toBeLessThanOrEqual(24);
  });

  it('keeps the fill visible when the sheen is removed', async () => {
    // Mirrors what `prefers-reduced-motion: reduce` does. The fill lives on the host
    // rather than in the keyframe, so hiding the sheen must not blank the placeholder.
    const page = await newE2EPage();
    await page.setContent(`
      <style>
        pds-skeleton::part(sheen) { display: none; }
      </style>
      <pds-skeleton width="200px"></pds-skeleton>
    `);
    await page.waitForChanges();

    const result = await page.evaluate(() => {
      const el = document.querySelector('pds-skeleton') as HTMLElement;
      const sheen = el.shadowRoot?.querySelector('span[part="sheen"]') as HTMLElement;
      return {
        background: window.getComputedStyle(el).backgroundColor,
        sheenDisplay: sheen ? window.getComputedStyle(sheen).display : null,
      };
    });

    expect(result.sheenDisplay).toBe('none');
    expect(result.background).not.toBe('rgba(0, 0, 0, 0)');
  });
});

describe('pds-skeleton accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-skeleton width="200px"></pds-skeleton>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations inside a status region', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div role="status" aria-label="Loading results">
        <pds-skeleton width="200px"></pds-skeleton>
        <pds-skeleton width="140px"></pds-skeleton>
      </div>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
