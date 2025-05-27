import { newSpecPage } from '@stencil/core/testing';
import { PdsModalContent } from '../pds-modal-content';

describe('pds-modal-content', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsModalContent],
      html: `<pds-modal-content></pds-modal-content>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-modal-content>
        <div class="pds-modal-content"></div>
      </pds-modal-content>
    `);
  });

  it('renders with scrollable attribute', async () => {
    const page = await newSpecPage({
      components: [PdsModalContent],
      html: `<pds-modal-content scrollable="true"></pds-modal-content>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-modal-content scrollable>
        <div class="pds-modal-content pds-modal-content--scrollable" tabindex="-1"></div>
      </pds-modal-content>
    `);
  });

  it('renders with content', async () => {
    const page = await newSpecPage({
      components: [PdsModalContent],
      html: `<pds-modal-content><p>Modal content</p></pds-modal-content>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-modal-content>
        <div class="pds-modal-content">
          <p>Modal content</p>
        </div>
      </pds-modal-content>
    `);
  });
});