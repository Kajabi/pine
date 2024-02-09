import { newSpecPage } from '@stencil/core/testing';
import { PdsAccordion } from '../pds-accordion';

describe('pds-accordion', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion></pds-accordion>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-accordion>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-accordion>
    `);
  });
});
