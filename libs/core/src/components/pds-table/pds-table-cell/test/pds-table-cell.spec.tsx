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

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    expect(tableCell.classList.contains('is-compact')).toBeTruthy();
  });

  it('renders with fixed-cell-position style when tableRef is fixed & selectable', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell, PdsTable],
      html: `<pds-table fixed-column selectable><pds-table-cell></pds-table-cell></pds-table>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    expect(tableCell.style.getPropertyValue('--fixed-cell-position')).toBe('40px');
  });

  it('toggles is-scrolled class when table is scrolled', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell, PdsTable],
      html: `<pds-table responsive fixed-column component-id="test-table"><pds-table-cell></pds-table-cell></pds-table>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    const table = page.body.querySelector('pds-table') as HTMLElement;

    // Allow time for componentDidLoad to set up scroll listeners
    await new Promise(resolve => setTimeout(resolve, 150));

    // Simulate scroll on the container element (where scrolling actually happens)
    const container = table.shadowRoot?.querySelector('.pds-table-responsive-container') as HTMLElement;
    if (container) {
      container.scrollLeft = 10;
      container.dispatchEvent(new Event('scroll'));
    }

    await page.waitForChanges();
    // Additional wait for state update
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(tableCell).toHaveClass('has-scrolled');

    // Reset scroll
    if (container) {
      container.scrollLeft = 0;
      container.dispatchEvent(new Event('scroll'));
    }

    await page.waitForChanges();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(tableCell).not.toHaveClass('has-scrolled');
  });

  it('renders without alignment class when cellAlign is not set', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell></pds-table-cell>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    expect(tableCell.classList.toString()).not.toContain('pds-table-cell--align-');
  });

  it('renders with alignment class when cellAlign is set to start', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell cell-align="start"></pds-table-cell>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    expect(tableCell).toHaveClass('pds-table-cell--align-start');
  });

  it('renders with alignment class when cellAlign is set to center', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell cell-align="center"></pds-table-cell>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    expect(tableCell).toHaveClass('pds-table-cell--align-center');
  });

  it('renders with alignment class when cellAlign is set to end', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell cell-align="end"></pds-table-cell>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    expect(tableCell).toHaveClass('pds-table-cell--align-end');
  });

  it('renders with alignment class when cellAlign is set to justify', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell cell-align="justify"></pds-table-cell>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    expect(tableCell).toHaveClass('pds-table-cell--align-justify');
  });

  it('renders with both alignment and truncate classes when both props are set', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell cell-align="center" truncate="true"></pds-table-cell>`,
    });

    const tableCell = page.body.querySelector('pds-table-cell') as HTMLElement;
    expect(tableCell).toHaveClass('pds-table-cell--align-center');
    expect(tableCell).toHaveClass('is-truncated');
  });
});
