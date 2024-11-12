import { newSpecPage } from '@stencil/core/testing';
import { PdsText } from '../pds-text';

describe('pds-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-text>
    `);
  });
});
