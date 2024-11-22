import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover placement="right">
        <div slot="trigger">
          <pds-button variant="accent">Popover</pds-button>
        </div>
        <div slot="content">
          <p><strong>This is a Popover</strong></p>
        </div>
      </pds-popover>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-popover placement="right">
        <mock:shadow-root>
           <div class="pds-popover pds-popover--right">
            <button class="pds-popover__trigger">
              <slot name="trigger"></slot>
            </button>
            <div class="pds-popover__content" aria-hidden="true" aria-live="off" style="max-width: 352px; top: 50%; left: calc(0px + 8px); transform: translateY(-50%);">
              <slot name="content"></slot>
            </div>
          </div>
        </mock:shadow-root>
         <div slot="trigger">
          <pds-button variant="accent">Popover</pds-button>
        </div>
        <div slot="content">
          <p><strong>This is a Popover</strong></p>
        </div>
      </pds-popover>
    `);
  });

  it('renders', async () => {
    const maxWidthValue = '450px';
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover max-width="450px">
        <div slot="trigger">
          <pds-button variant="accent">Popover</pds-button>
        </div>
        <div slot="content">
          <p><strong>This is a Popover</strong></p>
        </div>
      </pds-popover>`,
    });

    const contentElement = page.root?.shadowRoot?.querySelector('.pds-popover__content') as HTMLElement;

    expect(contentElement.style.maxWidth).toBe(maxWidthValue);
  });

  it('should open the popover on trigger click', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
        <pds-popover placement="top">
          <div slot="trigger">
            <button>Popover</button>
          </div>
          <div slot="content">
            <p>This is a Popover</p>
          </div>
        </pds-popover>
      `,
    });

    const button = page.root?.querySelector('button');
    button?.click();
    await page.waitForChanges();

    const popover = page.root?.shadowRoot?.querySelector('.pds-popover');
    expect(popover).toHaveClass('pds-popover--is-open');
  });

  it('should close the popover on clicking outside', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
        <pds-popover placement="top">
          <div slot="trigger">
            <button>Popover</button>
          </div>
          <div slot="content">
            <p>This is a Popover</p>
          </div>
        </pds-popover>
      `,
    });

    const button = page.root?.querySelector('button');
    await button?.click();
    await page.waitForChanges();

    const document = page.doc;
    await document.body.click();
    await page.waitForChanges();

    const popover = page.root?.shadowRoot?.querySelector('.pds-popover');
    expect(popover).not.toHaveClass('pds-popover--is-open');
  });

  it('should hide the popover when trigger is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
        <pds-popover>
          <div slot="trigger">
            <button>Show Popover</button>
          </div>
          <div slot="content">Popover Content</div>
        </pds-popover>
      `
    });

    // Open the popover
    const button = page.root?.querySelector('button');
    button?.click();
    await page.waitForChanges();

    const popover = page.root?.shadowRoot?.querySelector('.pds-popover');
    expect(popover).toHaveClass('pds-popover--is-open');

    // click trigger to close popover
    await button?.click();
    await page.waitForChanges();

    expect(popover).not.toHaveClass('pds-popover--is-open');
  });
});
