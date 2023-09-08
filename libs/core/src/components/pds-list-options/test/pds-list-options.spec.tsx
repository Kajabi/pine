import { newSpecPage } from '@stencil/core/testing';
import { PdsListOptions } from '../pds-list-options';
import { PdsListOption } from '../pds-list-option/pds-list-option'

describe('pds-list-options', () => {
  it('renders the component', async () => {
    const page = await newSpecPage({
      components: [PdsListOptions, PdsListOption],
      html: `
      <pds-list-options>
        <pds-list-option>Item 1</pds-list-option>
        <pds-list-option>Item 2</pds-list-option>
        <pds-list-option>Item 3</pds-list-option>
      </pds-list-options>`
    });
    expect(page.root).toEqualHtml(`
      <pds-list-options class="pds-list-options">
        <mock:shadow-root>
        <div class="pds-list-options">
          <slot></slot>
        </div>
        </mock:shadow-root>
        <pds-list-option>
          <div class="pds-list-option">
            Item 1
          </div>
        </pds-list-option>
        <pds-list-option>
          <div class="pds-list-option">
            Item 2
          </div>
        </pds-list-option>
        <pds-list-option>
          <div class="pds-list-option">
            Item 3
          </div>
        </pds-list-option>
      </pds-list-options>
    `);
  });
});
