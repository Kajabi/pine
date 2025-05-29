import { newSpecPage } from '@stencil/core/testing';
import { PdsDropdownMenu } from '../pds-dropdown-menu';

describe('pds-dropdown-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu],
      html: `<pds-dropdown-menu></pds-dropdown-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-dropdown>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-dropdown>
    `);
  });
});
