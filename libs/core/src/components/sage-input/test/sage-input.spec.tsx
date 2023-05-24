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

  it('renders placeholder text', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: `<sage-input placeholder="placeholder text" input-id="field-1" value="Frank Dux"></sage-input>`
    });

    expect(root).toEqualHtml(`
    <sage-input input-id="field-1" placeholder="placeholder text" value="Frank Dux">
      <mock:shadow-root>
        <div class="sage-input">
          <label htmlFor="field-1">
          </label>
          <input placeholder="placeholder text" id="field-1" class="sage-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </sage-input>
    `);
  });

  it('renders readonly input', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: `<sage-input required="true" input-id="field-1" value="Frank Dux"></sage-input>`
    });

    expect(root).toEqualHtml(`
    <sage-input input-id="field-1" required="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="sage-input">
          <label htmlFor="field-1">
          </label>
          <input required id="field-1" class="sage-input__field" type="text" value="Frank Dux" />
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

  it('updates value prop on value change', async () => {
    const page = await newSpecPage({
      components: [SageInput],
      html: `<sage-input value="yada-yada" />`,
    })
    const sageInput = page.root
    expect(sageInput.value).toBe('yada-yada')

    const input = sageInput.shadowRoot.querySelector('input')
    expect(input.value).toBe('yada-yada')

    input.value = 'yoda-yoda'
    input.dispatchEvent(new Event('input'))
    await page.waitForChanges()

    expect(input?.value).toEqual('yoda-yoda')

    input.value = '';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(input?.value).toEqual('');
  });

  it('is invalid when the value is empty onInput', async () => {
    const page = await newSpecPage({
      components: [SageInput],
      html: `<sage-input value="yada-yada" required="true" />`,
    });

    const sageInput = page.root;
    const input = sageInput?.shadowRoot?.querySelector<HTMLInputElement>('input');
    const eventSpy = jest.fn();

    document.addEventListener('sageInput', eventSpy);

    expect(sageInput?.value).toEqual('yada-yada');

    input.value = '';
    input.checkValidity = jest.fn().mockReturnValue(false);
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(sageInput?.value).toEqual('');
    expect(eventSpy).toHaveBeenCalled();
  });

  it('is invalid when type email is not a valid email address onInput', async () => {
    const page = await newSpecPage({
      components: [SageInput],
      html: `<sage-input type="email" value="yada-yada" required="true" />`,
    });

    const sageInput = page.root;
    const input = sageInput?.shadowRoot?.querySelector<HTMLInputElement>('input');
    const eventSpy = jest.fn();

    document.addEventListener('sageInput', eventSpy);

    expect(sageInput?.value).toEqual('yada-yada');

    input.value = 'notavalidemailaddress.com';

    // TODO Q: is mockReturnValue actually working or merely mirrroring my call?
    input.checkValidity = jest.fn().mockReturnValue(false);
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(sageInput?.value).toEqual('notavalidemailaddress.com');
    expect(eventSpy).toHaveBeenCalled();
  });
});
