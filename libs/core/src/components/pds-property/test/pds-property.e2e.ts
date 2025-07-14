import { newE2EPage } from '@stencil/core/testing';

describe('pds-property', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-property>Property text</pds-property>');

    const element = await page.find('pds-property');
    expect(element).toBeTruthy();
  });

      it('renders with icon and text', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-property icon="check-circle">Property text</pds-property>');

    const element = await page.find('pds-property');
    expect(element).toBeTruthy();

    const icon = await page.find('pds-property >>> pds-icon');
    expect(icon).toBeTruthy();
    const iconName = await icon.getProperty('icon');
    expect(iconName).toBe('check-circle');

    expect(element.textContent).toBe('Property text');
  });

    it('renders with slot content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-property icon="info-circle">
        <span>Slot content</span>
      </pds-property>
    `);

    const element = await page.find('pds-property');
    expect(element).toBeTruthy();

    const slotContent = await page.find('pds-property span');
    expect(slotContent.textContent).toBe('Slot content');
  });

  it('renders with default star icon when no icon specified', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-property>Property text without icon</pds-property>');

    const element = await page.find('pds-property');
    expect(element).toBeTruthy();

    const icon = await page.find('pds-property >>> pds-icon');
    expect(icon).toBeTruthy();
    const iconName = await icon.getProperty('icon');
    expect(iconName).toBe('star');

    expect(element.textContent).toBe('Property text without icon');
  });
});
