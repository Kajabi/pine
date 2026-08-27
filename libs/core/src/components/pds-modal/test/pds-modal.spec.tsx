import { newSpecPage } from '@stencil/core/testing';
import { MockPdsModal } from './mock-pds-modal';
import { PdsModal } from '../pds-modal';

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

  it('should have the correct backdropDismiss attribute', async () => {
    // Default value should be true
    const defaultPage = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });
    expect(defaultPage.root?.getAttribute('backdrop-dismiss')).toBeNull(); // Default value is not set as attribute

    // Explicit false value
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal backdrop-dismiss="false"></pds-modal>`,
    });

    expect(page.root?.getAttribute('backdrop-dismiss')).toBe('false');
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

  it('should handle backdrop click when backdropDismiss is true', async () => {
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

  it('should not close on backdrop click when backdropDismiss is false', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal backdrop-dismiss="false"></mock-pds-modal>`,
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

  it('should close on Escape key press when backdropDismiss is true (default)', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal></mock-pds-modal>`,
    });

    // Open the modal
    page.rootInstance.open = true;
    await page.waitForChanges();

    // Directly call the handler method with a mocked event
    const mockEvent = { key: 'Escape', preventDefault: jest.fn() } as unknown as KeyboardEvent;
    page.rootInstance.handleKeyDown(mockEvent);

    // Should prevent default browser behavior
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    // Modal should be closed
    expect(page.rootInstance.open).toBe(false);
  });

  it('should not close on Escape key press when backdropDismiss is false', async () => {
    const page = await newSpecPage({
      components: [MockPdsModal],
      html: `<mock-pds-modal backdrop-dismiss="false"></mock-pds-modal>`,
    });

    // Open the modal
    page.rootInstance.open = true;
    await page.waitForChanges();

    // Directly call the handler method with a mocked event
    const mockEvent = { key: 'Escape', preventDefault: jest.fn() } as unknown as KeyboardEvent;
    page.rootInstance.handleKeyDown(mockEvent);

    // Should still prevent default browser behavior even when not closing
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    // Modal should still be open
    expect(page.rootInstance.open).toBe(true);
  });

  // disableTopLayer — exercises the real component (the mock does not touch the
  // <dialog> API). modalRef is stubbed so show()/showModal() are observable
  // without a real dialog element.
  describe('disableTopLayer', () => {
    // showModal() schedules a post-open setTimeout that focuses inside modalRef.
    // Stub the dialog + focus helpers so that deferred callback is inert and
    // cannot throw into a later test if it fires after this one completes.
    const stubDialog = (instance: PdsModal) => {
      const show = jest.fn();
      const showModal = jest.fn();
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (instance as any).modalRef = { show, showModal, close: jest.fn(), querySelectorAll: () => [] };
      (instance as any).updateFocusableElements = jest.fn();
      (instance as any).setInitialFocus = jest.fn();
      /* eslint-enable @typescript-eslint/no-explicit-any */
      return { show, showModal };
    };

    it('opens with showModal() (top layer) by default', async () => {
      const page = await newSpecPage({
        components: [PdsModal],
        html: `<pds-modal></pds-modal>`,
      });
      const { show, showModal } = stubDialog(page.rootInstance);

      await page.rootInstance.showModal();

      expect(showModal).toHaveBeenCalled();
      expect(show).not.toHaveBeenCalled();
    });

    it('opens with show() (non-modal) when disableTopLayer is true', async () => {
      const page = await newSpecPage({
        components: [PdsModal],
        html: `<pds-modal disable-top-layer="true"></pds-modal>`,
      });
      const { show, showModal } = stubDialog(page.rootInstance);

      await page.rootInstance.showModal();

      expect(show).toHaveBeenCalled();
      expect(showModal).not.toHaveBeenCalled();
      expect(page.rootInstance.open).toBe(true);
    });

    it('reflects the mode on aria-modal', async () => {
      const topLayer = await newSpecPage({
        components: [PdsModal],
        html: `<pds-modal></pds-modal>`,
      });
      expect(topLayer.root?.querySelector('dialog')?.getAttribute('aria-modal')).toBe('true');

      const nonModal = await newSpecPage({
        components: [PdsModal],
        html: `<pds-modal disable-top-layer="true"></pds-modal>`,
      });
      expect(nonModal.root?.querySelector('dialog')?.getAttribute('aria-modal')).toBe('false');
    });

    // The Escape-ownership behavior (leave Escape to an overlay that holds focus,
    // close otherwise) depends on document.activeElement and dialog.close(), which
    // the spec mock-doc environment does not implement — it is covered in the e2e
    // suite where a real browser exercises focus and key events.
  });
});
