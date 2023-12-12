import { newSpecPage } from '@stencil/core/testing';
import { PdsTableHeadCell } from '../pds-table-head-cell';
import { PdsTable } from '../../pds-table';

describe('pds-table-head-cell', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell></pds-table-head-cell>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-head-cell role="columnheader">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-head-cell>
    `);
  });

  it('renders sortable with icon when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell sortable="true"></pds-table-head-cell>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-head-cell class="is-sortable sort-asc" role="columnheader" sortable="true">
        <mock:shadow-root>
          <slot></slot>
          <pds-icon name="up-small"></pds-icon>
        </mock:shadow-root>
      </pds-table-head-cell>
    `);
  });

  it('renders with is-compact class when tableRef is compact', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell, PdsTable],
      html: `<pds-table compact><pds-table-head-cell></pds-table-head-cell></pds-table>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    expect(tableHeadCell.classList.contains('is-compact')).toBeTruthy();
  });

  it('renders with fixed-cell-position style when tableRef is fixed & selectable', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell, PdsTable],
      html: `
        <pds-table fixed-column selectable>
          <pds-table-head-cell></pds-table-head-cell>
        </pds-table>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    expect(tableHeadCell.style.getPropertyValue('--fixed-cell-position')).toBe('40px');
  });

});
