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
      <pds-table-head role="row" part="head">
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

  it('renders a pds-checkbox when selectable is set', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead, PdsTable],
      html: `
        <pds-table selectable="true" fixed-column="true">
          <pds-table-head>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
          </pds-table-head>
        </pds-table>`,
    });

    const head = page.root?.querySelector('pds-table-head');
    const checkbox = head?.shadowRoot?.querySelector('pds-checkbox');

    expect(checkbox).not.toBeNull();
    expect(checkbox?.getAttribute('label')).toBe('Select All Rows');
  });

  it('sets isSelected to true when checkbox is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead, PdsTable],
      html: `
        <pds-table selectable="true">
          <pds-table-head>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
          </pds-table-head>
          <pds-table-body>
            <pds-table-row>
              <pds-table-cell>Row 1, Column 1</pds-table-cell>
              <pds-table-cell>Row 1, Column 2</pds-table-cell>
            </pds-table-row>
          </pds-table-body>
        </pds-table>`,
    });

    const head = page.root?.querySelector('pds-table-head');
    const checkbox = head?.shadowRoot?.querySelector('pds-checkbox');
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    checkbox?.dispatchEvent(inputEvent);
    await page.waitForChanges();

    // Check if isSelected is toggled
    expect((head as unknown as PdsTableHead).isSelected).toBe(true);
  });

  it('does not render pds-checkbox when disableSelectAll is set on parent table', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead, PdsTable],
      html: `
        <pds-table selectable="true" disable-select-all="true">
          <pds-table-head>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
            <pds-table-head-cell>Column Title</pds-table-head-cell>
          </pds-table-head>
        </pds-table>`,
    });

    const head = page.root?.querySelector('pds-table-head');
    const checkbox = head?.shadowRoot?.querySelector('pds-checkbox');
    const headCell = head?.shadowRoot?.querySelector('pds-table-head-cell');

    // Checkbox should not be rendered
    expect(checkbox).toBeNull();
    // But the container cell should still exist for column alignment
    expect(headCell).not.toBeNull();
  });

  it('renders with border attribute when border prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead],
      html: `<pds-table-head border="true"></pds-table-head>`,
    });
    expect(page.root).toHaveAttribute('border');
  });

  it('renders with background attribute when background prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead],
      html: `<pds-table-head background="true"></pds-table-head>`,
    });
    expect(page.root).toHaveAttribute('background');
  });

  it('renders with both border and background attributes when both props are set', async () => {
    const page = await newSpecPage({
      components: [PdsTableHead],
      html: `<pds-table-head border="true" background="true"></pds-table-head>`,
    });
    expect(page.root).toHaveAttribute('border');
    expect(page.root).toHaveAttribute('background');
  });
});
