import { newSpecPage } from '@stencil/core/testing';
import { PdsCheckbox } from '../pds-checkbox';
import { danger } from '@pine-ds/icons/icons';

describe('pds-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox>
        <mock:shadow-root>
          <label>
            <input type="checkbox">
            <span><slot name="label"></slot></span>
          </label>
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
          <label for="default">
            <input type="checkbox" id="default">
            <span><slot name="label"></slot>Label text</span>
          </label>
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
          <label for="default">
            <input aria-invalid="true" type="checkbox" id="default">
            <span><slot name="label"></slot>Label text</span>
          </label>
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
          <label for="default">
            <input indeterminate="" type="checkbox" id="default">
            <span><slot name="label"></slot>Label text</span>
          </label>
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
          <label for="default">
            <input type="checkbox" id="default">
            <span><slot name="label"></slot>This is label text</span>
          </label>
        </mock:shadow-root>
      </pds-checkbox>
    `);
  });

  it('renders hidden label text when hide-label prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="This is label text" hide-label />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-checkbox component-id="default" label="This is label text" hide-label>
        <mock:shadow-root>
          <label for="default">
            <input type="checkbox" id="default">
            <span class="visually-hidden"><slot name="label"></slot>This is label text</span>
          </label>
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
          <label for="default">
            <input aria-describedby="default__helper-message" type="checkbox" id="default">
            <span><slot name="label"></slot>Label text</span>
          </label>
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
          <label for="default">
            <input aria-describedby="default__error-message" aria-invalid="true" id="default" type="checkbox">
            <span><slot name="label"></slot>Label text</span>
          </label>
          <div aria-live="assertive" class="pds-checkbox__message pds-checkbox__message--error" id="default__error-message">
            <pds-icon aria-hidden="true" icon="${danger}" size="small"></pds-icon>
            This is a short error message.
          </div>
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
  it('describes the helper message when invalid with no error message', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="cb" invalid helper-message="Pick one"></pds-checkbox>`,
    });

    const shadow = page.root.shadowRoot;
    const describedBy = shadow.querySelector('input').getAttribute('aria-describedby');

    expect(describedBy).toBe('cb__helper-message');
    expect(shadow.querySelector(`#${describedBy}`).textContent).toContain('Pick one');
  });

  it('renders the label prop as a text node outside the label slot', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text"></pds-checkbox>`,
    });

    const span = page.root.shadowRoot.querySelector('label span');
    expect(span.querySelector('slot[name="label"]').textContent).toBe('');
    expect(span.textContent).toBe('Label text');
  });

  it('drops the label prop text when the label slot has content', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Label text"><span slot="label">Slotted label</span></pds-checkbox>`,
    });

    expect(page.root.shadowRoot.querySelector('label span').textContent).toBe('');
    expect(page.root.querySelector('[slot="label"]').textContent).toBe('Slotted label');
  });

  it('marks the host only when the label slot has content', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `
        <pds-checkbox component-id="slotted"><span slot="label">Slotted label</span></pds-checkbox>
        <pds-checkbox component-id="prop" label="Label text"></pds-checkbox>
      `,
    });

    const [slotted, prop] = Array.from(page.body.querySelectorAll('pds-checkbox'));
    expect(slotted).toHaveClass('has-label-slot');
    expect(prop).not.toHaveClass('has-label-slot');
  });

  it('takes its disabled state from a disabled fieldset', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<fieldset disabled><pds-checkbox component-id="in-fieldset" label="Label"></pds-checkbox></fieldset>`,
    });

    page.rootInstance.formDisabledCallback(true);
    await page.waitForChanges();
    expect(page.root.disabled).toBe(true);

    page.rootInstance.formDisabledCallback(false);
    await page.waitForChanges();
    expect(page.root.disabled).toBe(false);
  });

  // formDisabledCallback also fires when this element's own `disabled` attribute is merely
  // present (even as the literal string "false", which a consumer's or React's attribute
  // serialization can write) — the platform treats any value as disabled, independent of a real
  // fieldset. Without a disabled fieldset ancestor, that call must not disable the checkbox.
  it("ignores formDisabledCallback(true) with no disabled fieldset ancestor", async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="no-fieldset" label="Label" disabled="false"></pds-checkbox>`,
    });

    page.rootInstance.formDisabledCallback(true);
    await page.waitForChanges();
    expect(page.root.disabled).toBe(false);
  });
});

describe('pds-checkbox pill variant', () => {
  it('adds the pill class and keeps a native checkbox', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="pill" label="Pill" variant="pill"></pds-checkbox>`,
    });

    expect(page.root).toHaveClass('pds-checkbox--pill');
    expect(page.root?.shadowRoot?.querySelector('input')?.getAttribute('type')).toBe('checkbox');
  });

  it('does not add the pill class by default', async () => {
    const page = await newSpecPage({
      components: [PdsCheckbox],
      html: `<pds-checkbox component-id="default" label="Default"></pds-checkbox>`,
    });

    expect(page.root).not.toHaveClass('pds-checkbox--pill');
  });
});
