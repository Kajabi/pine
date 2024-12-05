import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

describe('pds-popover', () => {
  xit('renders', async () => {
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

  xit('should apply a maxWidth to the popover', async () => {
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

  it('should show the popover on trigger click', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: '<pds-popover component-id="my-popover" text="Show popover"></pds-popover>',
    });

    let popoverContent = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement;
    expect(popoverContent?.classList.contains('pds-popover--active')).toBe(false);

    const triggerButton = page.root?.shadowRoot?.querySelector('.pds-popover__trigger') as HTMLButtonElement;
    console.log('Trigger button', triggerButton instanceof HTMLButtonElement);
    triggerButton.click();
    await Promise.resolve();

    popoverContent = page.root?.shadowRoot?.querySelector('div[popover]') as HTMLElement;
    console.log('popoverContent.classList', popoverContent.classList.toString());
    expect(popoverContent.classList.contains('pds-popover--active')).toBeTruthy();
  });
});
