import { newSpecPage } from '@stencil/core/testing';
import { PdsInput } from '../pds-input';

describe('pds-input', () => {
  it('renders a value when prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" value="Frank Dux"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders a label', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" label="Name" value="Frank Dux"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" label="Name" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__label-wrapper">
            <label class="pds-input__label" htmlFor="field-1">
              <span>
                Name
              </span>
            </label>
          </div>
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders placeholder text', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input placeholder="placeholder text" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" placeholder="placeholder text" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input placeholder="placeholder text" id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders required input', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input required="true" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" required="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input required id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders disabled input', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input disabled="true" component-id="field-1" value="Frank Dux"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input aria-disabled="true" component-id="field-1" disabled="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="is-disabled pds-input__field-wrapper">
            <input disabled id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders readonly input', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input readonly="true" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input aria-readonly="true" component-id="field-1" readonly="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input readonly id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders full width input', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input full-width="true" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" full-width="true" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders in invalid state when invalid prop is set', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="pds-input-invalid" invalid="true" label="Name" value="Frank Dux"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="pds-input-invalid" invalid="true" label="Name" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__label-wrapper">
            <label class="pds-input__label" htmlFor="pds-input-invalid">
              <span>
                Name
              </span>
            </label>
          </div>
          <div class="has-error pds-input__field-wrapper">
            <input aria-invalid="true" id="pds-input-invalid" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders autocomplete attribute', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" value="Frank Dux" autocomplete="given-name"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" value="Frank Dux" autocomplete="given-name">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" autocomplete="given-name" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders max attribute', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" value="Frank Dux" max="100"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" value="Frank Dux" max="100">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" max="100" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders maxlength attribute', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" value="Frank Dux" maxlength="100"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" value="Frank Dux" maxlength="100">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" maxlength="100" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders min attribute', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" value="Frank Dux" min="0"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" value="Frank Dux" min="0">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" min="0" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders minlength attribute', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" value="Frank Dux" minlength="100"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" value="Frank Dux" minlength="100">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" minlength="100" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders pattern attribute', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" value="Frank Dux" pattern="^[a-zA-Z]+$"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" value="Frank Dux" pattern="^[a-zA-Z]+$">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" pattern="^[a-zA-Z]+$" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders step attribute', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1" value="Frank Dux" step="1"></pds-input>`
    });
    expect(root).toEqualHtml(`
    <pds-input component-id="field-1" value="Frank Dux" step="1">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" step="1" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders a helper message', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input helper-message="Use the correct syntax" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    const helperMessage = root.shadowRoot.querySelector('.pds-input__helper-message');
    expect(helperMessage).not.toBeNull();
  });

  it('renders a error message', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input error-message="Please provide a helpful error message" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    const errorMessage = root.shadowRoot.querySelector('.pds-input__error-message');
    expect(errorMessage).not.toBeNull();
  });

  it('renders a prefix', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input prefix="Prefix" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input prefix="Prefix" component-id="field-1" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  });

  it('renders a suffix', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input suffix="Suffix" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input suffix="Suffix" component-id="field-1" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  })

  it('renders a prepend', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input prepend="Prepend" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input prepend="Prepend" component-id="field-1" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  })

  it('renders a append', async () => {
    const { root } = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input append="Append" component-id="field-1" value="Frank Dux"></pds-input>`
    });

    expect(root).toEqualHtml(`
    <pds-input append="Append" component-id="field-1" value="Frank Dux">
      <mock:shadow-root>
        <div class="pds-input">
          <div class="pds-input__field-wrapper">
            <input id="field-1" class="pds-input__field" type="text" value="Frank Dux" />
          </div>
        </div>
      </mock:shadow-root>
    </pds-input>
    `);
  })

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

  it('calls onBlurEvent when loses focus', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input />`,
    });

    const pdsInput = page.root;
    const nativeInput = pdsInput?.shadowRoot?.querySelector('input')
    const onBlurEvent = jest.fn();
    pdsInput.addEventListener('pdsBlur', onBlurEvent);

    nativeInput?.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(onBlurEvent).toHaveBeenCalled();

  });

  it('calls onFocusEvent when gains focus', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input />`,
    });

    const pdsInput = page.root;
    const nativeInput = pdsInput?.shadowRoot?.querySelector('input')
    const onFocusEvent = jest.fn();
    pdsInput.addEventListener('pdsFocus', onFocusEvent);

    nativeInput?.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    expect(onFocusEvent).toHaveBeenCalled();
  });

  it('should call onChangeEvent when value is changed', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input />`,
    });
    const pdsInput = page.root;

    const nativeInput = pdsInput?.shadowRoot?.querySelector('input')
    nativeInput?.value = 'test';

    const onChangeEvent = jest.fn();
    pdsInput?.addEventListener('pdsChange', onChangeEvent);

    nativeInput?.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(onChangeEvent).toHaveBeenCalled();

  });

  it('calls onChangeEvent when input value changes', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input />`,
    });
    const component = page.rootInstance;
    const mockEvent = new Event('change');
    const pdsChangeSpy = jest.spyOn(component.pdsChange, 'emit');

    component.value = 'Test Value';
    component.emitValueChange(mockEvent);

    expect(pdsChangeSpy).toHaveBeenCalledWith({
      value: 'Test Value',
      event: mockEvent,
    });
  });

  it('should set focus on the input element when setFocus is called', async() => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input></pds-input>`,
    });

    const component = page.rootInstance;

    // Mock the native input element
    const nativeInput = document.createElement('input');
    jest.spyOn(nativeInput, 'focus');
    component['nativeInput'] = nativeInput;
    await component.setFocus();
    expect(nativeInput.focus).toHaveBeenCalled();
  });

  it('should properly initialize state in componentWillLoad', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `
        <pds-input component-id="field-1">
          <div slot="prefix">Prefix Content</div>
          <div slot="suffix">Suffix Content</div>
          <div slot="prepend">Prepend Content</div>
          <div slot="append">Append Content</div>
        </pds-input>
      `
    });

    const component = page.rootInstance;
    const root = page.root;

    expect(component).not.toBeNull();
    expect(root).not.toBeNull();

    // Check that slot presence was correctly detected
    expect(component.hasPrefix).toBe(true);
    expect(component.hasSuffix).toBe(true);
    expect(component.hasPrepend).toBe(true);
    expect(component.hasAppend).toBe(true);

    // Check that host attributes are properly set
    if (root) {
      expect(root.getAttribute('has-prefix')).toBe('true');
      expect(root.getAttribute('has-suffix')).toBe('true');
      expect(root.getAttribute('has-prepend')).toBe('true');
      expect(root.getAttribute('has-append')).toBe('true');
    }
  });

  it('should properly handle missing slots in componentWillLoad', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `<pds-input component-id="field-1"></pds-input>`
    });

    const component = page.rootInstance;
    const root = page.root;

    expect(component).not.toBeNull();
    expect(root).not.toBeNull();

    // Check that slot presence is false when slots are empty
    expect(component.hasPrefix).toBe(false);
    expect(component.hasSuffix).toBe(false);
    expect(component.hasPrepend).toBe(false);
    expect(component.hasAppend).toBe(false);

    // Check that host attributes are not set
    if (root) {
      expect(root.hasAttribute('has-prefix')).toBe(false);
      expect(root.hasAttribute('has-suffix')).toBe(false);
      expect(root.hasAttribute('has-prepend')).toBe(false);
      expect(root.hasAttribute('has-append')).toBe(false);
    }
  });

  it('should inherit aria attributes in componentWillLoad', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `
        <pds-input
          component-id="field-1"
          aria-label="Test Label"
          aria-describedby="test-desc"
          aria-details="test-details"
        ></pds-input>
      `
    });

    const root = page.root;
    expect(root).not.toBeNull();

    if (root?.shadowRoot) {
      const input = root.shadowRoot.querySelector('input');
      expect(input).not.toBeNull();

      // Check that aria attributes were inherited
      if (input) {
        expect(input.getAttribute('aria-label')).toBe('Test Label');
        expect(input.getAttribute('aria-describedby')).toBe('test-desc');
        expect(input.getAttribute('aria-details')).toBe('test-details');
      }
    }
  });

  it('should update addon widths when prefix and suffix are present', async () => {
    const page = await newSpecPage({
      components: [PdsInput],
      html: `
        <pds-input component-id="field-1">
          <div slot="prefix">Prefix Content</div>
          <div slot="suffix">Suffix Content</div>
        </pds-input>
      `
    });

    const component = page.rootInstance;
    const root = page.root;

    expect(component).not.toBeNull();
    expect(root).not.toBeNull();

    if (root?.shadowRoot) {
      const prefixEl = root.shadowRoot.querySelector('.pds-input__prefix');
      const suffixEl = root.shadowRoot.querySelector('.pds-input__suffix');

      // Mock offsetWidth values
      Object.defineProperty(prefixEl, 'offsetWidth', { value: 100 });
      Object.defineProperty(suffixEl, 'offsetWidth', { value: 120 });

      // Trigger the update and wait for changes
      component.updateAddonWidths();
      await page.waitForChanges();
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Check that CSS custom properties were set correctly
      expect(root.style.getPropertyValue('--prefix-width')).toBe('100px');
      expect(root.style.getPropertyValue('--suffix-width')).toBe('120px');
    }
  });

  describe('action slot', () => {
    it('renders action slot content when provided', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `
          <pds-input component-id="field-1" label="Email">
            <span slot="action">Help</span>
          </pds-input>
        `
      });

      expect(root).toEqualHtml(`
        <pds-input component-id="field-1" has-action="true" label="Email">
          <mock:shadow-root>
            <div class="pds-input">
              <div class="pds-input__label-wrapper">
                <label class="pds-input__label" htmlFor="field-1">
                  <span>
                    Email
                  </span>
                </label>
                <div class="pds-input__action" part="action">
                  <slot name="action"></slot>
                </div>
              </div>
              <div class="pds-input__field-wrapper">
                <input id="field-1" class="pds-input__field" type="text" value="" />
              </div>
            </div>
          </mock:shadow-root>
          <span slot="action">Help</span>
        </pds-input>
      `);
    });

    it('does not render action slot when no content is provided', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `<pds-input component-id="field-1" label="Email"></pds-input>`
      });

      expect(root).toEqualHtml(`
        <pds-input component-id="field-1" label="Email">
          <mock:shadow-root>
            <div class="pds-input">
              <div class="pds-input__label-wrapper">
                <label class="pds-input__label" htmlFor="field-1">
                  <span>
                    Email
                  </span>
                </label>
              </div>
              <div class="pds-input__field-wrapper">
                <input id="field-1" class="pds-input__field" type="text" value="" />
              </div>
            </div>
          </mock:shadow-root>
        </pds-input>
      `);
    });

    it('sets has-action attribute when action slot content is present', async () => {
      const page = await newSpecPage({
        components: [PdsInput],
        html: `
          <pds-input component-id="field-1" label="Password">
            <a slot="action" href="#">Forgot password?</a>
          </pds-input>
        `
      });

      const root = page.root;
      expect(root?.getAttribute('has-action')).toBe('true');
    });

    it('properly detects action slot presence in componentWillLoad', async () => {
      const page = await newSpecPage({
        components: [PdsInput],
        html: `
          <pds-input component-id="field-1" label="Username">
            <button slot="action">Help</button>
          </pds-input>
        `
      });

      const component = page.rootInstance;
      expect(component.hasAction).toBe(true);
    });

    it('renders action slot with complex content', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `
          <pds-input component-id="field-1" label="API Key">
            <button slot="action" type="button">
              <span>Copy</span>
            </button>
          </pds-input>
        `
      });

      const actionWrapper = root?.shadowRoot?.querySelector('.pds-input__action');
      expect(actionWrapper).not.toBeNull();
      expect(actionWrapper?.getAttribute('part')).toBe('action');
    });

    it('does not render label wrapper when no label is provided', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `
          <pds-input component-id="field-1">
            <span slot="action">Help</span>
          </pds-input>
        `
      });

      const labelWrapper = root?.shadowRoot?.querySelector('.pds-input__label-wrapper');
      expect(labelWrapper).toBeNull();
    });

    it('renders action slot alongside required indicator', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `
          <pds-input component-id="field-1" label="Email" required>
            <span slot="action">Info</span>
          </pds-input>
        `
      });

      expect(root).toEqualHtml(`
        <pds-input component-id="field-1" has-action="true" label="Email" required>
          <mock:shadow-root>
            <div class="pds-input">
              <div class="pds-input__label-wrapper">
                <label class="pds-input__label" htmlFor="field-1">
                  <span>
                    Email
                    <span class="pds-input__required-indicator"> *</span>
                  </span>
                </label>
                <div class="pds-input__action" part="action">
                  <slot name="action"></slot>
                </div>
              </div>
              <div class="pds-input__field-wrapper">
                <input id="field-1" class="pds-input__field" type="text" value="" required />
              </div>
            </div>
          </mock:shadow-root>
          <span slot="action">Info</span>
        </pds-input>
      `);
    });
  });

  describe('hideLabel', () => {
    it('renders label wrapper with visually-hidden class when hideLabel is true', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `<pds-input component-id="field-1" label="Name" hide-label></pds-input>`,
      });

      const labelWrapper = root?.shadowRoot?.querySelector('.pds-input__label-wrapper');
      const labelSpan = root?.shadowRoot?.querySelector('.pds-input__label span');

      expect(labelWrapper).not.toBeNull();
      expect(labelSpan?.classList.contains('visually-hidden')).toBe(true);
      expect(labelSpan?.textContent?.trim()).toBe('Name');
    });

    it('does not set aria-label on input when hideLabel is true (label still in DOM)', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `<pds-input component-id="field-1" label="Name" hide-label></pds-input>`,
      });

      const input = root?.shadowRoot?.querySelector('input');
      expect(input?.hasAttribute('aria-label')).toBeFalsy();
    });

    it('does not show action slot when hideLabel is true', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `
          <pds-input component-id="field-1" label="Name" hide-label>
            <span slot="action">Help</span>
          </pds-input>
        `,
      });

      const labelWrapper = root?.shadowRoot?.querySelector('.pds-input__label-wrapper');
      const actionSlot = root?.shadowRoot?.querySelector('.pds-input__action');

      expect(labelWrapper).not.toBeNull(); // Label wrapper still exists
      expect(actionSlot).toBeNull(); // But action slot is hidden
      expect(root?.getAttribute('has-action')).toBeNull();
    });

    it('renders label wrapper without visually-hidden class when hideLabel is false', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `<pds-input component-id="field-1" label="Name" hide-label="false"></pds-input>`,
      });

      const labelWrapper = root?.shadowRoot?.querySelector('.pds-input__label-wrapper');
      const labelSpan = root?.shadowRoot?.querySelector('.pds-input__label span');

      expect(labelWrapper).not.toBeNull();
      expect(labelSpan?.classList.contains('visually-hidden')).toBe(false);
      expect(labelSpan?.textContent?.trim()).toBe('Name');
    });

    it('does not set aria-label on input when hideLabel is false', async () => {
      const { root } = await newSpecPage({
        components: [PdsInput],
        html: `<pds-input component-id="field-1" label="Name"></pds-input>`,
      });

      const input = root?.shadowRoot?.querySelector('input');
      expect(input?.hasAttribute('aria-label')).toBeFalsy();
    });
  });
});
