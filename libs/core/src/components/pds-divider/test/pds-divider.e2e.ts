import { newE2EPage } from '@stencil/core/testing';

describe('pds-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-divider />');

    const element = await page.find('pds-divider');
    expect(element).toHaveClass('hydrated');
  });

  it('renders vertically when prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-divider vertical="true" />');

    const element = await page.find('pds-divider');
    expect(element).toHaveClass('hydrated');

    const hr = element.shadowRoot.querySelector("hr");
    expect(hr).toHaveClass('pds-divider--vertical');
  });

  it('renders with offset applied when prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-divider offset="lg" />');

    const element = await page.find('pds-divider');
    expect(element).toHaveClass('hydrated');

    const hr = element.shadowRoot.querySelector("hr");
    expect(hr).toHaveClass('pds-divider--offset-lg');
  });
});
