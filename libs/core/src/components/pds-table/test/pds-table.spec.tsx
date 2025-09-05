import { newSpecPage } from '@stencil/core/testing';
import { PdsTable } from '../pds-table';
import { PdsTableHead } from '../pds-table-head/pds-table-head';
import { PdsTableHeadCell } from '../pds-table-head-cell/pds-table-head-cell';
import { PdsTableBody } from '../pds-table-body/pds-table-body';
import { PdsTableRow } from '../pds-table-row/pds-table-row';
import { PdsTableCell } from '../pds-table-cell/pds-table-cell';

describe('pds-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table></pds-table>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table" role="grid" tabindex="0">
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
      <pds-table class="pds-table is-compact" compact="true" role="grid" tabindex="0">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table>
    `);
  });

  it('renders responsive when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table responsive="true" component-id="test-table"></pds-table>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table class="pds-table is-responsive pds-table-responsive-host" responsive="true" component-id="test-table" id="test-table" role="grid" tabindex="0">
        <mock:shadow-root>
          <div class="scroll-shadow-left" style="opacity: 0;"></div>
          <div class="scroll-shadow-right" style="opacity: 0;"></div>
          <div class="pds-table-responsive-container">
            <div class="pds-table-responsive-wrapper">
              <div class="pds-table  is-responsive">
                <slot></slot>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </pds-table>
    `);
  });

  it('sorts the table when pdsTableSort event is triggered', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableHead, PdsTableHeadCell, PdsTableBody, PdsTableRow, PdsTableCell],
      html: `
        <pds-table component-id="test-table" responsive tabindex="0">
          <pds-table-head>
            <pds-table-head-cell sortable>Column 1</pds-table-head-cell>
            <pds-table-head-cell sortable>Column 2</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Row 1, Column 1</pds-table-cell>
              <pds-table-cell>Row 1, Column 2</pds-table-cell>
            </pds-table-row>
            <pds-table-row>
              <pds-table-cell>Row 2, Column 1</pds-table-cell>
              <pds-table-cell>Row 2, Column 2</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      `,
    });

    const table = page.body.querySelector('pds-table') as HTMLElement;
    const tableBody = page.body.querySelector('pds-table-body') as HTMLElement;

    // Trigger the pdsTableSort event to simulate user interaction
    table.dispatchEvent(
      new CustomEvent('pdsTableSort', {
        detail: { column: 'Column 1', direction: 'asc' },
      }),
    );

    // Wait for changes to be applied
    await page.waitForChanges();

    // Check if the table rows are sorted correctly
    const rows = Array.from(tableBody.querySelectorAll('pds-table-row')) as any;
    const values = rows.map((row) => row.querySelector('pds-table-cell').textContent?.trim());

    // Assert that the values are sorted in ascending order based on Column 1
    expect(values).toEqual(['Row 1, Column 1', 'Row 2, Column 1']);
  });

  it('sorts the table in DESC order when pdsTableSort event is triggered', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableHead, PdsTableHeadCell, PdsTableBody, PdsTableRow, PdsTableCell],
      html: `
        <pds-table component-id="test-table" responsive>
          <pds-table-head>
            <pds-table-head-cell sortable>Column 1</pds-table-head-cell>
            <pds-table-head-cell sortable>Column 2</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>A 1, Column 1</pds-table-cell>
              <pds-table-cell>B 1, Column 2</pds-table-cell>
            </pds-table-row>
            <pds-table-row>
              <pds-table-cell>C 2, Column 1</pds-table-cell>
              <pds-table-cell>D 2, Column 2</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      `,
    });

    const table = page.body.querySelector('pds-table') as HTMLElement;
    const tableBody = page.body.querySelector('pds-table-body') as HTMLElement;

    // Trigger the pdsTableSort event to simulate user interaction
    table.dispatchEvent(
      new CustomEvent('pdsTableSort', {
        detail: { column: 'Column 1', direction: 'desc' },
      }),
    );

    // Wait for changes to be applied
    await page.waitForChanges();

    // Check if the table rows are sorted correctly
    const rows = Array.from(tableBody.querySelectorAll('pds-table-row')) as any;
    const values = rows.map((row) => row.querySelector('pds-table-cell').textContent?.trim());

    // Assert that the values are sorted in ascending order based on Column 1
    expect(values).toEqual(['C 2, Column 1', 'A 1, Column 1']);
  });

  it('sorts the table case-insensitively when pdsTableSort event is triggered', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableHead, PdsTableHeadCell, PdsTableBody, PdsTableRow, PdsTableCell],
      html: `
        <pds-table component-id="test-table" responsive>
          <pds-table-head>
            <pds-table-head-cell sortable>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>apple</pds-table-cell>
            </pds-table-row>
            <pds-table-row>
              <pds-table-cell>Banana</pds-table-cell>
            </pds-table-row>
            <pds-table-row>
              <pds-table-cell>Cherry</pds-table-cell>
            </pds-table-row>
            <pds-table-row>
              <pds-table-cell>date</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      `,
    });

    const table = page.body.querySelector('pds-table') as HTMLElement;
    const tableBody = page.body.querySelector('pds-table-body') as HTMLElement;

    // Trigger the pdsTableSort event to simulate user interaction
    table.dispatchEvent(
      new CustomEvent('pdsTableSort', {
        detail: { column: 'Name', direction: 'asc' },
      }),
    );

    // Wait for changes to be applied
    await page.waitForChanges();

    // Check if the table rows are sorted correctly (case-insensitive)
    const rows = Array.from(tableBody.querySelectorAll('pds-table-row')) as any;
    const values = rows.map((row) => row.querySelector('pds-table-cell').textContent?.trim());

    // Assert that the values are sorted in case-insensitive ascending order
    // Expected order: apple, Banana, Cherry, date (case-insensitive alphabetical)
    expect(values).toEqual(['apple', 'Banana', 'Cherry', 'date']);
  });

  it('should select the header checkbox when all rows are selected', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableHead, PdsTableBody, PdsTableRow],
      html: `
        <pds-table selectable>
          <pds-table-head>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row is-selected>
              <pds-table-cell>Row 1, Column 1</pds-table-cell>
              <pds-table-cell>Row 1, Column 2</pds-table-cell>
            </pds-table-row>
            <pds-table-row is-selected>
              <pds-table-cell>Row 1, Column 1</pds-table-cell>
              <pds-table-cell>Row 1, Column 2</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      `,
    });

    const table = page.root?.querySelector('pds-table');
    const head = page.root?.querySelector('pds-table-head');
    const rows = page.root?.querySelectorAll('pds-table-row');

    const headerCheckbox = head?.shadowRoot?.querySelector('pds-checkbox') as HTMLInputElement;

    rows?.forEach((row, idx) => {
      table?.dispatchEvent(
        new CustomEvent('pdsTableRowSelected', {
          detail: { rowIndex: idx, isSelected: true },
          bubbles: true,
        })
      );
    });

    // Simulate all rows being selected
    const event = new CustomEvent('pdsTableRowSelected', {
      detail: { rowIndex: 0, isSelected: true },
      bubbles: true,
    });
    table?.dispatchEvent(event);
    await page.waitForChanges();

    // Check if the header checkbox is selected
    expect(headerCheckbox?.checked).toBe(true);
  });

  it('should display a console warning message when no columnHeaderCell is found', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `
        <pds-table component-id="test-table">
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Row 1 Cell 1</pds-table-cell>
              <pds-table-cell>Row 1 Cell 2</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      `,
    });

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    page.rootInstance.sortTable('NonExistentColumn', 'asc');

    expect(consoleWarnSpy).toHaveBeenCalledWith('Column "NonExistentColumn" not found.');
  });

  it('should not proceed if event.defaultPrevented is true in handleTableSelect', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `<pds-table component-id="test-table"></pds-table>`,
    });

    const pdsTable = page.rootInstance;

    const event = new CustomEvent('pdsTableRowSelected', {
      detail: { rowIndex: 0, isSelected: true },
    });
    Object.defineProperty(event, 'defaultPrevented', { value: true });

    pdsTable.handleTableSelect(event);

    const allTableRows = pdsTable.el.querySelectorAll('pds-table-row');
    expect(allTableRows.length).toBe(0);
  });

  it('should not proceed if event.defaultPrevented is true in handleTableSelectAll', async () => {
    const page = await newSpecPage({
      components: [PdsTable],
      html: `
        <pds-table component-id="test-table">
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Row 1 Cell 1</pds-table-cell>
              <pds-table-cell>Row 1 Cell 2</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      `,
    });

    const pdsTable = page.rootInstance;

    const event = new CustomEvent('pdsTableSelectAll', {
      detail: { isSelected: true },
    });

    Object.defineProperty(event, 'defaultPrevented', { value: true });

    pdsTable.handleTableSelectAll(event);

    const pdsTableBody = pdsTable.el.querySelector('pds-table-body');
    const tableRows = pdsTableBody.querySelectorAll('pds-table-row');

    tableRows.forEach((row) => {
      expect(row.isSelected).toBeUndefined();
    });
  });
});
