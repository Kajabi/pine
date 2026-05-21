import { newSpecPage } from '@stencil/core/testing';
import { PdsSwitch } from '../pds-switch';
import { danger } from '@pine-ds/icons/icons';

describe('pds-switch', () => {
  const mockInternals = {
    setFormValue: jest.fn(),
    setValidity: jest.fn(),
  };
  let originalAttachInternals: unknown;

  beforeAll(() => {
    originalAttachInternals = (HTMLElement.prototype as { attachInternals?: unknown }).attachInternals;
    Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
      configurable: true,
      value: () => mockInternals,
    });
  });

  afterAll(() => {
    if (originalAttachInternals) {
      Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
        configurable: true,
        value: originalAttachInternals,
      });
    } else {
      delete (HTMLElement.prototype as { attachInternals?: unknown }).attachInternals;
    }
  });

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
          <label htmlFor="pds-switch-e1">
            <input id="pds-switch-e1" name="pds-switch-e1" class="pds-switch__input" type="checkbox">
            <span>Switch label</span>
          </label>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('does not render a label when hide-label is true', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch component-id="pds-switch-e1" label="Switch label" hide-label="true">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-e1" class="pds-switch" label="Switch label" hide-label="true">
        <mock:shadow-root>
          <label htmlFor="pds-switch-e1">
            <input id="pds-switch-e1" name="pds-switch-e1" class="pds-switch__input" type="checkbox">
            <span class="visually-hidden">Switch label</span>
          </label>
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
          <label htmlFor="pds-switch-disabled">
            <input id="pds-switch-disabled" name="pds-switch-disabled" class="pds-switch__input" type="checkbox" disabled>
            <span>Switch disabled</span>
          </label>
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
          <label htmlFor="pds-switch-required">
            <input id="pds-switch-required" name="pds-switch-required" class="pds-switch__input" type="checkbox" required>
            <span>Switch required</span>
          </label>
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
          <label htmlFor="pds-switch-msg">
            <input aria-describedby="pds-switch-msg__helper-message" id="pds-switch-msg" name="pds-switch-msg" class="pds-switch__input" type="checkbox">
            <span>Switch helper message</span>
          </label>
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
          <label htmlFor="pds-switch-err">
            <input aria-describedby="pds-switch-err__error-message" aria-invalid="true" id="pds-switch-err" name="pds-switch-err" class="pds-switch__input" type="checkbox">
            <span>Switch error message</span>
          </label>
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
          <label htmlFor="switch-with-description">
            <input aria-describedby="switch-with-description__error-message" aria-invalid="true" id="switch-with-description" name="switch-with-description" class="pds-switch__input" type="checkbox">
            <span>Switch with description</span>
          </label>
          <div id="switch-with-description__helper-message"  class="pds-switch__message">This is a helper message</div>
          <div aria-live="assertive" id="switch-with-description__error-message" class="pds-switch__message pds-switch__message--error">
            <pds-icon icon="${danger}" size="small"></pds-icon>
            This is an error message
          </div>
        </mock:shadow-root>
      </pds-switch>
    `);
  });

  it('renders a name attribute', async () => {
    const page = await newSpecPage({
      components: [PdsSwitch],
      html: `
        <pds-switch component-id="pds-switch-name" name="pds-switch-name" label="Switch name">
        </pds-switch>
      `
    });

    expect(page.root).toEqualHtml(`
      <pds-switch component-id="pds-switch-name" class="pds-switch" name="pds-switch-name" label="Switch name">
        <mock:shadow-root>
          <label htmlFor="pds-switch-name">
            <input id="pds-switch-name" name="pds-switch-name" class="pds-switch__input" type="checkbox">
            <span>Switch name</span>
          </label>
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

});
