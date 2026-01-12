import { newSpecPage } from '@stencil/core/testing';
import { PdsTable } from '../../pds-table';
import { PdsTableBody } from '../../pds-table-body/pds-table-body';
import { PdsTableRow } from '../pds-table-row';

describe('pds-table-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableRow],
      html: `<pds-table-row></pds-table-row>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-row role="row" part="row">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-row>
    `);
  });

  it('renders with is-selected class when the checkbox is checked', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableBody, PdsTableRow],
      html: `
      <pds-table selectable="true">
        <pds-table-body>
          <pds-table-row></pds-table-row>
        </pds-table-body>
      </pds-table>
      `,
    });

    const row = page.root?.querySelector('pds-table-row');
    const checkbox = row?.shadowRoot?.querySelector('pds-checkbox') as HTMLElement;

    checkbox.click();
    await page.waitForChanges();

    expect(row?.classList.contains('is-selected')).toBe(true);
  });

  it('adds the class is-fixed to the table-cell when table has fixedColumn', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableRow],
      html: `
      <pds-table fixed-column="true">
        <pds-table-row>
          <pds-table-cell>Cell Content</pds-table-cell>
        </pds-table-row>
      </pds-table>
      `,
    });

    const cell = page.root?.querySelector('pds-table-cell');
    expect(cell?.classList.contains('is-fixed')).toBe(true);
  });

  it('emits pdsTableRowSelected event when isSelected is set', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableBody, PdsTableRow],
      html: `
      <pds-table selectable="true">
        <pds-table-body>
          <pds-table-row is-selected=true indeterminate=true></pds-table-row>
        </pds-table-body>
      </pds-table>
      `,
    });

    const row = page.root?.querySelector('pds-table-row');
    const checkbox = row?.shadowRoot?.querySelector('pds-checkbox') as HTMLElement;


    checkbox.click();
    await page.waitForChanges();

    expect((row as HTMLPdsTableRowElement).indeterminate).toBe(false);
  });

  it('renders with has-divider class when table has rowDividers prop', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableBody, PdsTableRow],
      html: `
      <pds-table row-dividers="true">
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell>Row 1</pds-table-cell>
          </pds-table-row>
          <pds-table-row>
            <pds-table-cell>Row 2</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
      `,
    });

    // Wait for MutationObserver updates to complete
    await page.waitForChanges();

    const rows = page.root?.querySelectorAll('pds-table-row');

    // Ensure rows exist before asserting
    expect(rows).toBeDefined();
    expect(rows?.length).toBeGreaterThan(0);

    rows?.forEach((row) => {
      expect(row.classList.contains('has-divider')).toBe(true);
    });

    // Verify is-last-row class is only on the last row
    expect(rows?.[0]?.classList.contains('is-last-row')).toBe(false);
    expect(rows?.[rows.length - 1]?.classList.contains('is-last-row')).toBe(true);
  });

  it('does not render with has-divider class when table does not have rowDividers prop', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableBody, PdsTableRow],
      html: `
      <pds-table>
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell>Row 1</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
      `,
    });

    const row = page.root?.querySelector('pds-table-row');
    expect(row?.classList.contains('has-divider')).toBe(false);
  });
});
