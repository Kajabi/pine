import { newSpecPage } from '@stencil/core/testing';
import { PdsRadio } from '../pds-radio';
import { danger } from '@pine-ds/icons/icons';

describe('pds-radio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio></pds-radio>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-radio>
        <label>
          <input type="radio">
          <span></span>
        </label>
      </pds-radio>
    `);
  });

  it('renders with id when componentId prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-radio component-id="default" label="Label text">
        <label htmlfor="default">
          <input id="default" type="radio">
          <span>Label text</span>
        </label>
      </pds-radio>
    `);
  });

  it('renders checked input when checked prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" checked />`,
    });

    const input = root?.querySelector('input');
    expect(input?.checked).toBe(true);
  });

  it('does not render label text when hideLabel prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" hide-label />`,
    });

    const label = page.root?.querySelector('label');
    expect(label?.querySelector('span')).toHaveClass('visually-hidden');
  });

  it('renders disabled input when disabled prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" disabled />`,
    });

    const input = root?.querySelector('input');
    expect(input?.disabled).toBe(true);
  });

  it('renders in invalid state when invalid prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" invalid />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-radio class="is-invalid" component-id="default" label="Label text" invalid>
        <label htmlfor="default">
          <input aria-invalid="true" id="default" type="radio">
          <span>Label text</span>
        </label>
      </pds-radio>
    `);
  });

  it('renders label text when label prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="This is label text" />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-radio component-id="default" label="This is label text">
        <label htmlfor="default">
          <input id="default" type="radio">
          <span>This is label text</span>
        </label>
      </pds-radio>
    `);
  });

  it('renders message when message prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" helper-message="This is short message text." />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-radio component-id="default" label="Label text" helper-message="This is short message text.">
        <label htmlfor="default">
          <input aria-describedby="default__helper-message" id="default" type="radio">
          <span>Label text</span>
        </label>
        <div class="pds-radio__message" id="default__helper-message">
          This is short message text.
        </div>
      </pds-radio>
    `);
  });

  it('renders error message when error-message prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" invalid="true" error-message="This is a short error message." />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-radio class="is-invalid" component-id="default" error-message="This is a short error message." invalid="true" label="Label text">
        <label htmlfor="default">
          <input aria-invalid="true" id="default" type="radio">
          <span>Label text</span>
        </label>
        <div aria-live="assertive" class="pds-radio__message pds-radio__message--error" id="default__error-message">
          <pds-icon icon="${danger}" size="small"></pds-icon>
          This is a short error message.
        </div>
      </pds-radio>
    `);
  });

  it('renders required input when required prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" required />`,
    });

    const input = root?.querySelector('input');
    expect(input?.required).toBe(true);
  });

  it('sets input value attribute when value prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" value="This is the input value" />`,
    });

    const input = root?.querySelector('input');
    expect(input?.value).toEqual('This is the input value');
  });

  it('emits "pdsRadioChange" event when radio is changed', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: '<pds-radio component-id="default" label="Label text" />',
    });

    const radio = page.root?.querySelector('input[type="radio"]');
    const eventSpy = jest.fn();

    page.root?.addEventListener('pdsRadioChange', eventSpy);
    radio?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
  });

  it('does not emit "pdsRadioChange" event when radio is changed and disabled', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: '<pds-radio component-id="default" label="Label text" disabled />',
    });

    const radio = page.root?.querySelector('input[type="radio"]');
    const eventSpy = jest.fn();

    page.root?.addEventListener('pdsRadioChange', eventSpy);
    radio?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).not.toHaveBeenCalled();
  });

  it('does not emit "pdsRadioChange" event when radio is inside a pds-radio-group', async () => {
    const { PdsRadioGroup } = await import('../../pds-radio-group/pds-radio-group');
    const page = await newSpecPage({
      components: [PdsRadio, PdsRadioGroup],
      html: `
        <pds-radio-group name="test-group">
          <pds-radio component-id="radio1" label="Option 1" value="option1"></pds-radio>
        </pds-radio-group>
      `,
    });

    const radio = page.doc.querySelector('pds-radio[component-id="radio1"]');
    const input = radio?.querySelector('input[type="radio"]');
    const eventSpy = jest.fn();

    radio?.addEventListener('pdsRadioChange', eventSpy);
    input?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).not.toHaveBeenCalled();
  });

  it('renders with has-border class when hasBorder prop is true', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" has-border />`,
    });

    expect(page.root).toHaveClass('has-border');
  });

  it('does not render with has-border class when hasBorder prop is false', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" />`,
    });

    expect(page.root).not.toHaveClass('has-border');
  });

  it('renders with has-border class when hasBorder prop is explicitly set to true', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" />`,
    });

    // Set hasBorder property programmatically
    const component = page.root as HTMLPdsRadioElement;
    component.hasBorder = true;
    await page.waitForChanges();

    expect(page.root).toHaveClass('has-border');
  });

  it('combines has-border class with other state classes', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" has-border invalid disabled />`,
    });

    expect(page.root).toHaveClass('has-border');
    expect(page.root).toHaveClass('is-invalid');
    expect(page.root).toHaveClass('is-disabled');
  });

  it('renders correctly with hasBorder and helper message', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio component-id="default" label="Label text" has-border helper-message="Helper text" />`,
    });

    expect(page.root).toHaveClass('has-border');

    const message = page.root?.querySelector('.pds-radio__message');
    expect(message?.textContent).toBe('Helper text');
  });

});
