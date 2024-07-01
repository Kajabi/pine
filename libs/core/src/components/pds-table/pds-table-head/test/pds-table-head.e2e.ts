import { newE2EPage } from '@stencil/core/testing';

describe('pds-table-head', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-table-head></pds-table-head>');

    const element = await page.find('pds-table-head');
    expect(element).toHaveClass('hydrated');
  });

  it('emits pdsTableSelectAll event when the pds-checkbox is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-table selectable="true">
        <pds-table-head>
          <pds-table-head-cell>Column Title</pds-table-head-cell>
          <pds-table-head-cell>Column Title</pds-table-head-cell>
          <pds-table-head-cell>Column Title</pds-table-head-cell>
        </pds-table-head>
      </pds-table>
    `);

    const head = await page.find('pds-table-head');
    const checkbox = await page.find('pds-table-head >>> pds-checkbox');

    const pdsTableSelectAllSpy = await head.spyOnEvent('pdsTableSelectAll');


    await checkbox.triggerEvent('input');
    await page.waitForChanges();

    expect(pdsTableSelectAllSpy).toHaveReceivedEventDetail({ isSelected: true });
  });
});
