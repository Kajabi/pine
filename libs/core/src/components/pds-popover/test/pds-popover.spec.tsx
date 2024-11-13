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
});
