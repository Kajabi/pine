import { newSpecPage } from '@stencil/core/testing';
import { PdsTable } from '../../pds-table';
import { PdsTableBody } from '../../pds-table-body/pds-table-body';
import { PdsTableRow } from '../pds-table-row';
import { PdsCheckbox } from '../../../pds-checkbox/pds-checkbox';

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

    checkbox.dispatchEvent(new CustomEvent('pdsCheckboxChange', {
      detail: { checked: true, value: '' },
      bubbles: true,
    }));
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

  it('clears indeterminate when checkbox changes', async () => {
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

    checkbox.dispatchEvent(new CustomEvent('pdsCheckboxChange', {
      detail: { checked: false, value: '' },
      bubbles: true,
    }));
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

  describe('selection checkbox label', () => {
    const renderRows = (rows: string) =>
      newSpecPage({
        components: [PdsTable, PdsTableBody, PdsTableRow],
        html: `<pds-table selectable="true"><pds-table-body>${rows}</pds-table-body></pds-table>`,
      });

    const checkboxLabels = (page) =>
      Array.from(page.root.querySelectorAll('pds-table-row')).map((row: HTMLElement) =>
        row.shadowRoot.querySelector('pds-checkbox').getAttribute('label'),
      );

    it('defaults to "Select Row" on every row', async () => {
      const page = await renderRows('<pds-table-row></pds-table-row><pds-table-row></pds-table-row>');

      expect(checkboxLabels(page)).toEqual(['Select Row', 'Select Row']);
    });

    it('uses each row\'s select-label', async () => {
      const page = await renderRows(`
        <pds-table-row select-label="Select Jane Doe"></pds-table-row>
        <pds-table-row select-label="Sélectionner John Roe"></pds-table-row>
      `);

      expect(checkboxLabels(page)).toEqual(['Select Jane Doe', 'Sélectionner John Roe']);
    });

    it('falls back to the default for an empty or whitespace-only select-label', async () => {
      const page = await renderRows(`
        <pds-table-row select-label=""></pds-table-row>
        <pds-table-row select-label="   "></pds-table-row>
      `);

      expect(checkboxLabels(page)).toEqual(['Select Row', 'Select Row']);
    });

    it('falls back to the default when selectLabel is cleared or set to a non-string', async () => {
      const page = await renderRows('<pds-table-row select-label="Select Jane Doe"></pds-table-row><pds-table-row></pds-table-row>');
      const [first, second] = Array.from(page.root.querySelectorAll('pds-table-row')) as HTMLPdsTableRowElement[];

      first.removeAttribute('select-label');
      (second as unknown as { selectLabel: unknown }).selectLabel = { text: 'Select Jane Doe' };
      await page.waitForChanges();

      expect(checkboxLabels(page)).toEqual(['Select Row', 'Select Row']);
    });

    it('updates the checkbox when select-label changes', async () => {
      const page = await renderRows('<pds-table-row></pds-table-row>');
      const row = page.root.querySelector('pds-table-row') as HTMLPdsTableRowElement;

      row.selectLabel = 'Select Jane Doe';
      await page.waitForChanges();

      expect(checkboxLabels(page)).toEqual(['Select Jane Doe']);
    });
  });

  it('keeps its checkbox id when the row re-renders', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableBody, PdsTableRow, PdsCheckbox],
      html: '<pds-table selectable="true"><pds-table-body><pds-table-row></pds-table-row></pds-table-body></pds-table>',
    });
    const row = page.root.querySelector('pds-table-row') as HTMLPdsTableRowElement;
    const inputId = () => row.shadowRoot.querySelector('pds-checkbox').shadowRoot.querySelector('input').id;
    const initialId = inputId();

    row.isSelected = true;
    await page.waitForChanges();
    expect(inputId()).toBe(initialId);

    row.selectLabel = 'Select Jane Doe';
    await page.waitForChanges();
    expect(inputId()).toBe(initialId);
    expect(initialId).not.toBe('');
  });

  it('keeps its checkbox id when the row is moved, as sorting does', async () => {
    const page = await newSpecPage({
      components: [PdsTable, PdsTableBody, PdsTableRow, PdsCheckbox],
      html: '<pds-table selectable="true"><pds-table-body><pds-table-row></pds-table-row><pds-table-row></pds-table-row></pds-table-body></pds-table>',
    });
    const body = page.root.querySelector('pds-table-body');
    const row = body.querySelector('pds-table-row') as HTMLPdsTableRowElement;
    const checkbox = () => row.shadowRoot.querySelector('pds-checkbox').shadowRoot;
    const initialId = checkbox().querySelector('input').id;

    body.appendChild(row);
    await page.waitForChanges();
    row.isSelected = true;
    await page.waitForChanges();

    expect(checkbox().querySelector('input').id).toBe(initialId);
    expect(checkbox().querySelector('label').getAttribute('for')).toBe(initialId);
  });
});
