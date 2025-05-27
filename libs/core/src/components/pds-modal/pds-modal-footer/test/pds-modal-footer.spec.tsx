import { newSpecPage } from '@stencil/core/testing';
import { PdsModalFooter } from '../pds-modal-footer';

describe('pds-modal-footer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsModalFooter],
      html: `<pds-modal-footer></pds-modal-footer>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-modal-footer>
        <footer class="pds-modal__footer"></footer>
      </pds-modal-footer>
    `);
  });

  it('renders with content', async () => {
    const page = await newSpecPage({
      components: [PdsModalFooter],
      html: `<pds-modal-footer><pds-button>Close</pds-button></pds-modal-footer>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-modal-footer>
        <footer class="pds-modal__footer">
          <pds-button>Close</pds-button>
        </footer>
      </pds-modal-footer>
    `);
  });
});