import { newE2EPage } from '@stencil/core/testing';

describe('pds-select', () => {

  it('should handle option selection', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <pds-select>
        <option value="0">Option 1</option>
        <option value="1">Option 2</option>
      </pds-select>
    `);

    const select = await page.find('pds-select >>> select');
    // Use page.$eval with shadow DOM selector
    await page.$eval('pds-select >>> select', (select: HTMLSelectElement) => {
      select.value = '1';
      select.dispatchEvent(new Event('change'));
    });

    expect(await select.getProperty('value')).toBe('1');
  });

  it('should emit change event when option is selected', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <pds-select>
        <option value="0">Option 1</option>
        <option value="1">Option 2</option>
      </pds-select>
    `);

    const select = await page.find('pds-select');
    const changeEvent = await select.spyOnEvent('pdsSelectChange');

    // Use page.$eval with shadow DOM selector
    await page.$eval('pds-select >>> select', (select: HTMLSelectElement) => {
      select.value = '1';
      select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });

    expect(changeEvent).toHaveReceivedEventTimes(1);
    expect(changeEvent).toHaveReceivedEventDetail({
      isTrusted: false
    });
  });
});
