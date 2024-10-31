import { newSpecPage } from '@stencil/core/testing';
import { PdsBen } from '../pds-ben';

describe('pds-ben', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsBen],
      html: `<pds-ben></pds-ben>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-ben>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-ben>
    `);
  });
});
