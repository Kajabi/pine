import { newSpecPage } from '@stencil/core/testing';
import { PdsDropdown } from '../pds-dropdown';

describe('pds-dropdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsDropdown],
      html: `<pds-dropdown></pds-dropdown>`,
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
