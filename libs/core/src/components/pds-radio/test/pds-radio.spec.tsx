import { newSpecPage } from '@stencil/core/testing';
import { PdsRadio } from '../pds-radio';

describe('pds-radio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio></pds-radio>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-radio>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-radio>
    `);
  });
});
