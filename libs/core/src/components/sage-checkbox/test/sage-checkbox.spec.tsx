import { newSpecPage } from '@stencil/core/testing';
import { SageCheckbox } from '../sage-checkbox';

describe('sage-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-checkbox>
        <mock:shadow-root>
          <div class="sage-checkbox">
            <input type="checkbox">
            <label></label>
          </div>
        </mock:shadow-root>
      </sage-checkbox>
    `);
  });
  it('renders with id when checkboxId prop is set', async () => {
    const page = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="Label text" />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-checkbox checkbox-id="default" label="Label text">
        <mock:shadow-root>
          <div class="sage-checkbox">
            <input type="checkbox" id="default">
            <label htmlfor="default">Label text</label>
          </div>
        </mock:shadow-root>
      </sage-checkbox>
    `);
  });
  it('renders checked input when checked prop is set', async () => {
    const { root } = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="Label text" checked />`,
    });
    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.checked).toBe(true);
  });
  it('renders disabled input when checked prop is set', async () => {
    const { root } = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="Label text" disabled />`,
    });
    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.disabled).toBe(true);
  });
  it('renders with error when invalid prop is set', async () => {
    const page = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="Label text" invalid />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-checkbox checkbox-id="default" label="Label text" invalid>
        <mock:shadow-root>
          <div class="sage-checkbox is-invalid">
            <input type="checkbox" id="default">
            <label htmlfor="default">Label text</label>
          </div>
        </mock:shadow-root>
      </sage-checkbox>
    `);
  });
  it('renders indeterminate when indeterminate prop is set', async () => {
    const page = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="Label text" indeterminate />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-checkbox checkbox-id="default" label="Label text" indeterminate>
        <mock:shadow-root>
          <div class="sage-checkbox is-indeterminate">
            <input type="checkbox" id="default">
            <label htmlfor="default">Label text</label>
          </div>
        </mock:shadow-root>
      </sage-checkbox>
    `);
  });
  it('renders label text when label prop is set', async () => {
    const page = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="This is label text" />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-checkbox checkbox-id="default" label="This is label text">
        <mock:shadow-root>
          <div class="sage-checkbox">
            <input type="checkbox" id="default">
            <label htmlfor="default">This is label text</label>
          </div>
        </mock:shadow-root>
      </sage-checkbox>
    `);
  });
  it('renders message when message prop is set', async () => {
    const page = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="Label text" message="This is short message text." />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-checkbox checkbox-id="default" label="Label text" message="This is short message text.">
        <mock:shadow-root>
          <div class="sage-checkbox">
            <input type="checkbox" id="default">
            <label htmlfor="default">Label text</label>
            <div class="sage-checkbox__message">This is short message text.</div>
          </div>
        </mock:shadow-root>
      </sage-checkbox>
    `);
  });
  it('renders required input when required prop is set', async () => {
    const { root } = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="Label text" required />`,
    });
    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.required).toBe(true);
  });
  it('sets input value attribute when value prop is set', async () => {
    const { root } = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox checkbox-id="default" label="Label text" value="This is the input value" />`,
    });
    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.value).toEqual('This is the input value');
  });
});
