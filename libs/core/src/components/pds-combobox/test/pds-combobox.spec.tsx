import { newSpecPage } from '@stencil/core/testing';
import { PdsCombobox } from '../pds-combobox';

// Helper function to create mock options
const createMockOption = (value: string, label: string, selected: boolean = false) => ({
  value,
  label,
  hasAttribute: jest.fn((attr: string) => attr === 'selected' && selected),
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(),
} as unknown as HTMLOptionElement);

describe('pds-combobox', () => {
  it('renders default combobox with input trigger', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });
    expect(root).toEqualHtml(`
      <pds-combobox component-id="test-combobox">
        <mock:shadow-root>
          <div class="pds-combobox" tabindex="-1">
            <input aria-autocomplete="list" aria-controls="pds-combobox-listbox" aria-disabled="false" aria-expanded="false" autocomplete="off" class="pds-combobox__input" id="test-combobox" part="input" role="combobox" style="width: fit-content;" type="text" value="" />
            <div style="display: none;">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
      </pds-combobox>
    `);
  });

  it('renders with label', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option"></pds-combobox>`,
    });

    const label = root?.shadowRoot?.querySelector('.pds-combobox__label');
    expect(label).not.toBeNull();
    expect(label?.textContent).toBe('Choose Option');
  });

  it('renders with hidden label - label span has visually-hidden class', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option" hide-label></pds-combobox>`,
    });

    const labelSpan = root?.shadowRoot?.querySelector('.pds-combobox__label span');
    expect(labelSpan).not.toBeNull();
    expect(labelSpan?.classList.contains('visually-hidden')).toBe(true);
    expect(labelSpan?.textContent).toBe('Choose Option');
  });

  it('renders without visually-hidden class when hideLabel is false', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option" hide-label="false"></pds-combobox>`,
    });

    const labelSpan = root?.shadowRoot?.querySelector('.pds-combobox__label span');
    expect(labelSpan).not.toBeNull();
    expect(labelSpan?.classList.contains('visually-hidden')).toBe(false);
    expect(labelSpan?.textContent).toBe('Choose Option');
  });

  it('renders input trigger with aria-label when hideLabel is true', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option" hide-label trigger="input"></pds-combobox>`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('aria-label')).toBe('Choose Option');
  });

  it('renders input trigger without aria-label when hideLabel is false', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option" trigger="input"></pds-combobox>`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('aria-label')).toBeNull();
  });

  it('renders button trigger with aria-label when hideLabel is true', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option" hide-label trigger="button"></pds-combobox>`,
    });

    const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');
    expect(button?.getAttribute('aria-label')).toBe('Choose Option');
  });

  it('renders button trigger without aria-label when hideLabel is false', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option" trigger="button"></pds-combobox>`,
    });

    const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');
    expect(button?.getAttribute('aria-label')).toBeNull();
  });

  it('renders with placeholder', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" placeholder="Type to search..."></pds-combobox>`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('placeholder')).toBe('Type to search...');
  });

  it('renders with value', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" value="test value"></pds-combobox>`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.value).toBe('test value');
  });

  it('renders disabled combobox', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" disabled></pds-combobox>`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.disabled).toBe(true);
    expect(input?.getAttribute('aria-disabled')).toBe('true');
  });

  it('renders with button trigger', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
    });

    const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('role')).toBe('combobox');
    expect(button?.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('renders button trigger with secondary variant by default', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
    });

    const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');
    expect(button?.classList.contains('pds-combobox__button-trigger--secondary')).toBe(true);
  });

  it('renders button trigger with primary variant', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button" trigger-variant="primary"></pds-combobox>`,
    });

    const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');
    expect(button?.classList.contains('pds-combobox__button-trigger--primary')).toBe(true);
  });

  it('renders button trigger with accent variant', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button" trigger-variant="accent"></pds-combobox>`,
    });

    const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');
    expect(button?.classList.contains('pds-combobox__button-trigger--accent')).toBe(true);
  });

  it('renders with select-only mode', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" mode="select-only"></pds-combobox>`,
    });

    const component = page.rootInstance;
    expect(component.mode).toBe('select-only');
  });

  it('renders with filter mode by default', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    expect(component.mode).toBe('filter');
  });

    it('renders with slotted options', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox">
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
        <option value="bird">Bird</option>
      </pds-combobox>`,
    });

    const component = page.rootInstance;

        const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
      createMockOption('bird', 'Bird'),
    ];

    component.optionEls = mockOptions;
    component.filterOptions();

    expect(component.filteredOptions.length).toBe(3);
  });

    it('filters options in filter mode', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" mode="filter"></pds-combobox>`,
    });

    const component = page.rootInstance;

        const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
      createMockOption('bird', 'Bird'),
    ];

    component.optionEls = mockOptions;
    component.value = 'ca';
    component.filterOptions();

    expect(component.filteredOptions.length).toBe(1);
    expect(component.filteredOptions[0].value).toBe('cat');
  });

    it('does not filter options in select-only mode', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" mode="select-only"></pds-combobox>`,
    });

    const component = page.rootInstance;

    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
      createMockOption('bird', 'Bird'),
    ];

    component.optionEls = mockOptions;
    component.value = 'ca';
    component.filterOptions();

    expect(component.filteredOptions.length).toBe(3);
  });

  it('opens dropdown when input is focused', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    input?.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);
  });

  it('opens dropdown when button trigger is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const button = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');

    button?.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);
  });

  it('closes dropdown when focus leaves combobox', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const combobox = page.root?.shadowRoot?.querySelector('.pds-combobox');

    // Open dropdown first
    component.isOpen = true;
    await page.waitForChanges();

    // Create a focusout event with relatedTarget outside the combobox
    const focusoutEvent = new FocusEvent('focusout', {
      relatedTarget: document.createElement('div'),
    });

    combobox?.dispatchEvent(focusoutEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(false);
  });

    it('handles keyboard navigation with arrow keys', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
    ];

    component.optionEls = mockOptions;
    component.filteredOptions = mockOptions;
    component.isOpen = true;

    // Test arrow down
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    input?.dispatchEvent(arrowDownEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(0);

    // Test arrow down again
    input?.dispatchEvent(arrowDownEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(1);

    // Test arrow up
    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    input?.dispatchEvent(arrowUpEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(0);
  });

    it('handles Enter key to select option', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');
    const pdsComboboxChangeSpy = jest.spyOn(component.pdsComboboxChange, 'emit');

    const mockOption = createMockOption('cat', 'Cat');

    component.optionEls = [mockOption];
    component.filteredOptions = [mockOption];
    component.isOpen = true;
    component.highlightedIndex = 0;

    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    input?.dispatchEvent(enterEvent);
    await page.waitForChanges();

    expect(component.value).toBe('Cat');
    expect(component.isOpen).toBe(false);
    expect(pdsComboboxChangeSpy).toHaveBeenCalledWith({ value: 'cat' });
  });

  it('handles Escape key to close dropdown', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    component.isOpen = true;
    await page.waitForChanges();

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    input?.dispatchEvent(escapeEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(false);
  });

  it('updates value when typing in input', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'test';
    const inputEvent = new Event('input');
    Object.defineProperty(inputEvent, 'target', {
      value: input,
      enumerable: true,
    });

    input.dispatchEvent(inputEvent);
    await page.waitForChanges();

    expect(component.value).toBe('test');
    expect(component.isOpen).toBe(true);
  });

  it('displays selected option label in button trigger', async () => {
        const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button">
        <option value="cat" selected>Cat</option>
      </pds-combobox>`,
    });

    const component = page.rootInstance;

    // Manually trigger updateOptions since slots might not work in testing environment
    (component as any).updateOptions();
    await page.waitForChanges();

    const buttonLabel = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger-label');
    expect(buttonLabel?.textContent).toBe('Cat');
  });

  it('displays placeholder when no option is selected in button trigger', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button" placeholder="Select option"></pds-combobox>`,
    });

    const component = page.rootInstance;
    component.optionEls = [];
    await page.waitForChanges();

    const buttonLabel = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger-label');
    expect(buttonLabel?.textContent).toBe('Select option');
  });

  it('emits change event when option is selected', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const pdsComboboxChangeSpy = jest.spyOn(component.pdsComboboxChange, 'emit');

    // Mock option
    const mockOption = {
      value: 'cat',
      label: 'Cat',
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      hasAttribute: jest.fn(() => false),
    } as unknown as HTMLOptionElement;

    component.optionEls = [mockOption];
    component.handleOptionClick(mockOption);

    expect(pdsComboboxChangeSpy).toHaveBeenCalledWith({ value: 'cat' });
  });

  it('sets focus on input when setFocus method is called', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    // Mock the focus method
    const focusSpy = jest.spyOn(input as HTMLInputElement, 'focus');

    await component.setFocus();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('renders dropdown with options when open', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;

    // Mock options
    const mockOptions = [
      { value: 'cat', label: 'Cat', hasAttribute: jest.fn(() => false) } as unknown as HTMLOptionElement,
      { value: 'dog', label: 'Dog', hasAttribute: jest.fn(() => false) } as unknown as HTMLOptionElement,
    ];

    component.filteredOptions = mockOptions;
    component.isOpen = true;
    await page.waitForChanges();

    const listbox = page.root?.shadowRoot?.querySelector('.pds-combobox__listbox');
    expect(listbox).not.toBeNull();

    const options = page.root?.shadowRoot?.querySelectorAll('.pds-combobox__option');
    expect(options?.length).toBe(2);
  });

  it('highlights option on mouse enter', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;

    // Mock options
    const mockOptions = [
      { value: 'cat', label: 'Cat', hasAttribute: jest.fn(() => false) } as unknown as HTMLOptionElement,
      { value: 'dog', label: 'Dog', hasAttribute: jest.fn(() => false) } as unknown as HTMLOptionElement,
    ];

    component.filteredOptions = mockOptions;
    component.isOpen = true;
    await page.waitForChanges();

    const secondOption = page.root?.shadowRoot?.querySelector('.pds-combobox__option:nth-child(2)');
    const mouseEnterEvent = new MouseEvent('mouseenter');
    Object.defineProperty(mouseEnterEvent, 'currentTarget', {
      value: { getAttribute: () => '1' },
      enumerable: true,
    });

    secondOption?.dispatchEvent(mouseEnterEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(1);
  });

  it('prevents default on option mousedown', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;

    // Mock options
    const mockOptions = [
      { value: 'cat', label: 'Cat', hasAttribute: jest.fn(() => false) } as unknown as HTMLOptionElement,
    ];

    component.filteredOptions = mockOptions;
    component.isOpen = true;
    await page.waitForChanges();

    const option = page.root?.shadowRoot?.querySelector('.pds-combobox__option');
    const mouseDownEvent = new MouseEvent('mousedown');
    const preventDefaultSpy = jest.spyOn(mouseDownEvent, 'preventDefault');

    option?.dispatchEvent(mouseDownEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('shows checkmark for selected option', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;

    // Mock selected option
    const mockOption = {
      value: 'cat',
      label: 'Cat',
      hasAttribute: jest.fn(() => true),
    } as unknown as HTMLOptionElement;

    component.filteredOptions = [mockOption];
    component.isOpen = true;
    await page.waitForChanges();

    const checkIcon = page.root?.shadowRoot?.querySelector('.pds-combobox__option-check');
    expect(checkIcon).not.toBeNull();
  });

  it('handles button trigger keyboard navigation', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const button = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');

    // Mock options
    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
    ];

    component.optionEls = mockOptions;
    component.filteredOptions = mockOptions;

    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    button?.dispatchEvent(enterEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);
    expect(component.highlightedIndex).toBe(0);

    // Test Space key
    component.isOpen = false;
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    button?.dispatchEvent(spaceEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);

    // Test ArrowDown key
    component.isOpen = false;
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    button?.dispatchEvent(arrowDownEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);
  });

  it('handles disabled state for button trigger', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button" disabled></pds-combobox>`,
    });

    const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');
    expect(button?.getAttribute('aria-disabled')).toBe('true');
  });

  it('renders with correct aria attributes', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('role')).toBe('combobox');
    expect(input?.getAttribute('aria-autocomplete')).toBe('list');
    expect(input?.getAttribute('aria-controls')).toBe('pds-combobox-listbox');
    expect(input?.getAttribute('aria-expanded')).toBe('false');
    expect(input?.getAttribute('autocomplete')).toBe('off');
  });

  it('updates aria-expanded when dropdown opens', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    component.isOpen = true;
    await page.waitForChanges();

    expect(input?.getAttribute('aria-expanded')).toBe('true');
  });

  it('updates aria-activedescendant when option is highlighted', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    component.highlightedIndex = 0;
    await page.waitForChanges();

    expect(input?.getAttribute('aria-activedescendant')).toBe('pds-combobox-option-0');
  });

  it('restores selected option value when input is cleared and focus is lost', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const combobox = page.root?.shadowRoot?.querySelector('.pds-combobox');

    // Mock options with one selected
    const mockSelectedOption = createMockOption('cat', 'Cat', true);
    const mockUnselectedOption = createMockOption('dog', 'Dog', false);

    component.optionEls = [mockSelectedOption, mockUnselectedOption];
    // Set the selected option state to match what would happen in updateOptions
    component.selectedOption = mockSelectedOption;

    // Initially set value to match selected option
    component.value = 'Cat';
    await page.waitForChanges();

    // User clears the input (simulating typing and deleting all text)
    component.value = '';
    await page.waitForChanges();

    // User removes focus from combobox
    const focusoutEvent = new FocusEvent('focusout', {
      relatedTarget: document.createElement('div'),
    });
    combobox?.dispatchEvent(focusoutEvent);
    await page.waitForChanges();

    // Value should be restored to the selected option's label
    expect(component.value).toBe('Cat');
  });

  it('does not restore value when no option is selected and focus is lost', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const combobox = page.root?.shadowRoot?.querySelector('.pds-combobox');

    // Mock options with none selected
    const mockOption1 = createMockOption('cat', 'Cat', false);
    const mockOption2 = createMockOption('dog', 'Dog', false);

    component.optionEls = [mockOption1, mockOption2];

    // User types something that doesn't match any option
    component.value = 'bird';
    await page.waitForChanges();

    // User removes focus from combobox
    const focusoutEvent = new FocusEvent('focusout', {
      relatedTarget: document.createElement('div'),
    });
    combobox?.dispatchEvent(focusoutEvent);
    await page.waitForChanges();

    // Value should remain unchanged since no option is selected
    expect(component.value).toBe('bird');
  });
});
