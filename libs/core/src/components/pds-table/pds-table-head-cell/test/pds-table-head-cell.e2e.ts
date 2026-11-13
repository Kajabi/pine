import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-head-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-head-cell></pds-table-head-cell>');

    const element = await page.find('pds-table-head-cell');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with fixed styles when part attribute is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table fixed-column>
        <pds-table-head>
          <pds-table-head-cell part="fixed-cell">Column 1</pds-table-head-cell>
          <pds-table-head-cell>Column 2</pds-table-head-cell>
        </pds-table-head>
      </pds-table>
    `);

    const headCell = await page.find('pds-table-head-cell');
    expect(headCell).toHaveClass('is-fixed');
  });

  it('toggles is-active class when sortable and clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table>
        <pds-table-head>
          <pds-table-head-cell sortable>Column 1</pds-table-head-cell>
        </pds-table-head>
      </pds-table>
    `);

    const headCell = await page.find('pds-table-head-cell');

    await headCell.click();
    await page.waitForChanges();

    const classList = await headCell.getAttribute('class');
    expect(classList).toContain('is-active');
  });

  // Moving the table (reparent or DOM morph) disconnects and reconnects every head cell.
  // pds-table itself rebinds its own observers on reconnect; the head cell must rebind the
  // scroll listener that drives its fixed-column shadow too, or the shadow freezes for good.
  it('keeps the fixed-column shadow working after the table is removed and reconnected to the DOM', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 150px">
        <pds-table component-id="head-cell-reconnect" fixed-column responsive>
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
      </div>
    `);
    await page.waitForChanges();

    const scroll = () =>
      page.evaluate(async () => {
        const table = document.querySelector('pds-table');
        const container = table.shadowRoot.querySelector('.pds-table-responsive-container');
        container.scrollLeft = 20;
        container.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 50));
      });
    const hasShadow = () =>
      page.evaluate(() => document.querySelectorAll('pds-table-head-cell')[0].classList.contains('has-scrolled'));

    await scroll();
    expect(await hasShadow()).toBe(true);

    await page.evaluate(() => {
      const table = document.querySelector('pds-table');
      const parent = table.parentElement;
      parent.removeChild(table);
      parent.appendChild(table);
    });
    await page.waitForChanges();

    // The reconnect resets the scroll position to 0, so the shadow should be gone again --
    // and, if the listener didn't rebind, scrolling back wouldn't bring it back at all.
    expect(await hasShadow()).toBe(false);

    await scroll();
    expect(await hasShadow()).toBe(true);
  });
});
