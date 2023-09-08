import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

describe('pds-popover', () => {
  it('opens the popover when the trigger is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover placement="right">
        <pds-button variant="secondary">Secondary</pds-button>
       </pds-popover>`
    });

    const trigger = page.root?.shadowRoot?.querySelector<HTMLButtonElement>('.pds-button');
    console.log('trigger: ', trigger);

    // Open the combobox by clicking on it
    trigger?.click();
    await page.waitForChanges();

    // Check if the combobox is open
    const element = page.root?.shadowRoot;

    console.log('element: ', element);
    console.log('element?.querySelector(\'.pds-popover\'): ', element?.querySelector('.pds-popover--is-open'));

    expect(element?.querySelector('.pds-popover')).toHaveClass('pds-popover--is-open');
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

});
