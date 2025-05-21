import { newE2EPage } from '@stencil/core/testing';

describe('pds-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-modal></pds-modal>');

    const element = await page.find('pds-modal');
    expect(element).toHaveClass('hydrated');
  });

  it('should open and close the modal', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-modal component-id="test-modal">
        <div slot="header">Modal Header</div>
        <div>Modal Content</div>
        <div slot="footer">Modal Footer</div>
      </pds-modal>
    `);

    const modal = await page.find('pds-modal');
    
    // Initially modal should be closed
    let isOpen = await modal.getProperty('open');
    expect(isOpen).toBe(false);

    // Open the modal
    await modal.callMethod('showModal');
    await page.waitForChanges();

    // Check if modal is open
    isOpen = await modal.getProperty('open');
    expect(isOpen).toBe(true);

    // Close the modal programmatically
    await modal.callMethod('hideModal');
    await page.waitForChanges();

    // Check if modal is closed
    isOpen = await modal.getProperty('open');
    expect(isOpen).toBe(false);
  });

  it('should emit events when opening and closing', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-modal component-id="test-modal">
        <div slot="header">Modal Header</div>
        <div>Modal Content</div>
        <div slot="footer">Modal Footer</div>
      </pds-modal>
    `);

    const modal = await page.find('pds-modal');
    
    // Listen for events
    const openSpy = await page.spyOnEvent('pdsModalOpen');
    const closeSpy = await page.spyOnEvent('pdsModalClose');

    // Open the modal
    await modal.callMethod('showModal');
    await page.waitForChanges();
    expect(openSpy).toHaveReceivedEvent();

    // Close the modal
    await modal.callMethod('hideModal');
    await page.waitForChanges();
    expect(closeSpy).toHaveReceivedEvent();
  });
  
  it('should handle different size props', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-modal size="lg"></pds-modal>`);

    const modal = await page.find('pds-modal');
    expect(await modal.getProperty('size')).toBe('lg');
    
    // Update the size property
    await modal.setProperty('size', 'sm');
    await page.waitForChanges();
    expect(await modal.getProperty('size')).toBe('sm');
  });
  
  it('should handle scrollable prop', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-modal scrollable="true"></pds-modal>`);

    const modal = await page.find('pds-modal');
    expect(await modal.getProperty('scrollable')).toBe(true);
  });
  
  it('should handle closeOnBackdropClick prop', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-modal close-on-backdrop-click="false"></pds-modal>`);

    const modal = await page.find('pds-modal');
    expect(await modal.getProperty('closeOnBackdropClick')).toBe(false);
  });
  
  it('should handle closeOnEsc prop', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-modal close-on-esc="false"></pds-modal>`);

    const modal = await page.find('pds-modal');
    expect(await modal.getProperty('closeOnEsc')).toBe(false);
  });
});
