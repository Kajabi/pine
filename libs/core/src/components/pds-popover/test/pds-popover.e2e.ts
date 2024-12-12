import { newE2EPage } from '@stencil/core/testing';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover></pds-popover>');

    const element = await page.find('pds-popover');
    expect(element).toHaveClass('hydrated');
  });

  it('should handle trigger click interactions', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" text="Show popover"></pds-popover>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');

    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).not.toContain('pds-popover--active');
  });

  it('should update position on scroll when active', async () => {
    const page = await newE2EPage();
    await page.setContent('<div style="height: 200vh"><pds-popover component-id="my-popover" text="Show popover"></pds-popover></div>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    await triggerButton.click();
    await page.waitForChanges();

    const initialTop = await popoverContent.getComputedStyle('top');

    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForChanges();

    const newTop = await popoverContent.getComputedStyle('top');
    expect(newTop).not.toBe(initialTop);
  });

  it('should respect manual mode', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover component-id="my-popover" popover-type="manual" text="Show popover"></pds-popover>');

    const triggerButton = await page.find('pds-popover >>> .pds-popover__trigger');
    const popoverContent = await page.find('pds-popover >>> div[popover]');

    await triggerButton.click();
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');

    // Click outside should not close in manual mode
    await page.mouse.click(0, 0);
    await page.waitForChanges();
    expect(await popoverContent.getProperty('className')).toContain('pds-popover--active');
  });
});
