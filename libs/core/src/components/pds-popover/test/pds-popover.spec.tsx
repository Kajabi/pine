import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../../pds-popover2/pds-popover';

describe('pds-popover', () => {
  it('should show arrow when has-arrow is true', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover has-arrow="true">
        <pds-button variant="secondary">Secondary</pds-button>
       </pds-popover>`
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-popover--no-arrow')).toBeNull();
  });

  it('should be able to call method to show popover', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover placement="right">
        <pds-button variant="secondary">Secondary</pds-button>
       </pds-popover>`
    });

    const popover = page.rootInstance as PdsPopover;

    // Call the showPopover method
    await popover.showPopover();
    await page.waitForChanges();

    // Check for expected class
    const popoverElement = page.root?.shadowRoot?.querySelector('.pds-popover');
    expect(popoverElement).toHaveClass('pds-popover--is-open');
  });

  it('should toggle the popover', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover></pds-popover>`
    });

    const popover = page.rootInstance as PdsPopover;

    // Initially, the opened property should be false
    expect(popover.opened).toBe(false);

    // Call the togglePdsPopover method
    await popover.togglePdsPopover();

    // After calling togglePdsPopover, the opened property should be true
    expect(popover.opened).toBe(true);

    // Call the togglePdsPopover method again
    await popover.togglePdsPopover();

    // After calling togglePdsPopover again, the opened property should be false
    expect(popover.opened).toBe(false);
  });

  it('should close the popover on global click when opened', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover></pds-popover>`
    });

    const popover = page.rootInstance as PdsPopover;

    popover.opened = true;

    const mockClickEvent = new MouseEvent('click', {
      bubbles: true,
    });

    document.dispatchEvent(mockClickEvent);

    expect(popover.opened).toBe(false);
  });

  it('should not close the popover on global click when not opened', async () => {
    // Create a new instance of the component
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover></pds-popover>`
    });

    const popover = page.rootInstance as PdsPopover;

    expect(popover.opened).toBe(false);

    const mockClickEvent = new MouseEvent('click', {
      bubbles: true,
    });

    document.dispatchEvent(mockClickEvent);

    expect(popover.opened).toBe(false);
  });

  it('should toggle the popover on trigger click', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover></pds-popover>`
    });

    const popover = page.rootInstance as PdsPopover;

    expect(popover.opened).toBe(false);

    const triggerElement = page.root?.shadowRoot?.querySelector('.pds-popover__trigger');

    const mockClickEvent = new MouseEvent('click', {
      bubbles: true,
    });

    triggerElement?.dispatchEvent(mockClickEvent);

    // After clicking the trigger element, the opened property should be true
    expect(popover.opened).toBe(true);

    // Click the trigger element again
    triggerElement?.dispatchEvent(mockClickEvent);

    // After clicking again, the opened property should be false
    expect(popover.opened).toBe(false);
  });
});
