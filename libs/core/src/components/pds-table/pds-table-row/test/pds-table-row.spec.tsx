import { newSpecPage } from '@stencil/core/testing';
import { PdsTable } from '../../pds-table';
import { PdsTableBody } from '../../pds-table-body/pds-table-body';
import { PdsTableRow } from '../pds-table-row';

describe('pds-table-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTableRow],
      html: `<pds-table-row></pds-table-row>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-table-row role="row">
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
    const checkbox = row?.shadowRoot?.querySelector('pds-checkbox') as HTMLFormElement;

    checkbox.click();
    await page.waitForChanges();

    expect(row?.classList.contains('is-selected')).toBe(true);
  });
});
