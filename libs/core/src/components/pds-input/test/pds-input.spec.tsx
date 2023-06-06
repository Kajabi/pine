import { newSpecPage } from '@stencil/core/testing';
import { PdsInput } from '../pds-input';

describe('pds-input', () => {
  it('renders a value when prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input input-id="field-1" value="Frank Dux"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input input-id="field-1" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <label htmlFor="field-1">
          </label>
          <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders a label', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input input-id="field-1" label="Name" value="Frank Dux"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input input-id="field-1" label="Name" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <label htmlFor="field-1">
            Name
          </label>
          <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders placeholder text', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input placeholder="placeholder text" input-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input input-id="field-1" placeholder="placeholder text" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <label htmlFor="field-1">
          </label>
          <input placeholder="placeholder text" id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders readonly input', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input required="true" input-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input input-id="field-1" required="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <label htmlFor="field-1">
          </label>
          <input required id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders disabled input', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input disabled="true" input-id="field-1" value="Frank Dux"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input aria-disabled="true" input-id="field-1" disabled="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <label htmlFor="field-1">
          </label>
          <input disabled id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders readonly input', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input readonly="true" input-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input input-id="field-1" readonly="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <label htmlFor="field-1">
          </label>
          <input readonly id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders a hint', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input hint="Use the correct syntax" input-id="field-1" value="Frank Dux"></pds-input>`
    });

    const hint = root.shadowRoot.querySelector('.pds-input__hint');
    expect(hint).not.toBeNull();
  });

  it('renders a error', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input error-text="Please provide a helpful error mespds" input-id="field-1" value="Frank Dux"></pds-input>`
    });

    const errorText = root.shadowRoot.querySelector('.pds-input__error-text');
    expect(errorText).not.toBeNull();
  });

  it('updates value prop on value change', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input value="yada-yada" />`,
    })
    const pdsInput = page.root
    expect(pdsInput.value).toBe('yada-yada')

    const input = pdsInput.shadowRoot.querySelector('input')
    expect(input.value).toBe('yada-yada')

    input.value = 'yoda-yoda'
    input.dispatchEvent(new Event('input'))
    await page.waitForChanges()

    expect(input?.value).toEqual('yoda-yoda')

    input.value = '';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(input?.value).toEqual('');
  })
});
