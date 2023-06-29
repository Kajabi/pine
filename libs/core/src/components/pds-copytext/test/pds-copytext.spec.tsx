import { newSpecPage } from '@stencil/core/testing';
import { PdsCopytext } from '../pds-copytext';

describe('pds-copytext', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext class="pds-copytext pds-copytext--bordered">
        <mock:shadow-root>
          <button type="button">
            <span></span>
            <pds-icon name="copy" size="18px"></pds-icon>
          </button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });
});
