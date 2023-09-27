import { newSpecPage } from '@stencil/core/testing';
import { PdsCheckbox } from '../pds-checkbox';

describe('pds-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox>
        <mock:shadow-root>
          <input type="checkbox">
          <label></label>
        </mock:shadow-root>
      </pds-checkbox>
    `);
  });

  it('renders with id when componentId prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox component-id="default" label="Label text">
        <mock:shadow-root>
          <input type="checkbox" id="default">
          <label htmlfor="default">Label text</label>
        </mock:shadow-root>
      </pds-checkbox>
    `);
  });

  it('renders checked input when checked prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" checked />`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.checked).toBe(true);
  });

  it('renders disabled input when disabled prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" disabled />`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.disabled).toBe(true);
  });

  it('renders in invalid state when invalid prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" invalid />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox class="is-invalid" component-id="default" label="Label text" invalid>
        <mock:shadow-root>
          <input aria-invalid="true" type="checkbox" id="default">
          <label htmlfor="default">Label text</label>
        </mock:shadow-root>
      </pds-checkbox>
    `);
  });

  it('renders in indeterminate state when indeterminate prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" indeterminate />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox class="is-indeterminate" component-id="default" label="Label text" indeterminate>
        <mock:shadow-root>
          <input type="checkbox" id="default">
          <label htmlfor="default">Label text</label>
        </mock:shadow-root>
      </pds-checkbox>
    `);
  });

  it('renders label text when label prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="This is label text" />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox component-id="default" label="This is label text">
        <mock:shadow-root>
          <input type="checkbox" id="default">
          <label htmlfor="default">This is label text</label>
        </mock:shadow-root>
      </pds-checkbox>
    `);
  });

  it('renders message when message prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" helper-message="This is short message text." />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox component-id="default" label="Label text" helper-message="This is short message text.">
        <mock:shadow-root>
          <input aria-describedby="default__helper-message" type="checkbox" id="default">
          <label htmlfor="default">Label text</label>
          <div class="pds-checkbox__message" id="default__helper-message">This is short message text.</div>
        </mock:shadow-root>
      </pds-checkbox>
    `);
  });

  it('renders error message when error-message prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" invalid="true" error-message="This is a short error message." />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox class="is-invalid" component-id="default" error-message="This is a short error message." invalid="true" label="Label text">
        <mock:shadow-root>
          <input aria-invalid="true" id="default" type="checkbox">
          <label htmlfor="default">Label text</label>
          <div aria-live="assertive" class="pds-checkbox__message pds-checkbox__message--error" id="default__error-message">This is a short error message.</div>
        </mock:shadow-root>
      </pds-checkbox>
    `);
  });

  it('renders required input when required prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" required />`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.required).toBe(true);
  });

  it('sets input value attribute when value prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text" value="This is the input value" />`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.value).toEqual('This is the input value');
  });

  it('emits "pdseCheckboxChange" event when checkbox is changed', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: '<pds-checkbox component-id="default" label="Label text" />',
    });

    const checkbox = page.root?.shadowRoot?.querySelector('input[type="checkbox"]');
    const eventSpy = jest.fn();

    page.root?.addEventListener('pdsCheckboxChange', eventSpy);
    checkbox?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
  });

  it('does not emit "pdsCheckboxChange" event when checkbox is changed and disabled', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: '<pds-checkbox component-id="default" label="Label text" disabled />',
    });

    const checkbox = page.root?.shadowRoot?.querySelector('input[type="checkbox"]');
    const eventSpy = jest.fn();

    page.root?.addEventListener('pdsCheckboxChange', eventSpy);
    checkbox?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(eventSpy).not.toHaveBeenCalled();
  });
});
