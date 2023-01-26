import { newSpecPage } from '@stencil/core/testing';
import { SageInput } from '../sage-input';

describe('sage-input', () => {
  it('renders a value when prop is set', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: `<sage-input input-id="field-1" value="Frank Dux"></sage-input>`
    });
    expect(root).toEqualHtml(`
    <sage-input input-id="field-1" value="Frank Dux">
      <mock:shadow-root>
        <div class="sage-input">
          <label htmlFor="field-1">
          </label>
          <input id="field-1" class="sage-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </sage-input>
    `);
  });

  it('renders a label', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: `<sage-input input-id="field-1" label="Name" value="Frank Dux"></sage-input>`
    });
    expect(root).toEqualHtml(`
    <sage-input input-id="field-1" label="Name" value="Frank Dux">
      <mock:shadow-root>
        <div class="sage-input">
          <label htmlFor="field-1">
            Name
          </label>
          <input id="field-1" class="sage-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </sage-input>
    `);
  });

  it('renders disabled input', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: `<sage-input disabled="true" input-id="field-1" value="Frank Dux"></sage-input>`
    });
    expect(root).toEqualHtml(`
    <sage-input aria-disabled="true" input-id="field-1" disabled="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="sage-input">
          <label htmlFor="field-1">
          </label>
          <input disabled id="field-1" class="sage-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </sage-input>
    `);
  });

  it('renders readonly input', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: `<sage-input readonly="true" input-id="field-1" value="Frank Dux"></sage-input>`
    });

    expect(root).toEqualHtml(`
    <sage-input input-id="field-1" readonly="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="sage-input">
          <label htmlFor="field-1">
          </label>
          <input readonly id="field-1" class="sage-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </sage-input>
    `);
  });

  it('renders a hint', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: `<sage-input hint="Use the correct syntax" input-id="field-1" value="Frank Dux"></sage-input>`
    });

    const hint = root.shadowRoot.querySelector('.sage-input__hint');
    expect(hint).not.toBeNull();
  });

  it('renders a error', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: `<sage-input error-text="Please provide a helpful error message" input-id="field-1" value="Frank Dux"></sage-input>`
    });

    const errorText = root.shadowRoot.querySelector('.sage-input__error-text');
    expect(errorText).not.toBeNull();
  });
});
