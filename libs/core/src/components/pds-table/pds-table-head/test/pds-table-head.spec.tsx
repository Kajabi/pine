import { newSpecPage } from '@stencil/core/testing';
import { PdsTableHead } from '../pds-table-head';
import { PdsTable } from '../../pds-table';

describe('pds-table-head', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead],
      html: `<pds-table-head></pds-table-head>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-head role="row">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-head>
    `);
  });

  it('renders with is-fixed class when tableRef has fixedColumn', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead, PdsTable],
      html: `
        <pds-table fixed-column="true">
          <pds-table-head>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
          </pds-table-head>
        </pds-table>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell');
    expect(tableHeadCell?.classList.contains('is-fixed')).toBeTruthy();
  });

  it('renders pds-table-checkbox-cell with checkbox-cell part', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead, PdsTable],
      html: `
        <pds-table selectable="true" fixed-column="true">
          <pds-table-head></pds-table-head>
        </pds-table>`,
    });

    const checkboxCell = page.body.querySelector('pds-table-checkbox-cell');
    const tableHead = page.body.querySelector('pds-table-head');

    expect(checkboxCell).toBeDefined();
    expect(tableHead).toBeDefined();

    if (checkboxCell && tableHead) {
      await page.waitForChanges();

      expect(checkboxCell.getAttribute('part')).toBe('checkbox-cell');
    }
  });

  it('renders pds-table-checkbox-cell without checkbox-cell part', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead, PdsTable],
      html: `
        <pds-table selectable="true" fixed-column="false">
          <pds-table-head></pds-table-head>
        </pds-table>`,
    });

    const checkboxCell = page.body.querySelector('pds-table-checkbox-cell');
    const tableHead = page.body.querySelector('pds-table-head');

    expect(checkboxCell).toBeDefined();
    expect(tableHead).toBeDefined();

    if (checkboxCell && tableHead) {
      await page.waitForChanges();

      expect(checkboxCell.getAttribute('part')).toBe('');
    }
  });
});
