import { newSpecPage } from '@stencil/core/testing';
import { PdsBanner } from '../pds-banner';

describe('pds-banner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsBanner],
      html: `<pds-banner></pds-banner>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-banner>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-banner>
    `);
  });
});
