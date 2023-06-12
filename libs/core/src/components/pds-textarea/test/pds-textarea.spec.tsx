import { newSpecPage } from '@stencil/core/testing';
import { PdsTextarea } from '../pds-textarea';

describe('pds-textarea', () => {
  it('renders default textarea', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea>
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field"></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders disabled textarea', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea disabled="true"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea aria-disabled="true" disabled="true">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field" disabled=""></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders error text', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea component-id="testId" invalid="true" error-message="error"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="testId" invalid="true" error-message="error">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea aria-invalid="true" class="pds-textarea__field is-invalid" id="testId" name="testId"></textarea>
            <p aria-live="assertive" class="pds-textarea__error-message" id="testId__error-message">error</p>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('does not render error text when invalid prop is set to false', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea invalid="false" error-message="error"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea invalid="false" error-message="error">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field"></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders hint text', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea component-id="testId" hint-message="hint"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="testId" hint-message="hint">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field" id="testId" name="testId"></textarea>
            <p class="pds-textarea__hint-message" id="testId__helper-message">hint</p>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders label text', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea label="label"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea label="label">
        <mock:shadow-root>
          <div class="pds-textarea">
            <label>label</label>
            <textarea class="pds-textarea__field"></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders name property', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea name="foo"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea name="foo">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea name="foo" class="pds-textarea__field"></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders placeholder text', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea placeholder="Placeholder..."></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea placeholder="Placeholder...">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field" placeholder="Placeholder..."></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders readonly when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea readonly="true"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea readonly="true">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field" readonly=""></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders required when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea required="true"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea required="true">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field" required=""></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders textarea id and for attribute on label when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea component-id="testId" label="label"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="testId" label="label">
        <mock:shadow-root>
          <div class="pds-textarea">
            <label htmlFor="testId">label</label>
            <textarea class="pds-textarea__field" id="testId" name="testId"></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders textarea value when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea value="foo"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea value="foo">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field">foo</textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('renders a helper and error message and assigns aria-description to the input', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html:`
        <pds-textarea
          component-id="textarea-with-description"
          invalid="true"
          label="Textarea with description"
          hint-message="This is a helper message"
          error-message="This is an error message">
        </pds-textarea>
      `
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="textarea-with-description" label="Textarea with description" hint-message="This is a helper message" error-message="This is an error message" invalid="true">
        <mock:shadow-root>
          <div class="pds-textarea">
            <label htmlFor="textarea-with-description">Textarea with description</label>
            <textarea aria-describedby="textarea-with-description__error-message" aria-invalid="true"  class="is-invalid pds-textarea__field" id="textarea-with-description" name="textarea-with-description"></textarea>
            <p id="textarea-with-description__helper-message"  class="pds-textarea__hint-message">
              This is a helper message
            </p>
            <p aria-live="assertive" id="textarea-with-description__error-message" class="pds-textarea__error-message">
              This is an error message
            </p>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('updates value prop on value change', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea value="initial"></pds-textarea>`,
    });

    const pdsTextarea = page.root;
    expect(pdsTextarea?.value).toBe('initial');

    const textarea = pdsTextarea?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
    expect(textarea?.innerHTML.toString()).toBe('initial');

    textarea.innerHTML = 'new value';
    textarea?.dispatchEvent(new Event('textareaInput'));
    await page.waitForChanges();

    expect(textarea?.innerHTML.toString()).toBe('new value');

    textarea.innerHTML = '';
    textarea?.dispatchEvent(new Event('textareaInput'));
    await page.waitForChanges();

    expect(textarea?.innerHTML.toString()).toBe('');
  });

  it('onChange logic with valid `innerHTML` runs', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea value="initial" required="true"></pds-textarea>`,
    });
    const pdsTextarea = page.root;
    const eventSpy = jest.fn();
    document.addEventListener('pdsTextareaChange', eventSpy);

    const textarea = pdsTextarea?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
    expect(pdsTextarea?.value).toEqual('initial');
    expect(textarea?.innerHTML).toEqual('initial');

    textarea.innerHTML += 'A';
    textarea.checkValidity = jest.fn().mockReturnValue(true);
    textarea.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(pdsTextarea?.value).toEqual('initialA');
    expect(textarea?.innerHTML).toEqual('initialA');
    expect(eventSpy).toHaveBeenCalled();
  });

  it('onChange logic with invalid `innerHTML` runs', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea value="initial" required="true"></pds-textarea>`,
    });

    const pdsTextarea = page.root;
    const textarea = pdsTextarea?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
    const eventSpy = jest.fn();

    document.addEventListener('pdsTextareaChange', eventSpy);

    expect(pdsTextarea?.value).toEqual('initial');
    expect(textarea?.innerHTML).toEqual('initial');

    textarea.innerHTML = '';
    textarea.checkValidity = jest.fn().mockReturnValue(false);
    textarea.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(pdsTextarea?.value).toEqual('');
    expect(textarea?.innerHTML).toEqual('');
    expect(eventSpy).toHaveBeenCalled();
  });
});
