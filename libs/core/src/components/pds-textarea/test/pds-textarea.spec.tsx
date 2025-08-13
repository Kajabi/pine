import { newSpecPage } from '@stencil/core/testing';
import { PdsTextarea } from '../pds-textarea';
import { danger } from '@pine-ds/icons/icons';

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
      html: `<pds-textarea component-id="pds-textarea-error" invalid="true" error-message="error"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="pds-textarea-error" invalid="true" error-message="error">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea aria-invalid="true" class="pds-textarea__field is-invalid" id="pds-textarea-error" name="pds-textarea-error"></textarea>
            <p aria-live="assertive" class="pds-textarea__error-message" id="pds-textarea-error__error-message">
              <pds-icon icon="${danger}" size="small"></pds-icon>
              error
            </p>
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

  it('renders helper text', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea component-id="pds-textarea-helper" helper-message="helper"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="pds-textarea-helper" helper-message="helper">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea aria-describedby="pds-textarea-helper__helper-message" class="pds-textarea__field" id="pds-textarea-helper" name="pds-textarea-helper"></textarea>
            <p class="pds-textarea__helper-message" id="pds-textarea-helper__helper-message">helper</p>
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
            <div class="pds-textarea__label-wrapper">
              <label>label</label>
            </div>
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
      <pds-textarea aria-readonly="true" readonly="true">
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
      html: `<pds-textarea component-id="pds-textarea-id" label="label"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="pds-textarea-id" label="label">
        <mock:shadow-root>
          <div class="pds-textarea">
            <div class="pds-textarea__label-wrapper">
              <label htmlFor="pds-textarea-id">label</label>
            </div>
            <textarea class="pds-textarea__field" id="pds-textarea-id" name="pds-textarea-id"></textarea>
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

  it('renders autocomplete attribute when property is passed', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea autocomplete="off"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea autocomplete="off">
        <mock:shadow-root>
          <div class="pds-textarea">
            <textarea class="pds-textarea__field" autocomplete="off"></textarea>
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
          helper-message="This is a helper message"
          error-message="This is an error message">
        </pds-textarea>
      `
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="textarea-with-description" label="Textarea with description" helper-message="This is a helper message" error-message="This is an error message" invalid="true">
        <mock:shadow-root>
          <div class="pds-textarea">
            <div class="pds-textarea__label-wrapper">
              <label htmlFor="textarea-with-description">Textarea with description</label>
            </div>
            <textarea aria-describedby="textarea-with-description__error-message" aria-invalid="true"  class="is-invalid pds-textarea__field" id="textarea-with-description" name="textarea-with-description"></textarea>
            <p id="textarea-with-description__helper-message"  class="pds-textarea__helper-message">
              This is a helper message
            </p>
            <p aria-live="assertive" id="textarea-with-description__error-message" class="pds-textarea__error-message">
              <pds-icon icon="${danger}" size="small"></pds-icon>
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
    expect(textarea?.innerHTML).toBe('initial');

    textarea.value = 'new value';
    textarea?.dispatchEvent(new Event('textareaInput'));
    await page.waitForChanges();

    expect(textarea?.value).toBe('new value');

    textarea.value = '';
    textarea?.dispatchEvent(new Event('textareaInput'));
    await page.waitForChanges();

    expect(textarea?.value).toBe('');
  });

  it('onChange logic with invalid `value` runs', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea value="initial" required="true"></pds-textarea>`,
    });

    const pdsTextarea = page.root;
    const textarea = pdsTextarea?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
    const eventSpy = jest.fn();

    pdsTextarea.addEventListener('pdsTextareaChange', eventSpy);

    expect(pdsTextarea?.value).toEqual('initial');
    expect(textarea?.innerHTML).toEqual('initial');

    textarea.value = '';
    textarea.checkValidity = jest.fn().mockReturnValue(false);
    textarea.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(textarea).toHaveClass('is-invalid');
    expect(eventSpy).toHaveBeenCalled();
  });

  it('should emit pdsTextareaChange event when value changes', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea></pds-textarea>`,
    });

    const pdsTextarea = page.root;
    const textarea = pdsTextarea?.shadowRoot?.querySelector('textarea');
    const changeEventSpy = jest.fn();

    pdsTextarea?.addEventListener('pdsTextareaChange', changeEventSpy);

    // Simulate user typing
    textarea.value = 'New input value';
    textarea?.dispatchEvent(new Event('change'));

    await page.waitForChanges();

    expect(changeEventSpy).toHaveBeenCalled();
    expect(changeEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value: 'New input value', event: expect.any(Event) },
      })
    );
  });

  it('should emit pdsBlur event on blur', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea></pds-textarea>`,
    });

    const textarea = page.root?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');

    const blurEventSpy = jest.fn();
    page.root?.addEventListener('pdsBlur', blurEventSpy);
    textarea?.dispatchEvent(new FocusEvent('blur'));
    await page.waitForChanges();

    expect(blurEventSpy).toHaveBeenCalled();
  });

  it('should emit pdsFocus event on focus', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea value="initial" required="true"></pds-textarea>`,
    });

    const textarea = page.root?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
    const focusEventSpy = jest.fn();
    page.root?.addEventListener('pdsFocus', focusEventSpy);

    textarea?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();

    expect(focusEventSpy).toHaveBeenCalled();
  });

it('should set focus on the input element when setFocus is called', async() => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea></pds-textarea>`,
    });

    const component = page.rootInstance;

    // Mock the native input element
    const nativenTextarea = document.createElement('textarea');
    jest.spyOn(nativenTextarea, 'focus');
    component['nativeTextarea'] = nativenTextarea;
    await component.setFocus();
    expect(nativenTextarea.focus).toHaveBeenCalled();
  });

  it('should emit pdsInput event on input', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea value="initial" required="true"></pds-textarea>`,
    });

    const textarea = page.root?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
    const inputEventSpy = jest.fn();
    page.root?.addEventListener('pdsInput', inputEventSpy);

    if (textarea) {
      textarea.value = 'Typing...';
    }
    textarea?.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(inputEventSpy).toHaveBeenCalled();
  });

  it('renders action slot content when provided', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `
        <pds-textarea component-id="textarea-1" label="Description">
          <span slot="action">0/500</span>
        </pds-textarea>
      `,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="textarea-1" has-action="true" label="Description">
        <mock:shadow-root>
          <div class="pds-textarea">
            <div class="pds-textarea__label-wrapper">
              <label htmlFor="textarea-1">Description</label>
              <div class="pds-textarea__action" part="action">
                <slot name="action"></slot>
              </div>
            </div>
            <textarea class="pds-textarea__field" id="textarea-1" name="textarea-1"></textarea>
          </div>
        </mock:shadow-root>
        <span slot="action">0/500</span>
      </pds-textarea>
    `);
  });

  it('does not render action slot when no content is provided', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea component-id="textarea-1" label="Description"></pds-textarea>`,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="textarea-1" label="Description">
        <mock:shadow-root>
          <div class="pds-textarea">
            <div class="pds-textarea__label-wrapper">
              <label htmlFor="textarea-1">Description</label>
            </div>
            <textarea class="pds-textarea__field" id="textarea-1" name="textarea-1"></textarea>
          </div>
        </mock:shadow-root>
      </pds-textarea>
    `);
  });

  it('sets has-action attribute when action slot content is present', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `
        <pds-textarea component-id="textarea-1" label="Comments">
          <a slot="action" href="#">View guidelines</a>
        </pds-textarea>
      `,
    });

    const root = page.root;
    expect(root?.getAttribute('has-action')).toBe('true');
  });

  it('properly detects action slot presence in componentWillLoad', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `
        <pds-textarea component-id="textarea-1" label="Bio">
          <button slot="action">Help</button>
        </pds-textarea>
      `,
    });

    const component = page.rootInstance;
    expect(component.hasAction).toBe(true);
  });

  it('renders action slot with complex content', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `
        <pds-textarea component-id="textarea-1" label="Message">
          <button slot="action" type="button">
            <span>Attach file</span>
          </button>
        </pds-textarea>
      `,
    });

    const actionWrapper = root?.shadowRoot?.querySelector('.pds-textarea__action');
    expect(actionWrapper).not.toBeNull();
    expect(actionWrapper?.getAttribute('part')).toBe('action');
  });

  it('does not render label wrapper when no label is provided', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `
        <pds-textarea component-id="textarea-1">
          <span slot="action">Help</span>
        </pds-textarea>
      `,
    });

    const labelWrapper = root?.shadowRoot?.querySelector('.pds-textarea__label-wrapper');
    expect(labelWrapper).toBeNull();
  });

  it('renders action slot with value and helper message', async () => {
    const {root} = await newSpecPage({
      components: [PdsTextarea],
      html: `
        <pds-textarea component-id="textarea-1" label="Bio" value="Hello" helper-message="Max 500 characters">
          <span slot="action">5/500</span>
        </pds-textarea>
      `,
    });

    expect(root).toEqualHtml(`
      <pds-textarea component-id="textarea-1" has-action="true" helper-message="Max 500 characters" label="Bio" value="Hello">
        <mock:shadow-root>
          <div class="pds-textarea">
            <div class="pds-textarea__label-wrapper">
              <label htmlFor="textarea-1">Bio</label>
              <div class="pds-textarea__action" part="action">
                <slot name="action"></slot>
              </div>
            </div>
            <textarea aria-describedby="textarea-1__helper-message" class="pds-textarea__field" id="textarea-1" name="textarea-1">Hello</textarea>
            <p class="pds-textarea__helper-message" id="textarea-1__helper-message">
              Max 500 characters
            </p>
          </div>
        </mock:shadow-root>
        <span slot="action">5/500</span>
      </pds-textarea>
    `);
  });
});

