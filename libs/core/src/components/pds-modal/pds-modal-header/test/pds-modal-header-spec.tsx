import { newSpecPage } from '@stencil/core/testing';
import { PdsModalHeader } from '../pds-modal-header';

describe('pds-modal-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsModalHeader],
      html: `<pds-modal-header></pds-modal-header>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-modal-header>
        <header class="pds-modal__header">
          <slot></slot>
        </header>
      </pds-modal-header>
    `);
  });

  it('renders with content', async () => {
    const page = await newSpecPage({
      components: [PdsModalHeader],
      html: `<pds-modal-header><h2>Modal Title</h2></pds-modal-header>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-modal-header>
        <header class="pds-modal__header">
          <slot></slot>
        </header>
        <h2>Modal Title</h2>
      </pds-modal-header>
    `);
  });
});