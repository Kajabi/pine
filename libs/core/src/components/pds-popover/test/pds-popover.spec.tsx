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

  it('should show the popover using the show method', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" text="Show popover"></pds-popover>',
    });

    const popover = page.root as unknown as PdsPopover;
    const popoverContent = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement;

    expect(popoverContent.classList.contains('pds-popover--active')).toBeFalsy();

    await popover.show();
    await page.waitForChanges();

    expect(popoverContent.classList.contains('pds-popover--active')).toBeTruthy();
  });

 it('should hide the popover using the hide method', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" text="Show popover"></pds-popover>',
    });

    const popover = page.rootInstance;
    const popoverContent = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement;

    await popover.show();
    await page.waitForChanges();
    expect(popoverContent.classList.contains('pds-popover--active')).toBeTruthy();

    await popover.hide();
    await page.waitForChanges();

    expect(popoverContent.classList.contains('pds-popover--active')).toBeFalsy();
  });

  it('should show the popover using the space button on the keyboard', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" text="Show popover"></pds-popover>',
    });

    const popover = page.body.querySelector('pds-popover');
    const popoverContent = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement;

    expect(popoverContent.classList.contains('pds-popover--active')).toBeFalsy();

    const spaceKeyEvent = new KeyboardEvent('keydown', {'key': 'Space'});
    popover?.dispatchEvent(spaceKeyEvent);
    await page.waitForChanges();

    const escapeKeyEvent = new KeyboardEvent('keydown', {'key': 'Escape'});
    popover?.dispatchEvent(escapeKeyEvent);
    await page.waitForChanges();

    expect(popoverContent.classList.contains('pds-popover--active')).toBeFalsy();
  });

  it('should handle Enter key press to show popover', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover component-id="popover-1"></pds-popover>`,
    });

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    page.root?.dispatchEvent(keyDownEvent);
    await page.waitForChanges();

    expect(page.rootInstance.active).toBe(true);
  });

  it('should handle Space key press to show popover', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover component-id="popover-1"></pds-popover>`,
    });

    const keyDownEvent = new KeyboardEvent('keydown', { key: ' ' });
    page.root?.dispatchEvent(keyDownEvent);
    await page.waitForChanges();

    expect(page.rootInstance.active).toBe(true);
  });

  it('should handle Escape key press to hide popover when active', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover component-id="popover-1"></pds-popover>`,
    });

    await page.rootInstance.show();
    await page.waitForChanges();

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    page.root?.dispatchEvent(keyDownEvent);
    await page.waitForChanges();

    expect(page.rootInstance.active).toBe(false);
  });

  it('should not show popover if already active', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover component-id="popover-1"></pds-popover>`,
    });

    await page.rootInstance.show();
    await page.waitForChanges();

    const keyDownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    page.root?.dispatchEvent(keyDownEvent);
    await page.waitForChanges();

    // Should still be active but not trigger show again
    expect(page.rootInstance.active).toBe(true);
  });

  it('should hide popover on document click when type is auto', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" text="Show popover"></pds-popover>',
    });

    await page.rootInstance.show();
    await page.waitForChanges();

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(clickEvent);
    await page.waitForChanges();

    const popoverContent = page.root?.shadowRoot?.querySelector('div[popover]');
    expect(popoverContent?.classList.contains('pds-popover--active')).toBeFalsy();
    expect(page.rootInstance.active).toBeFalsy();
  });

  it('should not hide popover on document click when type is manual', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" popover-type="manual" text="Show popover"></pds-popover>',
    });

    await page.rootInstance.show();
    await page.waitForChanges();

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(clickEvent);
    await page.waitForChanges();

    const popoverContent = page.root?.shadowRoot?.querySelector('div[popover]');
    expect(popoverContent?.classList.contains('pds-popover--active')).toBeTruthy();
    expect(page.rootInstance.active).toBeTruthy();
  });

  it('should not hide inactive popover on document click', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" text="Show popover"></pds-popover>',
    });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(clickEvent);
    await page.waitForChanges();

    const popoverContent = page.root?.shadowRoot?.querySelector('div[popover]');
    expect(popoverContent?.classList.contains('pds-popover--active')).toBeFalsy();
    expect(page.rootInstance.active).toBeFalsy();
  });

  it('should handle popover positioning calculations correctly', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover"></pds-popover>'
    });

    // Define mock trigger and popover rects
    const mockTriggerRect = {
      top: 100,
      right: 200,
      bottom: 150,
      left: 100,
      width: 100,
      height: 50,
      x: 100,
      y: 100
    };

    const mockPopoverRect = {
      top: 0,
      right: 200,
      bottom: 100,
      left: 0,
      width: 200,
      height: 100,
      x: 0,
      y: 0
    };

    const triggerEl = page.root?.shadowRoot?.querySelector('.pds-popover__trigger') as HTMLElement;
    const popoverEl = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement;

    Object.defineProperty(triggerEl, 'getBoundingClientRect', {
      value: () => mockTriggerRect
    });

    Object.defineProperty(popoverEl, 'getBoundingClientRect', {
      value: () => mockPopoverRect
    });

    // Test top placement
    page.rootInstance.placement = 'top';
    await page.rootInstance.show();
    await page.waitForChanges();

    expect(popoverEl.style.top).toBe('0px');
    expect(popoverEl.style.left).toBe('50px');

    // Test bottom placement
    page.rootInstance.placement = 'bottom';
    await page.rootInstance.show();
    await page.waitForChanges();

    expect(popoverEl.style.top).toBe('150px');
    expect(popoverEl.style.left).toBe('50px');
  });
});
