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

    // console.log('triggerButton', triggerButton.innerHTML);
    // console.log('popoverContent', popoverContent);
    await triggerButton?.click();
    await page.waitForChanges();

    expect(popoverContent.classList.contains('pds-popover--active')).toBeTruthy();
  });
});
