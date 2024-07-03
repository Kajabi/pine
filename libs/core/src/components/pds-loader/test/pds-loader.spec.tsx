import { newSpecPage } from '@stencil/core/testing';
import { PdsLoader } from '../pds-loader';

describe('pds-loader', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader></pds-loader>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('renders the typing variant when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader variant="typing"></pds-loader>`,
    });
    expect(page.root).toEqualAttribute('variant', 'typing');
  });

  it('renders with a custom size when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader size="60px"></pds-loader>`,
    });
    const svg = page.root?.shadowRoot?.querySelector('svg');

    expect(svg).toEqualAttribute('style', 'height: 60px; width: 60px;');
  });

  it('renders with a preset size when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader size="lg"></pds-loader>`,
    });
    const svg = page.root?.shadowRoot?.querySelector('svg');

    expect(svg).toEqualAttribute('style', 'height: 64px; width: 64px;');
  });

  it('shows label when show-label prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader show-label="true"></pds-loader>`,
    });
    const label = page.root?.shadowRoot?.querySelector('.pds-loader__label');

    expect(label).not.toHaveClass('pds-loader--hidden');
  });
});
