import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

interface ToggleEvent extends Event {
  newState: 'open' | 'closed';
}

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover component-id="popover-1"></pds-popover>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-popover component-id="popover-1" placement="right">
        <mock:shadow-root>
          <button class="pds-popover__trigger" popovertarget="popover-1" popovertargetaction="show"></button>
          <div class="pds-popover" id="popover-1" popover="auto" style="max-width: 352px;">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </pds-popover>
    `);
  });

  it('should apply a maxWidth to the popover', async () => {
    const maxWidthValue = '450px';
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover component-id="popover-1" max-width="450px">
        <mock:shadow-root>
          <button class="pds-popover__trigger" popovertarget="popover-1" popovertargetaction="show"></button>
          <div class="pds-popover" id="popover-1" popover="auto" style="max-width: 450px;">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </pds-popover>`,
    });

    const contentElement = page.root?.shadowRoot?.querySelector('[popover]') as HTMLElement;
    expect(contentElement.style.maxWidth).toBe(maxWidthValue);
  });

  it('should handle positioning for all placements with scroll offsets', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover"></pds-popover>'
    });

    // Mock window scroll position
    Object.defineProperty(window, 'pageXOffset', { value: 10 });
    Object.defineProperty(window, 'pageYOffset', { value: 20 });

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

    const triggerEl = page.root?.shadowRoot?.querySelector('.pds-popover__trigger') as HTMLElement;
    const popoverEl = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement;

    Object.defineProperty(triggerEl, 'getBoundingClientRect', {
      value: () => mockTriggerRect
    });

    Object.defineProperty(popoverEl, 'getBoundingClientRect', {
      value: () => mockPopoverRect
    });

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

    for (const [placement, expected] of Object.entries(placements)) {
      page.rootInstance.placement = placement;
      // Directly call the private positioning method
      (page.rootInstance as any).handlePopoverPositioning();
      await page.waitForChanges();

      expect(popoverEl.style.top).toBe(`${expected.top}px`);
      expect(popoverEl.style.left).toBe(`${expected.left}px`);
    }
  });

  it('should handle scroll events and update positioning only when active', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover"></pds-popover>'
    });

    const positioningSpy = jest.spyOn(page.rootInstance as any, 'handlePopoverPositioning');

    window.dispatchEvent(new Event('scroll'));
    await page.waitForChanges();
    expect(positioningSpy).not.toHaveBeenCalled();

    page.rootInstance.active = true;
    await page.waitForChanges();

    // Clear previous spy calls
    positioningSpy.mockClear();

    window.dispatchEvent(new Event('scroll'));
    await page.waitForChanges();
    expect(positioningSpy).toHaveBeenCalled();
  });

  it('should call native showPopover when show() method is called', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover"></pds-popover>'
    });

    const popoverEl = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement & { showPopover?: jest.Mock };
    popoverEl.showPopover = jest.fn();

    await page.rootInstance.show();
    expect(popoverEl.showPopover).toHaveBeenCalled();
  });

  it('should call native hidePopover when hide() method is called', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover"></pds-popover>'
    });

    const popoverEl = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement & { hidePopover?: jest.Mock };
    popoverEl.hidePopover = jest.fn();

    await page.rootInstance.hide();
    expect(popoverEl.hidePopover).toHaveBeenCalled();
  });

  it('should call native togglePopover when toggle() method is called', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover"></pds-popover>'
    });

    const popoverEl = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement & { togglePopover?: jest.Mock };
    popoverEl.togglePopover = jest.fn();

    await page.rootInstance.toggle();
    expect(popoverEl.togglePopover).toHaveBeenCalled();
  });

  it('should emit pdsPopoverOpen event with details when toggle event fires with open state', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="test-popover" popover-type="auto" text="Test"></pds-popover>'
    });

    const openEventSpy = jest.fn();
    page.root?.addEventListener('pdsPopoverOpen', openEventSpy);

    // Simulate toggle event with open state
    const toggleEvent = new Event('toggle') as ToggleEvent;
    Object.defineProperty(toggleEvent, 'newState', { value: 'open' });

    (page.rootInstance as any).handleToggle(toggleEvent);
    await page.waitForChanges();

    expect(openEventSpy).toHaveBeenCalled();
    expect(page.rootInstance.active).toBe(true);
  });

  it('should emit pdsPopoverClose event with details when toggle event fires with closed state', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="test-popover" popover-type="auto" text="Test"></pds-popover>'
    });

    const closeEventSpy = jest.fn();
    page.root?.addEventListener('pdsPopoverClose', closeEventSpy);

    // Set active to true first
    page.rootInstance.active = true;

    // Simulate toggle event with closed state
    const toggleEvent = new Event('toggle') as ToggleEvent;
    Object.defineProperty(toggleEvent, 'newState', { value: 'closed' });

    (page.rootInstance as any).handleToggle(toggleEvent);
    await page.waitForChanges();

    expect(closeEventSpy).toHaveBeenCalled();
    expect(page.rootInstance.active).toBe(false);
  });

  it('should handle different popoverTargetAction values', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" popover-target-action="toggle"></pds-popover>'
    });

    const triggerButton = page.root?.shadowRoot?.querySelector('.pds-popover__trigger') as HTMLButtonElement;
    expect(triggerButton.getAttribute('popovertargetaction')).toBe('toggle');
  });

  it('should handle different popoverType values', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" popover-type="manual"></pds-popover>'
    });

    const popoverEl = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement;
    expect(popoverEl.getAttribute('popover')).toBe('manual');
  });
});
