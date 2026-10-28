import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';
import { enlarge } from '@pine-ds/icons/icons';

describe('pds-select', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });
    expect(root).toEqualHtml(`
      <pds-select component-id="field-1">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="field-1">
                <span></span>
              </label>
            </div>
            <select class="pds-select__field" id="field-1" part="select">
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with slotted options', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" label="Name">
               <option value="1">Option 1</option>
               <option value="2">Option 2</option>
             </pds-select>`,
    });

    // Trigger the handleSlotChange logic
    const slot = page.root?.shadowRoot?.querySelector('slot');
    const select = page.root?.shadowRoot?.querySelector('select');

    // Get the actual slotted nodes
    const slottedElements = slot?.assignedElements();

    // Clone and append each option to the select
    slottedElements?.forEach(element => {
      select?.appendChild(element.cloneNode(true));
    });

    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <pds-select component-id="field-1" label="Name">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="field-1">
                <span>Name</span>
              </label>
            </div>
            <select class="pds-select__field" id="field-1" part="select">
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </pds-select>
    `);
  });

  it('renders a label', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" label="Name"></pds-select>`,
    });
    expect(root).toEqualHtml(`
      <pds-select component-id="field-1" label="Name">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="field-1">
                <span>Name</span>
              </label>
            </div>
            <select class="pds-select__field" id="field-1" part="select"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with error message', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" error-message="Error occurred"></pds-select>`,
    });

    const errorMessage = page.root?.shadowRoot?.querySelector('.pds-select__error-message');
    expect(errorMessage?.textContent).toContain('Error occurred');
  });

  it('renders with helper message', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" helper-message="Helper text"></pds-select>`,
    });

    await page.waitForChanges(); // Ensures component fully renders

    const helperMessage = page.root?.shadowRoot?.querySelector('.pds-select__helper-message');
    expect(helperMessage?.textContent).toBe('Helper text');
  });

  it('renders with disabled attribute and class', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select aria-disabled="true" component-id="field-1" disabled label="Disabled"></pds-select>`,
    });

    await page.waitForChanges(); // Ensures component fully renders

    expect(page.root).toEqualHtml(`
      <pds-select aria-disabled="true" class="is-disabled" component-id="field-1" label="Disabled" disabled="">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="field-1">
                <span>Disabled</span>
              </label>
            </div>
            <select class="pds-select__field" disabled="" id="field-1" part="select">
              <slot></slot>
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with invalid class when prop set ', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" invalid="true"></pds-select>`,
    });

    await page.waitForChanges(); // Ensures component fully renders

    expect(page.root).toEqualHtml(`
      <pds-select class="is-invalid" component-id="field-1" invalid="true">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="field-1">
                <span></span>
              </label>
            </div>
            <select aria-invalid="true" class="pds-select__field" id="field-1" part="select">
              <slot></slot>
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders autocomplete attribute when property is passed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select autocomplete="off" component-id="field-1" label="Name"></pds-select>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-select autocomplete="off" component-id="field-1" label="Name">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="field-1">
                <span>Name</span>
              </label>
            </div>
            <select autocomplete="off" class="pds-select__field" id="field-1" part="select"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with autocomplete attribute set', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select autocomplete="on" component-id="field-1" label="Name"></pds-select>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-select autocomplete="on" component-id="field-1" label="Name">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="field-1">
                <span>Name</span>
              </label>
            </div>
            <select autocomplete="on" class="pds-select__field" id="field-1" part="select"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with the multiple attribute', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" multiple></pds-select>`,
    });

    expect(root).toEqualHtml(`
      <pds-select component-id="field-1" multiple="">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="field-1">
                <span></span>
              </label>
            </div>
            <select class="pds-select__field" id="field-1" multiple="" part="select">
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('calls updateSelectedOption when value changes with multiple values', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" multiple></pds-select>`,
    });

    const component = page.rootInstance;
    const updateSelectedOptionSpy = jest.spyOn(component, 'updateSelectedOption');

    // Mock the selectEl and its options property
    const mockOption1 = { value: 'option1', selected: false } as HTMLOptionElement;
    const mockOption2 = { value: 'option2', selected: false } as HTMLOptionElement;
    const mockOption3 = { value: 'option3', selected: false } as HTMLOptionElement;
    const mockOptions = [mockOption1, mockOption2, mockOption3];
    const mockSelectEl = {
      options: mockOptions,
    } as unknown as HTMLSelectElement;
    component.selectEl = mockSelectEl;

    // Change the value property to an array
    component.value = ['option1', 'option3'];
    await page.waitForChanges();

    expect(updateSelectedOptionSpy).toHaveBeenCalled();
    expect(mockOption1.selected).toBe(true);
    expect(mockOption2.selected).toBe(false);
    expect(mockOption3.selected).toBe(true);
  });

  it('calls updateSelectedOption when value changes with a single value', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });

    const component = page.rootInstance;
    const updateSelectedOptionSpy = jest.spyOn(component, 'updateSelectedOption');

    // Mock the selectEl and its options property
    const mockOption1 = { value: 'option1', selected: false } as HTMLOptionElement;
    const mockOption2 = { value: 'option2', selected: false } as HTMLOptionElement;
    const mockOption3 = { value: 'option3', selected: false } as HTMLOptionElement;
    const mockOptions = [mockOption1, mockOption2, mockOption3];
    const mockSelectEl = {
      options: mockOptions,
    } as unknown as HTMLSelectElement;
    component.selectEl = mockSelectEl;

    // Change the value property to a single string
    component.value = 'option2';
    await page.waitForChanges();

    expect(updateSelectedOptionSpy).toHaveBeenCalled();
    expect(mockOption1.selected).toBe(false);
    expect(mockOption2.selected).toBe(true);
    expect(mockOption3.selected).toBe(false);
  });

  it('updates selected options when value changes', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
              </pds-select>`
    });

    const component = page.rootInstance;

    const mockOption1 = document.createElement('option');
    mockOption1.value = '1';
    const mockOption2 = document.createElement('option');
    mockOption2.value = '2';

    const mockSelect = document.createElement('select');
    mockSelect.appendChild(mockOption1);
    mockSelect.appendChild(mockOption2);

    // Override options with proper iterator
    Object.defineProperty(mockSelect, 'options', {
      value: {
        length: 2,
        item: (index: number) => [mockOption1, mockOption2][index],
        [Symbol.iterator]: function* () {
          yield mockOption1;
          yield mockOption2;
        }
      }
    });

    component.selectEl = mockSelect;
    component.value = "2";
    await page.waitForChanges();

    expect(mockOption2.selected).toBeTruthy();
  });

});

describe('handleSlotChange', () => {
  it('handles slot changes with option elements', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" value="2"></pds-select>`,
    });

    const component = page.rootInstance;

    // Mock the required elements with proper value attribute
    const mockOption1 = document.createElement('option');
    mockOption1.setAttribute('value', '1');
    mockOption1.textContent = 'Option 1';
    const mockOption2 = document.createElement('option');
    mockOption2.setAttribute('value', '2');
    mockOption2.textContent = 'Option 2';

    const mockSlot = {
      assignedElements: () => [mockOption1, mockOption2]
    } as unknown as HTMLSlotElement;

    const mockSelect = document.createElement('select');
    Object.defineProperty(mockSelect, 'options', {
      value: {
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () { }
      }
    });

    component.slotContainer = { querySelector: () => mockSlot } as unknown as HTMLDivElement;
    component.selectEl = mockSelect;

    // Call handleSlotChange
    component.handleSlotChange();

    await page.waitForChanges();

    // Verify the select element's children
    const selectChildren = Array.from(component.selectEl.children) as HTMLOptionElement[];
    expect(selectChildren.length).toBe(2);
    expect(selectChildren[1].getAttribute('value')).toBe('2');
  });

  it('handles slot changes with optgroup elements', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });

    const component = page.rootInstance;

    // Mock the required elements
    const mockOptgroup = document.createElement('optgroup');
    mockOptgroup.label = 'Group 1';
    const mockOption = document.createElement('option');
    mockOption.value = '1';
    mockOption.text = 'Option 1';
    mockOptgroup.appendChild(mockOption);

    const mockSlot = {
      assignedElements: () => [mockOptgroup]
    } as unknown as HTMLSlotElement;

    const mockSelect = document.createElement('select');
    // Add options property with iterator
    Object.defineProperty(mockSelect, 'options', {
      value: {
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () { }
      }
    });

    component.slotContainer = { querySelector: () => mockSlot } as unknown as HTMLDivElement;
    component.selectEl = mockSelect;

    // Call handleSlotChange
    component.handleSlotChange();

    await page.waitForChanges();

    expect(component.selectEl.children.length).toBe(1);
    expect(component.selectEl.children[0].tagName).toBe('OPTGROUP');
    expect(component.selectEl.children[0].children.length).toBe(1);
  });

  it('sets selected attribute when option value matches component value', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });

    const component = page.rootInstance;

    // Create mock options
    const mockOption1 = document.createElement('option');
    mockOption1.value = '1';
    mockOption1.textContent = 'Option 1';
    const mockOption2 = document.createElement('option');
    mockOption2.value = '2';
    mockOption2.textContent = 'Option 2';

    // Create mock options collection for the select element
    const mockOptions = [mockOption1, mockOption2];
    Object.defineProperty(mockOptions, Symbol.iterator, {
      enumerable: false,
      value: function* () {
        yield mockOption1;
        yield mockOption2;
      }
    });

    // Create and configure mock select element
    const mockSelect = document.createElement('select');
    Object.defineProperty(mockSelect, 'options', {
      value: mockOptions,
      writable: true
    });

    // Set up the component
    component.selectEl = mockSelect;
    component.slotContainer = {
      querySelector: () => ({
        assignedElements: () => [mockOption1, mockOption2]
      })
    } as unknown as HTMLDivElement;

    // Set the value that should match mockOption2
    component.value = '2';

    // Call handleSlotChange
    component.handleSlotChange();

    await page.waitForChanges();

    expect(mockSelect.options[1].selected).toBe(true);
  });

  it('sets selected attribute when handling slot changes', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });

    const component = page.rootInstance;

    const mockOption1 = document.createElement('option');
    mockOption1.value = '1';
    const mockOption2 = document.createElement('option');
    mockOption2.value = '2';

    const mockSelect = document.createElement('select');
    mockSelect.appendChild(mockOption1);
    mockSelect.appendChild(mockOption2);

    // Override options with proper iterator
    Object.defineProperty(mockSelect, 'options', {
      value: {
        length: 2,
        item: (index: number) => [mockOption1, mockOption2][index],
        [Symbol.iterator]: function* () {
          yield mockOption1;
          yield mockOption2;
        }
      }
    });

    component.selectEl = mockSelect;
    component.value = '2';

    component.slotContainer = {
      querySelector: () => ({
        assignedElements: () => [mockOption1, mockOption2]
      })
    } as unknown as HTMLDivElement;

    component.handleSlotChange();
    await page.waitForChanges();

    expect(mockOption2.selected).toBeTruthy();
  });
});

describe('onSelectUpdate', () => {
  it('updates value and emits event on select change', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });

    const component = page.rootInstance;
    const pdsSelectChangeSpy = jest.spyOn(component.pdsSelectChange, 'emit');

    // Create a mock select element with proper options collection
    const mockOption = { value: '1', selected: true } as HTMLOptionElement;
    const mockOptions = {
      length: 1,
      item: (index: number) => index === 0 ? mockOption : null,
      [Symbol.iterator]: function* () {
        yield mockOption;
      }
    };
    const mockSelect = {
      options: mockOptions
    } as unknown as HTMLSelectElement;

    // Set the mock select element as the component's selectEl
    component.selectEl = mockSelect;

    // Create a mock event with the select as target
    const mockEvent = { target: mockSelect } as unknown as Event;

    // Call onSelectUpdate directly with the mock event
    component.onSelectUpdate(mockEvent);

    await page.waitForChanges();

    expect(component.value).toBe('1');
    expect(pdsSelectChangeSpy).toHaveBeenCalled();
  });

  it('updates values array and emits event on multiple select change', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" multiple></pds-select>`,
    });

    const component = page.rootInstance;
    const pdsSelectChangeSpy = jest.spyOn(component.pdsSelectChange, 'emit');

    // Create mock options with multiple selections
    const mockOption1 = { value: '1', selected: true } as HTMLOptionElement;
    const mockOption2 = { value: '2', selected: true } as HTMLOptionElement;
    const mockOptions = {
      length: 2,
      item: (index: number) => index === 0 ? mockOption1 : mockOption2,
      [Symbol.iterator]: function* () {
        yield mockOption1;
        yield mockOption2;
      }
    };
    const mockSelect = {
      options: mockOptions
    } as unknown as HTMLSelectElement;

    component.selectEl = mockSelect;

    const mockEvent = { target: mockSelect } as unknown as Event;
    component.onSelectUpdate(mockEvent);

    await page.waitForChanges();

    expect(component.value).toEqual(['1', '2']);
    expect(pdsSelectChangeSpy).toHaveBeenCalled();
  });
});

describe('event emitters', () => {
  it('emits pdsBlur event when select loses focus', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" name="test"></pds-select>`,
    });

    const pdsSelect = page.root;
    const nativeSelect = pdsSelect?.shadowRoot?.querySelector('select');
    const onBlurEvent = jest.fn();
    pdsSelect?.addEventListener('pdsBlur', onBlurEvent);

    nativeSelect?.dispatchEvent(new FocusEvent('blur'));
    await page.waitForChanges();

    expect(onBlurEvent).toHaveBeenCalled();
  });

  it('emits pdsFocus event when select gains focus', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" name="test"></pds-select>`,
    });

    const pdsSelect = page.root;
    const nativeSelect = pdsSelect?.shadowRoot?.querySelector('select');
    const onFocusEvent = jest.fn();
    pdsSelect?.addEventListener('pdsFocus', onFocusEvent);

    nativeSelect?.dispatchEvent(new FocusEvent('focus'));
    await page.waitForChanges();

    expect(onFocusEvent).toHaveBeenCalled();
  });

  it('emits pdsKeyDown event when a key is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" name="test"></pds-select>`,
    });

    const pdsSelect = page.root;
    const nativeSelect = pdsSelect?.shadowRoot?.querySelector('select');
    const onKeyDownEvent = jest.fn();
    pdsSelect?.addEventListener('pdsKeyDown', onKeyDownEvent);

    const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    nativeSelect?.dispatchEvent(keyboardEvent);
    await page.waitForChanges();

    expect(onKeyDownEvent).toHaveBeenCalled();
  });

  it('emits pdsKeyDown event with correct key information', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" name="test"></pds-select>`,
    });

    const pdsSelect = page.root;
    const nativeSelect = pdsSelect?.shadowRoot?.querySelector('select');
    let receivedEvent: KeyboardEvent | null = null;

    pdsSelect?.addEventListener('pdsKeyDown', (e: CustomEvent<KeyboardEvent>) => {
      receivedEvent = e.detail;
    });

    const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' });
    nativeSelect?.dispatchEvent(keyboardEvent);
    await page.waitForChanges();

    expect(receivedEvent).not.toBeNull();
    expect(receivedEvent?.key).toBe('Enter');
  });
});

describe('action slot', () => {
  it('renders action slot content when provided', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select component-id="select-1" label="Country" name="country">
          <span slot="action">Help</span>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </pds-select>
      `,
    });

    expect(root).toEqualHtml(`
      <pds-select component-id="select-1" has-action="true" label="Country" name="country">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="select-1">
                <span>Country</span>
              </label>
              <div class="pds-select__action" part="action">
                <slot name="action"></slot>
              </div>
            </div>
            <select class="pds-select__field" id="select-1" name="country" part="select"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
        <span slot="action">Help</span>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </pds-select>
    `);
  });

  it('does not render action slot when no content is provided', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="select-1" label="Country" name="country"></pds-select>`,
    });

    expect(root).toEqualHtml(`
      <pds-select component-id="select-1" label="Country" name="country">
        <mock:shadow-root>
          <div class="pds-select">
            <div class="pds-select__label-wrapper">
              <label for="select-1">
                <span>Country</span>
              </label>
            </div>
            <select class="pds-select__field" id="select-1" name="country" part="select"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon aria-hidden="true" class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('sets has-action attribute when action slot content is present', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select component-id="select-1" label="Language" name="language">
          <button slot="action">Translate</button>
          <option value="en">English</option>
        </pds-select>
      `,
    });

    const root = page.root;
    expect(root?.getAttribute('has-action')).toBe('true');
  });

  it('renders action slot with complex content', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select component-id="select-1" label="Timezone" name="timezone">
          <a slot="action" href="#">
            <span>Auto-detect</span>
          </a>
          <option value="est">EST</option>
        </pds-select>
      `,
    });

    const actionWrapper = root?.shadowRoot?.querySelector('.pds-select__action');
    expect(actionWrapper).not.toBeNull();
    expect(actionWrapper?.getAttribute('part')).toBe('action');
  });

  it('does not render label wrapper when hideLabel is true', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select component-id="select-1" label="Country" name="country" hide-label>
          <span slot="action">Help</span>
          <option value="us">United States</option>
        </pds-select>
      `,
    });

    const labelWrapper = root?.shadowRoot?.querySelector('.pds-select__label-wrapper');
    const actionSlot = root?.shadowRoot?.querySelector('.pds-select__action');
    expect(labelWrapper).toBeNull();
    expect(actionSlot).toBeNull();
  });

  it('renders action slot with error message', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select component-id="select-1" label="Country" name="country" error-message="Please select a country">
          <span slot="action">Required</span>
          <option value="">Choose...</option>
          <option value="us">United States</option>
        </pds-select>
      `,
    });

    const actionWrapper = page.root?.shadowRoot?.querySelector('.pds-select__action');
    const errorMessage = page.root?.shadowRoot?.querySelector('.pds-select__error-message');

    expect(actionWrapper).not.toBeNull();
    expect(errorMessage?.textContent).toContain('Please select a country');
  });

  it('renders action slot with multiple select', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `
        <pds-select component-id="select-1" label="Skills" name="skills" multiple>
          <span slot="action">Select all that apply</span>
          <option value="js">JavaScript</option>
          <option value="ts">TypeScript</option>
          <option value="py">Python</option>
        </pds-select>
      `,
    });

    const actionWrapper = root?.shadowRoot?.querySelector('.pds-select__action');
    const selectIcon = root?.shadowRoot?.querySelector('.pds-select__select-icon');

    expect(actionWrapper).not.toBeNull();
    expect(selectIcon).toBeNull(); // Multiple selects don't have the dropdown icon
  });
});

describe('highlight', () => {
  it('renders with highlight attribute when highlight prop is true', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="select-1" highlight="true" label="Name" name="name"></pds-select>`,
    });

    expect(root?.hasAttribute('highlight')).toBe(true);
  });

  it('reflects highlight property to attribute', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="select-1" label="Name" name="name"></pds-select>`,
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
      components: [PdsSelect],
      html: `<pds-select component-id="select-1" highlight="true" disabled label="Name" name="name"></pds-select>`,
    });

    const root = page.root;

    // Both attributes should be present
    expect(root?.hasAttribute('highlight')).toBe(true);
    expect(root?.hasAttribute('disabled')).toBe(true);

    // Disabled state should apply (CSS selector excludes disabled)
    expect(root?.classList.contains('is-disabled')).toBe(true);
  });
});

describe('aria associations', () => {
  const renderSelect = async (attrs: string) => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" ${attrs}></pds-select>`,
    });

    const shadow = page.root.shadowRoot;
    const select = shadow.querySelector('select');

    return {
      describedBy: select.getAttribute('aria-describedby'),
      invalid: select.getAttribute('aria-invalid'),
      describedText: (id: string) => shadow.querySelector(`#${id}`)?.textContent,
    };
  };

  it('describes the error message when invalid', async () => {
    const { describedBy, invalid, describedText } = await renderSelect(
      'invalid="true" error-message="Please select a country"'
    );

    expect(describedBy).toBe('field-1__error-message');
    expect(invalid).toBe('true');
    expect(describedText(describedBy)).toContain('Please select a country');
  });

  it('describes the error message when only error-message is set', async () => {
    const { describedBy, invalid, describedText } = await renderSelect(
      'error-message="Please select a country"'
    );

    expect(describedBy).toBe('field-1__error-message');
    expect(invalid).toBe('true');
    expect(describedText(describedBy)).toContain('Please select a country');
  });

  it('prefers the error message over the helper message', async () => {
    const { describedBy } = await renderSelect(
      'invalid="true" helper-message="Pick one" error-message="Required"'
    );

    expect(describedBy).toBe('field-1__error-message');
  });

  it('describes the helper message when valid', async () => {
    const { describedBy, invalid, describedText } = await renderSelect('helper-message="Pick one"');

    expect(describedBy).toBe('field-1__helper-message');
    expect(invalid).toBeNull();
    expect(describedText(describedBy)).toContain('Pick one');
  });

  it('describes nothing when there are no messages', async () => {
    const { describedBy } = await renderSelect('label="Country"');

    expect(describedBy).toBeNull();
  });
});

describe('option sync', () => {
  const OPTION_OBSERVER_INIT = { childList: true, subtree: true, attributes: true, characterData: true };
  const originalMutationObserver = globalThis.MutationObserver;
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;

  type MockObserver = { callback: MutationCallback; observe: jest.Mock; disconnect: jest.Mock };
  let observers: MockObserver[];
  let frames: Map<number, FrameRequestCallback>;

  // The spec DOM's options don't reflect `value` from the attribute; give them a native-like one.
  const optionProto = Object.getPrototypeOf(document.createElement('option'));
  const hadOwnValue = Object.prototype.hasOwnProperty.call(optionProto, 'value');

  beforeAll(() => {
    if (!hadOwnValue) {
      Object.defineProperty(optionProto, 'value', {
        configurable: true,
        get() {
          return this.getAttribute('value') ?? this.textContent;
        },
        set(value: string) {
          this.setAttribute('value', value);
        },
      });
    }
  });

  afterAll(() => {
    if (!hadOwnValue) delete optionProto.value;
  });

  beforeEach(() => {
    observers = [];
    globalThis.MutationObserver = jest.fn((callback: MutationCallback) => {
      const observer = { callback, observe: jest.fn(), disconnect: jest.fn(), takeRecords: () => [] };
      observers.push(observer);
      return observer;
    }) as unknown as typeof MutationObserver;

    frames = new Map();
    let nextFrame = 1;
    globalThis.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      const id = nextFrame++;
      frames.set(id, callback);
      return id;
    });
    globalThis.cancelAnimationFrame = jest.fn((id: number) => {
      frames.delete(id);
    });
  });

  afterEach(() => {
    globalThis.MutationObserver = originalMutationObserver;
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  const flushFrames = () => {
    const pending = Array.from(frames.values());
    frames.clear();
    pending.forEach((callback) => callback(0));
  };

  // The latest observer watching the options (the host keeper has its own).
  const optionObserver = () =>
    [...observers].reverse().find(({ observe }) =>
      observe.mock.calls.some(([, init]) => JSON.stringify(init) === JSON.stringify(OPTION_OBSERVER_INIT)),
    );

  const setup = async (options: string, value = 'b', extraAttributes = '') => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" value="${value}" ${extraAttributes}>${options}</pds-select>`,
    });
    const component = page.rootInstance;
    // The spec DOM's select has no options collection.
    const select = component.selectEl as HTMLSelectElement;
    Object.defineProperty(select, 'options', { get: () => select.querySelectorAll('option') });
    component.handleSlotChange();
    // componentDidLoad's own catch-up sync is already pending by now; settle it so every test
    // starts from a clean zero-pending-frames baseline.
    flushFrames();

    const option = (optionValue: string) => page.root.querySelector(`option[value="${optionValue}"]`);
    const notify = (target: Node, type: MutationRecordType = 'characterData') =>
      optionObserver().callback([{ type, target } as MutationRecord], {} as MutationObserver);

    return { page, component, select, option, notify };
  };

  const OPTIONS = '<option value="a">Alpha</option><option value="b">Beta</option>';

  it('watches the slotted options at any depth', async () => {
    const { page } = await setup(OPTIONS);

    expect(optionObserver().observe).toHaveBeenCalledWith(page.root, OPTION_OBSERVER_INIT);
  });

  it('updates an option whose text changed in place', async () => {
    const { select, option, notify } = await setup(OPTIONS);
    const before = select.children[0];

    option('a').textContent = 'Apple';
    notify(option('a'));
    flushFrames();

    expect(select.children[0]).toBe(before);
    expect(select.children[0].textContent).toBe('Apple');
  });

  it('updates an option whose value or disabled state changed in place', async () => {
    const { select, option, notify } = await setup(OPTIONS);
    const before = select.children[0];

    const changed = option('a');
    changed.setAttribute('value', 'a2');
    changed.setAttribute('disabled', '');
    notify(changed, 'attributes');
    flushFrames();

    expect(select.children[0]).toBe(before);
    expect(select.children[0].getAttribute('value')).toBe('a2');
    expect(select.children[0].hasAttribute('disabled')).toBe(true);
  });

  it('rebuilds the options when an option is added inside an optgroup', async () => {
    const { page, select, notify } = await setup(
      '<optgroup label="Group"><option value="a">Alpha</option></optgroup><option value="b">Beta</option>',
    );

    const added = document.createElement('option');
    added.setAttribute('value', 'c');
    added.textContent = 'Gamma';
    const group = page.root.querySelector('optgroup');
    group.appendChild(added);
    notify(group, 'childList');
    flushFrames();

    expect(select.querySelectorAll('optgroup option').length).toBe(2);
    expect(select.querySelector('optgroup option[value="c"]').textContent).toBe('Gamma');
  });

  it('keeps the value selected through a copy', async () => {
    const { select, option, notify } = await setup(OPTIONS);

    option('a').textContent = 'Apple';
    notify(option('a'));
    flushFrames();

    expect((select.querySelector('option[value="b"]') as HTMLOptionElement).selected).toBe(true);
  });

  it('shows no selection, keeps the value and emits nothing when the selected option is renamed', async () => {
    const { page, component, select, option, notify } = await setup(OPTIONS);
    const changed = jest.fn();
    page.root.addEventListener('pdsSelectChange', changed);

    const renamed = option('b');
    renamed.setAttribute('value', 'b2');
    notify(renamed, 'attributes');
    flushFrames();

    expect(select.selectedIndex).toBe(-1);
    expect(component.value).toBe('b');
    expect(changed).not.toHaveBeenCalled();
  });

  it('falls back to the first option on the first copy when the value matches nothing, like a native select', async () => {
    const { select } = await setup(OPTIONS, 'nope');

    expect(select.selectedIndex).not.toBe(-1);
  });

  // An async reload (`{loading ? null : options}`) can leave the select briefly empty between the
  // old options and the new ones. That emptiness must not look like the very first copy again: the
  // first copy's own "hadOptions" check used the select's current emptiness, which this reload
  // revisits, so the no-match blank state got skipped and a mismatched value looked selected again.
  it('shows no selection, not the first option, when the replacement set after a reload matches nothing', async () => {
    const { page, select, component } = await setup(OPTIONS, 'b');

    Array.from(page.root.querySelectorAll('option')).forEach((option) => option.remove());
    component.handleSlotChange();
    expect(select.children.length).toBe(0);

    const replacement = document.createElement('option');
    replacement.setAttribute('value', 'z');
    replacement.textContent = 'Zeta';
    page.root.appendChild(replacement);
    component.handleSlotChange();

    expect(select.selectedIndex).toBe(-1);
  });

  // updateFormValue() returns early under isSpecTest(), so this only checks it's called once per
  // changed copy rather than on every mutation; real validity recomputation is covered in e2e.
  it('calls updateFormValue once after a copy that changed something, not on every mutation', async () => {
    const { component, option, notify } = await setup(OPTIONS, 'b', 'required');
    const updateFormValue = jest.spyOn(component, 'updateFormValue');

    option('b').setAttribute('disabled', '');
    notify(option('b'), 'attributes');
    flushFrames();
    expect(updateFormValue).toHaveBeenCalledTimes(1);

    notify(option('b'), 'attributes');
    flushFrames();
    expect(updateFormValue).toHaveBeenCalledTimes(1);
  });

  it('copies once for several changes before a frame', async () => {
    const { select, option, notify } = await setup(OPTIONS);

    option('a').textContent = 'Apple';
    notify(option('a'));
    option('b').textContent = 'Banana';
    notify(option('b'));

    expect(frames.size).toBe(1);
    flushFrames();
    expect(select.children[0].textContent).toBe('Apple');
    expect(select.children[1].textContent).toBe('Banana');
  });

  it('leaves the select alone when the copies would be unchanged', async () => {
    const { select, option, notify } = await setup(OPTIONS);
    const before = Array.from(select.children);

    notify(option('a'));
    flushFrames();

    expect(Array.from(select.children)).toEqual(before);
  });

  it('ignores the host’s own attributes and children, and the action slot', async () => {
    const { page, notify } = await setup(`<span slot="action">Help</span>${OPTIONS}`);

    notify(page.root, 'attributes');
    notify(page.root, 'childList');
    notify(page.root.querySelector('[slot="action"]').firstChild);

    expect(frames.size).toBe(0);
  });

  it('catches up on changes made while it was out of the document', async () => {
    const { page, select, option, notify } = await setup(OPTIONS);
    const parent = page.root.parentElement;

    notify(option('a'));
    page.root.remove();
    option('a').textContent = 'Apple';
    parent.appendChild(page.root);
    flushFrames();

    expect(select.children[0].textContent).toBe('Apple');
  });

  it('stops watching and cancels a pending copy when removed', async () => {
    const { page, component, option, notify } = await setup(OPTIONS);
    const observer = optionObserver();

    notify(option('a'));
    const pending = component.optionSyncFrame;
    expect(frames.has(pending)).toBe(true);
    page.root.remove();

    expect(observer.disconnect).toHaveBeenCalled();
    expect(component.optionObserver).toBeNull();
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalledWith(pending);
    expect(frames.has(pending)).toBe(false);
  });
});
