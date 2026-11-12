import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table></pds-table>');

    const element = await page.find('pds-table');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with compact and responsive configurations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table compact responsive component-id="test-table"></pds-table>
    `);
    const table = await page.find('pds-table');
    expect(table).toHaveClass('pds-table-responsive-host');
    // For responsive tables, the inner div has the table classes
    const tableDiv = await page.find('pds-table >>> .pds-table');
    expect(tableDiv).toHaveClass('is-compact');
    expect(tableDiv).toHaveClass('is-responsive');
  });

  it('sorts the table when pdsTableSort event is triggered', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table>
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
    `);

    const columnHeader1 = await page.find('pds-table-head-cell:nth-child(1)');

    await columnHeader1.click(); // Simulate clicking on the sortable column
    await page.waitForChanges();

    // Check if the values are rearranged after sorting
    const rows = await page.findAll('pds-table-row');
    const values = await Promise.all(rows.map(async (row) => (await row.find('pds-table-cell')).textContent.trim()));

    // Assert that the values are different after sorting
    expect(values).not.toEqual(['Row 1, Column 1', 'Row 2, Column 1']);
  });
});

describe('pds-table column widths', () => {
  const LONG = 'Averyveryverylongunbreakablevaluethatwouldwidenanautocolumn';

  const table = (attrs: string, rows: [string, string, string][]) => `
    <div style="width: 600px">
      <pds-table component-id="widths" ${attrs}>
        <pds-table-head>
          <pds-table-head-cell width="100px" sortable>Name</pds-table-head-cell>
          <pds-table-head-cell width="150px">Status</pds-table-head-cell>
          <pds-table-head-cell>Notes</pds-table-head-cell>
        </pds-table-head>
        <pds-table-body>
          ${rows
            .map(
              (row) => `
            <pds-table-row>
              ${row.map((value) => `<pds-table-cell>${value}</pds-table-cell>`).join('')}
            </pds-table-row>`,
            )
            .join('')}
        </pds-table-body>
      </pds-table>
    </div>
  `;

  const headWidths = (page) =>
    page.$$eval('pds-table-head-cell', (cells) =>
      cells.map((cell) => Math.round(cell.getBoundingClientRect().width)),
    );

  it('gives fixed-layout columns their head cell widths whatever the content', async () => {
    const page = await newE2EPage();
    await page.setContent(table('table-layout="fixed"', [[LONG, 'Active', 'Short']]));
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([100, 150, 350]);
  });

  it('keeps fixed-layout column widths when the rows change', async () => {
    const page = await newE2EPage();
    await page.setContent(
      table('table-layout="fixed"', [
        ['Zed', 'Active', 'Short'],
        [LONG, 'Unsubscribed manually', 'A longer note'],
      ]),
    );
    await page.waitForChanges();
    const before = await headWidths(page);

    await page.click('pds-table-head-cell');
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual(before);
    expect(before).toEqual([100, 150, 350]);
  });

  it('gives responsive fixed-layout columns their head cell widths', async () => {
    const page = await newE2EPage();
    await page.setContent(table('table-layout="fixed" responsive', [[LONG, 'Active', 'Short']]));
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([100, 150, 350]);
  });

  it('scrolls a responsive fixed-layout table whose widths exceed its container', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 300px">
        <pds-table component-id="wide" table-layout="fixed" responsive>
          <pds-table-head>
            <pds-table-head-cell width="200px">Name</pds-table-head-cell>
            <pds-table-head-cell width="200px">Email</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Jane Doe</pds-table-cell>
              <pds-table-cell>jane@example.com</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([200, 200]);
    const container = await page.evaluate(() => {
      const el = document.querySelector('pds-table').shadowRoot.querySelector('.pds-table-responsive-container');
      return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
    });
    expect(container.clientWidth).toBe(300);
    expect(container.scrollWidth).toBe(400);
  });

  it('gives fixed-layout columns their widths in a right-to-left table', async () => {
    const page = await newE2EPage();
    await page.setContent(`<div dir="rtl">${table('table-layout="fixed"', [[LONG, 'Active', 'Short']])}</div>`);
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([100, 150, 350]);
    // The first column starts at the inline-start (right) edge.
    const [first, last] = await page.$$eval('pds-table-head-cell', (cells) =>
      [cells[0], cells[cells.length - 1]].map((cell) => cell.getBoundingClientRect().left),
    );
    expect(first).toBeGreaterThan(last);
  });

  it('treats the width as a minimum in the default auto layout', async () => {
    const page = await newE2EPage();
    await page.setContent(table('', [['Zed', 'Active', 'Short']]));
    await page.waitForChanges();

    const [name, status] = await headWidths(page);
    expect(name).toBeGreaterThanOrEqual(100);
    expect(status).toBeGreaterThanOrEqual(150);
  });

  it('gives the select-all column of a selectable fixed-layout table a width', async () => {
    const page = await newE2EPage();
    await page.setContent(table('table-layout="fixed" selectable', [['Zed', 'Active', 'Short']]));
    await page.waitForChanges();

    const checkboxWidth = await page.evaluate(() =>
      Math.round(
        document
          .querySelector('pds-table-head')
          .shadowRoot.querySelector('pds-table-head-cell')
          .getBoundingClientRect().width,
      ),
    );
    expect(checkboxWidth).toBe(48);
    expect(await headWidths(page)).toEqual([100, 150, 302]);
  });

  it('truncates a cell to its fixed-layout column', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 600px">
        <pds-table component-id="truncate" table-layout="fixed">
          <pds-table-head>
            <pds-table-head-cell width="200px">Name</pds-table-head-cell>
            <pds-table-head-cell>Notes</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Jane Doe</pds-table-cell>
              <pds-table-cell truncate>${LONG} ${LONG}</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    const cell = await page.evaluate(() => {
      const el = document.querySelectorAll('pds-table-cell')[1] as HTMLElement;
      return {
        width: Math.round(el.getBoundingClientRect().width),
        overflowing: el.scrollWidth > el.clientWidth,
      };
    });
    expect(cell.width).toBe(400);
    expect(cell.overflowing).toBe(true);
  });
});

describe('pds-table accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table component-id="people">
        <pds-table-head>
          <pds-table-head-cell>Name</pds-table-head-cell>
          <pds-table-head-cell>Email</pds-table-head-cell>
        </pds-table-head>
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell>Jane Doe</pds-table-cell>
            <pds-table-cell>jane@example.com</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
