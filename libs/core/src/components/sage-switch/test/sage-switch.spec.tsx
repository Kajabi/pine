import { newSpecPage } from '@stencil/core/testing';
import { SageSwitch } from '../sage-switch';

describe('sage-switch', () => {
  it('renders an input as a checkbox with label', async () => {
    const page = await newSpecPage({
      components: [SageSwitch],
      html: `<sage-switch component-id="sage-switch-e1" label="Switch label"></sage-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-switch component-id="sage-switch-e1" class="sage-switch" label="Switch label">
        <mock:shadow-root>
          <input id="sage-switch-e1" name="sage-switch-e1" class="sage-switch__input" type="checkbox">
          <label htmlFor="sage-switch-e1" class="sage-switch__label">Switch label</label>
        </mock:shadow-root>
      </sage-switch>
    `);
  });

  it('renders a radio input with label and name defaulting to id', async () => {
    const page = await newSpecPage({
      components: [SageSwitch],
      html: `<sage-switch component-id="sage-switch-radio" label="Switch radio" type="radio" value="on"></sage-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-switch component-id="sage-switch-radio" class="sage-switch" label="Switch radio" type="radio" value="on">
        <mock:shadow-root>
          <input id="sage-switch-radio" class="sage-switch__input" type="radio" name="sage-switch-radio" value="on">
          <label htmlFor="sage-switch-radio" class="sage-switch__label">Switch radio</label>
        </mock:shadow-root>
      </sage-switch>
    `);
  });

  it('renders a radio input with label and associated group name', async () => {
    const page = await newSpecPage({
      components: [SageSwitch],
      html: `<sage-switch component-id="sage-switch-radio-id" label="Switch radio" type="radio" name="sage-radio-group-name" value="on"></sage-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-switch component-id="sage-switch-radio-id" class="sage-switch" label="Switch radio" type="radio" name="sage-radio-group-name" value="on">
        <mock:shadow-root>
          <input id="sage-switch-radio-id" class="sage-switch__input" type="radio" name="sage-radio-group-name" value="on">
          <label htmlFor="sage-switch-radio-id" class="sage-switch__label">Switch radio</label>
        </mock:shadow-root>
      </sage-switch>
    `);
  });

  it('renders a disabled input', async () => {
    const page = await newSpecPage({
      components: [SageSwitch],
      html: `<sage-switch component-id="sage-switch-disabled" label="Switch disabled" disabled="true"></sage-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-switch component-id="sage-switch-disabled" class="sage-switch" label="Switch disabled" aria-disabled="true" disabled="true">
        <mock:shadow-root>
          <input id="sage-switch-disabled" name="sage-switch-disabled" class="sage-switch__input" type="checkbox" disabled>
          <label htmlFor="sage-switch-disabled" class="sage-switch__label">Switch disabled</label>
        </mock:shadow-root>
      </sage-switch>
    `);
  });

  it('renders a required input', async () => {
    const page = await newSpecPage({
      components: [SageSwitch],
      html: `<sage-switch component-id="sage-switch-required" label="Switch required" required="true"></sage-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-switch component-id="sage-switch-required" class="sage-switch" label="Switch required" required="true">
        <mock:shadow-root>
          <input id="sage-switch-required" name="sage-switch-required" class="sage-switch__input" type="checkbox" required>
          <label htmlFor="sage-switch-required" class="sage-switch__label">Switch required</label>
        </mock:shadow-root>
      </sage-switch>
    `);
  });

  it('renders a helper message', async () => {
    const page = await newSpecPage({
      components: [SageSwitch],
      html: `<sage-switch component-id="sage-switch-msg" label="Switch helper message" helper-message="Direct trade next level slow-carb, hashtag distillery"></sage-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-switch component-id="sage-switch-msg" class="sage-switch sage-switch--message" label="Switch helper message" helper-message="Direct trade next level slow-carb, hashtag distillery">
        <mock:shadow-root>
          <input id="sage-switch-msg" name="sage-switch-msg" class="sage-switch__input" type="checkbox">
          <label htmlFor="sage-switch-msg" class="sage-switch__label">Switch helper message</label>
          <div id="sage-switch-msg__helper-message"  class="sage-switch__message">Direct trade next level slow-carb, hashtag distillery</div>
        </mock:shadow-root>
      </sage-switch>
    `);
  });

  it('renders an error message', async () => {
    const page = await newSpecPage({
      components: [SageSwitch],
      html: `<sage-switch component-id="sage-switch-err" label="Switch error message" error-message="La croix blue bottle narwhal fam" invalid="true" ></sage-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-switch component-id="sage-switch-err" class="sage-switch sage-switch--error" label="Switch error message" error-message="La croix blue bottle narwhal fam" invalid="true">
        <mock:shadow-root>
          <input aria-invalid="true" id="sage-switch-err" name="sage-switch-err" class="sage-switch__input" type="checkbox">
          <label htmlFor="sage-switch-err" class="sage-switch__label">Switch error message</label>
          <div aria-live="assertive" id="sage-switch-err__error-message"  class="sage-switch__message sage-switch__error-message">La croix blue bottle narwhal fam</div>
        </mock:shadow-root>
      </sage-switch>
    `);
  });
});
