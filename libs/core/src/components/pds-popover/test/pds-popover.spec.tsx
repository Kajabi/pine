import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

describe('pds-popover', () => {
  it('should hide arrow when has-arrow is false', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover has-arrow="false">
        <pds-button variant="secondary">Secondary</pds-button>
       </pds-popover>`
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-popover--no-arrow')).not.toBeNull();
  });

  it('should be able to call method to show popover', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover placement="right">
        <pds-button variant="secondary">Secondary</pds-button>
       </pds-popover>`
    });

    await page.root?.showPopover();
    await page.waitForChanges();

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-popover')).toHaveClass('pds-popover--is-open');
  });
  it('should toggle the popover', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover></pds-popover>`
    });

    const popover = page.rootInstance as PdsPopover;

    // Initially, the opened property should be false
    expect(popover.opened).toBe(false);

    // Call the togglePopover method
    await popover.togglePopover();

    // After calling togglePopover, the opened property should be true
    expect(popover.opened).toBe(true);

    // Call the togglePopover method again
    await popover.togglePopover();

    // After calling togglePopover again, the opened property should be false
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
