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
      isTrusted: false,
    });
  });

  it('renders action slot content when provided', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-select label="Country">
          <span slot="action">Required</span>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </pds-select>
      `);

    const actionSlot = await page.find('pds-select >>> .pds-select__action');
    expect(actionSlot).not.toBeNull();

    const slotContent = await page.find('pds-select span[slot="action"]');
    expect(await slotContent.innerText).toBe('Required');
  });

  it('does not render action wrapper when no action content is provided', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-select label="Country">
          <option value="us">United States</option>
        </pds-select>
      `);

    const actionSlot = await page.find('pds-select >>> .pds-select__action');
    expect(actionSlot).toBeNull();
  });

  it('sets has-action attribute when action slot has content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-select label="Language">
          <button slot="action">Auto-detect</button>
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </pds-select>
      `);

    const component = await page.find('pds-select');
    expect(component).toHaveAttribute('has-action');
    expect(await component.getAttribute('has-action')).toBe('true');
  });

  it('hides action slot when hideLabel is true', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-select label="Country" hide-label="true">
          <span slot="action">Required</span>
          <option value="us">United States</option>
        </pds-select>
      `);

    const actionSlot = await page.find('pds-select >>> .pds-select__action');
    expect(actionSlot).toBeNull();
  });

  it('applies highlight styling when highlight prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-select highlight label="Name" name="name"><option value="1">Option 1</option></pds-select>');

    const component = await page.find('pds-select');
    expect(component).toHaveClass('hydrated');
    expect(component).toHaveAttribute('highlight');

    // Verify highlight attribute is reflected
    const hasHighlight = await component.getAttribute('highlight');
    expect(hasHighlight).not.toBeNull();
  });

  it('toggles highlight attribute when property changes', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-select label="Name" name="name"><option value="1">Option 1</option></pds-select>');
    const component = await page.find('pds-select');

    // Initially no highlight
    expect(component).not.toHaveAttribute('highlight');

    // Set highlight property
    component.setProperty('highlight', true);
    await page.waitForChanges();

    // Should have highlight attribute
    expect(component).toHaveAttribute('highlight');

    // Unset highlight property
    component.setProperty('highlight', false);
    await page.waitForChanges();

    // Should not have highlight attribute
    expect(component).not.toHaveAttribute('highlight');
  });
});
