import { newSpecPage } from '@stencil/core/testing';
import { PdsDropdownMenuSeparator } from '../pds-dropdown-menu-separator';

describe('pds-dropdown-menu-separator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenuSeparator],
      html: `<pds-dropdown-menu-separator></pds-dropdown-menu-separator>`,
    });
    
    expect(page.root).toEqualHtml(`
      <pds-dropdown-menu-separator>
        <mock:shadow-root>
          <hr>
        </mock:shadow-root>
      </pds-dropdown-menu-separator>
    `);
  });

  it('does not write component-id onto the host id', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenuSeparator],
      html: `<pds-dropdown-menu-separator component-id="test-separator"></pds-dropdown-menu-separator>`,
    });

    expect(page.root.id).toBe('');
  });

  it('keeps an author-set id even when component-id is also set', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenuSeparator],
      html: `<pds-dropdown-menu-separator id="author-id" component-id="test-separator"></pds-dropdown-menu-separator>`,
    });

    expect(page.root.id).toBe('author-id');
  });
});
