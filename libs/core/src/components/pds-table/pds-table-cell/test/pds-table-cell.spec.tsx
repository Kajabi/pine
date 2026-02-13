import { newSpecPage } from '@stencil/core/testing';
import { PdsTableCell } from '../pds-table-cell';
import { PdsTable } from '../../pds-table';

// Mock ResizeObserver for truncation tooltip tests
(globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver || class {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

describe('pds-table-cell', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell></pds-table-cell>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table-cell role="gridcell" part="cell">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-table-cell>
    `);
  });

  it('renders truncated when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell truncate="true"></pds-table-cell>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-table-cell role="gridcell" truncate="true" class="is-truncated" part="cell" tabindex="0">
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

    expect(tableCell).toHaveClass('has-scrolled');

    // Reset scroll
    if (container) {
      container.scrollLeft = 0;
      container.dispatchEvent(new Event('scroll'));
    }

    await page.waitForChanges();

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

  it('initializes truncation tooltip when truncate is set', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell truncate="true">Long text content</pds-table-cell>`,
    });

    // Verify the component loaded without errors
    expect(page.root).toBeTruthy();
    expect(page.rootInstance.truncate).toBe(true);
  });

  it('cleans up truncation tooltip on disconnect', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell truncate="true">Long text</pds-table-cell>`,
    });

    // Should not throw when disconnected
    page.root!.remove();
    await page.waitForChanges();
  });

  it('shows tooltip when text overflows', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell truncate="true">This is a very long text that will definitely overflow</pds-table-cell>`,
    });

    const tableCell = page.root as HTMLElement;
    expect(tableCell).toBeTruthy();

    // Mock overflow by setting scrollWidth > clientWidth
    Object.defineProperty(tableCell, 'scrollWidth', { value: 500, configurable: true });
    Object.defineProperty(tableCell, 'clientWidth', { value: 100, configurable: true });

    // Simulate mouseenter
    tableCell.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Check that a tooltip portal was created
    const tooltip = document.querySelector('.pds-truncation-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');

    // Cleanup
    tableCell.dispatchEvent(new MouseEvent('mouseleave'));
  });

  it('does not show tooltip when text fits', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell truncate="true">Short</pds-table-cell>`,
    });

    const tableCell = page.root as HTMLElement;
    expect(tableCell).toBeTruthy();

    // Mock no overflow: scrollWidth <= clientWidth
    Object.defineProperty(tableCell, 'scrollWidth', { value: 50, configurable: true });
    Object.defineProperty(tableCell, 'clientWidth', { value: 100, configurable: true });

    // Simulate mouseenter
    tableCell.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Check that no tooltip was created
    const tooltip = document.querySelector('.pds-truncation-tooltip');
    expect(tooltip).toBeNull();
  });

  it('adds tabindex="0" when truncate is enabled', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell truncate="true">Text</pds-table-cell>`,
    });

    expect(page.root?.getAttribute('tabindex')).toBe('0');
  });

  it('does not add tabindex when truncate is disabled', async () => {
    const page = await newSpecPage({
      components: [PdsTableCell],
      html: `<pds-table-cell>Text</pds-table-cell>`,
    });

    expect(page.root?.getAttribute('tabindex')).toBeNull();
  });
});
