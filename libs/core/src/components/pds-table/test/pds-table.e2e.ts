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

  it('floors an auto column instead of squeezing it when the explicit-width columns already fill a narrow container', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 343px">
        <pds-table component-id="floor" table-layout="fixed" responsive>
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell width="134px">Added</pds-table-head-cell>
            <pds-table-head-cell width="216px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell>Mar 4, 2024</pds-table-cell>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([148, 134, 216, 120]);
    const container = await page.evaluate(() => {
      const el = document.querySelector('pds-table').shadowRoot.querySelector('.pds-table-responsive-container');
      return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
    });
    expect(container.clientWidth).toBe(343);
    expect(container.scrollWidth).toBe(618);
  });

  it('counts the select-all column when flooring an auto column in a selectable table', async () => {
    const page = await newE2EPage();
    // 440px leaves the auto column 140px if the select-all column is ignored, but only 92px once
    // its 48px is taken out -- below the 120px floor.
    await page.setContent(`
      <div style="width: 440px">
        <pds-table component-id="selectable-floor" table-layout="fixed" responsive selectable>
          <pds-table-head>
            <pds-table-head-cell width="300px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([300, 120]);
    const container = await page.evaluate(() => {
      const el = document.querySelector('pds-table').shadowRoot.querySelector('.pds-table-responsive-container');
      return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
    });
    expect(container.clientWidth).toBe(440);
    expect(container.scrollWidth).toBe(468);
  });

  it('floors an auto column against a non-px explicit width, measured from layout', async () => {
    const page = await newE2EPage();
    // 20rem is 320px of a 400px container, leaving the auto column only 80px -- below the floor.
    // If the explicit column's width went unmeasured (treated as 0 instead of being read from
    // layout), the auto column would wrongly see the full 400px and never floor, so this actually
    // distinguishes the fix from the bug, unlike a wide-open percentage width would.
    await page.setContent(`
      <div style="width: 400px">
        <pds-table component-id="rem-width" table-layout="fixed" responsive>
          <pds-table-head>
            <pds-table-head-cell width="20rem">Status</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Active</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([320, 120]);
  });

  it('clears a floor and reapplies it as table-layout switches away from and back to fixed', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 343px">
        <pds-table component-id="layout-switch" table-layout="fixed" responsive>
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell width="134px">Added</pds-table-head-cell>
            <pds-table-head-cell width="216px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell>Mar 4, 2024</pds-table-cell>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();
    expect(await headWidths(page)).toEqual([148, 134, 216, 120]);

    await page.evaluate(() => {
      document.querySelector('pds-table').setAttribute('table-layout', 'auto');
    });
    await page.waitForChanges();

    const nameWidthAuto = await page.evaluate(() => {
      const el = document.querySelectorAll('pds-table-head-cell')[3];
      return el.style.getPropertyValue('--pds-table-head-cell-auto-floor-width');
    });
    expect(nameWidthAuto).toBe('');

    await page.evaluate(() => {
      document.querySelector('pds-table').setAttribute('table-layout', 'fixed');
    });
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([148, 134, 216, 120]);
  });

  it('clears a floor and reapplies it as responsive toggles off and back on, table-layout unchanged', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 343px">
        <pds-table component-id="responsive-switch" table-layout="fixed" responsive>
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell width="134px">Added</pds-table-head-cell>
            <pds-table-head-cell width="216px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell>Mar 4, 2024</pds-table-cell>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();
    expect(await headWidths(page)).toEqual([148, 134, 216, 120]);

    await page.evaluate(() => {
      document.querySelector('pds-table').removeAttribute('responsive');
    });
    await page.waitForChanges();

    const nameWidthNonResponsive = await page.evaluate(() => {
      const el = document.querySelectorAll('pds-table-head-cell')[3];
      return el.style.getPropertyValue('--pds-table-head-cell-auto-floor-width');
    });
    expect(nameWidthNonResponsive).toBe('');

    await page.evaluate(() => {
      document.querySelector('pds-table').setAttribute('responsive', '');
    });
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([148, 134, 216, 120]);
  });

  it('measures the real container when responsive turns on, not the pre-render tree', async () => {
    const page = await newE2EPage();
    // Plenty of room (700 - 148 - 134 - 216 = 202px for the auto column) -- the opposite of the
    // other toggle tests, which all start already needing the floor. A `@Watch` that measured
    // before this component's own re-render created `.pds-table-responsive-container` would read
    // an empty/zero width there and wrongly floor the auto column anyway.
    await page.setContent(`
      <div style="width: 700px">
        <pds-table component-id="responsive-on-measures-live" table-layout="fixed">
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell width="134px">Added</pds-table-head-cell>
            <pds-table-head-cell width="216px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell>Mar 4, 2024</pds-table-cell>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    await page.evaluate(() => {
      document.querySelector('pds-table').setAttribute('responsive', '');
    });
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([148, 134, 216, 202]);
  });

  it('wires up responsive scrolling when responsive turns on at runtime, and tears it down when it turns off', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 300px">
        <pds-table component-id="responsive-scroll-toggle" table-layout="fixed">
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

    const scrollContainer = () =>
      page.evaluate(() => {
        const el = document.querySelector('pds-table').shadowRoot.querySelector('.pds-table-responsive-container');
        return el ? { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth } : null;
      });

    // Without responsive, there's no scroll container at all yet.
    expect(await scrollContainer()).toBeNull();

    await page.evaluate(() => {
      document.querySelector('pds-table').setAttribute('responsive', '');
    });
    await page.waitForChanges();

    const afterOn = await scrollContainer();
    expect(afterOn.clientWidth).toBe(300);
    expect(afterOn.scrollWidth).toBe(400);

    // Scrolling it proves the listener actually got attached, not just that the markup exists.
    const rightShadowOpacity = await page.evaluate(async () => {
      const table = document.querySelector('pds-table');
      const container = table.shadowRoot.querySelector('.pds-table-responsive-container');
      container.scrollLeft = 50;
      container.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 50));
      return getComputedStyle(table.shadowRoot.querySelector('.scroll-shadow-right')).opacity;
    });
    expect(rightShadowOpacity).toBe('1');

    await page.evaluate(() => {
      document.querySelector('pds-table').removeAttribute('responsive');
    });
    await page.waitForChanges();

    expect(await scrollContainer()).toBeNull();
  });

  it('rebinds a fixed-column cell\'s own scroll shadow when responsive turns on at runtime', async () => {
    const page = await newE2EPage();
    // The cell caches its scroll container at load and stays in light DOM across the toggle, so
    // it never reconnects on its own -- without an explicit rebind it would keep listening to
    // nothing (there was no container yet) instead of the one the table just created.
    await page.setContent(`
      <div style="width: 150px">
        <pds-table component-id="fixed-column-rebind" fixed-column>
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

    await page.evaluate(() => {
      document.querySelector('pds-table').setAttribute('responsive', '');
    });
    await page.waitForChanges();

    await page.evaluate(async () => {
      const table = document.querySelector('pds-table');
      const container = table.shadowRoot.querySelector('.pds-table-responsive-container');
      container.scrollLeft = 20;
      container.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const firstCellScrolled = await page.evaluate(() =>
      document.querySelectorAll('pds-table-cell')[0].classList.contains('has-scrolled'),
    );
    expect(firstCellScrolled).toBe(true);
  });

  it('drops a fixed-column scroll shadow once responsive turns off, not just its listener', async () => {
    // Turning `responsive` off tears the scroll listener down without setting it back up, which
    // must not leave the shadow it was driving stuck on with nothing left to ever clear it.
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 150px">
        <pds-table component-id="fixed-column-unbind" fixed-column responsive>
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

    await page.evaluate(async () => {
      const table = document.querySelector('pds-table');
      const container = table.shadowRoot.querySelector('.pds-table-responsive-container');
      container.scrollLeft = 20;
      container.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(
      await page.evaluate(() => document.querySelectorAll('pds-table-cell')[0].classList.contains('has-scrolled')),
    ).toBe(true);
    expect(
      await page.evaluate(() => document.querySelectorAll('pds-table-head-cell')[0].classList.contains('has-scrolled')),
    ).toBe(true);

    await page.evaluate(() => {
      document.querySelector('pds-table').removeAttribute('responsive');
    });
    await page.waitForChanges();

    expect(
      await page.evaluate(() => document.querySelectorAll('pds-table-cell')[0].classList.contains('has-scrolled')),
    ).toBe(false);
    expect(
      await page.evaluate(() => document.querySelectorAll('pds-table-head-cell')[0].classList.contains('has-scrolled')),
    ).toBe(false);
  });

  // The select-all and row-checkbox cells sit in pds-table-head's and pds-table-row's own
  // shadow roots rather than coming through a `<slot>`, so a sync that only walks light DOM
  // never reaches them -- they'd keep listening on the container the toggle just replaced.
  it('rebinds the select-all and row-checkbox cells once responsive toggles back on', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 150px">
        <pds-table component-id="checkbox-cell-rebind" fixed-column responsive selectable>
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

    // Turning `responsive` off and back on tears the old `.pds-table-responsive-container` down
    // and renders a new one -- the case the cached-container bug actually needs.
    await page.evaluate(() => document.querySelector('pds-table').removeAttribute('responsive'));
    await page.waitForChanges();
    await page.evaluate(() => document.querySelector('pds-table').setAttribute('responsive', ''));
    await page.waitForChanges();

    await page.evaluate(async () => {
      const table = document.querySelector('pds-table');
      const container = table.shadowRoot.querySelector('.pds-table-responsive-container');
      container.scrollLeft = 20;
      container.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const selectAllScrolled = await page.evaluate(() =>
      document.querySelector('pds-table-head').shadowRoot.querySelector('pds-table-head-cell').classList.contains('has-scrolled'),
    );
    const checkboxCellScrolled = await page.evaluate(() =>
      document.querySelector('pds-table-row').shadowRoot.querySelector('pds-table-cell').classList.contains('has-scrolled'),
    );
    expect(selectAllScrolled).toBe(true);
    expect(checkboxCellScrolled).toBe(true);
  });

  it('does not leak a window resize listener when the table unmounts right after a layout change', async () => {
    const page = await newE2EPage();
    // Starts with neither responsive nor fixed layout, so no listener exists yet -- the spy
    // installed after mount only has to explain any listener that shows up from here on, with
    // nothing from initial load to account for.
    await page.setContent(`
      <div style="width: 343px">
        <pds-table component-id="unmount-during-sync">
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    const leakedResizeListeners = await page.evaluate(async () => {
      let active = 0;
      const originalAdd = window.addEventListener.bind(window);
      const originalRemove = window.removeEventListener.bind(window);
      window.addEventListener = ((type: string, ...rest: unknown[]) => {
        if (type === 'resize') active++;
        return (originalAdd as any)(type, ...rest);
      }) as typeof window.addEventListener;
      window.removeEventListener = ((type: string, ...rest: unknown[]) => {
        if (type === 'resize') active--;
        return (originalRemove as any)(type, ...rest);
      }) as typeof window.removeEventListener;

      const table = document.querySelector('pds-table');
      // Turning both on starts the fixed-layout and responsive-scroll setup (deferred to
      // componentDidRender), then removing the table before that render flushes is what the fix
      // has to see coming: without it, the deferred sync still runs, re-adding the listener this
      // same disconnect already should have ruled out.
      table.setAttribute('table-layout', 'fixed');
      table.setAttribute('responsive', '');
      table.remove();

      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      window.addEventListener = originalAdd;
      window.removeEventListener = originalRemove;
      return active;
    });

    expect(leakedResizeListeners).toBe(0);
  });

  it('grows the auto column back once resizing gives it room again', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div id="resizable" style="width: 343px">
        <pds-table component-id="grows-back" table-layout="fixed" responsive>
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell width="134px">Added</pds-table-head-cell>
            <pds-table-head-cell width="216px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell>Mar 4, 2024</pds-table-cell>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();
    expect(await headWidths(page)).toEqual([148, 134, 216, 120]);

    await page.evaluate(() => {
      document.getElementById('resizable').style.width = '700px';
    });
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([148, 134, 216, 202]);
  });

  it('never floors an auto column without responsive, since the table itself would be what grows', async () => {
    const page = await newE2EPage();
    // Without responsive there's no container the floor's own growth leaves unaffected to
    // measure against -- applying it here would have the table measure its own effect on itself.
    await page.setContent(`
      <div style="width: 343px">
        <pds-table component-id="no-responsive-floor" table-layout="fixed">
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell width="134px">Added</pds-table-head-cell>
            <pds-table-head-cell width="216px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell>Mar 4, 2024</pds-table-cell>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    const nameFloorVar = await page.evaluate(() =>
      (document.querySelectorAll('pds-table-head-cell')[3] as HTMLElement).style.getPropertyValue(
        '--pds-table-head-cell-auto-floor-width',
      ),
    );
    expect(nameFloorVar).toBe('');
  });

  it('re-floors an auto column once a new column is added, and once an existing one changes width', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 343px">
        <pds-table component-id="mutation-floor" table-layout="fixed" responsive>
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();
    // 343 - 148 = 195px for the one auto column -- plenty of room, no floor yet.
    expect(await headWidths(page)).toEqual([148, 195]);

    await page.evaluate(() => {
      const head = document.querySelector('pds-table-head');
      const cell = document.createElement('pds-table-head-cell');
      cell.setAttribute('width', '134px');
      cell.textContent = 'Added';
      head.appendChild(cell);
    });
    await page.waitForChanges();
    // 343 - 148 - 134 = 61px left for the auto column, now below the floor.
    expect(await headWidths(page)).toEqual([148, 120, 134]);

    await page.evaluate(() => {
      document.querySelectorAll('pds-table-head-cell')[0].setAttribute('width', '80px');
    });
    await page.waitForChanges();
    // 343 - 80 - 134 = 129px, above the floor again.
    expect(await headWidths(page)).toEqual([80, 129, 134]);
  });

  it('keeps the floor working after the table is removed and reconnected to the DOM', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 343px">
        <pds-table component-id="reconnect-floor" table-layout="fixed" responsive>
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell width="134px">Added</pds-table-head-cell>
            <pds-table-head-cell width="216px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell>Mar 4, 2024</pds-table-cell>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();
    expect(await headWidths(page)).toEqual([148, 134, 216, 120]);

    await page.evaluate(() => {
      const table = document.querySelector('pds-table');
      const parent = table.parentElement;
      parent.removeChild(table);
      parent.appendChild(table);
    });
    await page.waitForChanges();

    // If reconnecting hadn't re-attached the resize observer, this would leave the floor frozen
    // at its stale 120px instead of growing back to its fair share.
    await page.evaluate(() => {
      (document.querySelector('div') as HTMLElement).style.width = '700px';
    });
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([148, 134, 216, 202]);
  });

  it('still applies a pending layout change after the table is moved in the same turn', async () => {
    const page = await newE2EPage();
    // Starts as a plain auto-layout table (no pending sync, nothing to lose by moving it) so the
    // only thing under test is the responsive+fixed change made right before the synchronous
    // move, not the plain reconnect case the previous test already covers.
    await page.setContent(`
      <div style="width: 343px">
        <pds-table component-id="moved-during-pending-sync">
          <pds-table-head>
            <pds-table-head-cell width="148px">Lifetime value</pds-table-head-cell>
            <pds-table-head-cell width="134px">Added</pds-table-head-cell>
            <pds-table-head-cell width="216px">Email marketing</pds-table-head-cell>
            <pds-table-head-cell>Name</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>$12,480.00</pds-table-cell>
              <pds-table-cell>Mar 4, 2024</pds-table-cell>
              <pds-table-cell>Unsubscribed manually</pds-table-cell>
              <pds-table-cell truncate>Alexandra Christina Rodriguez-Fitzgerald</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>
      </div>
    `);
    await page.waitForChanges();

    await page.evaluate(() => {
      const table = document.querySelector('pds-table');
      // Turning both on queues the pending sync (deferred to componentDidRender); moving the
      // table in the same turn, before that render flushes, is the race the fix has to survive.
      table.setAttribute('table-layout', 'fixed');
      table.setAttribute('responsive', '');
      const parent = table.parentElement;
      parent.removeChild(table);
      parent.appendChild(table);
    });
    await page.waitForChanges();

    expect(await headWidths(page)).toEqual([148, 134, 216, 120]);
  });

  it('updates the select-all column too when table-layout switches at runtime', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table component-id="selectable-layout-switch" selectable>
        <pds-table-head>
          <pds-table-head-cell>Name</pds-table-head-cell>
        </pds-table-head>
        <pds-table-body>
          <pds-table-row>
            <pds-table-cell>Zed</pds-table-cell>
          </pds-table-row>
        </pds-table-body>
      </pds-table>
    `);
    await page.waitForChanges();

    // The checkbox's own natural size already happens to match the fixed-layout width token, so
    // width alone can't tell the two layouts apart here -- the `has-width` class can.
    const selectAllHasWidthClass = () =>
      page.evaluate(() =>
        document
          .querySelector('pds-table-head')
          .shadowRoot.querySelector('pds-table-head-cell')
          .classList.contains('has-width'),
      );

    expect(await selectAllHasWidthClass()).toBe(false);

    await page.evaluate(() => document.querySelector('pds-table').setAttribute('table-layout', 'fixed'));
    await page.waitForChanges();

    expect(await selectAllHasWidthClass()).toBe(true);

    await page.evaluate(() => document.querySelector('pds-table').setAttribute('table-layout', 'auto'));
    await page.waitForChanges();

    expect(await selectAllHasWidthClass()).toBe(false);
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
