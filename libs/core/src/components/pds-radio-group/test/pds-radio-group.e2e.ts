import { newE2EPage } from '@stencil/core/testing';

describe('pds-radio-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio-group></pds-radio-group>');

    const element = await page.find('pds-radio-group');
    expect(element).toHaveClass('hydrated');
  });

  it('applies name to all child radios', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group">
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        <pds-radio component-id="radio3" label="Option 3" value="3"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radios = await page.findAll('pds-radio');
    expect(radios.length).toBe(3);

    for (const radio of radios) {
      const name = await radio.getProperty('name');
      expect(name).toBe('test-group');
    }
  });

  it('only allows one radio to be selected at a time', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group">
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        <pds-radio component-id="radio3" label="Option 3" value="3"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radio1 = await page.find('pds-radio[component-id="radio1"] >>> input');
    const radio2 = await page.find('pds-radio[component-id="radio2"] >>> input');
    const radio3 = await page.find('pds-radio[component-id="radio3"] >>> input');

    // Click first radio
    await radio1.click();
    await page.waitForChanges();

    let checked1 = await radio1.getProperty('checked');
    let checked2 = await radio2.getProperty('checked');
    let checked3 = await radio3.getProperty('checked');

    expect(checked1).toBe(true);
    expect(checked2).toBe(false);
    expect(checked3).toBe(false);

    // Click second radio
    await radio2.click();
    await page.waitForChanges();

    checked1 = await radio1.getProperty('checked');
    checked2 = await radio2.getProperty('checked');
    checked3 = await radio3.getProperty('checked');

    expect(checked1).toBe(false);
    expect(checked2).toBe(true);
    expect(checked3).toBe(false);
  });

  it('displays error message when invalid and errorMessage are set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group" invalid error-message="Please select an option">
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const errorMessage = await page.find('.pds-radio-group__message--error');
    expect(errorMessage).toBeTruthy();
    expect(await errorMessage.textContent).toContain('Please select an option');
  });

  it('applies invalid state to all child radios', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group" invalid>
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radios = await page.findAll('pds-radio');
    for (const radio of radios) {
      const invalid = await radio.getProperty('invalid');
      expect(invalid).toBe(true);
    }
  });

  it('displays helper message when helperMessage is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group" helper-message="This is a helper message">
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const helperMessage = await page.find('.pds-radio-group__message:not(.pds-radio-group__message--error)');
    expect(helperMessage).toBeTruthy();
    expect(await helperMessage.textContent).toBe('This is a helper message');
  });

  it('displays group label when label is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group" label="Comments">
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const label = await page.find('.pds-radio-group__label');
    expect(label).toBeTruthy();
    expect(await label.textContent).toBe('Comments');
  });

  it('works with form submission', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form id="test-form">
        <pds-radio-group name="test-group">
          <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
          <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        </pds-radio-group>
        <button type="submit">Submit</button>
      </form>
    `);

    await page.waitForChanges();

    // Click the actual input element inside the radio
    const radio2Input = await page.find('pds-radio[component-id="radio2"] >>> input');
    await radio2Input.click();
    await page.waitForChanges();

    // Verify the radio is checked
    const checked = await radio2Input.getProperty('checked');
    expect(checked).toBe(true);

    const formData = await page.evaluate(() => {
      const formEl = document.querySelector('form') as HTMLFormElement;
      const data = new FormData(formEl);
      return Array.from(data.entries());
    });

    expect(formData).toContainEqual(['test-group', '2']);
  });

  it('applies required attribute to child radios when required is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group" required>
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radios = await page.findAll('pds-radio');
    for (const radio of radios) {
      const required = await radio.getProperty('required');
      expect(required).toBe(true);
    }
  });

  it('emits pdsRadioGroupChange event when a child radio is selected', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group">
        <pds-radio component-id="radio1" label="Option 1" value="option1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="option2"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radioGroup = await page.find('pds-radio-group');
    const changeEvent = await radioGroup.spyOnEvent('pdsRadioGroupChange');

    const radio1Input = await page.find('pds-radio[component-id="radio1"] >>> input');
    await radio1Input.click();
    await page.waitForChanges();

    expect(changeEvent).toHaveReceivedEvent();
    expect(changeEvent).toHaveReceivedEventDetail({
      checked: true,
      value: 'option1',
      componentId: 'radio1',
    });
  });

  it('emits pdsRadioGroupChange with correct details when different radio is selected', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group">
        <pds-radio component-id="radio1" label="Option 1" value="option1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="option2"></pds-radio>
        <pds-radio component-id="radio3" label="Option 3" value="option3"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radioGroup = await page.find('pds-radio-group');
    const changeEvent = await radioGroup.spyOnEvent('pdsRadioGroupChange');

    // Select first radio
    const radio1Input = await page.find('pds-radio[component-id="radio1"] >>> input');
    await radio1Input.click();
    await page.waitForChanges();

    expect(changeEvent).toHaveReceivedEventTimes(1);
    expect(changeEvent).toHaveReceivedEventDetail({
      checked: true,
      value: 'option1',
      componentId: 'radio1',
    });

    // Select second radio
    const radio2Input = await page.find('pds-radio[component-id="radio2"] >>> input');
    await radio2Input.click();
    await page.waitForChanges();

    expect(changeEvent).toHaveReceivedEventTimes(2);
    expect(changeEvent).toHaveReceivedEventDetail({
      checked: true,
      value: 'option2',
      componentId: 'radio2',
    });
  });

  it('does not emit event for radios outside the group', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group" component-id="group1">
        <pds-radio component-id="radio1" label="Option 1" value="option1"></pds-radio>
      </pds-radio-group>
      <pds-radio-group name="other-group" component-id="group2">
        <pds-radio component-id="radio2" label="Option 2" value="option2"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radioGroup1 = await page.find('pds-radio-group[component-id="group1"]');
    const changeEvent1 = await radioGroup1.spyOnEvent('pdsRadioGroupChange');

    const radioGroup2 = await page.find('pds-radio-group[component-id="group2"]');
    const changeEvent2 = await radioGroup2.spyOnEvent('pdsRadioGroupChange');

    // Click radio in group 2
    const radio2Input = await page.find('pds-radio[component-id="radio2"] >>> input');
    await radio2Input.click();
    await page.waitForChanges();

    // Group 1 should not receive the event
    expect(changeEvent1).not.toHaveReceivedEvent();

    // Group 2 should receive the event
    expect(changeEvent2).toHaveReceivedEvent();
    expect(changeEvent2).toHaveReceivedEventDetail({
      checked: true,
      value: 'option2',
      componentId: 'radio2',
    });
  });

  it('disables all child radios when disabled prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group" disabled>
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
        <pds-radio component-id="radio3" label="Option 3" value="3"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radios = await page.findAll('pds-radio');
    expect(radios.length).toBe(3);

    for (const radio of radios) {
      const disabled = await radio.getProperty('disabled');
      expect(disabled).toBe(true);

      // Verify the input element is also disabled
      const input = await radio.find('>>> input');
      const inputDisabled = await input.getProperty('disabled');
      expect(inputDisabled).toBe(true);
    }
  });

  it('prevents interaction when disabled', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio-group name="test-group" disabled>
        <pds-radio component-id="radio1" label="Option 1" value="1"></pds-radio>
        <pds-radio component-id="radio2" label="Option 2" value="2"></pds-radio>
      </pds-radio-group>
    `);

    await page.waitForChanges();

    const radioGroup = await page.find('pds-radio-group');
    const changeEvent = await radioGroup.spyOnEvent('pdsRadioGroupChange');

    // Try to click a disabled radio
    const radio1Input = await page.find('pds-radio[component-id="radio1"] >>> input');
    await radio1Input.click();
    await page.waitForChanges();

    // Event should not be emitted
    expect(changeEvent).not.toHaveReceivedEvent();
  });
});

