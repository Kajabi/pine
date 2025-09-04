import { newE2EPage } from '@stencil/core/testing';

describe('pds-loader', () => {
  it('is not visible when isLoading prop is false', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-loader is-loading="false"></pds-loader>');

    const element = await page.find('pds-loader');
    expect(element).toHaveClass('pds-loader--hidden');
  });

  it('exposes loader-svg part for color customization', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <style>
        .custom-color::part(loader-svg) {
          color: rgb(0, 255, 255) !important;
        }
      </style>
      <pds-loader class="custom-color" variant="spinner" is-loading="true"></pds-loader>
    `);

    const loader = await page.find('pds-loader');
    expect(loader).toHaveClass('hydrated');

    await page.waitForChanges();

    // Test that the SVG part is accessible and can be styled
    const svgColor = await page.evaluate(() => {
      const loader = document.querySelector('pds-loader');
      const svg = loader?.shadowRoot?.querySelector('svg[part="loader-svg"]');
      return svg ? window.getComputedStyle(svg).color : null;
    });

    expect(svgColor).toBe('rgb(0, 255, 255)');
  });

  it('only exposes loader-svg part for spinner variant', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-loader variant="spinner" is-loading="true"></pds-loader>
      <pds-loader variant="typing" is-loading="true"></pds-loader>
    `);

    await page.waitForChanges();

    const hasSpinnerPart = await page.evaluate(() => {
      const spinnerLoader = document.querySelectorAll('pds-loader')[0];
      const svg = spinnerLoader?.shadowRoot?.querySelector('svg[part="loader-svg"]');
      return !!svg;
    });

    const hasTypingPart = await page.evaluate(() => {
      const typingLoader = document.querySelectorAll('pds-loader')[1];
      const svg = typingLoader?.shadowRoot?.querySelector('svg[part="loader-svg"]');
      return !!svg;
    });

    expect(hasSpinnerPart).toBe(true);
    expect(hasTypingPart).toBe(false);
  });

  it('loader-svg part can be styled with different colors', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <style>
        .red-loader::part(loader-svg) {
          color: rgb(255, 0, 0) !important;
        }
        .blue-loader::part(loader-svg) {
          color: rgb(0, 0, 255) !important;
        }
        .green-loader::part(loader-svg) {
          color: rgb(0, 128, 0) !important;
        }
      </style>
      <pds-loader class="red-loader" variant="spinner" is-loading="true"></pds-loader>
      <pds-loader class="blue-loader" variant="spinner" is-loading="true"></pds-loader>
      <pds-loader class="green-loader" variant="spinner" is-loading="true"></pds-loader>
    `);

    await page.waitForChanges();

    const colors = await page.evaluate(() => {
      const loaders = document.querySelectorAll('pds-loader');
      const colors: (string | null)[] = [];

      loaders.forEach(loader => {
        const svg = loader.shadowRoot?.querySelector('svg[part="loader-svg"]');
        colors.push(svg ? window.getComputedStyle(svg).color : null);
      });

      return colors;
    });

    expect(colors[0]).toBe('rgb(255, 0, 0)'); // red
    expect(colors[1]).toBe('rgb(0, 0, 255)'); // blue
    expect(colors[2]).toBe('rgb(0, 128, 0)'); // green
  });
});
