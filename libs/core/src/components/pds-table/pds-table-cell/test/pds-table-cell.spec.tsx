import { newSpecPage } from '@stencil/core/testing';
import { PdsTableCell } from '../pds-table-cell';
import { PdsTable } from '../../pds-table';

describe('pds-table-cell', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell></pds-table-cell>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table-cell role="gridcell">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-cell>
    `);
  });

  it('renders truncated when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell truncate="true"></pds-table>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table-cell role="gridcell" truncate="true" class="is-truncated">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-cell>
    `);
  });

  it('renders with is-compact class when tableRef is compact', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell, PdsTable],
      html: `<pds-table compact><pds-table-cell></pds-table-cell></pds-table>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as any;
    expect(tableCell.classList.contains('is-compact')).toBeTruthy();
  });

  it('renders with fixed-cell-position style when tableRef is fixed & selectable', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell, PdsTable],
      html: `<pds-table fixed-column selectable><pds-table-cell></pds-table-cell></pds-table>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as any;
    expect(tableCell.style.getPropertyValue('--fixed-cell-position')).toBe('40px');
  });
});
