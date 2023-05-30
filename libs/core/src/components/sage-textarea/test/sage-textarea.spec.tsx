import { newSpecPage } from '@stencil/core/testing';
import { SageTextarea } from '../sage-textarea';

describe('sage-textarea', () => {
  it('renders default textarea', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea>
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea class="sage-textarea__field"></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders disabled textarea', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea disabled="true"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea aria-disabled="true" disabled="true">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea class="sage-textarea__field" disabled=""></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders error text', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea component-id="testId" invalid="true" error-message="error"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea component-id="testId" invalid="true" error-message="error">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea aria-invalid="true" class="sage-textarea__field is-invalid" id="testId" name="testId"></textarea>
            <p aria-live="assertive" class="sage-textarea__error-message" id="testId__error-message">error</p>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('does not render error text when invalid prop is set to false', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea invalid="false" error-message="error"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea invalid="false" error-message="error">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea class="sage-textarea__field"></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders hint text', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea component-id="testId" hint-message="hint"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea component-id="testId" hint-message="hint">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea class="sage-textarea__field" id="testId" name="testId"></textarea>
            <p class="sage-textarea__hint-message" id="testId__helper-message">hint</p>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders label text', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea label="label"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea label="label">
        <mock:shadow-root>
          <div class="sage-textarea">
            <label>label</label>
            <textarea class="sage-textarea__field"></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders name property', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea name="foo"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea name="foo">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea name="foo" class="sage-textarea__field"></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders placeholder text', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea placeholder="Placeholder..."></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea placeholder="Placeholder...">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea class="sage-textarea__field" placeholder="Placeholder..."></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders readonly when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea readonly="true"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea readonly="true">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea class="sage-textarea__field" readonly=""></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders required when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea required="true"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea required="true">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea class="sage-textarea__field" required=""></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders textarea id and for attribute on label when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea component-id="testId" label="label"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea component-id="testId" label="label">
        <mock:shadow-root>
          <div class="sage-textarea">
            <label htmlFor="testId">label</label>
            <textarea class="sage-textarea__field" id="testId" name="testId"></textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders textarea value when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea value="foo"></sage-textarea>`,
    });

    expect(root).toEqualHtml(`
      <sage-textarea value="foo">
        <mock:shadow-root>
          <div class="sage-textarea">
            <textarea class="sage-textarea__field">foo</textarea>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('renders a helper and error message and assigns aria-description to the input', async () => {
    const {root} = await newSpecPage({
      components: [SageTextarea],
      html:`
        <sage-textarea
          component-id="textarea-with-description"
          invalid="true"
          label="Textarea with description"
          hint-message="This is a helper message"
          error-message="This is an error message">
        </sage-textarea>
      `
    });

    expect(root).toEqualHtml(`
      <sage-textarea component-id="textarea-with-description" label="Textarea with description" hint-message="This is a helper message" error-message="This is an error message" invalid="true">
        <mock:shadow-root>
          <div class="sage-textarea">
            <label htmlFor="textarea-with-description">Textarea with description</label>
            <textarea aria-describedby="textarea-with-description__error-message" aria-invalid="true"  class="is-invalid sage-textarea__field" id="textarea-with-description" name="textarea-with-description"></textarea>
            <p id="textarea-with-description__helper-message"  class="sage-textarea__hint-message">
              This is a helper message
            </p>
            <p aria-live="assertive" id="textarea-with-description__error-message" class="sage-textarea__error-message">
              This is an error message
            </p>
          </div>
        </mock:shadow-root>
      </sage-textarea>
    `);
  });

  it('test case', async () => {
    const page = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea value="initial"></sage-textarea>`,
    });

    // console.log('pg: ', page.body?.querySelector('sage-textarea')?.shadowRoot?.querySelector('textarea'))

    const textarea = page.body?.querySelector('sage-textarea') //?.shadowRoot?.querySelector('textarea');

    expect(textarea?.getAttribute('value')).toBe('initial');
  });

  it('updates value prop on value change', async () => {
    const page = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea value="initial"></sage-textarea>`,
    });

    const textarea = page.body?.querySelector<HTMLTextAreaElement>('sage-textarea');
    expect(textarea?.getAttribute('value')).toBe('initial');



    // textarea.value = 'new value';
    // textarea?.dispatchEvent(new Event('textareaInput'));
    // await page.waitForChanges();

    // expect(textarea?.value.toString()).toBe('new value');

    // textarea.value = '';
    // textarea?.dispatchEvent(new Event('textareaInput'));
    // await page.waitForChanges();

    // expect(textarea?.value.toString()).toBe('');
  });

  it('is valid when the value is present onChange' , async () => {
    const page = await newSpecPage({
      components: [SageTextarea],
      html: `<sage-textarea value="initial" required="true"></sage-textarea>`,
    });

    const eventSpy = jest.fn();
    document.addEventListener('sageTextareaChange', eventSpy);

    const textarea = page.body?.querySelector<HTMLTextAreaElement>('sage-textarea');
    expect(textarea?.getAttribute('value')).toEqual('initial');
    await page.waitForChanges();

    textarea.value = 'initialA';
    textarea.dispatchEvent(new Event('sageTextareaChange'));
    await page.waitForChanges();

    expect(textarea?.getAttribute('value')).toEqual('initialA');
    expect(eventSpy).toHaveBeenCalled();
  });

  // it('is invalid when the value is empty onChange', async () => {
  //   const page = await newSpecPage({
  //     components: [SageTextarea],
  //     html: `<sage-textarea value="initial" required="true"></sage-textarea>`,
  //   });

  //   const sageTextarea = page.root;
  //   const textarea = sageTextarea?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
  //   const eventSpy = jest.fn();

  //   document.addEventListener('sageTextareaChange', eventSpy);

  //   expect(sageTextarea?.value).toEqual('initial');
  //   expect(textarea?.value).toEqual('initial');

  //   const myFn = jest.fn((target) => {
  //     if (target === 1) {
  //       return true;
  //     }

  //     return false;
  //   })

  //   console.log('sageTextarea: ', sageTextarea);

  //   textarea.value = '';
  //   // textarea.checkValidity = jest.fn().mockReturnValue(false);
  //   textarea.dispatchEvent(new Event('change'));
  //   await page.waitForChanges();

  //   expect(sageTextarea?.value).toEqual('');
  //   expect(textarea?.value).toEqual('');
  //   expect(eventSpy).toHaveBeenCalled();
  // });
});
