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
            <span class="pds-popover__trigger">
              <slot name="trigger"></slot>
            </span>
            <div class="pds-popover__content" aria-hidden="true" aria-live="off" style="top: 50%; left: calc(0px + 8px); transform: translateY(-50%);">
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

  it('should open the popover on trigger click', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
        <pds-popover placement="top">
          <button>Popover</button>
        </pds-popover>
      `,
    });

    const button = page.root?.querySelector('button');
    await button?.click();
    await page.waitForChanges();

    const popover = page.root?.shadowRoot?.querySelector('.pds-popover');
    expect(popover).toHaveClass('pds-popover--is-open');
  });

  it('should close the popover on clicking outside', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
        <pds-popover placement="top">
          <button>Popover</button>
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

  // it('should not close the popover on clicking inside', async () => {
  //   const page = await newSpecPage({
  //     components: [PdsPopover],
  //     html: `
  //       <pds-popover placement="top">
  //         <div slot="trigger">
  //           <pds-button variant="accent">Popover</pds-button>
  //         </div>
  //         <div slot="content">
  //           <div class="popover-content">Content</div>
  //         </div>
  //       </pds-popover>
  //     `,
  //   });

  //   const button = page.root?.querySelector('.pds-button') as HTMLElement;
  //   await button?.click();
  //   await page.waitForChanges();

  //   const content = page.root?.shadowRoot?.querySelector('.popover-content') as HTMLElement;
  //   await content?.click();
  //   await page.waitForChanges();

  //   const popover = page.root?.shadowRoot?.querySelector('.pds-popover');
  //   console.log('popover', popover);
  //   expect(popover).toHaveClass('pds-popover--is-open');
  // });
});
