import { newSpecPage } from '@stencil/core/testing';
import { PdsAlert } from '../pds-alert';

describe('pds-alert', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsAlert],
      html: `<pds-alert></pds-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-alert>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-alert>
    `);
  });
});
