import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `<pds-popover></pds-popover>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-popover>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-popover>
    `);
  });
});
