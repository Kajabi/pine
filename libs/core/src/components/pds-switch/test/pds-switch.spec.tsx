import { newSpecPage } from '@stencil/core/testing';
import { PdsSwitch } from '../pds-switch';

describe('pds-switch', () => {
  it('renders an input as a checkbox with label', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-e1"
          label="Switch label">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-e1" class="pds-switch" label="Switch label">
        <mock:shadow-root>
          <input id="pds-switch-e1" name="pds-switch-e1" class="pds-switch__input" type="checkbox">
          <label htmlFor="pds-switch-e1" class="pds-switch__label">Switch label</label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a radio input with label and name defaulting to id', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-radio"
          label="Switch radio"
          type="radio"
          value="on">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-radio" class="pds-switch" label="Switch radio" type="radio" value="on">
        <mock:shadow-root>
          <input id="pds-switch-radio" class="pds-switch__input" type="radio" name="pds-switch-radio" value="on">
          <label htmlFor="pds-switch-radio" class="pds-switch__label">Switch radio</label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a radio input with label and associated group name', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-radio-id"
          label="Switch radio"
          type="radio"
          name="pds-radio-group-name"
          value="on">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-radio-id" class="pds-switch" label="Switch radio" type="radio" name="pds-radio-group-name" value="on">
        <mock:shadow-root>
          <input id="pds-switch-radio-id" class="pds-switch__input" type="radio" name="pds-radio-group-name" value="on">
          <label htmlFor="pds-switch-radio-id" class="pds-switch__label">Switch radio</label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a disabled input', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-disabled"
          label="Switch disabled"
          disabled="true">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-disabled" class="pds-switch" label="Switch disabled" aria-disabled="true" disabled="true">
        <mock:shadow-root>
          <input id="pds-switch-disabled" name="pds-switch-disabled" class="pds-switch__input" type="checkbox" disabled>
          <label htmlFor="pds-switch-disabled" class="pds-switch__label">Switch disabled</label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a required input', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-required"
          label="Switch required"
          required="true">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-required" class="pds-switch" label="Switch required" required="true">
        <mock:shadow-root>
          <input id="pds-switch-required" name="pds-switch-required" class="pds-switch__input" type="checkbox" required>
          <label htmlFor="pds-switch-required" class="pds-switch__label">Switch required</label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a helper message', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-msg"
          label="Switch helper message"
          helper-message="Direct trade next level slow-carb, hashtag distillery">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-msg" class="pds-switch pds-switch--message" label="Switch helper message" helper-message="Direct trade next level slow-carb, hashtag distillery">
        <mock:shadow-root>
          <input aria-describedby="pds-switch-msg__helper-message" id="pds-switch-msg" name="pds-switch-msg" class="pds-switch__input" type="checkbox">
          <label htmlFor="pds-switch-msg" class="pds-switch__label">Switch helper message</label>
          <div id="pds-switch-msg__helper-message"  class="pds-switch__message">Direct trade next level slow-carb, hashtag distillery</div>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders an error message', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-err"
          label="Switch error message"
          error-message="La croix blue bottle narwhal fam"
          invalid="true">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-err" class="pds-switch pds-switch--error" label="Switch error message" error-message="La croix blue bottle narwhal fam" invalid="true">
        <mock:shadow-root>
          <input aria-invalid="true" id="pds-switch-err" name="pds-switch-err" class="pds-switch__input" type="checkbox">
          <label htmlFor="pds-switch-err" class="pds-switch__label">Switch error message</label>
          <div aria-live="assertive" id="pds-switch-err__error-message"  class="pds-switch__message pds-switch__message--error">La croix blue bottle narwhal fam</div>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a helper and error message and assigns aria-description to the input', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html:`
        <pds-switch
          component-id="switch-with-description"
          invalid="true"
          label="Switch with description"
          helper-message="This is a helper message"
          error-message="This is an error message">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="switch-with-description" class="pds-switch pds-switch--message pds-switch--error" label="Switch with description" helper-message="This is a helper message" error-message="This is an error message" invalid="true">
        <mock:shadow-root>
          <input aria-describedby="switch-with-description__error-message" aria-invalid="true" id="switch-with-description" name="switch-with-description" class="pds-switch__input" type="checkbox">
          <label htmlFor="switch-with-description" class="pds-switch__label">Switch with description</label>
          <div id="switch-with-description__helper-message"  class="pds-switch__message">This is a helper message</div>
          <div aria-live="assertive" id="switch-with-description__error-message"  class="pds-switch__message pds-switch__message--error">This is an error message</div>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('emits a `pdsSwitchChange` event when the input is changed', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="switch-with-event"
          label="Switch with event">
        </pds-switch>
      `
    });

    const component = page.root?.shadowRoot?.querySelector('input');
    const eventSpy = jest.fn();

    page.root?.addEventListener('pdsSwitchChange', eventSpy);
    component?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
  });

  it('will not emit a `pdsSwitchChange` event when the input is disabled', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="switch-with-event"
          disabled="true"
          label="Switch with event">
        </pds-switch>
      `
    });

    const component = page.root?.shadowRoot?.querySelector('input');
    const eventSpy = jest.fn();

    page.root?.addEventListener('pdsSwitchChange', eventSpy);
    component?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).not.toHaveBeenCalled();
  });

  it('sets checked to true for radio input on change', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="pds-switch-radio"
          label="Switch radio"
          type="radio"
          value="on">
        </pds-switch>
      `
    });

    const component = page.root?.shadowRoot?.querySelector('input');

    component?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(component?.checked).toBe(true);
  });
});
