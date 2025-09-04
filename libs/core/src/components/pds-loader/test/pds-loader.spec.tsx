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

  it('exposes loader-svg part for color customization', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader variant="spinner"></pds-loader>`,
    });

    const svg = page.root?.shadowRoot?.querySelector('svg[part="loader-svg"]');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('part')).toBe('loader-svg');
  });

  it('does not expose loader-svg part for typing variant', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader variant="typing"></pds-loader>`,
    });

    const svg = page.root?.shadowRoot?.querySelector('svg[part="loader-svg"]');
    expect(svg).toBeNull();

    const typingContainer = page.root?.shadowRoot?.querySelector('.pds-loader--typing');
    expect(typingContainer).toBeTruthy();
  });

  it('renders spinner variant with correct HTML structure including parts', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader variant="spinner" is-loading="true"></pds-loader>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-loader aria-busy="" aria-live="polite" class="pds-loader" is-loading="true" size="md" variant="spinner">
        <mock:shadow-root>
          <div class="pds-loader--spinner">
            <svg fill="none" part="loader-svg" viewBox="0 0 200 200" style="height: 48px; width: 48px;">
              <defs>
                <linearGradient id="spinner-secondHalf">
                  <stop offset="0%" stop-color="currentColor" stop-opacity="0"></stop>
                  <stop offset="100%" stop-color="currentColor" stop-opacity="0.5"></stop>
                </linearGradient>
                <linearGradient id="spinner-firstHalf">
                  <stop offset="0%" stop-color="currentColor" stop-opacity="1"></stop>
                  <stop offset="100%" stop-color="currentColor" stop-opacity="0.5"></stop>
                </linearGradient>
              </defs>
              <g class="pds-loader__spinner-path">
                <path d="M 4 100 A 96 96 0 0 1 196 100" stroke="url(#spinner-secondHalf)"></path>
                <path d="M 196 100 A 96 96 0 0 1 4 100" stroke="url(#spinner-firstHalf)"></path>
                <path d="M 4 100 A 96 96 0 0 1 4 98" stroke="currentColor" stroke-linecap="round"></path>
              </g>
            </svg>
          </div>
          <div class="pds-loader--hidden pds-loader__label">
            <slot name="label">
              Loading...
            </slot>
          </div>
        </mock:shadow-root>
      </pds-loader>
    `);
  });
});
