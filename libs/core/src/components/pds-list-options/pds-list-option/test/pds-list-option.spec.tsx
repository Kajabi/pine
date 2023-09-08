import { newSpecPage } from '@stencil/core/testing';
import { PdsListOption } from '../pds-list-option';

describe('pds-list-option', () => {
  it('renders the component', async () => {
    const page = await newSpecPage({
      components: [PdsListOption],
      html: `<pds-list-option>Item 1</pds-list-option>`
    });
    expect(page.root).toEqualHtml(`
      <pds-list-option>
        <mock:shadow-root>
        <div class="pds-list-option">
          Item 1
        </div>
        </mock:shadow-root>
      </pds-list-option>
    `);
  });
});
