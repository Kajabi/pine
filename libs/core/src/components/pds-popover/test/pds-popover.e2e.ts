import { newE2EPage } from '@stencil/core/testing';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover></pds-popover>');

    const element = await page.find('pds-popover');
    expect(element).toHaveClass('hydrated');
  });

  it('should show the popover on trigger click', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover"></pds-popover>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger') as unknown as HTMLButtonElement;
    expect(triggerButton).toBeTruthy();

    const popoverContent = await page.find('pds-popover >>> div[popover]') as unknown as HTMLElement;
    expect(popoverContent).toBeTruthy();
    expect(popoverContent.classList.contains('pds-popover--active')).toBeFalsy();

    await triggerButton?.click();
    await page.waitForChanges();

    expect(popoverContent.classList.contains('pds-popover--active')).toBeTruthy();
  });

  it('should handle keyboard interactions', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover"></pds-popover>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    // Test Enter key
    await triggerButton.press('Enter');
    await page.waitForChanges();
    expect(await popoverContent.getAttribute('class')).toContain('pds-popover--active');

    // Test Escape key
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await popoverContent.getAttribute('class')).not.toContain('pds-popover--active');

    // Test Space key
    await triggerButton.press(' ');
    await page.waitForChanges();
    expect(await popoverContent.getAttribute('class')).toContain('pds-popover--active');
  });

  it('should respect manual mode', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover" popover-type="manual"></pds-popover>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getAttribute('class')).toContain('pds-popover--active');

    // Click outside should not close in manual mode
    await page.click('body');
    await page.waitForChanges();
    expect(await popoverContent.getAttribute('class')).toContain('pds-popover--active');
  });

  it('should handle show/hide methods', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover"></pds-popover>');

    const element = await page.find('pds-popover');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    await element.callMethod('show');
    await page.waitForChanges();
    expect(await popoverContent.getAttribute('class')).toContain('pds-popover--active');

    await element.callMethod('hide');
    await page.waitForChanges();
    expect(await popoverContent.getAttribute('class')).not.toContain('pds-popover--active');
  });
});
