import { newSpecPage } from '@stencil/core/testing';
import { PdsLabel } from '../pds-label';

describe('pds-label', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsLabel],
      html: `<pds-label></pds-label>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-label>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-label>
    `);
  });
});