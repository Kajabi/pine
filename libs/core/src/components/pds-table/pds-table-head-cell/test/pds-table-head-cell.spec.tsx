import { newSpecPage } from '@stencil/core/testing';
import { PdsTable } from '../../pds-table';
import { PdsTableHeadCell } from '../pds-table-head-cell';

import { upSmall } from '@pine-ds/icons/icons';

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
          <pds-icon icon="${upSmall}"></pds-icon>
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

  it('toggles is-scrolled class when table has fixed column and is scrolled', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell, PdsTable],
      html: `<pds-table responsive fixed-column component-id="test-table"><pds-table-head-cell></pds-table-head-cell></pds-table>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    const table = page.body.querySelector('pds-table') as HTMLElement;

    // Wait for container to be available and listeners set up
    let container: HTMLElement | null = null;
    let attempts = 0;
    while (!container && attempts < 10) {
      container = table.shadowRoot?.querySelector('.pds-table-responsive-container') as HTMLElement;
      if (!container) {
        await new Promise(resolve => setTimeout(resolve, 10));
        await page.waitForChanges();
        attempts++;
      }
    }

    expect(container).toBeTruthy();

    // Simulate scroll on the container element
    if (container) {
      container.scrollLeft = 10;
      container.dispatchEvent(new Event('scroll'));
    }

    await page.waitForChanges();

    expect(tableHeadCell).toHaveClass('has-scrolled');

    // Reset scroll
    if (container) {
      container.scrollLeft = 0;
      container.dispatchEvent(new Event('scroll'));
    }

    await page.waitForChanges();

    expect(tableHeadCell).not.toHaveClass('has-scrolled');
  });

  it('handles sort click', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell, PdsTable],
      html: `<pds-table><pds-table-head-cell sortable></pds-table-head-cell></pds-table>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;

    tableHeadCell.click();

    expect(tableHeadCell.classList.contains('is-active')).toBe(true);
  });

  it('renders without alignment class when cellAlign is not set', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell></pds-table-head-cell>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    expect(tableHeadCell.classList.toString()).not.toContain('pds-table-head-cell--align-');
  });

  it('renders with alignment class when cellAlign is set to start', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell cell-align="start"></pds-table-head-cell>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    expect(tableHeadCell).toHaveClass('pds-table-head-cell--align-start');
  });

  it('renders with alignment class when cellAlign is set to center', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell cell-align="center"></pds-table-head-cell>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    expect(tableHeadCell).toHaveClass('pds-table-head-cell--align-center');
  });

  it('renders with alignment class when cellAlign is set to end', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell cell-align="end"></pds-table-head-cell>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    expect(tableHeadCell).toHaveClass('pds-table-head-cell--align-end');
  });

  it('renders with alignment class when cellAlign is set to justify', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell cell-align="justify"></pds-table-head-cell>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    expect(tableHeadCell).toHaveClass('pds-table-head-cell--align-justify');
  });

  it('renders with both alignment and sortable classes when both props are set', async () => {
    const page = await newSpecPage({
      components: [PdsTableHeadCell],
      html: `<pds-table-head-cell cell-align="center" sortable="true"></pds-table-head-cell>`,
    });

    const tableHeadCell = page.body.querySelector('pds-table-head-cell') as HTMLElement;
    expect(tableHeadCell).toHaveClass('pds-table-head-cell--align-center');
    expect(tableHeadCell).toHaveClass('is-sortable');
  });
});
