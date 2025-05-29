import { newSpecPage } from '@stencil/core/testing';
import { PdsToast } from '../pds-toast';

describe('pds-toast', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast></pds-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-toast>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-toast>
    `);
  });
});
