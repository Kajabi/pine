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
            <select class="pds-select__field" id="field-1" part="select">
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
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
            <label htmlfor="field-1">Name</label>
            <select class="pds-select__field" id="field-1" part="select">
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
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
            <label htmlFor="field-1">Name</label>
            <select class="pds-select__field" id="field-1" part="select"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
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
            <label htmlfor="field-1">Disabled</label>
            <select class="pds-select__field" disabled="" id="field-1" part="select">
              <slot></slot>
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
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
            <select class="pds-select__field" id="field-1" part="select">
              <slot></slot>
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
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
            <label htmlFor="field-1">Name</label>
            <select autocomplete="off" class="pds-select__field" id="field-1" part="select"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
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
            <label htmlFor="field-1">Name</label>
            <select autocomplete="on" class="pds-select__field" id="field-1" part="select"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
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
