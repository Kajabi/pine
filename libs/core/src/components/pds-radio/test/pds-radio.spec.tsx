import { newSpecPage } from '@stencil/core/testing';
import { PdsRadio } from '../pds-radio';

describe('pds-radio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsRadio],
      html: `<pds-radio></pds-radio>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-radio>
        <input type="radio">
        <label></label>
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
        <input type="radio" id="default">
        <label htmlfor="default">Label text</label>
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
        <input aria-invalid="true" id="default" type="radio">
        <label htmlfor="default">Label text</label>
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
        <input type="radio" id="default">
        <label htmlfor="default">This is label text</label>
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
        <input aria-describedby="default__helper-message" id="default" type="radio">
        <label htmlfor="default">Label text</label>
        <div class="pds-radio__message" id="default__helper-message">This is short message text.</div>
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

});
