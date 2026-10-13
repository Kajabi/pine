import { newSpecPage } from '@stencil/core/testing';
import { PdsSkeleton } from '../pds-skeleton';

describe('pds-skeleton', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsSkeleton],
      html: `<pds-skeleton></pds-skeleton>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('defaults to the text variant and reflects it', async () => {
    const page = await newSpecPage({
      components: [PdsSkeleton],
      html: `<pds-skeleton></pds-skeleton>`,
    });
    expect(page.root).toEqualAttribute('variant', 'text');
  });

  it('reflects a variant when set', async () => {
    const page = await newSpecPage({
      components: [PdsSkeleton],
      html: `<pds-skeleton variant="circle"></pds-skeleton>`,
    });
    expect(page.root).toEqualAttribute('variant', 'circle');
  });

  it('is always hidden from assistive tech', async () => {
    const page = await newSpecPage({
      components: [PdsSkeleton],
      html: `<pds-skeleton></pds-skeleton>`,
    });
    expect(page.root).toEqualAttribute('aria-hidden', 'true');
  });

  it('exposes the sheen part so it can be restyled or hidden', async () => {
    const page = await newSpecPage({
      components: [PdsSkeleton],
      html: `<pds-skeleton></pds-skeleton>`,
    });
    const sheen = page.root?.shadowRoot?.querySelector('span[part="sheen"]');

    expect(sheen).toBeTruthy();
  });

  it('maps the width prop onto a custom property', async () => {
    const page = await newSpecPage({
      components: [PdsSkeleton],
      html: `<pds-skeleton width="240px"></pds-skeleton>`,
    });

    expect(page.root?.style.getPropertyValue('--sizing-skeleton-width')).toBe('240px');
  });

  it('maps the height prop onto a custom property', async () => {
    const page = await newSpecPage({
      components: [PdsSkeleton],
      html: `<pds-skeleton height="12px"></pds-skeleton>`,
    });

    expect(page.root?.style.getPropertyValue('--sizing-skeleton-height')).toBe('12px');
  });

  it('sets no sizing custom properties when width and height are unset, so the variant decides', async () => {
    const page = await newSpecPage({
      components: [PdsSkeleton],
      html: `<pds-skeleton variant="circle"></pds-skeleton>`,
    });

    expect(page.root?.style.getPropertyValue('--sizing-skeleton-width')).toBe('');
    expect(page.root?.style.getPropertyValue('--sizing-skeleton-height')).toBe('');
  });
});
