import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

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
        left: mockTriggerRect.left
      },
      'right': {
        top: mockTriggerRect.top,
        left: mockTriggerRect.right + OFFSET
      },
      'bottom': {
        top: mockTriggerRect.bottom + OFFSET,
        left: mockTriggerRect.left
      },
      'left': {
        top: mockTriggerRect.top,
        left: mockTriggerRect.left - mockPopoverRect.width - OFFSET
      }
    };

    for (const [placement, expected] of Object.entries(placements)) {
      page.rootInstance.placement = placement;
      await page.rootInstance.handleClick();
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
});
