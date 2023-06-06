import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';

describe('pds-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select></pds-select>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-select>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-select>
    `);
  });
});
