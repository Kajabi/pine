import { newSpecPage } from '@stencil/core/testing';
import { PdsSwitch } from '../pds-switch';
import { danger } from '@pine-ds/icons/icons';

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
          <div aria-live="assertive" id="pds-switch-err__error-message" class="pds-switch__message pds-switch__message--error">
            <pds-icon icon="${danger}" size="small"></pds-icon>
            La croix blue bottle narwhal fam
          </div>
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
          <div aria-live="assertive" id="switch-with-description__error-message" class="pds-switch__message pds-switch__message--error">
            <pds-icon icon="${danger}" size="small"></pds-icon>
            This is an error message
          </div>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('updates value prop on value change', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch
          component-id="switch-with-value"
          label="Switch with value">
        </pds-switch>
      `
    });

    const switchEl = page.root?.shadowRoot?.querySelector('input');
    const eventSpy = jest.fn();
    page.root?.addEventListener('pdsSwitchChange', eventSpy);

    expect(page.rootInstance.checked).toBe(false);

    if (switchEl) {
      switchEl.checked = true;
    }
    switchEl?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(page.rootInstance.checked).toBe(true);
  });

});
