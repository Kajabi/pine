import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover component-id="popover-1"></pds-popover>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-popover component-id="popover-1" id="popover-1" placement="right">
        <mock:shadow-root>
          <span class="pds-popover__trigger-wrapper">
            <slot name="trigger"></slot>
          </span>
          <div class="pds-popover__content-slot-wrapper">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </pds-popover>
    `);
  });

  it('should create portal on componentDidLoad', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover component-id="popover-1"></pds-popover>`,
    });

    expect((page.rootInstance as any).portalEl).toBeTruthy();
    expect((page.rootInstance as any).portalEl.id).toBe('popover-1-portal');
  });

  it('should handle positioning for all placements', async () => {
    const mockTriggerRect = {
      top: 100,
      right: 200,
      bottom: 150,
      left: 100,
      width: 100,
      height: 50
    };

    const mockPopoverRect = {
      width: 200,
      height: 100
    };

    const OFFSET = 8;
    const placements = {
      'top': {
        top: mockTriggerRect.top - mockPopoverRect.height - OFFSET,
        left: mockTriggerRect.left + (mockTriggerRect.width - mockPopoverRect.width) / 2
      },
      'top-start': {
        top: mockTriggerRect.top - mockPopoverRect.height - OFFSET,
        left: mockTriggerRect.left
      },
      'top-end': {
        top: mockTriggerRect.top - mockPopoverRect.height - OFFSET,
        left: mockTriggerRect.right - mockPopoverRect.width
      },
      'right': {
        top: mockTriggerRect.top + (mockTriggerRect.height - mockPopoverRect.height) / 2,
        left: mockTriggerRect.right + OFFSET
      },
      'right-start': {
        top: mockTriggerRect.top,
        left: mockTriggerRect.right + OFFSET
      },
      'right-end': {
        top: mockTriggerRect.bottom - mockPopoverRect.height,
        left: mockTriggerRect.right + OFFSET
      },
      'bottom': {
        top: mockTriggerRect.bottom + OFFSET,
        left: mockTriggerRect.left + (mockTriggerRect.width - mockPopoverRect.width) / 2
      },
      'bottom-start': {
        top: mockTriggerRect.bottom + OFFSET,
        left: mockTriggerRect.left
      },
      'bottom-end': {
        top: mockTriggerRect.bottom + OFFSET,
        left: mockTriggerRect.right - mockPopoverRect.width
      },
      'left': {
        top: mockTriggerRect.top + (mockTriggerRect.height - mockPopoverRect.height) / 2,
        left: mockTriggerRect.left - mockPopoverRect.width - OFFSET
      },
      'left-start': {
        top: mockTriggerRect.top,
        left: mockTriggerRect.left - mockPopoverRect.width - OFFSET
      },
      'left-end': {
        top: mockTriggerRect.bottom - mockPopoverRect.height,
        left: mockTriggerRect.left - mockPopoverRect.width - OFFSET
      }
    };

    // Test each placement separately to avoid prop immutability issues
    for (const [placement, expected] of Object.entries(placements)) {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `<pds-popover component-id="my-popover" placement="${placement}"></pds-popover>`
      });

      // Mock trigger element
      const mockTriggerEl = { getBoundingClientRect: () => mockTriggerRect } as HTMLElement;
      (page.rootInstance as any).triggerEl = mockTriggerEl;

      // Mock portal element
      const portalEl = (page.rootInstance as any).portalEl as HTMLElement;
      Object.defineProperty(portalEl, 'getBoundingClientRect', {
        value: () => mockPopoverRect
      });

      // Reset positioning guard
      (page.rootInstance as any).isRepositioning = false;
      (page.rootInstance as any).handlePopoverPositioning();

      // Wait for the positioning timeout to complete (16ms guard reset)
      await new Promise(resolve => setTimeout(resolve, 20));
      await page.waitForChanges();

      expect(portalEl.style.top).toBe(`${expected.top}px`);
      expect(portalEl.style.left).toBe(`${expected.left}px`);
    }
  });

  it('should emit pdsPopoverOpen event when show() is called', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="test-popover" popover-type="auto"></pds-popover>'
    });

    const openEventSpy = jest.fn();
    page.root?.addEventListener('pdsPopoverOpen', openEventSpy);

    // Mock trigger element for positioning
    (page.rootInstance as any).triggerEl = {
      getBoundingClientRect: () => ({ top: 100, left: 100, width: 50, height: 30, right: 150, bottom: 130 }),
      setAttribute: jest.fn(),
      focus: jest.fn()
    };

    await page.rootInstance.show();
    await page.waitForChanges();

    expect(openEventSpy).toHaveBeenCalled();
    expect(page.rootInstance.active).toBe(true);
  });

  it('should emit pdsPopoverClose event when hide() is called', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="test-popover" popover-type="auto"></pds-popover>'
    });

    const closeEventSpy = jest.fn();
    page.root?.addEventListener('pdsPopoverClose', closeEventSpy);

    // Set active first
    page.rootInstance.active = true;

    await page.rootInstance.hide();
    await page.waitForChanges();

    expect(closeEventSpy).toHaveBeenCalled();
    expect(page.rootInstance.active).toBe(false);
  });

  it('should handle different popoverTargetAction values', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" popover-target-action="toggle"></pds-popover>'
    });

    expect(page.rootInstance.popoverTargetAction).toBe('toggle');
  });

  it('should handle different popoverType values', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" popover-type="manual"></pds-popover>'
    });

    expect(page.rootInstance.popoverType).toBe('manual');
  });

  describe('Trigger Slot', () => {
    it('should render trigger slot wrapper', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="popover-1"></pds-popover>',
      });

      const triggerWrapper = page.root?.shadowRoot?.querySelector('.pds-popover__trigger-wrapper');
      expect(triggerWrapper).toBeTruthy();
    });

    it('should initialize trigger in componentDidLoad as fallback', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `<pds-popover component-id="test-popover"></pds-popover>`
      });

      // Create a mock button element
      const mockButton = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        setAttribute: jest.fn(),
        focus: jest.fn()
      };

      // Mock the shadowRoot and slot to return our mock button
      const mockSlot = {
        assignedElements: jest.fn().mockReturnValue([mockButton])
      };
      const mockShadowRoot = {
        querySelector: jest.fn().mockReturnValue(mockSlot)
      };

      Object.defineProperty(page.root, 'shadowRoot', {
        value: mockShadowRoot,
        configurable: true,
        writable: true
      });

      // Clear triggerEl to simulate scenario where slot change didn't fire
      (page.rootInstance as any).triggerEl = null;

      // Manually call componentDidLoad
      await (page.rootInstance as any).componentDidLoad();

      // Verify trigger was initialized from slot as fallback
      expect((page.rootInstance as any).triggerEl).toBe(mockButton);
      expect(mockButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should render with slotted trigger', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `
          <pds-popover component-id="popover-1">
            <button slot="trigger">Custom Button</button>
            <p>Content</p>
          </pds-popover>
        `,
      });

      const slottedButton = page.root?.querySelector('button[slot="trigger"]');
      expect(slottedButton).toBeTruthy();
      expect(slottedButton?.textContent).toBe('Custom Button');
    });

    it('should handle slot change with assigned elements', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `
          <pds-popover component-id="test-popover" popover-target-action="toggle">
            <button slot="trigger" id="custom-btn">Custom</button>
            <p>Content</p>
          </pds-popover>
        `,
      });

      const slot = page.root?.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement;
      const button = page.root?.querySelector('#custom-btn') as HTMLElement;

      // Mock addEventListener to verify it's called
      const addEventListenerSpy = jest.spyOn(button, 'addEventListener');

      // Mock assignedElements
      Object.defineProperty(slot, 'assignedElements', {
        value: () => [button],
        writable: true
      });

      // Trigger slot change
      const slotChangeEvent = new Event('slotchange');
      Object.defineProperty(slotChangeEvent, 'target', { value: slot, enumerable: true });
      (page.rootInstance as any).handleTriggerSlotChange(slotChangeEvent);
      await page.waitForChanges();

      expect((page.rootInstance as any).triggerEl).toBe(button);
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should handle slot change with no assigned elements', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>',
      });

      const slot = page.root?.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement;

      // Mock assignedElements to return empty array
      Object.defineProperty(slot, 'assignedElements', {
        value: () => [],
        writable: true
      });

      // Trigger slot change
      const slotChangeEvent = new Event('slotchange');
      Object.defineProperty(slotChangeEvent, 'target', { value: slot, enumerable: true });
      (page.rootInstance as any).handleTriggerSlotChange(slotChangeEvent);
      await page.waitForChanges();

      expect((page.rootInstance as any).triggerEl).toBeNull();
    });

    it('should clean up trigger event listener on slot change', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `
          <pds-popover component-id="test-popover">
            <button slot="trigger" id="old-btn">Old</button>
          </pds-popover>
        `,
      });

      const slot = page.root?.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement;
      const oldButton = page.root?.querySelector('#old-btn') as HTMLElement;
      const removeEventListenerSpy = jest.spyOn(oldButton, 'removeEventListener');

      // Mock first slot change with old button
      Object.defineProperty(slot, 'assignedElements', {
        value: () => [oldButton],
        writable: true,
        configurable: true
      });

      let slotChangeEvent = new Event('slotchange');
      Object.defineProperty(slotChangeEvent, 'target', { value: slot, enumerable: true });
      (page.rootInstance as any).handleTriggerSlotChange(slotChangeEvent);
      await page.waitForChanges();

      // Mock second slot change with no elements (trigger removed)
      Object.defineProperty(slot, 'assignedElements', {
        value: () => [],
        writable: true,
        configurable: true
      });

      slotChangeEvent = new Event('slotchange');
      Object.defineProperty(slotChangeEvent, 'target', { value: slot, enumerable: true });
      (page.rootInstance as any).handleTriggerSlotChange(slotChangeEvent);
      await page.waitForChanges();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  describe('Content Slot Changes', () => {
    it('should update portal content when slot changes while popover is active', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      // Set popover to active state
      page.rootInstance.active = true;

      // Spy on updatePortalContent
      const updateSpy = jest.spyOn(page.rootInstance as any, 'updatePortalContent');

      // Simulate slot change
      await (page.rootInstance as any).handleContentSlotChange();

      expect(updateSpy).toHaveBeenCalled();
    });

    it('should not update portal content when slot changes while popover is inactive', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      // Set popover to inactive state
      page.rootInstance.active = false;

      // Spy on updatePortalContent
      const updateSpy = jest.spyOn(page.rootInstance as any, 'updatePortalContent');

      // Simulate slot change
      await (page.rootInstance as any).handleContentSlotChange();

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('Trigger Click Handling', () => {
    it('should call show() when popoverTargetAction is "show"', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `
          <pds-popover component-id="test-popover" popover-target-action="show">
            <button slot="trigger">Trigger</button>
          </pds-popover>
        `
      });

      const showSpy = jest.spyOn(page.rootInstance, 'show');
      const mockEvent = new Event('click');
      jest.spyOn(mockEvent, 'preventDefault');

      (page.rootInstance as any).handleTriggerClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalled();
    });

    it('should call hide() when popoverTargetAction is "hide"', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `
          <pds-popover component-id="test-popover" popover-target-action="hide">
            <button slot="trigger">Trigger</button>
          </pds-popover>
        `
      });

      const hideSpy = jest.spyOn(page.rootInstance, 'hide');
      const mockEvent = new Event('click');
      jest.spyOn(mockEvent, 'preventDefault');

      (page.rootInstance as any).handleTriggerClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(hideSpy).toHaveBeenCalled();
    });

    it('should call toggle() when popoverTargetAction is "toggle"', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `
          <pds-popover component-id="test-popover" popover-target-action="toggle">
            <button slot="trigger">Trigger</button>
          </pds-popover>
        `
      });

      const toggleSpy = jest.spyOn(page.rootInstance, 'toggle');
      const mockEvent = new Event('click');
      jest.spyOn(mockEvent, 'preventDefault');

      (page.rootInstance as any).handleTriggerClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe('Toggle Method', () => {
    it('should call hide() when active is true', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      page.rootInstance.active = true;
      const hideSpy = jest.spyOn(page.rootInstance, 'hide');

      await page.rootInstance.toggle();

      expect(hideSpy).toHaveBeenCalled();
    });

    it('should call show() when active is false', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      page.rootInstance.active = false;
      const showSpy = jest.spyOn(page.rootInstance, 'show');

      await page.rootInstance.toggle();

      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe('Light Dismiss', () => {
    it('should hide popover when clicking outside for auto type', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover" popover-type="auto"></pds-popover>'
      });

      page.rootInstance.active = true;
      const hideSpy = jest.spyOn(page.rootInstance, 'hide');

      // Mock elements
      (page.rootInstance as any).triggerEl = document.createElement('button');
      (page.rootInstance as any).portalEl = document.createElement('div');

      // Mock event with target outside popover and trigger
      const outsideElement = document.createElement('div');
      const mockEvent = { target: outsideElement } as unknown as MouseEvent;

      (page.rootInstance as any).handleClickOutside(mockEvent);

      expect(hideSpy).toHaveBeenCalled();
    });

    it('should not hide popover when clicking inside portal', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover" popover-type="auto"></pds-popover>'
      });

      page.rootInstance.active = true;
      const hideSpy = jest.spyOn(page.rootInstance, 'hide');

      // Mock portal element
      const portalEl = document.createElement('div');
      const insideElement = document.createElement('span');
      portalEl.appendChild(insideElement);
      (page.rootInstance as any).portalEl = portalEl;
      (page.rootInstance as any).triggerEl = document.createElement('button');

      const mockEvent = { target: insideElement } as unknown as MouseEvent;

      (page.rootInstance as any).handleClickOutside(mockEvent);

      expect(hideSpy).not.toHaveBeenCalled();
    });

    it('should not hide popover when clicking trigger', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover" popover-type="auto"></pds-popover>'
      });

      page.rootInstance.active = true;
      const hideSpy = jest.spyOn(page.rootInstance, 'hide');

      // Mock trigger element
      const triggerEl = document.createElement('button');
      (page.rootInstance as any).triggerEl = triggerEl;
      (page.rootInstance as any).portalEl = document.createElement('div');

      const mockEvent = { target: triggerEl } as unknown as MouseEvent;

      (page.rootInstance as any).handleClickOutside(mockEvent);

      expect(hideSpy).not.toHaveBeenCalled();
    });

    it('should hide popover when Escape key is pressed', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover" popover-type="auto"></pds-popover>'
      });

      page.rootInstance.active = true;
      const hideSpy = jest.spyOn(page.rootInstance, 'hide');

      const mockEvent = {
        key: 'Escape',
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      } as any;

      (page.rootInstance as any).handleEscapeKey(mockEvent);

      expect(hideSpy).toHaveBeenCalled();
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should not hide popover when other keys are pressed', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover" popover-type="auto"></pds-popover>'
      });

      page.rootInstance.active = true;
      const hideSpy = jest.spyOn(page.rootInstance, 'hide');

      const mockEvent = { key: 'Enter' } as KeyboardEvent;

      (page.rootInstance as any).handleEscapeKey(mockEvent);

      expect(hideSpy).not.toHaveBeenCalled();
    });
  });

  describe('Positioning Edge Cases', () => {
    it('should not position when isRepositioning is true', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      // Set up mocks
      const mockTriggerEl = {
        getBoundingClientRect: () => ({ top: 100, left: 100, width: 50, height: 30, right: 150, bottom: 130 })
      } as HTMLElement;
      (page.rootInstance as any).triggerEl = mockTriggerEl;

      const portalEl = (page.rootInstance as any).portalEl as HTMLElement;
      Object.defineProperty(portalEl, 'getBoundingClientRect', {
        value: () => ({ width: 100, height: 50 })
      });

      // Set isRepositioning to true
      (page.rootInstance as any).isRepositioning = true;

      // Store initial style
      const initialTop = portalEl.style.top;

      (page.rootInstance as any).handlePopoverPositioning();

      // Styles should not have changed
      expect(portalEl.style.top).toBe(initialTop);
    });

    it('should not position when trigger has zero dimensions', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      // Set up trigger with zero dimensions
      const mockTriggerEl = {
        getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 })
      } as HTMLElement;
      (page.rootInstance as any).triggerEl = mockTriggerEl;

      const portalEl = (page.rootInstance as any).portalEl as HTMLElement;
      Object.defineProperty(portalEl, 'getBoundingClientRect', {
        value: () => ({ width: 100, height: 50 })
      });

      // Store initial style
      const initialTop = portalEl.style.top;

      (page.rootInstance as any).isRepositioning = false;
      (page.rootInstance as any).handlePopoverPositioning();

      // Styles should not have changed
      expect(portalEl.style.top).toBe(initialTop);
    });

    it('should not position when component is not mounted in show()', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      // Set up mocks
      (page.rootInstance as any).triggerEl = {
        getBoundingClientRect: () => ({ top: 100, left: 100, width: 50, height: 30, right: 150, bottom: 130 }),
        setAttribute: jest.fn(),
        focus: jest.fn()
      };

      const positioningSpy = jest.spyOn(page.rootInstance as any, 'handlePopoverPositioning');

      // Mark component as not mounted
      (page.rootInstance as any).isComponentMounted = false;

      await page.rootInstance.show();

      // Wait for requestAnimationFrame
      await new Promise(resolve => setTimeout(resolve, 50));

      // Positioning should not have been called due to early return
      expect(positioningSpy).not.toHaveBeenCalled();
    });

    it('should position when component is mounted in show()', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      // Set up mocks
      (page.rootInstance as any).triggerEl = {
        getBoundingClientRect: () => ({ top: 100, left: 100, width: 50, height: 30, right: 150, bottom: 130 }),
        setAttribute: jest.fn(),
        focus: jest.fn()
      };

      const portalEl = (page.rootInstance as any).portalEl as HTMLElement;
      Object.defineProperty(portalEl, 'getBoundingClientRect', {
        value: () => ({ width: 100, height: 50 })
      });

      const positioningSpy = jest.spyOn(page.rootInstance as any, 'handlePopoverPositioning');

      // Ensure component is marked as mounted
      (page.rootInstance as any).isComponentMounted = true;
      (page.rootInstance as any).isRepositioning = false;

      await page.rootInstance.show();

      // Wait for requestAnimationFrame to complete
      await new Promise(resolve => setTimeout(resolve, 50));

      // Positioning should have been called
      expect(positioningSpy).toHaveBeenCalled();
    });
  });

  describe('Portal Creation', () => {
    it('should auto-generate portal ID when componentId is not provided', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover></pds-popover>'
      });

      const portalEl = (page.rootInstance as any).portalEl;
      expect(portalEl).toBeTruthy();
      expect(portalEl.id).toMatch(/^pds-popover-portal-\d+$/);
    });

    it('should handle createPortal with slot content', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: `
          <pds-popover component-id="test-popover">
            <button slot="trigger">Trigger</button>
            <div>Popover content</div>
          </pds-popover>
        `
      });

      // Test that createPortal creates the portal element
      const portalEl = (page.rootInstance as any).portalEl;
      expect(portalEl).toBeTruthy();
      expect(portalEl.id).toBe('test-popover-portal');

      // Verify portal has proper styles applied
      expect(portalEl.style.position).toBe('fixed');
      expect(portalEl.style.display).toBe('none');
      expect(portalEl.style.opacity).toBe('0');
      expect(portalEl.style.visibility).toBe('hidden');
    });

    it('should not create portal if one already exists', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      const originalPortal = (page.rootInstance as any).portalEl;
      const createPortalSpy = jest.spyOn(document, 'createElement');

      // Call createPortal again - it should return early
      (page.rootInstance as any).createPortal();

      // Should still have the same portal
      expect((page.rootInstance as any).portalEl).toBe(originalPortal);
      // createElement should not have been called again for portal creation
      expect(createPortalSpy).not.toHaveBeenCalledWith('div');

      createPortalSpy.mockRestore();
    });
  });

  describe('Show Method Edge Cases', () => {
    it('should not show if already active', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      // Set active to true
      page.rootInstance.active = true;

      const updateContentSpy = jest.spyOn(page.rootInstance as any, 'updatePortalContent');

      await page.rootInstance.show();

      // updatePortalContent should not have been called since already active
      expect(updateContentSpy).not.toHaveBeenCalled();
    });

    it('should not show if portal does not exist', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover"></pds-popover>'
      });

      // Remove portal
      (page.rootInstance as any).portalEl = null;

      const updateContentSpy = jest.spyOn(page.rootInstance as any, 'updatePortalContent');

      await page.rootInstance.show();

      // updatePortalContent should not have been called since no portal
      expect(updateContentSpy).not.toHaveBeenCalled();
      expect(page.rootInstance.active).toBe(false);
    });
  });

  describe('Light Dismiss Edge Cases', () => {
    it('should handle click outside when portalEl or triggerEl are null', async () => {
      const page = await newSpecPage({
        components: [PdsPopover],
        html: '<pds-popover component-id="test-popover" popover-type="auto"></pds-popover>'
      });

      page.rootInstance.active = true;
      const hideSpy = jest.spyOn(page.rootInstance, 'hide');

      // Set portalEl to null
      (page.rootInstance as any).portalEl = null;
      (page.rootInstance as any).triggerEl = null;

      const outsideElement = document.createElement('div');
      const mockEvent = { target: outsideElement } as unknown as MouseEvent;

      (page.rootInstance as any).handleClickOutside(mockEvent);

      // Should call hide since both are null (nothing to check contains on)
      expect(hideSpy).toHaveBeenCalled();
    });
  });
});
