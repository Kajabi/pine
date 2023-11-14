import { newSpecPage } from '@stencil/core/testing';
import { PdsTable } from '../pds-table';

describe('pds-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table></pds-table>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table" role="grid">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table>
    `);
  });

  it('renders compact when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table compact="true"></pds-table>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table is-compact" compact="true" role="grid">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table>
    `);
  });

  it('renders responsive when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table responsive="true"></pds-table>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table is-responsive" responsive="true" role="grid">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table>
    `);
  });


});
