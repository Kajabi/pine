import { newSpecPage } from '@stencil/core/testing';
import { PdsLoader } from '../pds-loader';

describe('pds-loader', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsLoader],
      html: `<pds-loader></pds-loader>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-loader>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-loader>
    `);
  });
});
