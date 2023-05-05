import { newE2EPage } from '@stencil/core/testing';

describe('sage-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-divider />');

    const element = await page.find('sage-divider');
    expect(element).toHaveClass('hydrated');
  });

  it('renders vertically when prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-divider vertical="true" />');

    const element = await page.find('sage-divider');
    expect(element).toHaveClass('hydrated');

    const hr = element.shadowRoot.querySelector("hr");
    expect(hr).toHaveClass('sage-divider--vertical');
  });

  it('renders with offset applied when prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-divider offset="lg" />');

    const element = await page.find('sage-divider');
    expect(element).toHaveClass('hydrated');

    const hr = element.shadowRoot.querySelector("hr");
    expect(hr).toHaveClass('sage-divider--offset-lg');
  });
});
