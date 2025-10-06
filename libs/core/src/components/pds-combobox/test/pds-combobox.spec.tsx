import { newSpecPage } from '@stencil/core/testing';
import { PdsCombobox } from '../pds-combobox';

// Helper function to create mock options
const createMockOption = (value: string, label: string, selected: boolean = false) => ({
  value,
  label,
  tagName: 'OPTION',
  textContent: label,
  hasAttribute: jest.fn((attr: string) => attr === 'selected' && selected),
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(),
  getAttribute: jest.fn(),
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
            <div class="pds-combobox__input-wrapper" style="width: fit-content;">
              <input aria-autocomplete="list" aria-controls="pds-combobox-listbox" aria-disabled="false" aria-expanded="false" autocomplete="off" class="pds-combobox__input" id="test-combobox" part="input" role="combobox" type="text" value="" />
              <pds-icon aria-hidden="true" class="pds-combobox__input-icon" icon="enlarge"></pds-icon>
            </div>
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

  it('renders chip trigger with default props', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip"></pds-combobox>`,
    });

    const chipTrigger = root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger');
    expect(chipTrigger).not.toBeNull();
    expect(chipTrigger?.getAttribute('role')).toBe('combobox');
    expect(chipTrigger?.getAttribute('aria-haspopup')).toBe('listbox');
    expect(chipTrigger?.classList.contains('pds-combobox__chip-trigger--neutral')).toBe(true);
    expect(chipTrigger?.classList.contains('pds-combobox__chip-trigger--dropdown')).toBe(true);
  });

  it('renders chip trigger with custom sentiment and variant', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip" chip-sentiment="accent" chip-variant="tag"></pds-combobox>`,
    });

    const chipTrigger = root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger');
    expect(chipTrigger?.classList.contains('pds-combobox__chip-trigger--accent')).toBe(true);
    expect(chipTrigger?.classList.contains('pds-combobox__chip-trigger--tag')).toBe(true);
  });

  it('renders chip trigger with icon and dot', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip" chip-icon="star" chip-dot="true"></pds-combobox>`,
    });

    const chipTrigger = root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger');
    expect(chipTrigger?.classList.contains('pds-combobox__chip-trigger--dot')).toBe(true);
    const icon = chipTrigger?.querySelector('pds-icon');
    expect(icon?.getAttribute('icon')).toBe('star');
  });

  it('renders chip trigger with large size', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip" chip-large="true"></pds-combobox>`,
    });

    const chipTrigger = root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger');
    expect(chipTrigger?.classList.contains('pds-combobox__chip-trigger--large')).toBe(true);
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

    expect(component.filteredItems.length).toBe(3);
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

    const filteredOptions = component.filteredItems.filter(item => item.tagName === 'OPTION');
    expect(filteredOptions.length).toBe(1);
    expect(filteredOptions[0].value).toBe('cat');
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

    expect(component.filteredItems.length).toBe(3);
  });

  it('does not open dropdown when input is focused (consistent with button trigger)', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    // Focus alone should not open the dropdown
    input?.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    expect(component.isOpen).toBe(false);

    // But typing should open the dropdown
    const inputEvent = new Event('input');
    Object.defineProperty(inputEvent, 'target', {
      value: { value: 'test' },
      enumerable: true,
    });
    input?.dispatchEvent(inputEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);
  });

  it('opens dropdown when input is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    // Click should open the dropdown
    input?.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);

    // Clicking again when already open should not close it (different from button behavior)
    input?.dispatchEvent(new Event('click'));
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
    component.filteredItems = mockOptions;
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
    component.filteredItems = [mockOption];
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

  it('handles Home key to jump to first option', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
      createMockOption('bird', 'Bird'),
    ];

    component.optionEls = mockOptions;
    component.filteredItems = mockOptions;
    component.isOpen = true;
    component.highlightedIndex = 2; // Start at last option

    const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
    input?.dispatchEvent(homeEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(0);
  });

  it('handles End key to jump to last option', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
      createMockOption('bird', 'Bird'),
    ];

    component.optionEls = mockOptions;
    component.filteredItems = mockOptions;
    component.isOpen = true;
    component.highlightedIndex = 0; // Start at first option

    const endEvent = new KeyboardEvent('keydown', { key: 'End' });
    input?.dispatchEvent(endEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(2);
  });

  it('handles PageDown key to jump forward by 10 options', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    // Create 15 options
    const mockOptions = Array.from({ length: 15 }, (_, i) =>
      createMockOption(`option${i}`, `Option ${i}`)
    );

    component.optionEls = mockOptions;
    component.filteredItems = mockOptions;
    component.isOpen = true;
    component.highlightedIndex = 0;

    const pageDownEvent = new KeyboardEvent('keydown', { key: 'PageDown' });
    input?.dispatchEvent(pageDownEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(10);

    // Test that it doesn't go beyond last option
    input?.dispatchEvent(pageDownEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(14); // Last option
  });

  it('handles PageUp key to jump backward by 10 options', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    // Create 15 options
    const mockOptions = Array.from({ length: 15 }, (_, i) =>
      createMockOption(`option${i}`, `Option ${i}`)
    );

    component.optionEls = mockOptions;
    component.filteredItems = mockOptions;
    component.isOpen = true;
    component.highlightedIndex = 14; // Start at last option

    const pageUpEvent = new KeyboardEvent('keydown', { key: 'PageUp' });
    input?.dispatchEvent(pageUpEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(4);

    // Test that it doesn't go below 0
    input?.dispatchEvent(pageUpEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(0); // First option
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
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
    ];

    component.filteredItems = mockOptions;
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
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
    ];

    component.filteredItems = mockOptions;
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
      createMockOption('cat', 'Cat'),
    ];

    component.filteredItems = mockOptions;
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
    const mockOption = createMockOption('cat', 'Cat');

    // Use centralized state management to set selection
    (component as any).setSelectedOption(mockOption);

    component.filteredItems = [mockOption];
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
    component.filteredItems = mockOptions;

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

    // Test ArrowUp key
    component.isOpen = false;
    const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    button?.dispatchEvent(arrowUpEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);
  });

  it('handles button trigger escape key to close dropdown', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const button = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');

    component.isOpen = true;
    await page.waitForChanges();

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    button?.dispatchEvent(escapeEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(false);
    expect(component.highlightedIndex).toBe(-1);
  });

  it('delegates keyboard events to main handler when dropdown is open for button trigger', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const button = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');

    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
    ];

    component.optionEls = mockOptions;
    component.filteredItems = mockOptions;
    component.isOpen = true;
    component.highlightedIndex = 0;

    // Test that Home key works when dropdown is open
    const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
    button?.dispatchEvent(homeEvent);
    await page.waitForChanges();

    expect(component.highlightedIndex).toBe(0);
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

  it('updates aria-activedescendant when option is highlighted and dropdown is open', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    // Test that aria-activedescendant is not set when dropdown is closed
    component.highlightedIndex = 0;
    component.isOpen = false;
    await page.waitForChanges();

    expect(input?.getAttribute('aria-activedescendant')).toBeNull();

    // Test that aria-activedescendant is set when dropdown is open
    component.isOpen = true;
    await page.waitForChanges();

    expect(input?.getAttribute('aria-activedescendant')).toBe('pds-combobox-option-0');
  });

  it('updates aria-activedescendant for button trigger when option is highlighted', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const button = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');

    component.highlightedIndex = 0;
    component.isOpen = true;
    await page.waitForChanges();

    expect(button?.getAttribute('aria-activedescendant')).toBe('pds-combobox-option-0');
  });

  it('renders options with proper ARIA attributes', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;

    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
    ];

    component.filteredItems = mockOptions;
    component.isOpen = true;
    component.highlightedIndex = 0;
    await page.waitForChanges();

    const options = page.root?.shadowRoot?.querySelectorAll('.pds-combobox__option');
    const firstOption = options?.[0];
    const secondOption = options?.[1];

    // Test aria-setsize and aria-posinset
    expect(firstOption?.getAttribute('aria-setsize')).toBe('2');
    expect(firstOption?.getAttribute('aria-posinset')).toBe('1');
    expect(secondOption?.getAttribute('aria-setsize')).toBe('2');
    expect(secondOption?.getAttribute('aria-posinset')).toBe('2');

    // Test tabindex for highlighted vs non-highlighted options
    expect(firstOption?.getAttribute('tabindex')).toBe('0');
    expect(secondOption?.getAttribute('tabindex')).toBe('-1');
  });

  it('renders listbox with proper ARIA attributes', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Pet"></pds-combobox>`,
    });

    const component = page.rootInstance;

    const mockOptions = [
      createMockOption('cat', 'Cat'),
    ];

    component.filteredItems = mockOptions;
    component.isOpen = true;
    await page.waitForChanges();

    const listbox = page.root?.shadowRoot?.querySelector('.pds-combobox__listbox');

    expect(listbox?.getAttribute('role')).toBe('listbox');
    expect(listbox?.getAttribute('aria-label')).toBe('Choose Pet');
    expect(listbox?.getAttribute('aria-multiselectable')).toBe('false');
  });

  it('handles Tab key to close dropdown and allow normal focus flow', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');

    component.isOpen = true;
    component.highlightedIndex = 0;
    await page.waitForChanges();

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    input?.dispatchEvent(tabEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(false);
    expect(component.highlightedIndex).toBe(-1);
  });

  it('handles space key on button trigger without triggering double toggle', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const button = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');

    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
    ];

    component.optionEls = mockOptions;
    component.filteredItems = mockOptions;

    // Test space key - should open dropdown and stay open
    const spaceKeyDownEvent = new KeyboardEvent('keydown', { key: ' ' });
    const spaceKeyUpEvent = new KeyboardEvent('keyup', { key: ' ' });

    button?.dispatchEvent(spaceKeyDownEvent);
    button?.dispatchEvent(spaceKeyUpEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);
    expect(component.highlightedIndex).toBe(0);

    // Verify that clicking doesn't interfere with keyboard behavior
    component.isOpen = false;
    const clickEvent = new MouseEvent('click');
    button?.dispatchEvent(clickEvent);
    await page.waitForChanges();

    expect(component.isOpen).toBe(true);
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
    // Use centralized state management
    (component as any).setSelectedOption(mockSelectedOption);

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

  // Tests for new custom layout features
  describe('Custom Option Layouts', () => {
    it('renders custom option layouts when enabled', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" custom-option-layouts></pds-combobox>`,
      });

      const component = page.rootInstance;
      expect(component.customOptionLayouts).toBe(true);
    });

    it('detects layout options correctly', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" custom-option-layouts></pds-combobox>`,
      });

      const component = page.rootInstance;

      // Mock option with data-layout attribute
      const mockLayoutOption = {
        ...createMockOption('paypal', 'PayPal'),
        hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
        innerHTML: '<pds-icon icon="card-paypal"></pds-icon>PayPal',
      } as unknown as HTMLOptionElement;

      const mockRegularOption = {
        ...createMockOption('cash', 'Cash'),
        hasAttribute: jest.fn((attr: string) => attr === 'selected' && false),
      } as unknown as HTMLOptionElement;

      expect(component.isOptionLayout(mockLayoutOption)).toBe(true);
      expect(component.isOptionLayout(mockRegularOption)).toBe(false);
    });

    it('filters layout options by data-search-text', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" custom-option-layouts mode="filter"></pds-combobox>`,
      });

      const component = page.rootInstance;

      // Mock layout option with data-search-text
      const mockLayoutOption = {
        ...createMockOption('paypal', 'PayPal'),
        hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
        getAttribute: jest.fn((attr: string) => attr === 'data-search-text' ? 'PayPal digital payments' : null),
        textContent: 'PayPal',
      } as unknown as HTMLOptionElement;

      component.optionEls = [mockLayoutOption];
      component.value = 'digital';
      component.filterOptions();

      expect(component.filteredItems).toContain(mockLayoutOption);
    });

    it('renders layout options with innerHTML', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" custom-option-layouts></pds-combobox>`,
      });

      const component = page.rootInstance;

      // Mock layout option
      const mockLayoutOption = {
        ...createMockOption('paypal', 'PayPal'),
        hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
        innerHTML: '<pds-icon icon="card-paypal"></pds-icon>PayPal',
      } as unknown as HTMLOptionElement;

      component.filteredItems = [mockLayoutOption];
      component.isOpen = true;
      await page.waitForChanges();

      const optionWrapper = page.root?.shadowRoot?.querySelector('.pds-combobox__option-layout-wrapper');
      expect(optionWrapper).not.toBeNull();
    });
  });

  describe('Custom Trigger Content', () => {
    it('renders custom trigger content when enabled', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="button" custom-trigger-content></pds-combobox>`,
      });

      const component = page.rootInstance;
      expect(component.customTriggerContent).toBe(true);
    });

    it('uses selected option layout for trigger content', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="button" custom-trigger-content custom-option-layouts></pds-combobox>`,
      });

      const component = page.rootInstance;

      // Mock selected layout option
      const mockLayoutOption = {
        ...createMockOption('paypal', 'PayPal', true),
        hasAttribute: jest.fn((attr: string) => attr === 'data-layout' || (attr === 'selected' && true)),
        innerHTML: '<pds-icon icon="card-paypal"></pds-icon>PayPal',
      } as unknown as HTMLOptionElement;

      component.selectedOption = mockLayoutOption;
      component.optionEls = [mockLayoutOption];
      await page.waitForChanges();

      expect(component.selectedHasLayout).toBe(true);
      expect(component.selectedLayoutContent).toContain('PayPal');
    });

         it('updates trigger content when option selection changes', async () => {
       const page = await newSpecPage({
         components: [PdsCombobox],
         html: `<pds-combobox component-id="test-combobox" trigger="button" custom-trigger-content custom-option-layouts></pds-combobox>`,
       });

       const component = page.rootInstance;

       // Mock layout option
       const mockLayoutOption = {
         ...createMockOption('paypal', 'PayPal'),
         hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
         getAttribute: jest.fn((attr: string) => attr === 'data-search-text' ? null : null),
         innerHTML: '<pds-icon icon="card-paypal"></pds-icon>PayPal',
         setAttribute: jest.fn(),
         removeAttribute: jest.fn(),
       } as unknown as HTMLOptionElement;

      component.optionEls = [mockLayoutOption];

      // Initially no selection
      expect(component.selectedOption).toBeNull();

      // Select option
      component.handleOptionClick(mockLayoutOption);
      await page.waitForChanges();

             expect(component.selectedOption).toBe(mockLayoutOption);
       expect((component as any).selectedOptionLayoutContent).toContain('PayPal');
    });
  });



  describe('Trigger Width', () => {
    it('applies trigger width to input trigger', async () => {
      const { root } = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="input" trigger-width="300px"></pds-combobox>`,
      });

             const inputWrapper = root?.shadowRoot?.querySelector('.pds-combobox__input-wrapper') as HTMLElement;
      expect(inputWrapper?.style.width).toBe('300px');
   });

    it('applies trigger width to button trigger', async () => {
      const { root } = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="button" trigger-width="250px"></pds-combobox>`,
      });

             const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger') as HTMLElement;
       expect(button?.style.width).toBe('250px');
    });

    it('uses default trigger width when not specified', async () => {
      const { root } = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="input"></pds-combobox>`,
      });

             const inputWrapper = root?.shadowRoot?.querySelector('.pds-combobox__input-wrapper') as HTMLElement;
      expect(inputWrapper?.style.width).toBe('fit-content');
    });
  });

  describe('Methods', () => {
    it('getSelectedValue returns selected option value', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
      });

      const component = page.rootInstance;

      // Mock selected option
      const mockOption = createMockOption('paypal', 'PayPal', true);
      component.selectedOption = mockOption;

      const selectedValue = await component.getSelectedValue();
      expect(selectedValue).toBe('paypal');
    });

    it('getSelectedValue returns null when no option is selected', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
      });

      const component = page.rootInstance;
      component.selectedOption = null;

      const selectedValue = await component.getSelectedValue();
      expect(selectedValue).toBeNull();
    });
  });

  describe('Combined Features', () => {
         it('handles both custom trigger content and option layouts together', async () => {
       const page = await newSpecPage({
         components: [PdsCombobox],
         html: `<pds-combobox component-id="test-combobox" trigger="button" custom-trigger-content custom-option-layouts></pds-combobox>`,
       });

       const component = page.rootInstance;

       // Mock layout option
       const mockLayoutOption = {
         ...createMockOption('paypal', 'PayPal'),
         hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
         getAttribute: jest.fn((attr: string) => attr === 'data-search-text' ? null : null),
         innerHTML: '<pds-icon icon="card-paypal"></pds-icon>PayPal',
         setAttribute: jest.fn(),
         removeAttribute: jest.fn(),
       } as unknown as HTMLOptionElement;

      component.optionEls = [mockLayoutOption];
      component.filteredItems = [mockLayoutOption];
      component.isOpen = true;
      await page.waitForChanges();

      // Check that option renders with layout
      const optionWrapper = page.root?.shadowRoot?.querySelector('.pds-combobox__option-layout-wrapper');
      expect(optionWrapper).not.toBeNull();

      // Select the option
      component.handleOptionClick(mockLayoutOption);
      await page.waitForChanges();

      // Check that trigger content is updated
      expect(component.selectedHasLayout).toBe(true);
      expect(component.selectedLayoutContent).toContain('PayPal');
    });

    it('filters layout options correctly with search text', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" custom-option-layouts mode="filter"></pds-combobox>`,
      });

      const component = page.rootInstance;

      // Mock layout options with search text
      const mockPayPalOption = {
        ...createMockOption('paypal', 'PayPal'),
        hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
        getAttribute: jest.fn((attr: string) => attr === 'data-search-text' ? 'PayPal digital payments' : null),
        textContent: 'PayPal',
      } as unknown as HTMLOptionElement;

      const mockStripeOption = {
        ...createMockOption('stripe', 'Stripe'),
        hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
        getAttribute: jest.fn((attr: string) => attr === 'data-search-text' ? 'Stripe credit card' : null),
        textContent: 'Stripe',
      } as unknown as HTMLOptionElement;

      component.optionEls = [mockPayPalOption, mockStripeOption];
      component.value = 'digital';
      component.filterOptions();

      expect(component.filteredItems).toContain(mockPayPalOption);
      expect(component.filteredItems).not.toContain(mockStripeOption);
    });
  });

  describe('Accessibility', () => {
    it('renders with proper CSS parts for external styling', async () => {
      const { root } = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="input"></pds-combobox>`,
      });

      const input = root?.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('part')).toBe('input');
    });

    it('renders button trigger with proper CSS parts', async () => {
      const { root } = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="button"></pds-combobox>`,
      });

      const button = root?.shadowRoot?.querySelector('.pds-combobox__button-trigger');
      expect(button?.getAttribute('part')).toBe('button-trigger');
    });

    it('maintains proper ARIA attributes with custom layouts', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" custom-option-layouts></pds-combobox>`,
      });

      const component = page.rootInstance;

      // Mock layout option
      const mockLayoutOption = {
        ...createMockOption('paypal', 'PayPal'),
        hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
      } as unknown as HTMLOptionElement;

      component.filteredItems = [mockLayoutOption];
      component.isOpen = true;
      await page.waitForChanges();

      const option = page.root?.shadowRoot?.querySelector('.pds-combobox__option');
      expect(option?.getAttribute('role')).toBe('option');
      expect(option?.getAttribute('aria-selected')).toBe('false');
    });
  });
});
