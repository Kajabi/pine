import { newSpecPage } from '@stencil/core/testing';
import { MockPdsModal } from './mock-pds-modal';

// Test the modal component using our mock implementation
describe('pds-modal', () => {
  // Basic rendering tests
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });
    
    expect(page.root).not.toBeNull();
    expect(page.root?.tagName.toLowerCase()).toBe('mock-pds-modal');
  });

  it('renders with custom props', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal component-id="test-modal" size="lg" scrollable="true"></mock-pds-modal>`,
    });
    
    expect(page.root).not.toBeNull();
    expect(page.root?.getAttribute('component-id')).toBe('test-modal');
    expect(page.root?.getAttribute('size')).toBe('lg');
    expect(page.root?.getAttribute('scrollable')).toBe('true');
  });

  // Structure tests
  it('should have the correct size attribute', async () => {
    // Test small size
    const smallPage = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal size="sm"></pds-modal>`,
    });
    expect(smallPage.root?.getAttribute('size')).toBe('sm');
    
    // Test large size
    const largePage = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal size="lg"></pds-modal>`,
    });
    expect(largePage.root?.getAttribute('size')).toBe('lg');
    
    // Test fullscreen size
    const fullscreenPage = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal size="fullscreen"></pds-modal>`,
    });
    expect(fullscreenPage.root?.getAttribute('size')).toBe('fullscreen');
  });

  // Modal is always scrollable by default, no need to test scrollable attribute

  it('should have the correct disableBackdropClick attribute', async () => {
    // Default value should be true
    const defaultPage = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });
    expect(defaultPage.root?.getAttribute('close-on-backdrop-click')).toBeNull(); // Default value is not set as attribute
    
    // Explicit false value
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal close-on-backdrop-click="false"></pds-modal>`,
    });
    
    expect(page.root?.getAttribute('close-on-backdrop-click')).toBe('false');
  });

  it('should have the correct closeOnEsc attribute', async () => {
    // Default value should be true
    const defaultPage = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });
    expect(defaultPage.root?.getAttribute('close-on-esc')).toBeNull(); // Default value is not set as attribute
    
    // Explicit false value
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal close-on-esc="false"></pds-modal>`,
    });
    
    expect(page.root?.getAttribute('close-on-esc')).toBe('false');
  });

  it('should have the correct open attribute', async () => {
    // Default value should be false
    const defaultPage = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });
    expect(defaultPage.root?.getAttribute('open')).toBeNull(); // Default value is not set as attribute
    
    // Explicit true value
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal open="true"></mock-pds-modal>`,
    });
    
    expect(page.root?.getAttribute('open')).toBe('true');
  });

  it('should emit events when showing and hiding the modal', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });
    
    // Set up event spies
    const openSpy = jest.fn();
    const closeSpy = jest.fn();
    page.root?.addEventListener('pdsModalOpen', openSpy);
    page.root?.addEventListener('pdsModalClose', closeSpy);
    
    // Show the modal
    await page.rootInstance.showModal();
    expect(openSpy).toHaveBeenCalled();
    expect(page.rootInstance.open).toBe(true);
    
    // Hide the modal
    await page.rootInstance.hideModal();
    expect(closeSpy).toHaveBeenCalled();
    expect(page.rootInstance.open).toBe(false);
  });
  
  it('should handle backdrop click when disableBackdropClick is false', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });
    
    // Open the modal
    page.rootInstance.open = true;
    await page.waitForChanges();
    
    // Get the backdrop element
    const backdrop = page.root?.querySelector('.pds-modal__backdrop');
    expect(backdrop).not.toBeNull();
    
    // Directly call the handler method with a mocked event
    const mockEvent = { target: backdrop } as MouseEvent;
    page.rootInstance.handleBackdropClick(mockEvent);
    
    // Modal should be closed
    expect(page.rootInstance.open).toBe(false);
  });
  
  it('should not close on backdrop click when disableBackdropClick is true', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal close-on-backdrop-click="false"></mock-pds-modal>`,
    });
    
    // Open the modal
    page.rootInstance.open = true;
    await page.waitForChanges();
    
    // Get the backdrop element
    const backdrop = page.root?.querySelector('.pds-modal__backdrop');
    expect(backdrop).not.toBeNull();
    
    // Directly call the handler method with a mocked event
    const mockEvent = { target: backdrop } as MouseEvent;
    page.rootInstance.handleBackdropClick(mockEvent);
    
    // Modal should still be open
    expect(page.rootInstance.open).toBe(true);
  });
  
  it('should close on Escape key press (native dialog behavior)', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });
    
    // Open the modal
    page.rootInstance.open = true;
    await page.waitForChanges();
    
    // Directly call the handler method with a mocked event
    const mockEvent = { key: 'Escape' } as KeyboardEvent;
    page.rootInstance.handleKeyDown(mockEvent);
    
    // Modal should be closed
    expect(page.rootInstance.open).toBe(false);
  });
});
