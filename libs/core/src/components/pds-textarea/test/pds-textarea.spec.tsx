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
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field"></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field" disabled=""></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea aria-invalid="true" class="pds-textarea__field is-invalid" id="pds-textarea-error" name="pds-textarea-error"></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field"></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea aria-describedby="pds-textarea-helper__helper-message" class="pds-textarea__field" id="pds-textarea-helper" name="pds-textarea-helper"></textarea>
            </div>
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
              <label>
                <span>
                  label
                </span>
              </label>
            </div>
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field"></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea name="foo" class="pds-textarea__field"></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field" placeholder="Placeholder..."></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field" readonly=""></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field" required=""></textarea>
            </div>
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
              <label htmlFor="pds-textarea-id">
                <span>
                  label
                </span>
              </label>
            </div>
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field" id="pds-textarea-id" name="pds-textarea-id"></textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field">foo</textarea>
            </div>
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
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field" autocomplete="off"></textarea>
            </div>
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
              <label htmlFor="textarea-with-description">
                <span>
                  Textarea with description
                </span>
              </label>
            </div>
            <div class="pds-textarea__field-wrapper">
              <textarea aria-describedby="textarea-with-description__error-message" aria-invalid="true"  class="is-invalid pds-textarea__field" id="textarea-with-description" name="textarea-with-description"></textarea>
            </div>
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

    if (textarea) {
      textarea.value = 'new value';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await page.waitForChanges();

      expect(textarea.value).toBe('new value');
      expect(pdsTextarea?.value).toBe('new value');

      textarea.value = '';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await page.waitForChanges();

      expect(textarea.value).toBe('');
      expect(pdsTextarea?.value).toBe('');
    }
  });

  it('onChange logic with invalid `value` runs', async () => {
    const page = await newSpecPage({
      components: [PdsTextarea],
      html: `<pds-textarea value="initial" required="true"></pds-textarea>`,
    });

    const pdsTextarea = page.root;
    const textarea = pdsTextarea?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
    const eventSpy = jest.fn();

    pdsTextarea?.addEventListener('pdsTextareaChange', eventSpy);

    expect(pdsTextarea?.value).toEqual('initial');
    expect(textarea?.innerHTML).toEqual('initial');

    if (textarea) {
      textarea.value = '';
      textarea.checkValidity = jest.fn().mockReturnValue(false);
      textarea.dispatchEvent(new Event('change'));
      await page.waitForChanges();
    }

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
    if (textarea) {
      textarea.value = 'New input value';
      textarea.dispatchEvent(new Event('change'));
    }

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
              <label htmlFor="textarea-1">
                <span>
                  Description
                </span>
              </label>
              <div class="pds-textarea__action" part="action">
                <slot name="action"></slot>
              </div>
            </div>
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field" id="textarea-1" name="textarea-1"></textarea>
            </div>
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
              <label htmlFor="textarea-1">
                <span>
                  Description
                </span>
              </label>
            </div>
            <div class="pds-textarea__field-wrapper">
              <textarea class="pds-textarea__field" id="textarea-1" name="textarea-1"></textarea>
            </div>
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
              <label htmlFor="textarea-1">
                <span>
                  Bio
                </span>
              </label>
              <div class="pds-textarea__action" part="action">
                <slot name="action"></slot>
              </div>
            </div>
            <div class="pds-textarea__field-wrapper">
              <textarea aria-describedby="textarea-1__helper-message" class="pds-textarea__field" id="textarea-1" name="textarea-1">Hello</textarea>
            </div>
            <p class="pds-textarea__helper-message" id="textarea-1__helper-message">
              Max 500 characters
            </p>
          </div>
        </mock:shadow-root>
        <span slot="action">5/500</span>
      </pds-textarea>
    `);
  });

  describe('hideLabel', () => {
    it('renders label wrapper with visually-hidden class when hideLabel is true', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-1" label="Description" hide-label></pds-textarea>`,
      });

      const labelWrapper = root?.shadowRoot?.querySelector('.pds-textarea__label-wrapper');
      const labelSpan = root?.shadowRoot?.querySelector('.pds-textarea__label-wrapper span');

      expect(labelWrapper).not.toBeNull();
      expect(labelSpan?.classList.contains('visually-hidden')).toBe(true);
      expect(labelSpan?.textContent?.trim()).toBe('Description');
    });

    it('does not set aria-label on textarea when hideLabel is true (label still in DOM)', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-1" label="Description" hide-label></pds-textarea>`,
      });

      const textarea = root?.shadowRoot?.querySelector('textarea');
      expect(textarea?.hasAttribute('aria-label')).toBeFalsy();
    });

    it('does not show action slot when hideLabel is true', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `
          <pds-textarea component-id="textarea-1" label="Description" hide-label>
            <span slot="action">Help</span>
          </pds-textarea>
        `,
      });

      const labelWrapper = root?.shadowRoot?.querySelector('.pds-textarea__label-wrapper');
      const actionSlot = root?.shadowRoot?.querySelector('.pds-textarea__action');

      expect(labelWrapper).not.toBeNull(); // Label wrapper still exists
      expect(actionSlot).toBeNull(); // But action slot is hidden
      expect(root?.getAttribute('has-action')).toBeNull();
    });

    it('renders label wrapper without visually-hidden class when hideLabel is false', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-1" label="Description"></pds-textarea>`,
      });

      const labelWrapper = root?.shadowRoot?.querySelector('.pds-textarea__label-wrapper');
      const labelSpan = root?.shadowRoot?.querySelector('.pds-textarea__label-wrapper span');

      expect(labelWrapper).not.toBeNull();
      expect(labelSpan?.classList.contains('visually-hidden')).toBe(false);
      expect(labelSpan?.textContent?.trim()).toBe('Description');
    });

    it('does not set aria-label on textarea when hideLabel is false', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-1" label="Description"></pds-textarea>`,
      });

      const textarea = root?.shadowRoot?.querySelector('textarea');
      expect(textarea?.hasAttribute('aria-label')).toBeFalsy();
    });
  });

  describe('character counter', () => {
    it('renders character counter when maxLength is set', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-maxlength" label="Bio" max-length="120" value="Hello world"></pds-textarea>`,
      });

      const fieldWrapper = root?.shadowRoot?.querySelector('.pds-textarea__field-wrapper');
      const counter = root?.shadowRoot?.querySelector('.pds-textarea__character-counter');
      expect(fieldWrapper).not.toBeNull();
      expect(counter).not.toBeNull();
      expect(counter?.textContent?.trim()).toBe('11 / 120');

      // Verify counter is positioned within field wrapper
      expect(fieldWrapper?.contains(counter as Node)).toBe(true);
    });

    it('does not render character counter when maxLength is not set', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-no-maxlength" label="Bio" value="Hello world"></pds-textarea>`,
      });

      const counter = root?.shadowRoot?.querySelector('.pds-textarea__character-counter');
      expect(counter).toBeNull();
    });

    it('updates character counter as value changes', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-counter" label="Bio" max-length="50" value="Hello"></pds-textarea>`,
      });

      const root = page.root;
      let counter = root?.shadowRoot?.querySelector('.pds-textarea__character-counter');
      expect(counter?.textContent?.trim()).toBe('5 / 50');

      // Update value
      if (root) {
        root.value = 'Hello world!';
        await page.waitForChanges();
      }

      counter = root?.shadowRoot?.querySelector('.pds-textarea__character-counter');
      expect(counter?.textContent?.trim()).toBe('12 / 50');
    });

    it('shows 0 characters when value is empty', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-empty" label="Bio" max-length="100" value=""></pds-textarea>`,
      });

      const counter = root?.shadowRoot?.querySelector('.pds-textarea__character-counter');
      expect(counter?.textContent?.trim()).toBe('0 / 100');
    });

    it('prevents input beyond maxLength', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-limit" label="Bio" max-length="5" value="Hello"></pds-textarea>`,
      });

      const component = page.rootInstance;

      // Mock textarea with value exceeding limit
      const mockEvent = {
        target: {
          value: 'Hello World!' // 12 characters, exceeding limit of 5
        }
      } as unknown as Event;

      // Call onInput directly
      component.onInput(mockEvent);
      await page.waitForChanges();

      // Value should be truncated to maxLength
      expect(component.value).toBe('Hello');
    });

    it('renders character counter with disabled state', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-disabled-counter" label="Bio" max-length="100" disabled="true" value="Disabled text"></pds-textarea>`,
      });

      const counter = root?.shadowRoot?.querySelector('.pds-textarea__character-counter');
      expect(counter).not.toBeNull();
      expect(counter?.textContent?.trim()).toBe('13 / 100');
    });

    it('renders character counter with readonly state', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-readonly-counter" label="Bio" max-length="200" readonly="true" value="Readonly text"></pds-textarea>`,
      });

      const counter = root?.shadowRoot?.querySelector('.pds-textarea__character-counter');
      expect(counter).not.toBeNull();
      expect(counter?.textContent?.trim()).toBe('13 / 200');
    });

    it('renders maxlength attribute on native textarea when maxLength prop is set', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-attr" label="Bio" max-length="150"></pds-textarea>`,
      });

      const textarea = root?.shadowRoot?.querySelector<HTMLTextAreaElement>('textarea');
      expect(textarea?.getAttribute('maxlength')).toBe('150');
    });

    it('handles null/undefined value gracefully in character counter', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-null" label="Bio" max-length="100"></pds-textarea>`,
      });

      const counter = root?.shadowRoot?.querySelector('.pds-textarea__character-counter');
      expect(counter?.textContent?.trim()).toBe('0 / 100');
    });
  });

  describe('ResizeObserver and positioning', () => {
    beforeAll(() => {
      // Mock ResizeObserver for these tests
      global.ResizeObserver = jest.fn(() => ({
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
      })) as any;
    });

    afterAll(() => {
      delete (global as any).ResizeObserver;
    });

    it('sets up ResizeObserver when maxLength is present and observer is available', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-resize" label="Bio" max-length="100"></pds-textarea>`,
      });

      const component = page.rootInstance;
      expect(component.resizeObserver).toBeDefined();
    });

    it('cleans up ResizeObserver on disconnectedCallback', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-cleanup" label="Bio" max-length="100"></pds-textarea>`,
      });

      const component = page.rootInstance;
      const disconnectSpy = jest.fn();
      component.resizeObserver = { disconnect: disconnectSpy };

      component.disconnectedCallback();
      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('handles updateCharacterCounterPosition when elements are missing', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-position" label="Bio" max-length="100"></pds-textarea>`,
      });

      const component = page.rootInstance;
      component.characterCounter = null;
      component.nativeTextarea = null;

      // Should not throw when elements are missing
      expect(() => component.updateCharacterCounterPosition()).not.toThrow();
    });

    it('updates counter position when value changes with ResizeObserver', async () => {
      const originalRAF = global.requestAnimationFrame;
      const rafSpy = jest.fn((cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      });
      global.requestAnimationFrame = rafSpy;

      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-update" label="Bio" max-length="100" value="test"></pds-textarea>`,
      });

      const component = page.rootInstance;

      // Simulate input event which triggers repositioning
      component.value = 'updated text';
      await page.waitForChanges();

      expect(rafSpy).toHaveBeenCalled();

      global.requestAnimationFrame = originalRAF;
    });
  });

  describe('Form Associated Custom Elements API', () => {
    it('calls formResetCallback and resets value', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-form" value="initial value"></pds-textarea>`,
      });

      const component = page.rootInstance;
      expect(component.value).toBe('initial value');

      component.formResetCallback();
      expect(component.value).toBe('');
    });

    it('calls formDisabledCallback and updates disabled state', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-disabled"></pds-textarea>`,
      });

      const component = page.rootInstance;
      expect(component.disabled).toBe(false);

      component.formDisabledCallback(true);
      expect(component.disabled).toBe(true);

      component.formDisabledCallback(false);
      expect(component.disabled).toBe(false);
    });

    it('calls formStateRestoreCallback with string state', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-restore"></pds-textarea>`,
      });

      const component = page.rootInstance;

      component.formStateRestoreCallback('restored value');
      expect(component.value).toBe('restored value');
    });

    it('calls formStateRestoreCallback with FormData state', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-formdata" name="textarea-name"></pds-textarea>`,
      });

      const component = page.rootInstance;
      const formData = new FormData();
      formData.set('textarea-name', 'formdata value');

      component.formStateRestoreCallback(formData);
      expect(component.value).toBe('formdata value');
    });

    it('calls formStateRestoreCallback with FormData but no matching name', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-nomatch" name="textarea-name"></pds-textarea>`,
      });

      const component = page.rootInstance;
      const formData = new FormData();
      formData.set('different-name', 'value');

      const originalValue = component.value;
      component.formStateRestoreCallback(formData);
      expect(component.value).toBe(originalValue); // Should remain unchanged
    });

    it('calls updateFormValue when internals are available', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-internals" value="test"></pds-textarea>`,
      });

      const component = page.rootInstance;
      const mockSetFormValue = jest.fn();
      const mockSetValidity = jest.fn();

      component.internals = {
        setFormValue: mockSetFormValue,
        setValidity: mockSetValidity,
      };
      component.nativeTextarea = {
        validity: { valid: true },
        validationMessage: '',
      };

      component.updateFormValue();

      expect(mockSetFormValue).toHaveBeenCalledWith('test');
      expect(mockSetValidity).toHaveBeenCalled();
    });
  });

  describe('highlight', () => {
    it('renders with highlight attribute when highlight prop is true', async () => {
      const { root } = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-1" highlight="true" value="test"></pds-textarea>`,
      });

      expect(root?.hasAttribute('highlight')).toBe(true);
    });

    it('reflects highlight property to attribute', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-1"></pds-textarea>`,
      });

      const component = page.rootInstance;
      const root = page.root;

      // Initially no highlight
      expect(root?.hasAttribute('highlight')).toBe(false);

      // Set highlight property
      component.highlight = true;
      await page.waitForChanges();

      // Attribute should be reflected
      expect(root?.hasAttribute('highlight')).toBe(true);

      // Unset highlight property
      component.highlight = false;
      await page.waitForChanges();

      // Attribute should be removed
      expect(root?.hasAttribute('highlight')).toBe(false);
    });

    it('semantic states take precedence over highlight', async () => {
      const page = await newSpecPage({
        components: [PdsTextarea],
        html: `<pds-textarea component-id="textarea-1" highlight="true" disabled="true" value="test"></pds-textarea>`,
      });

      const root = page.root;

      // Both attributes should be present
      expect(root?.hasAttribute('highlight')).toBe(true);
      expect(root?.hasAttribute('disabled')).toBe(true);

      // Disabled state should apply (CSS selector excludes disabled)
      const textarea = root?.shadowRoot?.querySelector('textarea');
      expect(textarea?.hasAttribute('disabled')).toBe(true);
    });
  });
});
