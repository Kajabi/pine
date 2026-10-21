import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../../utils/test/axe';

describe('pds-table-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-cell></pds-table-cell>');

    const element = await page.find('pds-table-cell');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with compact styles', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table compact>
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell>Row 1, Column 1</pds-table-cell>
            <pds-table-cell>Row 1, Column 2</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
    `);

    const tableCell = await page.find('pds-table-cell');
    expect(tableCell).toHaveClass('is-compact');
  });

  it('renders with truncated content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table>
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell truncate>Very long content that should be truncated</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
    `);

    const tableCell = await page.find('pds-table-cell');
    expect(tableCell).toHaveClass('is-truncated');
  });

  // The tab stop is there to reach the tooltip, and the tooltip only appears
  // when there is hidden content — so a cell whose content fits stays out of
  // the tab order even though it opted into truncate. In a wide table that is
  // the difference between one dead stop per cell and none.
  it('is focusable only while the content is actually clipped', async () => {
    const page = await newE2EPage();
    // The width has to come from something the table honours. A `width` (or
    // `max-width`) on the cell itself is discarded by table layout: the host
    // measured 784px wide under that markup, the content therefore fit, and
    // the tab stop was correctly absent. The assertion only ever passed when
    // it ran before the post-layout re-measure removed it, which is why it
    // failed intermittently and more often under parallel load.
    await page.setContent(`
      <div style="width: 240px;">
        <pds-table>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell truncate>Very long content that cannot possibly fit in this narrow column</pds-table-cell>
              <pds-table-cell truncate>Hi</pds-table-cell>
              <pds-table-cell>Very long content that cannot possibly fit in this narrow column</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);

    // Read after layout, so this asserts the settled state rather than racing
    // the initial measurement.
    await page.waitForChanges();

    const [clipped, fits, plain] = await page.$$eval('pds-table-cell', (els) =>
      els.map((el) => el.getAttribute('tabindex')),
    );

    expect(clipped).toBe('0');
    expect(fits).toBeNull();
    expect(plain).toBeNull();
  });

  // Sorting re-appends every row, which disconnects and reconnects each cell in
  // it without a re-render.
  it('shows the fixed column shadow on scroll after the table sorts', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 240px;">
        <pds-table responsive fixed-column>
          <pds-table-head>
            <pds-table-head-cell sortable>Name</pds-table-head-cell>
            <pds-table-head-cell>Email</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Aardvark</pds-table-cell>
              <pds-table-cell>aardvark.with.a.long.address@example.com</pds-table-cell>
            </pds-table-row>
            <pds-table-row>
              <pds-table-cell>Zebra</pds-table-cell>
              <pds-table-cell>zebra.with.a.long.address@example.com</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);

    // The first click sorts descending.
    const nameHeader = await page.find('pds-table-head-cell');
    await nameHeader.click();
    await page.waitForChanges();

    const names = await page.$$eval('pds-table-row', (rows) =>
      rows.map((row) => row.querySelector('pds-table-cell').textContent.trim()),
    );
    expect(names).toEqual(['Zebra', 'Aardvark']);

    await page.$eval('pds-table', (table) => new Promise<void>((resolve) => {
      const container = table.shadowRoot.querySelector('.pds-table-responsive-container') as HTMLElement;
      container.addEventListener('scroll', () => resolve(), { once: true });
      container.scrollLeft = 80;
    }));
    await page.waitForChanges();

    const shadowed = await page.$$eval('pds-table-row', (rows) =>
      rows.map((row) => row.querySelector('pds-table-cell').classList.contains('has-scrolled')),
    );
    expect(shadowed).toEqual([true, true]);

    // The sort icon's missing text alternative and the unfocusable scroll container belong to the
    // head cell and pds-table, not the cell, so those two rules are off here.
    const violations = await runAxe(page, {
      rules: {
        'role-img-alt': { enabled: false },
        'scrollable-region-focusable': { enabled: false },
      },
    });
    expect(formatViolations(violations)).toBe('');
  });
});
