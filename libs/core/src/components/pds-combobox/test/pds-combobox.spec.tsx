import { newSpecPage } from '@stencil/core/testing';
import { PdsModal } from '../../pds-modal/pds-modal';
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

const createMockChipOption = (value: string, label: string, attrs: Record<string, string>) => ({
  value,
  label,
  tagName: 'OPTION',
  textContent: label,
  hasAttribute: jest.fn((attr: string) => attr in attrs),
  getAttribute: jest.fn((attr: string) => attrs[attr] ?? null),
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(),
} as unknown as HTMLOptionElement);

// updateFormValue() no-ops while isSpecTest() is true, so form association has to be
// re-enabled for a test to observe what reaches ElementInternals.setFormValue().
const withFormAssociationEnabled = async (run: () => void | Promise<void>) => {
  const previous = process.env.__STENCIL_SPEC_TESTS__;
  process.env.__STENCIL_SPEC_TESTS__ = 'false';
  try {
    await run();
  } finally {
    if (previous === undefined) {
      delete process.env.__STENCIL_SPEC_TESTS__;
    } else {
      process.env.__STENCIL_SPEC_TESTS__ = previous;
    }
  }
};

describe('pds-combobox', () => {
  it('renders default combobox with input trigger', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });
    expect(root).toEqualHtml(`
      <pds-combobox component-id="test-combobox">
        <mock:shadow-root>
          <div class="pds-combobox" tabindex="-1" part="combobox">
            <div class="pds-combobox__input-wrapper" style="width: fit-content;">
              <input aria-autocomplete="list" aria-controls="test-combobox-listbox" aria-disabled="false" aria-expanded="false" autocomplete="off" class="pds-combobox__input" id="test-combobox" part="input" role="combobox" type="text" value="" />
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

  it('renders with hidden label - omits label element and uses aria-label on trigger', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option" hide-label></pds-combobox>`,
    });

    expect(root?.shadowRoot?.querySelector('.pds-combobox__label')).toBeNull();
    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('aria-label')).toBe('Choose Option');
  });

  it('renders label when hideLabel is false', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" label="Choose Option" hide-label="false"></pds-combobox>`,
    });

    const label = root?.shadowRoot?.querySelector('.pds-combobox__label');
    expect(label).not.toBeNull();
    expect(label?.textContent).toBe('Choose Option');
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
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" value="cat"></pds-combobox>`,
    });

    const component = page.rootInstance;

    // Mock the options since slots don't work in testing environment
    const mockOptions = [
      createMockOption('cat', 'Cat'),
      createMockOption('dog', 'Dog'),
    ];
    component.optionEls = mockOptions;
    component.allItems = mockOptions;

    // Manually trigger updateOptions to process the value
    (component as any).updateOptions();
    await page.waitForChanges();

    // In testing environment, the @Watch methods don't fire, so manually simulate the logic
    expect(component.value).toBe('cat'); // Should preserve actual value

    // Manually set the selected option and displayText to simulate what would happen in real browser
    (component as any).setSelectedOption(mockOptions[0]);
    component.displayText = 'Cat';
    await page.waitForChanges();

    // Test the rendered input (should use displayText)
    const input = page.root?.shadowRoot?.querySelector('input');
    expect(input?.value).toBe('Cat'); // Should show display text
  });

  it('renders disabled combobox', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" disabled></pds-combobox>`,
    });

    const input = root?.shadowRoot?.querySelector('input');
    expect(input?.disabled).toBe(true);
    expect(input?.getAttribute('aria-disabled')).toBe('true');
    expect(root?.getAttribute('aria-disabled')).toBe('true');
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

  it('renders chip trigger with custom sentiment', async () => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip" chip-sentiment="accent"></pds-combobox>`,
    });

    const chipTrigger = root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger');
    expect(chipTrigger?.classList.contains('pds-combobox__chip-trigger--accent')).toBe(true);
    expect(chipTrigger?.classList.contains('pds-combobox__chip-trigger--dropdown')).toBe(true);
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

  it('renders the selected chip option at size lg when the option has chip-large', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const option = createMockChipOption('cat', 'Cat', { 'chip-sentiment': 'accent', 'chip-large': '' });
    component.optionEls = [option];
    component.allItems = [option];
    (component as any).setSelectedOption(option);
    await page.waitForChanges();

    const chip = page.root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger-auto');
    expect(chip?.getAttribute('size')).toBe('lg');
  });

  it('renders the selected chip option without a size when the option lacks chip-large', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const option = createMockChipOption('cat', 'Cat', { 'chip-sentiment': 'accent' });
    component.optionEls = [option];
    component.allItems = [option];
    (component as any).setSelectedOption(option);
    await page.waitForChanges();

    const chip = page.root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger-auto');
    expect(chip).not.toBeNull();
    expect(chip?.hasAttribute('size')).toBe(false);
  });

  it('renders dropdown chip options at size lg when the option has chip-large', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const option = createMockChipOption('cat', 'Cat', { 'chip-sentiment': 'accent', 'chip-large': '' });
    component.optionEls = [option];
    component.allItems = [option];
    component.filteredItems = [option];
    component.isOpen = true;
    await page.waitForChanges();

    const chip = page.root?.shadowRoot?.querySelector('.pds-combobox__option-chip');
    expect(chip?.getAttribute('size')).toBe('lg');
  });

  it('sizes the chip trigger large when slotted trigger content is a size lg chip', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip" custom-trigger-content><pds-chip slot="trigger-content" size="lg">Status</pds-chip></pds-combobox>`,
    });

    expect((page.rootInstance as any).selectedChipLarge).toBe(true);
  });

  it('sizes the chip trigger large when the selected layout option contains a size lg chip', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="chip" custom-option-layouts></pds-combobox>`,
    });

    const layoutChip = { getAttribute: jest.fn((attr: string) => (attr === 'size' ? 'lg' : null)) };
    const option = {
      value: 'paid',
      label: 'Paid',
      tagName: 'OPTION',
      textContent: 'Paid',
      hasAttribute: jest.fn((attr: string) => attr === 'data-layout'),
      getAttribute: jest.fn(() => null),
      querySelector: jest.fn((selector: string) => (selector === 'pds-chip' ? layoutChip : null)),
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    } as unknown as HTMLOptionElement;
    page.rootInstance.selectedOption = option;

    expect((page.rootInstance as any).selectedChipLarge).toBe(true);
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
    component.displayText = 'ca'; // Set displayText for filtering
    component.filterOptions();

    const filteredOptions = component.filteredItems.filter(item => item.tagName === 'OPTION');
    expect(filteredOptions.length).toBe(1);
    expect(filteredOptions[0].value).toBe('cat');
  });

  it('shows all options when reopening in filter mode with a committed selection', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" mode="filter"></pds-combobox>`,
    });

    const component = page.rootInstance as any;
    const react = createMockOption('react', 'React');
    const svelte = createMockOption('svelte', 'Svelte');
    const mockOptions = [react, svelte];
    component.optionEls = mockOptions;
    component.allItems = mockOptions;
    component.setSelectedOption(react);
    component.displayText = 'React';
    component.isOpen = false;
    await page.waitForChanges();

    component.prepareExpandFilterListOnOpen();
    component.filterOptions();
    const optionsShown = component.filteredItems.filter((item: Element) => item.tagName === 'OPTION');
    expect(optionsShown.length).toBe(2);
    expect(optionsShown.map((o: HTMLOptionElement) => o.value).sort()).toEqual(['react', 'svelte']);
  });

  it('resumes filtering after input changes following an expanded reopen', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" mode="filter"></pds-combobox>`,
    });

    const component = page.rootInstance as any;
    const react = createMockOption('react', 'React');
    const svelte = createMockOption('svelte', 'Svelte');
    component.optionEls = [react, svelte];
    component.allItems = [react, svelte];
    component.setSelectedOption(react);
    component.displayText = 'React';
    await page.waitForChanges();

    component.prepareExpandFilterListOnOpen();
    component.filterOptions();
    expect(component.filteredItems.filter((item: Element) => item.tagName === 'OPTION').length).toBe(2);

    const inputEvent = new Event('input');
    Object.defineProperty(inputEvent, 'target', {
      value: { value: 'S' },
      enumerable: true,
    });
    component.handleInput(inputEvent);
    await page.waitForChanges();

    expect(component.expandFilterListWhileOpen).toBe(false);
    const filtered = component.filteredItems.filter((item: Element) => item.tagName === 'OPTION');
    expect(filtered.length).toBe(1);
    expect(filtered[0].value).toBe('svelte');
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

    expect(component.value).toBe('cat'); // Should be actual option value
    expect(component.displayText).toBe('Cat'); // Should be display text
    expect(component.isOpen).toBe(false);
    expect(pdsComboboxChangeSpy).toHaveBeenCalledWith({ value: 'cat' });
  });

  it('handles Space key to select option', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });

    const component = page.rootInstance;
    const input = page.root?.shadowRoot?.querySelector('input');
    const pdsComboboxChangeSpy = jest.spyOn(component.pdsComboboxChange, 'emit');

    const mockOption = createMockOption('dog', 'Dog');

    component.optionEls = [mockOption];
    component.filteredItems = [mockOption];
    component.isOpen = true;
    component.highlightedIndex = 0;

    // Test Space key
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    input?.dispatchEvent(spaceEvent);
    await page.waitForChanges();

    expect(component.value).toBe('dog'); // Should be actual option value
    expect(component.displayText).toBe('Dog'); // Should be display text
    expect(component.isOpen).toBe(false);
    expect(pdsComboboxChangeSpy).toHaveBeenCalledWith({ value: 'dog' });
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

    expect(component.displayText).toBe('test'); // Typing updates displayText
    expect(component.isOpen).toBe(true);
  });

  it('drops a pending search event when it is removed from the DOM', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });
    const search = jest.fn();
    page.root!.addEventListener('pdsComboboxSearch', search);
    const input = page.root!.shadowRoot!.querySelector('input') as HTMLInputElement;
    const type = (text: string) => {
      input.value = text;
      input.dispatchEvent(new Event('input'));
    };

    jest.useFakeTimers();
    try {
      type('tag');
      jest.advanceTimersByTime(300);
      expect(search).toHaveBeenCalledTimes(1);

      type('email');
      page.root!.remove();
      jest.advanceTimersByTime(300);
      expect(search).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it('emits one search on the latest debounce when the debounce changes mid-search', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
    });
    const search = jest.fn();
    page.root!.addEventListener('pdsComboboxSearch', search);
    const input = page.root!.shadowRoot!.querySelector('input') as HTMLInputElement;

    jest.useFakeTimers();
    try {
      input.value = 'tag';
      input.dispatchEvent(new Event('input'));
      (page.root as HTMLPdsComboboxElement).debounce = 100;
      (page.root as HTMLPdsComboboxElement).debounce = 50;
      input.dispatchEvent(new Event('input'));
      jest.advanceTimersByTime(50);
      expect(search).toHaveBeenCalledTimes(1);

      input.dispatchEvent(new Event('input'));
      page.root!.remove();
      jest.advanceTimersByTime(1000);
      expect(search).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });

  it('displays selected option label in button trigger', async () => {
        const page = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="test-combobox" trigger="button" value="cat">
        <option value="cat">Cat</option>
      </pds-combobox>`,
    });

    const component = page.rootInstance;

    // Mock the options since slots don't work in testing environment
    const mockOptions = [
      createMockOption('cat', 'Cat'),
    ];
    component.optionEls = mockOptions;
    component.allItems = mockOptions;

    // Manually trigger updateOptions since slots might not work in testing environment
    (component as any).updateOptions();
    await page.waitForChanges();

    // In testing environment, manually simulate what would happen in real browser
    expect(component.value).toBe('cat'); // Should preserve actual value

    // Manually set the selected option and displayText to simulate what would happen in real browser
    (component as any).setSelectedOption(mockOptions[0]);
    component.displayText = 'Cat';
    await page.waitForChanges();

    const buttonLabel = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger-label');
    expect(buttonLabel?.textContent).toBe('Cat');
    expect(component.displayText).toBe('Cat'); // Should have display text
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

  it('highlights selected option when dropdown reopens', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `
        <pds-combobox component-id="test-combobox">
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
        </pds-combobox>
      `,
    });

    const component = page.rootInstance;
    const mockOptions = [
      createMockOption('dog', 'Dog', false),
      createMockOption('cat', 'Cat', false),
      createMockOption('bird', 'Bird', false),
    ];

    component.optionEls = mockOptions;
    component.filteredItems = mockOptions;
    component.value = 'cat'; // Set value to select the second option
    (component as any).setSelectedOption(mockOptions[1]); // Select the 'cat' option

    // Open dropdown
    component.isOpen = true;
    (component as any).setInitialHighlightedIndex();
    await page.waitForChanges();

    // Should highlight the selected option (index 1), not the first option (index 0)
    expect(component.highlightedIndex).toBe(1);
  });

  it('highlights first option when no option is selected', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `
        <pds-combobox component-id="test-combobox">
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
        </pds-combobox>
      `,
    });

    const component = page.rootInstance;
    const mockOptions = [
      createMockOption('dog', 'Dog', false),
      createMockOption('cat', 'Cat', false),
      createMockOption('bird', 'Bird', false),
    ];

    component.optionEls = mockOptions;
    component.filteredItems = mockOptions;
    // No selected option set

    // Open dropdown
    component.isOpen = true;
    (component as any).setInitialHighlightedIndex();
    await page.waitForChanges();

    // Should highlight the first option (index 0)
    expect(component.highlightedIndex).toBe(0);
  });

  it('highlights first option when selected option is filtered out', async () => {
    const page = await newSpecPage({
      components: [PdsCombobox],
      html: `
        <pds-combobox component-id="test-combobox">
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
        </pds-combobox>
      `,
    });

    const component = page.rootInstance;
    const allOptions = [
      createMockOption('dog', 'Dog', false),
      createMockOption('cat', 'Cat', true), // Selected
      createMockOption('bird', 'Bird', false),
    ];

    // Only show filtered options (cat is filtered out)
    const filteredOptions = [allOptions[0], allOptions[2]]; // dog and bird only

    component.optionEls = allOptions;
    component.filteredItems = filteredOptions;
    (component as any).setSelectedOption(allOptions[1]); // cat is selected but filtered out

    // Open dropdown
    component.isOpen = true;
    (component as any).setInitialHighlightedIndex();
    await page.waitForChanges();

    // Should highlight the first visible option (index 0) since selected option is not visible
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
    expect(input?.getAttribute('aria-controls')).toBe('test-combobox-listbox');
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

    expect(input?.getAttribute('aria-activedescendant')).toBe('test-combobox-option-0');
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

    expect(button?.getAttribute('aria-activedescendant')).toBe('test-combobox-option-0');
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

    // Initially set display text to match selected option
    component.displayText = 'Cat';
    await page.waitForChanges();

    // User clears the input (simulating typing and deleting all text)
    component.displayText = '';
    await page.waitForChanges();

    // User removes focus from combobox
    const focusoutEvent = new FocusEvent('focusout', {
      relatedTarget: document.createElement('div'),
    });
    combobox?.dispatchEvent(focusoutEvent);
    await page.waitForChanges();

    // Display text should be restored to the selected option's label
    expect(component.displayText).toBe('Cat');
    expect(component.value).toBe('cat'); // Value should remain as actual option value
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

             expect(component.selectedOption?.value).toBe(mockLayoutOption.value);
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

    it('clear resets the value, display text and selected option', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
      });

      const component = page.rootInstance;
      const mockOptions = [createMockOption('access_call_limits', 'Access call limits')];
      component.optionEls = mockOptions;
      component.allItems = mockOptions;
      (component as any).setSelectedOption(mockOptions[0]);
      component.displayText = 'Access call limits';
      component.value = 'access_call_limits';
      await page.waitForChanges();

      await component.clear();
      await page.waitForChanges();

      expect(component.value).toBe('');
      expect(component.displayText).toBe('');
      expect(component.selectedOption).toBeNull();
      expect(await component.getSelectedValue()).toBeNull();
    });

    it('clear resets the value submitted with the form', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" name="plan"></pds-combobox>`,
      });

      const component = page.rootInstance;
      const mockOptions = [createMockOption('access_call_limits', 'Access call limits')];
      component.optionEls = mockOptions;
      component.allItems = mockOptions;
      (component as any).setSelectedOption(mockOptions[0]);
      component.displayText = 'Access call limits';
      component.value = 'access_call_limits';
      await page.waitForChanges();

      const setFormValue = jest.fn();
      (component as any).internals = { setFormValue };

      await withFormAssociationEnabled(() => component.clear());

      expect(setFormValue).toHaveBeenCalledWith('');
      expect(setFormValue).not.toHaveBeenCalledWith('access_call_limits');
    });

    it('clear resets the submitted value when no option ever matched', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" name="plan" value="access_call_limits"></pds-combobox>`,
      });

      const component = page.rootInstance;
      await page.waitForChanges();

      expect(component.selectedOption).toBeNull();

      const setFormValue = jest.fn();
      (component as any).internals = { setFormValue };

      await withFormAssociationEnabled(() => component.clear());

      expect(component.value).toBe('');
      expect(setFormValue).toHaveBeenCalledWith('');
    });

    it('keeps the submitted value when only the filter text is emptied', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" name="plan"></pds-combobox>`,
      });

      const component = page.rootInstance;
      const mockOptions = [createMockOption('access_call_limits', 'Access call limits')];
      component.optionEls = mockOptions;
      component.allItems = mockOptions;
      (component as any).setSelectedOption(mockOptions[0]);
      component.displayText = 'Access call limits';
      component.value = 'access_call_limits';
      await page.waitForChanges();

      const setFormValue = jest.fn();
      (component as any).internals = { setFormValue };

      const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
      input.value = '';
      const inputEvent = new Event('input');
      Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true });

      await withFormAssociationEnabled(async () => {
        input.dispatchEvent(inputEvent);
        await page.waitForChanges();
      });

      expect(component.displayText).toBe('');
      expect(component.value).toBe('access_call_limits');
      expect(setFormValue).not.toHaveBeenCalled();
    });

    it('clear emits pdsComboboxChange once with an empty value', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
      });

      const component = page.rootInstance;
      const mockOptions = [createMockOption('access_call_limits', 'Access call limits')];
      component.optionEls = mockOptions;
      component.allItems = mockOptions;
      (component as any).setSelectedOption(mockOptions[0]);
      component.displayText = 'Access call limits';
      component.value = 'access_call_limits';
      await page.waitForChanges();

      const changeSpy = jest.spyOn(component.pdsComboboxChange, 'emit');

      await component.clear();
      await page.waitForChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledWith({ value: '' });
    });

    it('clear does not emit pdsComboboxChange when nothing was selected', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
      });

      const component = page.rootInstance;
      const changeSpy = jest.spyOn(component.pdsComboboxChange, 'emit');

      await component.clear();
      await page.waitForChanges();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('clear emits pdsComboboxChange when only filter text was present', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
      });

      const component = page.rootInstance;
      component.displayText = 'acc';
      await page.waitForChanges();

      const changeSpy = jest.spyOn(component.pdsComboboxChange, 'emit');

      await component.clear();
      await page.waitForChanges();

      expect(component.displayText).toBe('');
      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledWith({ value: '' });
    });

    it('clear restores the placeholder in the button trigger', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="button" placeholder="Select option"></pds-combobox>`,
      });

      const component = page.rootInstance;
      const mockOptions = [createMockOption('cat', 'Cat')];
      component.optionEls = mockOptions;
      component.allItems = mockOptions;
      (component as any).setSelectedOption(mockOptions[0]);
      component.displayText = 'Cat';
      component.value = 'cat';
      await page.waitForChanges();

      expect(page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger-label')?.textContent).toBe('Cat');

      await component.clear();
      await page.waitForChanges();

      expect(page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger-label')?.textContent).toBe(
        'Select option',
      );
    });

    it('clear restores the placeholder in the chip trigger', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" trigger="chip" placeholder="Select option"></pds-combobox>`,
      });

      const component = page.rootInstance;
      const mockOptions = [createMockOption('cat', 'Cat')];
      component.optionEls = mockOptions;
      component.allItems = mockOptions;
      (component as any).setSelectedOption(mockOptions[0]);
      component.displayText = 'Cat';
      component.value = 'cat';
      await page.waitForChanges();

      expect(page.root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger-label')?.textContent).toBe('Cat');

      await component.clear();
      await page.waitForChanges();

      expect(page.root?.shadowRoot?.querySelector('.pds-combobox__chip-trigger-label')?.textContent).toBe(
        'Select option',
      );
      expect(component.selectedOptionChipProps).toBeNull();
    });

    it('clear restores the unfiltered option list and resets the highlighted index', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
      });

      const component = page.rootInstance;
      const mockOptions = [
        createMockOption('cat', 'Cat'),
        createMockOption('dog', 'Dog'),
        createMockOption('bird', 'Bird'),
      ];
      component.optionEls = mockOptions;
      component.allItems = mockOptions;
      component.displayText = 'ca';
      (component as any).filterOptions();
      component.highlightedIndex = 0;
      await page.waitForChanges();

      expect(component.filteredItems).toHaveLength(1);

      await component.clear();
      await page.waitForChanges();

      expect(component.filteredItems).toHaveLength(3);
      expect(component.highlightedIndex).toBe(-1);
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
      component.displayText = 'digital'; // Set displayText for filtering
      component.filterOptions();

      expect(component.filteredItems).toContain(mockPayPalOption);
      expect(component.filteredItems).not.toContain(mockStripeOption);
    });
  });

  describe('Accessibility', () => {
    it('renders combobox wrapper with proper CSS part', async () => {
      const { root } = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox"></pds-combobox>`,
      });

      const comboboxWrapper = root?.shadowRoot?.querySelector('.pds-combobox');
      expect(comboboxWrapper?.getAttribute('part')).toBe('combobox');
    });

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

  describe('async options preselection', () => {
    it('preselects the matching option when options prop is set after value', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" value="2"></pds-combobox>`,
      });

      const component = page.rootInstance;

      // Simulate async options arriving after mount
      (page.root as HTMLPdsComboboxElement).options = [
        { id: '1', text: 'Option One' },
        { id: '2', text: 'Option Two' },
        { id: '3', text: 'Option Three' },
      ];
      await page.waitForChanges();

      expect(component.selectedOption).not.toBeNull();
      expect(component.selectedOption?.value).toBe('2');
      expect(component.displayText).toBe('Option Two');
    });

    it('does not overwrite an already-selected option when options are updated', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="test-combobox" value="1"></pds-combobox>`,
      });

      const component = page.rootInstance;

      (page.root as HTMLPdsComboboxElement).options = [
        { id: '1', text: 'Option One' },
        { id: '2', text: 'Option Two' },
      ];
      await page.waitForChanges();

      // Manually select a different option (user has interacted)
      const newOption = component.optionEls.find((o: HTMLOptionElement) => o.value === '2');
      component.setSelectedOption(newOption);
      await page.waitForChanges();

      // Updating options again should not reset to the original value
      (page.root as HTMLPdsComboboxElement).options = [
        { id: '1', text: 'Option One' },
        { id: '2', text: 'Option Two' },
        { id: '3', text: 'Option Three' },
      ];
      await page.waitForChanges();

      expect(component.selectedOption?.value).toBe('2');
    });
  });

  describe('trigger accessible name', () => {
    const triggerFor = (page: { root?: HTMLElement }, part: string) =>
      page.root!.shadowRoot!.querySelector(`[part="${part}"]`) as HTMLElement;

    it('names a button trigger by its visible label', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="named" label="Action" trigger="button"><option value="a">A</option></pds-combobox>`,
      });

      const label = page.root!.shadowRoot!.querySelector('label')!;
      const trigger = triggerFor(page, 'button-trigger');
      expect(label.id).toBe('named-label');
      expect(trigger.getAttribute('aria-labelledby')).toBe('named-label');
      expect(trigger.hasAttribute('aria-label')).toBe(false);
    });

    it('names a chip trigger by its visible label', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="named-chip" label="Status" trigger="chip"><option value="a">A</option></pds-combobox>`,
      });

      expect(triggerFor(page, 'chip-trigger').getAttribute('aria-labelledby')).toBe('named-chip-label');
    });

    it('uses aria-label instead when the label is hidden', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="hidden" label="Action" hide-label trigger="button"><option value="a">A</option></pds-combobox>`,
      });

      const trigger = triggerFor(page, 'button-trigger');
      expect(trigger.hasAttribute('aria-labelledby')).toBe(false);
      expect(trigger.getAttribute('aria-label')).toBe('Action');
    });

    it('leaves the input trigger named by <label for>', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="typed" label="Animal"><option value="a">A</option></pds-combobox>`,
      });

      const label = page.root!.shadowRoot!.querySelector('label')!;
      expect(triggerFor(page, 'input').hasAttribute('aria-labelledby')).toBe(false);
      expect(label.getAttribute('for')).toBe('typed');
    });

    it('drops <label for> on a div trigger, which it cannot label, and focuses the trigger on click', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="clicky" label="Action" trigger="button"><option value="a">A</option></pds-combobox>`,
      });

      const label = page.root!.shadowRoot!.querySelector('label')!;
      const trigger = triggerFor(page, 'button-trigger');
      const focus = jest.spyOn(trigger, 'focus');
      expect(label.hasAttribute('for')).toBe(false);

      label.click();

      expect(focus).toHaveBeenCalled();
    });

    it('uses aria-label on a chip trigger when the label is hidden', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="hidden-chip" label="Status" hide-label trigger="chip"><option value="a">A</option></pds-combobox>`,
      });

      const trigger = triggerFor(page, 'chip-trigger');
      expect(trigger.hasAttribute('aria-labelledby')).toBe(false);
      expect(trigger.getAttribute('aria-label')).toBe('Status');
    });
  });

  describe('grouped options', () => {
    const groupedOptions = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
      { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
    ];

    const openWith = async (html: string, options?: unknown[]) => {
      const page = await newSpecPage({ components: [PdsCombobox], html });
      const component = page.rootInstance;
      if (options) {
        (page.root as HTMLPdsComboboxElement).options = options;
        await page.waitForChanges();
      }
      component.isOpen = true;
      component.filterOptions();
      await page.waitForChanges();
      return { page, component };
    };

    // The spec environment doesn't populate slot assignment, so slotted markup is handed to the
    // component the way updateOptions() would collect it.
    const openWithSlottedGroup = async (componentId: string, label: string, icon?: string) => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="${componentId}" mode="select-only"></pds-combobox>`,
      });
      const component = page.rootInstance;
      const optgroup = page.doc.createElement('optgroup') as HTMLOptGroupElement;
      optgroup.label = label;
      if (icon !== undefined) optgroup.setAttribute('data-icon', icon);
      const option = page.doc.createElement('option') as HTMLOptionElement;
      option.value = 'first';
      option.textContent = 'First';
      optgroup.appendChild(option);
      component.optionEls = [option];
      component.allItems = [optgroup, option];
      component.isOpen = true;
      component.filterOptions();
      await page.waitForChanges();
      return { page, component };
    };

    const groupLabels = (page: { root?: HTMLElement }) =>
      Array.from(page.root!.shadowRoot!.querySelectorAll('.pds-combobox__group-label'));

    it('lists each group where it first appears, with all of its options', async () => {
      const { component } = await openWith(
        `<pds-combobox component-id="grouped" mode="select-only"></pds-combobox>`,
        groupedOptions,
      );

      const items = component.allItems.map((item: HTMLElement) =>
        item.tagName === 'OPTGROUP' ? `group:${(item as HTMLOptGroupElement).label}` : (item as HTMLOptionElement).value,
      );
      // Tag's options stay together even though the data interleaves Email between them.
      expect(items).toEqual(['group:Tag', 'tag-add', 'tag-remove', 'group:Email', 'email-send']);
      expect(component.optionEls.map((o: HTMLOptionElement) => o.value)).toEqual(['tag-add', 'tag-remove', 'email-send']);
      const removeTag = component.optionEls.find((o: HTMLOptionElement) => o.value === 'tag-remove');
      expect((removeTag.parentElement as HTMLOptGroupElement).label).toBe('Tag');
    });

    it('leaves options without a group at the top level', async () => {
      const { component } = await openWith(
        `<pds-combobox component-id="ungrouped" mode="select-only"></pds-combobox>`,
        [
          { id: '1', text: 'One' },
          { id: '2', text: 'Two' },
        ],
      );

      expect(component.allItems.every((item: HTMLElement) => item.tagName === 'OPTION')).toBe(true);
      expect(component.optionEls[0].parentElement).toBeNull();
    });

    it("renders each group's icon from the options prop beside its label", async () => {
      const { page } = await openWith(
        `<pds-combobox component-id="grouped-icons" mode="select-only"></pds-combobox>`,
        groupedOptions,
      );

      const labels = groupLabels(page);
      expect(labels.map(label => label.textContent)).toEqual(['Tag', 'Email']);
      expect(labels.map(label => label.querySelector('pds-icon')?.getAttribute('name'))).toEqual(['hashtag', 'mail']);
      expect(labels[0].classList.contains('pds-combobox__group-label--with-icon')).toBe(true);
      expect(labels[0].querySelector('pds-icon')?.getAttribute('aria-hidden')).toBe('true');
    });

    // `icon` also loads URLs and data: SVGs into pds-icon unsanitized; `name` accepts icon names only.
    it('renders a group icon only for a Pine icon name, never a URL or data: SVG', async () => {
      const { page } = await openWith(
        `<pds-combobox component-id="grouped-icon-name" mode="select-only"></pds-combobox>`,
        [
          { id: 'x', text: 'X', group: 'Data', groupIcon: 'data:image/svg+xml;utf8,<svg></svg>' },
          { id: 'y', text: 'Y', group: 'Path', groupIcon: '/icons/evil.svg' },
          { id: 'z', text: 'Z', group: 'Named', groupIcon: 'hashtag' },
        ],
      );

      const icons = groupLabels(page).map(label => label.querySelector('pds-icon'));
      expect(icons[0]).toBeNull();
      expect(icons[1]).toBeNull();
      expect(icons[2]?.getAttribute('name')).toBe('hashtag');
      expect(icons[2]?.hasAttribute('icon')).toBe(false);
    });

    it('leaves options with a null group from JSON ungrouped, with no icon', async () => {
      const { component } = await openWith(
        `<pds-combobox component-id="grouped-null" mode="select-only"></pds-combobox>`,
        [{ id: 'a', text: 'A', group: null, groupIcon: null }],
      );

      expect(component.optionEls[0].parentElement?.tagName).not.toBe('OPTGROUP');
      expect(component.allItems.some((item: Element) => item.tagName === 'OPTGROUP')).toBe(false);
    });

    it('lists ungrouped options before every group, wherever they appear', async () => {
      const { component } = await openWith(
        `<pds-combobox component-id="grouped-loose" mode="select-only"></pds-combobox>`,
        [
          { id: 'tag-add', text: 'Add a tag', group: 'Tag' },
          { id: 'loose', text: 'Loose' },
          { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
        ],
      );

      expect(component.allItems.map((item: HTMLElement) => (item.tagName === 'OPTGROUP' ? 'group:Tag' : (item as HTMLOptionElement).value))).toEqual([
        'loose',
        'group:Tag',
        'tag-add',
        'tag-remove',
      ]);
    });

    it('ignores a group or group icon that is not a string', async () => {
      const { component } = await openWith(
        `<pds-combobox component-id="grouped-types" mode="select-only"></pds-combobox>`,
        [
          { id: 'a', text: 'A', group: { label: 'Tag' } },
          { id: 'b', text: 'B', group: 'Tag', groupIcon: 42 },
        ],
      );

      expect(component.optionEls[0].parentElement?.tagName).not.toBe('OPTGROUP');
      const optgroup = component.optionEls[1].parentElement as HTMLOptGroupElement;
      expect(optgroup.label).toBe('Tag');
      expect(optgroup.hasAttribute('data-icon')).toBe(false);
    });

    it('takes the group icon from a later option when the first sets none', async () => {
      const { page } = await openWith(
        `<pds-combobox component-id="grouped-late-icon" mode="select-only"></pds-combobox>`,
        [
          { id: 'tag-add', text: 'Add a tag', group: 'Tag' },
          { id: 'tag-remove', text: 'Remove a tag', group: 'Tag', groupIcon: 'hashtag' },
        ],
      );

      expect(groupLabels(page)[0].querySelector('pds-icon')?.getAttribute('name')).toBe('hashtag');
    });

    it('renders each group label followed by its own options', async () => {
      const { page } = await openWith(
        `<pds-combobox component-id="grouped-dom" mode="select-only"></pds-combobox>`,
        groupedOptions,
      );

      const rows = Array.from(page.root!.shadowRoot!.querySelectorAll('.pds-combobox__group-label, [role="option"]'))
        .map(row => (row.classList.contains('pds-combobox__group-label') ? `group:${row.textContent}` : row.textContent));
      expect(rows).toEqual(['group:Tag', 'Add a tag', 'Remove a tag', 'group:Email', 'Send an email']);
    });

    it("puts each group's options in a group named for it", async () => {
      const { page } = await openWith(
        `<pds-combobox component-id="grouped-roles" mode="select-only"></pds-combobox>`,
        groupedOptions,
      );

      const groups = Array.from(page.root!.shadowRoot!.querySelectorAll('[role="listbox"] > [role="group"]'));
      expect(groups.map(group => [group.getAttribute('aria-label'), Array.from(group.querySelectorAll('[role="option"]')).map(o => o.textContent)])).toEqual([
        ['Tag', ['Add a tag', 'Remove a tag']],
        ['Email', ['Send an email']],
      ]);
      // The group's name already carries the caption, so the caption itself is hidden from assistive tech.
      expect(groups[0].querySelector('.pds-combobox__group-label')?.getAttribute('aria-hidden')).toBe('true');
    });

    // The label is presentational; an aria-label would override the role and announce it twice.
    it('gives a group label no aria-label', async () => {
      const { page } = await openWith(
        `<pds-combobox component-id="grouped-aria" mode="select-only"></pds-combobox>`,
        groupedOptions,
      );

      expect(groupLabels(page).every(label => !label.hasAttribute('aria-label'))).toBe(true);
    });

    it('renders the icon from data-icon on a slotted optgroup', async () => {
      const { page } = await openWithSlottedGroup('slotted-icons', 'Tag', 'hashtag');

      const [label] = groupLabels(page);
      expect(label.querySelector('pds-icon')?.getAttribute('name')).toBe('hashtag');
    });

    it('renders a slotted optgroup without data-icon exactly as before', async () => {
      const { page } = await openWithSlottedGroup('slotted-plain', 'Fruits');

      const [label] = groupLabels(page);
      expect(label.querySelector('pds-icon')).toBeNull();
      expect(label.classList.contains('pds-combobox__group-label--with-icon')).toBe(false);
      expect(label.textContent).toBe('Fruits');
    });

    it("keeps a matching option's group label when filtering options from the prop", async () => {
      const { page, component } = await openWith(
        `<pds-combobox component-id="grouped-filter"></pds-combobox>`,
        groupedOptions,
      );

      component.displayText = 'remove';
      component.filterOptions();
      await page.waitForChanges();

      const visible = component.filteredItems.map((item: HTMLElement) =>
        item.tagName === 'OPTGROUP' ? `group:${(item as HTMLOptGroupElement).label}` : (item as HTMLOptionElement).value,
      );
      expect(visible).toEqual(['group:Tag', 'tag-remove']);
    });

    it('keeps interleaved options under their own group when several match', async () => {
      const { page, component } = await openWith(
        `<pds-combobox component-id="grouped-filter-many"></pds-combobox>`,
        groupedOptions,
      );

      component.displayText = 'a';
      component.filterOptions();
      await page.waitForChanges();

      const visible = component.filteredItems.map((item: HTMLElement) =>
        item.tagName === 'OPTGROUP' ? `group:${(item as HTMLOptGroupElement).label}` : (item as HTMLOptionElement).value,
      );
      expect(visible).toEqual(['group:Tag', 'tag-add', 'tag-remove', 'group:Email', 'email-send']);
    });
  });

  describe('group-display="flyout"', () => {
    const actions = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
      { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
    ];

    const openFlyoutPanel = async (attrs = 'mode="select-only"') => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="actions" group-display="flyout" ${attrs}></pds-combobox>`,
      });
      const component = page.rootInstance;
      (page.root as HTMLPdsComboboxElement).options = actions;
      await page.waitForChanges();
      component.isOpen = true;
      component.filterOptions();
      await page.waitForChanges();
      return { page, component, root: page.root!.shadowRoot! };
    };

    // Groups are identified by their optgroup element, since two may share a label.
    const groupNamed = (component: { optionEls: HTMLOptionElement[] }, label: string) =>
      component.optionEls.map(o => o.parentElement as HTMLOptGroupElement).find(g => g?.label === label)!;

    it('lists one row per group, with its icon and a caret, and no flyout until one opens', async () => {
      const { root } = await openFlyoutPanel();

      const rows = Array.from(root.querySelectorAll('.pds-combobox__group-row'));
      expect(rows.map(row => row.querySelector('.pds-combobox__group-row-label')?.textContent)).toEqual(['Tag', 'Email']);
      expect(rows[0].querySelector('.pds-combobox__group-icon')?.getAttribute('name')).toBe('hashtag');
      expect(rows[0].querySelector('.pds-combobox__group-row-caret')?.getAttribute('name')).toBe('caret-right');
      expect(root.querySelector('.pds-combobox__flyout')).toBeNull();
      expect(root.querySelectorAll('.pds-combobox__option')).toHaveLength(0);
    });

    it("opens a group's options in a flyout, keeping their indexes", async () => {
      const { page, component, root } = await openFlyoutPanel();

      component.openGroup = groupNamed(component, 'Email');
      await page.waitForChanges();

      const flyout = root.querySelector('.pds-combobox__flyout')!;
      expect(flyout.getAttribute('aria-label')).toBe('Email');
      expect(Array.from(flyout.querySelectorAll('[role="treeitem"]')).map(o => [o.textContent, o.getAttribute('data-option-index')])).toEqual([
        ['Send an email', '2'],
      ]);
      expect(root.querySelector('.pds-combobox__group-row--open .pds-combobox__group-row-label')?.textContent).toBe('Email');
    });

    it('keeps the open flyout open when the options are rebuilt, and closes it if its group is gone', async () => {
      const { page, component, root } = await openFlyoutPanel();
      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      (page.root as HTMLPdsComboboxElement).options = [...actions, { id: 'coupon-send', text: 'Send a coupon', group: 'Coupon' }];
      await page.waitForChanges();
      expect(component.openGroup === groupNamed(component, 'Tag')).toBe(true);
      expect(root.querySelector('.pds-combobox__group-row--open .pds-combobox__group-row-label')?.textContent).toBe('Tag');

      (page.root as HTMLPdsComboboxElement).options = actions.filter(action => action.group !== 'Tag');
      await page.waitForChanges();
      expect(component.openGroup).toBeNull();
    });

    it('keeps the selection checked, and its group marked, when the options are rebuilt', async () => {
      const { page, component, root } = await openFlyoutPanel('mode="select-only" value="tag-remove"');
      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      (page.root as HTMLPdsComboboxElement).options = [...actions];
      await page.waitForChanges();
      expect(component.selectedOption === component.optionEls.find((o: HTMLOptionElement) => o.value === 'tag-remove')).toBe(true);
      expect(root.querySelector('.pds-combobox__group-row--has-selection .pds-combobox__group-row-label')?.textContent).toBe('Tag');
      expect(root.querySelector('[aria-selected="true"]')?.textContent).toBe('Remove a tag');
    });

    it('keeps text being typed when a rebuild relinks the selection', async () => {
      const { page, component } = await openFlyoutPanel('value="tag-remove"');
      component.displayText = 'em';
      await page.waitForChanges();

      (page.root as HTMLPdsComboboxElement).options = [...actions];
      await page.waitForChanges();
      expect(component.displayText).toBe('em');
      expect(component.selectedOption === component.optionEls.find((o: HTMLOptionElement) => o.value === 'tag-remove')).toBe(true);
    });

    it('scrolls only the flyout, not the panel or page, to show a highlighted flyout option', async () => {
      const { page, component, root } = await openFlyoutPanel();
      component.openGroup = groupNamed(component, 'Tag');
      component.highlightedIndex = 1;
      await page.waitForChanges();
      const option = root.querySelector('.pds-combobox__flyout [data-option-index="1"]') as HTMLElement;
      const pageScroll = jest.spyOn(option, 'scrollIntoView');

      component.updateOptionFocus();

      expect(pageScroll).not.toHaveBeenCalled();
    });

    it('selects an option clicked in a flyout', async () => {
      const { page, component, root } = await openFlyoutPanel();

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();
      (root.querySelector('[data-option-index="1"]') as HTMLElement).click();
      await page.waitForChanges();

      expect(component.value).toBe('tag-remove');
      expect(component.isOpen).toBe(false);
      expect(component.openGroup).toBeNull();
    });

    it('highlights the group holding the selection, and checks the option in its flyout', async () => {
      const { page, component, root } = await openFlyoutPanel('mode="select-only" value="tag-remove"');

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      const rows = Array.from(root.querySelectorAll('.pds-combobox__group-row'));
      expect(rows.map(row => row.classList.contains('pds-combobox__group-row--has-selection'))).toEqual([true, false]);
      expect(root.querySelector('[data-option-index="1"] .pds-combobox__option-check')).not.toBeNull();
      expect(root.querySelector('[data-option-index="0"] .pds-combobox__option-check')).toBeNull();
    });

    it("opens the highlighted option's group when arrowing", async () => {
      const { page, component, root } = await openFlyoutPanel();

      component.highlightedIndex = 2;
      component.updateOptionFocus();
      await page.waitForChanges();

      expect(component.openGroup?.label).toBe('Email');
      expect(root.querySelector('.pds-combobox__flyout [data-option-index="2"]')).not.toBeNull();
    });

    it('searches group labels too, and lists results under their groups', async () => {
      const { page, component, root } = await openFlyoutPanel('');

      component.displayText = 'tag';
      component.filterOptions();
      await page.waitForChanges();

      expect(component.filteredItems.filter((i: HTMLElement) => i.tagName === 'OPTION').map((o: HTMLOptionElement) => o.value)).toEqual([
        'tag-add',
        'tag-remove',
      ]);
      expect(root.querySelector('.pds-combobox__group-row')).toBeNull();
      expect(Array.from(root.querySelectorAll('.pds-combobox__group-label')).map(l => l.textContent)).toEqual(['Tag']);

      component.displayText = 'email';
      component.filterOptions();
      expect(component.filteredItems.filter((i: HTMLElement) => i.tagName === 'OPTION').map((o: HTMLOptionElement) => o.value)).toEqual([
        'email-send',
      ]);
    });

    it('does not search group labels in inline mode', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="inline-actions"></pds-combobox>`,
      });
      const component = page.rootInstance;
      (page.root as HTMLPdsComboboxElement).options = actions;
      await page.waitForChanges();

      component.displayText = 'email';
      component.filterOptions();

      // Only "Send an email" matches on its own text; the Email group label doesn't add anything.
      expect(component.filteredItems.filter((i: HTMLElement) => i.tagName === 'OPTION').map((o: HTMLOptionElement) => o.value)).toEqual([
        'email-send',
      ]);
      component.displayText = 'tag';
      component.filterOptions();
      expect(component.filteredItems.filter((i: HTMLElement) => i.tagName === 'OPTION').map((o: HTMLOptionElement) => o.value)).toEqual([
        'tag-add',
        'tag-remove',
      ]);
      component.displayText = 'mail';
      component.filterOptions();
      expect(component.filteredItems.filter((i: HTMLElement) => i.tagName === 'OPTION').map((o: HTMLOptionElement) => o.value)).toEqual([
        'email-send',
      ]);
      component.displayText = 'Email';
      component.filterOptions();
      expect(component.filteredItems.filter((i: HTMLElement) => i.tagName === 'OPTION')).toHaveLength(1);
    });

    it('closes the open group when the dropdown closes', async () => {
      const { page, component } = await openFlyoutPanel();

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();
      component.isOpen = false;
      await page.waitForChanges();

      expect(component.openGroup).toBeNull();
    });

    // Inside a modal the listbox is portaled into the dialog; the flyout renders inside the
    // listbox, so it goes with it rather than needing a portal of its own.
    it('renders the flyout inside the portaled listbox when dropdown-mount is body', async () => {
      const { page, component } = await openFlyoutPanel('mode="select-only" dropdown-mount="body"');

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      const portalFlyout = page.doc.querySelector('.pds-combobox-dropdown-portal .pds-combobox__flyout');
      expect(portalFlyout).not.toBeNull();
      expect(Array.from(portalFlyout!.querySelectorAll('[role="treeitem"]')).map(o => o.textContent)).toEqual([
        'Add a tag',
        'Remove a tag',
      ]);
      page.doc.querySelectorAll('.pds-combobox-dropdown-portal').forEach(el => el.remove());
    });

    it('keeps two groups with the same label apart', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="dup" group-display="flyout" mode="select-only"></pds-combobox>`,
      });
      const component = page.rootInstance;
      const doc = page.doc;
      const makeGroup = (values: string[]) => {
        const group = doc.createElement('optgroup') as HTMLOptGroupElement;
        group.label = 'Other';
        values.forEach(value => {
          const option = doc.createElement('option') as HTMLOptionElement;
          option.value = value;
          option.textContent = value;
          group.appendChild(option);
        });
        return group;
      };
      const first = makeGroup(['a']);
      const second = makeGroup(['b']);
      component.optionEls = [first.children[0], second.children[0]];
      component.allItems = [first, first.children[0], second, second.children[0]];
      component.isOpen = true;
      component.filterOptions();
      component.openGroup = second;
      await page.waitForChanges();

      const root = page.root!.shadowRoot!;
      expect(root.querySelectorAll('.pds-combobox__group-row')).toHaveLength(2);
      expect(root.querySelectorAll('.pds-combobox__group-row--open')).toHaveLength(1);
      expect(Array.from(root.querySelectorAll('.pds-combobox__flyout [role="treeitem"]')).map(o => o.textContent)).toEqual(['b']);
    });

    // aria-activedescendant must not name an option that isn't in the DOM.
    it('points aria-activedescendant only at a rendered option, or the closed group\'s row', async () => {
      const { page, component, root } = await openFlyoutPanel();
      const trigger = root.querySelector('[role="combobox"]')!;

      component.highlightedIndex = 2;
      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();
      expect(trigger.getAttribute('aria-activedescendant')).toBe(root.querySelectorAll('.pds-combobox__group-row')[1].id);

      component.openGroup = groupNamed(component, 'Email');
      await page.waitForChanges();
      expect(trigger.getAttribute('aria-activedescendant')).toBe('actions-option-2');
    });

    it('does not choose an option whose flyout the pointer has closed', async () => {
      const { page, component } = await openFlyoutPanel();

      component.highlightedIndex = 0;
      component.openGroup = groupNamed(component, 'Email');
      await page.waitForChanges();
      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
      await page.waitForChanges();

      expect(component.value).toBeFalsy();
      expect(component.isOpen).toBe(true);
    });

    it('keeps a group the keys opened, though the pointer left a close timer running', async () => {
      const { page, component } = await openFlyoutPanel();
      const tag = groupNamed(component, 'Tag');
      jest.useFakeTimers();
      try {
        // The pointer opened Tag, then left its row: Tag closes in 200ms unless something keeps it.
        component.flyout.enter(tag);
        component.flyout.leave(tag);
        component.highlightedGroup = tag;
        component.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
        jest.advanceTimersByTime(500);
      } finally {
        jest.useRealTimers();
      }
      await page.waitForChanges();

      expect(component.highlightedIndex).toBe(0);
      expect(component.openGroup?.label).toBe('Tag');
    });

    it('resets the open group when the display mode changes', async () => {
      const { page, component } = await openFlyoutPanel();
      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      (page.root as HTMLPdsComboboxElement).groupDisplay = 'inline';
      await page.waitForChanges();
      expect(component.openGroup).toBeNull();
    });

    describe('as a tree', () => {
      const press = async (page: { waitForChanges: () => Promise<void> }, component: { handleKeyDown: (e: KeyboardEvent) => void }, key: string) => {
        component.handleKeyDown(new KeyboardEvent('keydown', { key, cancelable: true }));
        await page.waitForChanges();
      };

      it('names the closed input\'s popup a tree while it holds the selection\'s label', async () => {
        const page = await newSpecPage({
          components: [PdsCombobox],
          html: `<pds-combobox component-id="actions" group-display="flyout" value="tag-remove"></pds-combobox>`,
        });
        (page.root as HTMLPdsComboboxElement).options = actions;
        await page.waitForChanges();
        const input = page.root!.shadowRoot!.querySelector('[role="combobox"]')!;

        expect(page.rootInstance.displayText).toBe('Remove a tag');
        expect(input.getAttribute('aria-haspopup')).toBe('tree');
      });

      it('scrolls the selection into view when a click opens its group', async () => {
        const { page, component } = await openFlyoutPanel('mode="select-only" trigger="button" value="tag-remove"');
        component.isOpen = false;
        await page.waitForChanges();
        const focus = jest.spyOn(component, 'updateOptionFocus');

        (page.root!.shadowRoot!.querySelector('.pds-combobox__button-trigger') as HTMLElement).click();
        await page.waitForChanges();

        expect(component.openGroup?.label).toBe('Tag');
        expect(focus).toHaveBeenCalled();
      });

      it('makes each group row a treeitem, with its options a level below', async () => {
        const { page, component, root } = await openFlyoutPanel();

        expect(root.querySelector('.pds-combobox__listbox')?.getAttribute('role')).toBe('tree');
        expect(root.querySelector('[role="combobox"]')?.getAttribute('aria-haspopup')).toBe('tree');
        const rows = Array.from(root.querySelectorAll('.pds-combobox__group-row'));
        expect(rows.map(row => ['role', 'aria-level', 'aria-posinset', 'aria-setsize', 'aria-expanded'].map(a => row.getAttribute(a)))).toEqual([
          ['treeitem', '1', '1', '2', 'false'],
          ['treeitem', '1', '2', '2', 'false'],
        ]);
        expect(root.querySelector(`[id="${rows[0].getAttribute('aria-labelledby')}"]`)?.textContent).toBe('Tag');

        component.openGroup = groupNamed(component, 'Tag');
        await page.waitForChanges();
        const open = root.querySelector('.pds-combobox__group-row--open')!;
        expect(open.getAttribute('aria-expanded')).toBe('true');
        expect(Array.from(open.querySelectorAll('[role="group"] [role="treeitem"]')).map(o => ['aria-level', 'aria-posinset', 'aria-setsize'].map(a => o.getAttribute(a)))).toEqual([
          ['2', '1', '2'],
          ['2', '2', '2'],
        ]);
      });

      it('marks only the selected treeitem, as a single-select tree does', async () => {
        const { page, component, root } = await openFlyoutPanel();
        component.value = 'tag-remove';
        component.openGroup = groupNamed(component, 'Tag');
        await page.waitForChanges();

        expect(Array.from(root.querySelectorAll('.pds-combobox__flyout [role="treeitem"]')).map(o => o.getAttribute('aria-selected'))).toEqual([null, 'true']);
      });

      it('leaves Space, Home and End to the input trigger\'s text', async () => {
        const { page, component } = await openFlyoutPanel();
        component.setInitialHighlightedIndex();
        await page.waitForChanges();

        for (const key of [' ', 'Home', 'End']) {
          const event = new KeyboardEvent('keydown', { key, cancelable: true });
          expect(component.handleGroupedPanelKey(event)).toBe(false);
          expect(event.defaultPrevented).toBe(false);
        }
      });

      it('jumps within a level with Home, End, PageUp and PageDown', async () => {
        const { page, component } = await openFlyoutPanel('mode="select-only" trigger="button"');

        await press(page, component, 'PageUp');
        expect(component.highlightedGroup?.label).toBe('Email');
        await press(page, component, 'PageUp');
        expect(component.highlightedGroup?.label).toBe('Tag');
        await press(page, component, 'PageDown');
        expect(component.highlightedGroup?.label).toBe('Email');

        await press(page, component, 'Home');
        await press(page, component, 'ArrowRight');
        await press(page, component, 'End');
        expect(component.highlightedIndex).toBe(1);
        await press(page, component, 'Home');
        expect(component.highlightedIndex).toBe(0);
      });

      it('opens a group with Space on the button trigger', async () => {
        const { page, component, root } = await openFlyoutPanel('mode="select-only" trigger="button"');
        component.setInitialHighlightedIndex();
        await page.waitForChanges();

        root.querySelector('[role="combobox"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true }));
        await page.waitForChanges();
        expect(component.openGroup?.label).toBe('Tag');
        expect(component.highlightedIndex).toBe(0);
      });

      it('leaves Left and Right to the input trigger while it has text', async () => {
        const { page, component } = await openFlyoutPanel();
        component.expandFilterListWhileOpen = true;
        component.displayText = 'Add a tag';
        component.highlightedGroup = groupNamed(component, 'Tag');
        await page.waitForChanges();

        for (const key of ['ArrowLeft', 'ArrowRight']) {
          const event = new KeyboardEvent('keydown', { key, cancelable: true });
          component.handleKeyDown(event);
          expect(event.defaultPrevented).toBe(false);
        }
        expect(component.openGroup).toBeNull();
      });

      it('carries on from the row when the highlighted option\'s flyout has closed', async () => {
        const { page, component } = await openFlyoutPanel('mode="select-only" trigger="button"');
        // The pointer was on "Remove a tag", then left, and the flyout closed behind it.
        component.highlightedIndex = 1;
        await page.waitForChanges();

        await press(page, component, 'ArrowDown');
        expect(component.highlightedGroup?.label).toBe('Email');

        component.highlightedIndex = 1;
        await page.waitForChanges();
        await press(page, component, 'Enter');
        expect(component.value).not.toBe('tag-remove');
        expect(component.openGroup?.label).toBe('Tag');
        expect(component.highlightedIndex).toBe(0);
      });

      it("opens on the selection's group however the dropdown opens", async () => {
        const page = await newSpecPage({
          components: [PdsCombobox],
          html: `<pds-combobox component-id="actions" group-display="flyout" mode="select-only" trigger="button"></pds-combobox>`,
        });
        const component = page.rootInstance;
        (page.root as HTMLPdsComboboxElement).options = actions;
        component.value = 'email-send';
        await page.waitForChanges();
        component.selectedOption = component.optionEls.find((o: HTMLOptionElement) => o.value === 'email-send');
        await page.waitForChanges();

        (page.root!.shadowRoot!.querySelector('[role="combobox"]') as HTMLElement).click();
        await page.waitForChanges();
        expect(component.openGroup?.label).toBe('Email');
        expect(component.highlightedIndex).toBe(2);

        await press(page, component, 'ArrowLeft');
        expect(component.highlightedGroup?.label).toBe('Email');
      });

      it('closes a flyout that hover opened with Escape, before the panel', async () => {
        const { page, component } = await openFlyoutPanel();
        component.openGroup = groupNamed(component, 'Email');
        await page.waitForChanges();

        await press(page, component, 'Escape');
        expect(component.openGroup).toBeNull();
        expect(component.highlightedGroup?.label).toBe('Email');
        expect(component.isOpen).toBe(true);
      });

      it('names the button trigger popup a tree', async () => {
        const { root } = await openFlyoutPanel('mode="select-only" trigger="button"');
        expect(root.querySelector('[role="combobox"]')?.getAttribute('aria-haspopup')).toBe('tree');
      });

      it('starts on the first row without opening it, and moves through the rows', async () => {
        const { page, component, root } = await openFlyoutPanel();
        const trigger = root.querySelector('[role="combobox"]')!;
        const [tagRow, emailRow] = Array.from(root.querySelectorAll('.pds-combobox__group-row'));

        component.setInitialHighlightedIndex();
        await page.waitForChanges();
        expect(component.openGroup).toBeNull();
        expect(trigger.getAttribute('aria-activedescendant')).toBe(tagRow.id);
        expect(tagRow.classList.contains('pds-combobox__group-row--highlighted')).toBe(true);

        await press(page, component, 'ArrowDown');
        expect(trigger.getAttribute('aria-activedescendant')).toBe(emailRow.id);
        await press(page, component, 'ArrowDown');
        expect(trigger.getAttribute('aria-activedescendant')).toBe(emailRow.id);
        await press(page, component, 'ArrowUp');
        expect(trigger.getAttribute('aria-activedescendant')).toBe(tagRow.id);
      });

      it('opens a group at its first option with ArrowRight, stays in it, and closes back to its row with ArrowLeft', async () => {
        const { page, component, root } = await openFlyoutPanel();
        const trigger = root.querySelector('[role="combobox"]')!;
        component.setInitialHighlightedIndex();
        await page.waitForChanges();

        await press(page, component, 'ArrowRight');
        expect(component.openGroup?.label).toBe('Tag');
        expect(trigger.getAttribute('aria-activedescendant')).toBe('actions-option-0');

        // Down stops at the group's last option rather than running into the next group.
        await press(page, component, 'ArrowDown');
        await press(page, component, 'ArrowDown');
        expect(component.highlightedIndex).toBe(1);

        await press(page, component, 'ArrowLeft');
        expect(component.openGroup).toBeNull();
        expect(component.highlightedIndex).toBe(-1);
        expect(trigger.getAttribute('aria-activedescendant')).toBe(root.querySelector('.pds-combobox__group-row')!.id);
      });

      it('opens a group with Enter, selects with Enter, and closes the group with Escape before the panel', async () => {
        const { page, component } = await openFlyoutPanel();
        component.setInitialHighlightedIndex();
        await page.waitForChanges();

        await press(page, component, 'Enter');
        expect(component.openGroup?.label).toBe('Tag');
        expect(component.isOpen).toBe(true);

        await press(page, component, 'Escape');
        expect(component.openGroup).toBeNull();
        expect(component.highlightedGroup?.label).toBe('Tag');
        expect(component.isOpen).toBe(true);

        await press(page, component, 'Enter');
        await press(page, component, 'Enter');
        expect(component.value).toBe('tag-add');
        expect(component.isOpen).toBe(false);
      });

      it('closes the group before the panel on Escape from the button trigger', async () => {
        const { page, component, root } = await openFlyoutPanel('mode="select-only" trigger="button"');
        component.openGroup = groupNamed(component, 'Tag');
        component.highlightedIndex = 0;
        await page.waitForChanges();

        root.querySelector('[role="combobox"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
        await page.waitForChanges();
        expect(component.openGroup).toBeNull();
        expect(component.isOpen).toBe(true);
      });

      it('highlights a row under the pointer, so the keys carry on from it', async () => {
        const { page, component, root } = await openFlyoutPanel();

        root.querySelectorAll('.pds-combobox__group-row-trigger')[1].dispatchEvent(new Event('mouseenter'));
        await page.waitForChanges();
        expect(component.highlightedGroup?.label).toBe('Email');

        await press(page, component, 'ArrowUp');
        expect(component.highlightedGroup?.label).toBe('Tag');
      });

      it('closes a flyout that hover opened when the keys move to another row', async () => {
        const { page, component } = await openFlyoutPanel();
        const email = groupNamed(component, 'Email');
        component.openGroup = email;
        component.highlightedGroup = email;
        await page.waitForChanges();

        await press(page, component, 'ArrowUp');
        expect(component.openGroup).toBeNull();
        expect(component.highlightedGroup?.label).toBe('Tag');
      });
    });

    it('applies the flyout width props', async () => {
      const { page, component, root } = await openFlyoutPanel(
        'mode="select-only" flyout-min-width="200px" flyout-max-width="320px"',
      );

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      const flyout = root.querySelector('.pds-combobox__flyout') as HTMLElement;
      expect(flyout.style.minWidth).toBe('200px');
      expect(flyout.style.maxWidth).toBe('320px');
    });
  });

  describe('group-display="drill-in"', () => {
    const actions = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag', groupIcon: 'hashtag' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
      { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
    ];

    const openDrillIn = async (attrs = 'group-display="drill-in" mode="select-only"') => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="drill" ${attrs}></pds-combobox>`,
      });
      const component = page.rootInstance;
      (page.root as HTMLPdsComboboxElement).options = actions;
      await page.waitForChanges();
      component.isOpen = true;
      component.filterOptions();
      await page.waitForChanges();
      return { page, component, root: page.root!.shadowRoot! };
    };

    const groupNamed = (component: { optionEls: HTMLOptionElement[] }, label: string) =>
      component.optionEls.map(o => o.parentElement as HTMLOptGroupElement).find(g => g?.label === label)!;

    it('replaces the group list with the clicked group and a row back', async () => {
      const { page, component, root } = await openDrillIn();

      expect(root.querySelectorAll('.pds-combobox__group-row')).toHaveLength(2);
      (root.querySelectorAll('.pds-combobox__group-row-trigger')[1] as HTMLElement).click();
      await page.waitForChanges();

      expect(component.openGroup?.label).toBe('Email');
      expect(root.querySelector('.pds-combobox__group-row')).toBeNull();
      expect(root.querySelector('.pds-combobox__flyout')).toBeNull();
      expect(root.querySelector('.pds-combobox__group-back-trigger')?.textContent).toBe('Back: Email');
      expect(Array.from(root.querySelectorAll('[role="group"] [role="treeitem"]')).map(o => [o.textContent, o.getAttribute('data-option-index')])).toEqual([
        ['Send an email', '2'],
      ]);

      (root.querySelector('.pds-combobox__group-back-trigger') as HTMLElement).click();
      await page.waitForChanges();
      expect(component.openGroup).toBeNull();
      expect(root.querySelectorAll('.pds-combobox__group-row')).toHaveLength(2);
    });

    it("names the drilled-in options by their group, and announces the group", async () => {
      const { page, component, root } = await openDrillIn();

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      const group = root.querySelector('ul[role="group"]')!;
      expect(group.getAttribute('aria-label')).toBe('Tag');
      expect(group.querySelectorAll('[role="treeitem"]')).toHaveLength(2);
      expect(root.querySelector('[role="status"]')?.textContent).toBe('Tag');
    });

    it('click-opens on the first row, so ArrowRight drills into the first group at its first option', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="drill" group-display="drill-in" mode="select-only" trigger="button"></pds-combobox>`,
      });
      const component = page.rootInstance;
      (page.root as HTMLPdsComboboxElement).options = actions;
      await page.waitForChanges();

      (page.root!.shadowRoot!.querySelector('.pds-combobox__button-trigger') as HTMLElement).click();
      await page.waitForChanges();
      expect(component.highlightedIndex).toBe(-1);
      expect(component.highlightedGroup?.label).toBe('Tag');

      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }));
      await page.waitForChanges();
      expect(component.openGroup?.label).toBe('Tag');
      expect(component.highlightedIndex).toBe(0);
    });
    it('stays in the drilled-in group when the options are rebuilt, as when another page loads', async () => {
      const { page, component, root } = await openDrillIn();
      (root.querySelectorAll('.pds-combobox__group-row-trigger')[1] as HTMLElement).click();
      await page.waitForChanges();

      (page.root as HTMLPdsComboboxElement).options = [...actions, { id: 'email-resend', text: 'Resend an email', group: 'Email' }];
      await page.waitForChanges();
      expect(root.querySelector('.pds-combobox__group-back-trigger')?.textContent).toBe('Back: Email');
      expect(Array.from(root.querySelectorAll('[data-option-index]')).map(o => o.textContent)).toEqual(['Send an email', 'Resend an email']);

      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true }));
      await page.waitForChanges();
      expect(component.openGroup).toBeNull();
      expect(root.querySelectorAll('.pds-combobox__group-row')).toHaveLength(2);
    });

    it("highlights the group's row on the way back, so the next arrow carries on from it", async () => {
      const { page, component, root } = await openDrillIn();

      component.openGroup = groupNamed(component, 'Tag');
      component.highlightedIndex = 1;
      await page.waitForChanges();
      (root.querySelector('.pds-combobox__group-back-trigger') as HTMLElement).click();
      await page.waitForChanges();

      expect(component.openGroup).toBeNull();
      expect(component.highlightedIndex).toBe(-1);
      expect(component.highlightedGroup?.label).toBe('Tag');
    });

    it("draws the open group as its own expanded treeitem, holding its options", async () => {
      const { page, component, root } = await openDrillIn();

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      expect(root.querySelector('.pds-combobox__listbox')?.getAttribute('role')).toBe('tree');
      const back = root.querySelector('.pds-combobox__group-back')!;
      expect(['role', 'aria-expanded', 'aria-level', 'aria-posinset', 'aria-setsize'].map(a => back.getAttribute(a))).toEqual(['treeitem', 'true', '1', '1', '2']);
      expect(root.querySelector(`[id="${back.getAttribute('aria-labelledby')}"]`)?.textContent).toBe('Back: Tag');
      expect(back.querySelector('ul[role="group"]')!.querySelectorAll('[role="treeitem"]')).toHaveLength(2);
    });

    it('drills in with ArrowRight, reaches the row back with ArrowUp, and returns to the same row', async () => {
      const { page, component, root } = await openDrillIn();
      const trigger = root.querySelector('[role="combobox"]')!;
      const press = async (key: string) => {
        component.handleKeyDown(new KeyboardEvent('keydown', { key, cancelable: true }));
        await page.waitForChanges();
      };
      component.setInitialHighlightedIndex();
      await page.waitForChanges();

      await press('ArrowDown');
      await press('ArrowRight');
      expect(component.openGroup?.label).toBe('Email');
      expect(trigger.getAttribute('aria-activedescendant')).toBe('drill-option-2');

      await press('ArrowUp');
      expect(trigger.getAttribute('aria-activedescendant')).toBe(root.querySelector('.pds-combobox__group-back')!.id);

      await press('ArrowRight');
      expect(component.highlightedIndex).toBe(2);

      await press('ArrowLeft');
      expect(component.openGroup).toBeNull();
      expect(component.highlightedGroup?.label).toBe('Email');
      expect(trigger.getAttribute('aria-activedescendant')).toBe(root.querySelectorAll('.pds-combobox__group-row')[1].id);
    });

    it('goes back with Enter on the row back', async () => {
      const { page, component } = await openDrillIn('group-display="drill-in" mode="select-only" trigger="button"');
      const tag = groupNamed(component, 'Tag');
      component.openGroup = tag;
      await page.waitForChanges();

      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Home', cancelable: true }));
      await page.waitForChanges();
      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
      await page.waitForChanges();

      expect(component.openGroup).toBeNull();
      expect(component.highlightedGroup?.label).toBe('Tag');
    });

    it('names a panel-search button trigger by its label and its own text, the selection', async () => {
      const { page, component, root } = await openDrillIn('group-display="drill-in" mode="select-only" trigger="button" panel-search label="Filter"');
      const trigger = root.querySelector('.pds-combobox__button-trigger')!;

      expect(trigger.getAttribute('aria-labelledby')).toBe('drill-label drill');
      expect(trigger.id).toBe('drill');

      (page.root as HTMLPdsComboboxElement).hideLabel = true;
      component.value = 'email-send';
      await page.waitForChanges();
      expect(trigger.hasAttribute('aria-labelledby')).toBe(false);
      expect(trigger.getAttribute('aria-label')).toBe('Filter, Send an email');
    });

    it('rings a group row for the keys only, not under the pointer', async () => {
      const { page, component, root } = await openDrillIn();
      const rows = () => Array.from(root.querySelectorAll('.pds-combobox__group-row'));

      rows()[1].querySelector('.pds-combobox__group-row-trigger')!.dispatchEvent(new Event('mouseenter'));
      await page.waitForChanges();
      expect(rows()[1].classList.contains('pds-combobox__group-row--highlighted')).toBe(true);
      expect(rows()[1].classList.contains('pds-combobox__group-row--keyboard')).toBe(false);

      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true }));
      await page.waitForChanges();
      expect(rows()[0].classList.contains('pds-combobox__group-row--keyboard')).toBe(true);
    });

    it('follows the open group to the optgroup an options reload rebuilds, and resets the highlight', async () => {
      const { page, component } = await openDrillIn();
      component.openGroup = groupNamed(component, 'Tag');
      component.highlightedGroup = groupNamed(component, 'Email');
      await page.waitForChanges();

      (page.root as HTMLPdsComboboxElement).options = [...component.options];
      await page.waitForChanges();
      expect(component.openGroup === groupNamed(component, 'Tag')).toBe(true);
      expect(component.highlightedGroup).toBeNull();

      (page.root as HTMLPdsComboboxElement).options = actions.filter(action => action.group !== 'Tag');
      await page.waitForChanges();
      expect(component.openGroup).toBeNull();
    });

    it('names the popup a tree from the search field, and a listbox of grouped results while searching', async () => {
      const { page, component, root } = await openDrillIn('group-display="drill-in" mode="select-only" trigger="button" panel-search');
      const input = root.querySelector('.pds-combobox__panel-search-input')!;
      const popup = () => root.querySelector('#drill-listbox')!;

      expect(root.querySelectorAll('[role="combobox"]')).toHaveLength(1);
      expect(root.querySelector('.pds-combobox__button-trigger')?.getAttribute('role')).toBe('button');
      expect(root.querySelector('.pds-combobox__button-trigger')?.getAttribute('aria-haspopup')).toBe('tree');
      expect(input.getAttribute('aria-haspopup')).toBe('tree');
      expect(popup().getAttribute('role')).toBe('tree');

      component.panelQuery = 'tag';
      component.filterOptions();
      await page.waitForChanges();

      expect(input.getAttribute('aria-haspopup')).toBe('listbox');
      expect(popup().getAttribute('role')).toBe('listbox');
      expect(popup().querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Tag');
    });

    it('highlights a clicked group\'s first option, so the arrows carry on inside it', async () => {
      const { page, component, root } = await openDrillIn();
      component.highlightedIndex = 0;
      await page.waitForChanges();

      (root.querySelectorAll('.pds-combobox__group-row-trigger')[1] as HTMLElement).click();
      await page.waitForChanges();
      expect(component.openGroup?.label).toBe('Email');
      expect(component.highlightedIndex).toBe(2);

      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
      await page.waitForChanges();
      expect(component.openGroup?.label).toBe('Email');
    });

    it('steps back to the groups with ArrowLeft', async () => {
      const { page, component } = await openDrillIn();

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();
      component.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      await page.waitForChanges();

      expect(component.openGroup).toBeNull();
    });

    it('steps back with Backspace on an empty panel search, but not while there is text', async () => {
      const { page, component, root } = await openDrillIn('group-display="drill-in" mode="select-only" trigger="button" panel-search');
      const input = () => root.querySelector('.pds-combobox__panel-search-input') as HTMLInputElement;

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();
      component.panelQuery = 'ta';
      input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      expect(component.openGroup?.label).toBe('Tag');

      component.panelQuery = '';
      input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      await page.waitForChanges();
      expect(component.openGroup).toBeNull();
    });

    it('does not open a group on hover', async () => {
      const { page, component, root } = await openDrillIn();

      root.querySelector('.pds-combobox__group-row')!.dispatchEvent(new Event('mouseenter'));
      await page.waitForChanges();

      expect(component.openGroup).toBeNull();
    });

    it('uses a translated back label', async () => {
      const { page, component, root } = await openDrillIn('group-display="drill-in" mode="select-only" drill-in-back-label="Volver"');

      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      expect(root.querySelector('.pds-combobox__group-back-trigger')?.textContent).toBe('Volver: Tag');
    });

    it('drills in from flyout mode when there is no room for a flyout', async () => {
      const { page, component, root } = await openDrillIn('group-display="flyout" mode="select-only"');

      component.flyoutFallback = true;
      component.openGroup = groupNamed(component, 'Tag');
      await page.waitForChanges();

      expect(root.querySelector('.pds-combobox__flyout')).toBeNull();
      expect(root.querySelector('.pds-combobox__group-back')).not.toBeNull();
    });
  });

  describe('disabled options', () => {
    const key = (component: { handleKeyDown: (e: KeyboardEvent) => void }, k: string) => {
      const event = new KeyboardEvent('keydown', { key: k, cancelable: true });
      component.handleKeyDown(event);
      return event;
    };

    const openList = async (options: unknown[], attrs = 'mode="select-only"') => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="locked" ${attrs}></pds-combobox>`,
      });
      const component = page.rootInstance;
      (page.root as HTMLPdsComboboxElement).options = options;
      await page.waitForChanges();
      component.isOpen = true;
      component.filterOptions();
      component.setInitialHighlightedIndex();
      await page.waitForChanges();
      return { page, component, root: page.root!.shadowRoot! };
    };

    const plans = [
      { id: 'free', text: 'Free' },
      { id: 'pro', text: 'Pro', disabled: true },
      { id: 'growth', text: 'Growth' },
      { id: 'premium', text: 'Premium', disabled: true },
    ];

    it('marks an option disabled from the options prop', async () => {
      const { component, root } = await openList(plans);

      expect(component.optionEls.map((o: HTMLOptionElement) => o.hasAttribute('disabled'))).toEqual([false, true, false, true]);
      const rendered = Array.from(root.querySelectorAll('[role="option"]'));
      expect(rendered.map(o => o.getAttribute('aria-disabled'))).toEqual([null, 'true', null, 'true']);
      expect(rendered[1].classList.contains('pds-combobox__option--disabled')).toBe(true);
    });

    it('disables every option in a disabled optgroup, and marks the group', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="locked-group" mode="select-only"></pds-combobox>`,
      });
      const component = page.rootInstance;
      const optgroup = page.doc.createElement('optgroup') as HTMLOptGroupElement;
      optgroup.label = 'Premium';
      optgroup.setAttribute('disabled', '');
      const option = page.doc.createElement('option') as HTMLOptionElement;
      option.value = 'sms';
      option.textContent = 'Send a text message';
      optgroup.appendChild(option);
      component.optionEls = [option];
      component.allItems = [optgroup, option];
      component.isOpen = true;
      component.filterOptions();
      await page.waitForChanges();

      const root = page.root!.shadowRoot!;
      expect(root.querySelector('[role="group"]')?.getAttribute('aria-disabled')).toBe('true');
      expect(root.querySelector('[role="option"]')?.getAttribute('aria-disabled')).toBe('true');
    });

    // The APG listbox pattern keeps disabled options reachable, so they're announced as unavailable.
    it('reaches disabled options with the keys and points aria-activedescendant at them', async () => {
      const { page, component, root } = await openList(plans);
      expect(component.highlightedIndex).toBe(0);

      key(component, 'ArrowDown');
      await page.waitForChanges();
      expect(component.highlightedIndex).toBe(1);
      expect(root.querySelector('[role="combobox"]')?.getAttribute('aria-activedescendant')).toBe('locked-option-1');
      key(component, 'End');
      expect(component.highlightedIndex).toBe(3);
      key(component, 'Home');
      expect(component.highlightedIndex).toBe(0);
    });

    it('opens with nothing highlighted, and chooses nothing, when every option is disabled', async () => {
      const { page, component } = await openList(plans.map(plan => ({ ...plan, disabled: true })));
      expect(component.highlightedIndex).toBe(-1);

      key(component, 'ArrowDown');
      key(component, 'Enter');
      await page.waitForChanges();
      expect(component.highlightedIndex).toBe(0);
      expect(component.value).toBeFalsy();
      expect(component.isOpen).toBe(true);
    });

    it('marks an inline group disabled when none of its options can be chosen', async () => {
      const { root } = await openList([
        { id: 'free', text: 'Free', group: 'Plans' },
        { id: 'sms', text: 'Send a text message', group: 'Premium', disabled: true },
      ]);
      const groups = Array.from(root.querySelectorAll('[role="group"]'));
      expect(groups.map(group => group.getAttribute('aria-disabled'))).toEqual([null, 'true']);
      expect(groups[1].classList.contains('pds-combobox__group--disabled')).toBe(true);
    });

    it('defaults a chip trigger to its first enabled option', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="locked-chip" trigger="chip" mode="select-only"></pds-combobox>`,
      });
      const component = page.rootInstance;
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const first = page.doc.createElement('option') as HTMLOptionElement;
      first.value = 'pro';
      first.setAttribute('disabled', '');
      const second = page.doc.createElement('option') as HTMLOptionElement;
      second.value = 'free';
      page.root!.append(first, second);
      component.updateOptions();
      await page.waitForChanges();
      warn.mockRestore();

      expect(component.selectedOption?.value).toBe('free');
    });

    it('starts on the first enabled option', async () => {
      const { component } = await openList([{ id: 'pro', text: 'Pro', disabled: true }, ...plans.slice(2)]);
      expect(component.highlightedIndex).toBe(1);
    });

    it('does not choose a disabled option by click, Enter or Space', async () => {
      const { page, component, root } = await openList(plans);

      (root.querySelectorAll('[role="option"]')[1] as HTMLElement).click();
      await page.waitForChanges();
      expect(component.value).toBeFalsy();
      expect(component.isOpen).toBe(true);

      component.highlightedIndex = 1;
      key(component, 'Enter');
      key(component, ' ');
      await page.waitForChanges();
      expect(component.value).toBeFalsy();
      expect(component.isOpen).toBe(true);
    });

    it('highlights a disabled option under the pointer, as the keys do, without choosing it', async () => {
      const { page, component, root } = await openList(plans);

      root.querySelectorAll('[role="option"]')[1].dispatchEvent(new Event('mouseenter'));
      await page.waitForChanges();
      expect(component.highlightedIndex).toBe(1);
      key(component, 'Enter');
      expect(component.value).toBeFalsy();
    });

    it('shows a disabled option as the value, as a native select does, without highlighting it', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="locked-value" mode="select-only" trigger="button" value="pro"></pds-combobox>`,
      });
      const component = page.rootInstance;
      (page.root as HTMLPdsComboboxElement).options = plans;
      await page.waitForChanges();

      expect(component.selectedOption?.value).toBe('pro');
      component.isOpen = true;
      component.filterOptions();
      component.setInitialHighlightedIndex();
      expect(component.highlightedIndex).toBe(0);
    });

    it('keeps disabled options in search results, still disabled', async () => {
      const { page, component, root } = await openList(plans, 'mode="filter"');
      component.displayText = 'pr';
      component.filterOptions();
      await page.waitForChanges();

      expect(Array.from(root.querySelectorAll('[role="option"]')).map(o => [o.textContent, o.getAttribute('aria-disabled')])).toEqual([
        ['Pro', 'true'],
        ['Premium', 'true'],
      ]);
    });

    describe('in a flyout', () => {
      const actions = [
        { id: 'tag-add', text: 'Add a tag', group: 'Contact', groupIcon: 'contact' },
        { id: 'tag-premium', text: 'Score a contact', group: 'Contact', disabled: true },
        { id: 'tag-remove', text: 'Remove a tag', group: 'Contact' },
        { id: 'sms-send', text: 'Send a text message', group: 'Premium', groupIcon: 'mail', disabled: true },
        { id: 'email-send', text: 'Send an email', group: 'Email', groupIcon: 'mail' },
      ];

      it('keeps a group with nothing to choose marked once it is drilled into', async () => {
        const { page, component, root } = await openList(actions, 'mode="select-only" trigger="button" group-display="drill-in"');
        const group = (label: string) => component.optionEls.map((o: HTMLOptionElement) => o.parentElement).find((g: HTMLElement | null) => (g as HTMLOptGroupElement | null)?.label === label);
        component.openGroup = group('Premium');
        await page.waitForChanges();

        const back = root.querySelector('.pds-combobox__group-back')!;
        expect(back.getAttribute('aria-disabled')).toBe('true');
        expect(back.classList.contains('pds-combobox__group-back--disabled')).toBe(true);

        component.openGroup = group('Contact');
        await page.waitForChanges();
        expect(root.querySelector('.pds-combobox__group-back')!.hasAttribute('aria-disabled')).toBe(false);
      });

      it('marks a group with nothing to choose, which the keys still reach and open', async () => {
        const { page, component, root } = await openList(actions, 'mode="select-only" trigger="button" group-display="flyout"');
        const rows = Array.from(root.querySelectorAll('.pds-combobox__group-row'));
        expect(rows.map(row => row.getAttribute('aria-disabled'))).toEqual([null, 'true', null]);

        expect(component.highlightedGroup?.label).toBe('Contact');
        key(component, 'ArrowDown');
        await page.waitForChanges();
        expect(component.highlightedGroup?.label).toBe('Premium');

        key(component, 'ArrowRight');
        await page.waitForChanges();
        expect(component.openGroup?.label).toBe('Premium');
        expect(component.highlightedIndex).toBe(3);
        key(component, 'Enter');
        expect(component.value).toBeFalsy();
        expect(component.isOpen).toBe(true);
      });

      it('opens on the first group with something to choose when the value is a disabled option', async () => {
        const page = await newSpecPage({
          components: [PdsCombobox],
          html: `<pds-combobox component-id="locked" mode="select-only" trigger="button" group-display="flyout" value="sms-send"></pds-combobox>`,
        });
        const component = page.rootInstance;
        (page.root as HTMLPdsComboboxElement).options = actions;
        await page.waitForChanges();
        component.isOpen = true;
        component.filterOptions();
        component.setInitialHighlightedIndex();
        await page.waitForChanges();

        expect(component.selectedOption?.value).toBe('sms-send');
        expect(component.openGroup).toBeNull();
        expect(component.highlightedGroup?.label).toBe('Contact');
      });

      it('opens on the first group with something to choose', async () => {
        const { component } = await openList(
          [{ id: 'sms-send', text: 'Send a text message', group: 'Premium', disabled: true }, ...actions.slice(4)],
          'mode="select-only" trigger="button" group-display="flyout"',
        );
        expect(component.highlightedGroup?.label).toBe('Email');
      });

      it('opens a disabled group on hover and highlights its row', async () => {
        const { page, component, root } = await openList(actions, 'mode="select-only" trigger="button" group-display="flyout"');
        const premium = root.querySelectorAll('.pds-combobox__group-row')[1];

        premium.dispatchEvent(new Event('mouseenter'));
        premium.querySelector('.pds-combobox__group-row-trigger')!.dispatchEvent(new Event('mouseenter'));
        await page.waitForChanges();

        expect(component.openGroup?.label).toBe('Premium');
        expect(component.highlightedGroup?.label).toBe('Premium');
        expect(root.querySelector('.pds-combobox__flyout [role="treeitem"]')?.getAttribute('aria-disabled')).toBe('true');
      });

      it('drills into a disabled group from the keyboard', async () => {
        const { page, component } = await openList(actions, 'mode="select-only" trigger="button" group-display="drill-in"');
        key(component, 'ArrowDown');
        key(component, 'ArrowRight');
        await page.waitForChanges();

        expect(component.openGroup?.label).toBe('Premium');
        expect(component.highlightedIndex).toBe(3);
      });
    });
  });

  describe('panel-search', () => {
    const actions = [
      { id: 'tag-add', text: 'Add a tag', group: 'Tag' },
      { id: 'tag-remove', text: 'Remove a tag', group: 'Tag' },
      { id: 'email-send', text: 'Send an email', group: 'Email' },
    ];

    const openWithSearch = async (attrs: string) => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="searchy" label="Action" ${attrs}></pds-combobox>`,
      });
      const component = page.rootInstance;
      (page.root as HTMLPdsComboboxElement).options = actions;
      await page.waitForChanges();
      component.isOpen = true;
      component.filterOptions();
      await page.waitForChanges();
      return { page, component, root: page.root!.shadowRoot! };
    };

    const search = (root: ShadowRoot) => root.querySelector('.pds-combobox__panel-search-input') as HTMLInputElement;
    const visibleValues = (component: { filteredItems: HTMLElement[] }) =>
      component.filteredItems.filter(i => i.tagName === 'OPTION').map(o => (o as HTMLOptionElement).value);

    it('puts a labelled search field above the options for the button trigger', async () => {
      const { root } = await openWithSearch(
        'trigger="button" panel-search search-placeholder="Search actions" search-options-label="Search actions"',
      );

      const panel = root.querySelector('.pds-combobox__listbox--with-search')!;
      expect(panel.querySelector('.pds-combobox__panel-search-input')?.getAttribute('placeholder')).toBe('Search actions');
      expect(search(root).getAttribute('aria-label')).toBe('Search actions');
      expect(search(root).getAttribute('aria-controls')).toBe('searchy-listbox');
      expect(panel.querySelector('ul[role="listbox"]')?.id).toBe('searchy-listbox');
    });

    it('ignores panel-search on the input trigger, which already searches', async () => {
      const { root } = await openWithSearch('panel-search');

      expect(search(root)).toBeNull();
      expect(root.querySelector('ul.pds-combobox__listbox[role="listbox"]')).not.toBeNull();
    });

    it('leaves the dropdown markup unchanged without panel-search', async () => {
      const { root } = await openWithSearch('trigger="button" mode="select-only"');

      expect(root.querySelector('.pds-combobox__listbox--with-search')).toBeNull();
      expect(root.querySelector('ul.pds-combobox__listbox[role="listbox"]')).not.toBeNull();
    });

    it('filters as you type, matching group labels in a grouped display', async () => {
      const { page, component, root } = await openWithSearch('trigger="button" panel-search group-display="flyout"');

      search(root).value = 'email';
      search(root).dispatchEvent(new Event('input'));
      await page.waitForChanges();
      expect(visibleValues(component)).toEqual(['email-send']);

      search(root).value = 'tag';
      search(root).dispatchEvent(new Event('input'));
      await page.waitForChanges();
      expect(visibleValues(component)).toEqual(['tag-add', 'tag-remove']);
      // Results are listed, not the group rows.
      expect(root.querySelector('.pds-combobox__group-row')).toBeNull();
    });

    it('filters a select-only button trigger too', async () => {
      const { page, component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search');

      search(root).value = 'remove';
      search(root).dispatchEvent(new Event('input'));
      await page.waitForChanges();

      expect(visibleValues(component)).toEqual(['tag-remove']);
    });

    it('types a space instead of selecting, and selects on Enter', async () => {
      const { page, component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search');

      component.highlightedIndex = 1;
      search(root).dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      await page.waitForChanges();
      expect(component.value).toBe('');

      search(root).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await page.waitForChanges();
      expect(component.value).toBe('tag-remove');
    });

    it('leaves Home and End to move the caret in the search field', async () => {
      const { page, component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search');

      component.highlightedIndex = 1;
      for (const key of ['Home', 'End']) {
        const event = new KeyboardEvent('keydown', { key, cancelable: true });
        search(root).dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      }
      await page.waitForChanges();
      expect(component.highlightedIndex).toBe(1);
    });

    it('keeps options out of the tab order, since focus stays in the search field', async () => {
      const { page, component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search');

      component.highlightedIndex = 0;
      await page.waitForChanges();

      expect(Array.from(root.querySelectorAll('[role="option"]')).map(o => o.getAttribute('tabindex'))).toEqual(['-1', '-1', '-1']);
    });

    it('refetches an empty query on reopen, rather than showing the last search\'s results', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="remote-reopen" trigger="button" mode="select-only" panel-search async-url="/api/actions"></pds-combobox>`,
      });
      const component = page.rootInstance;
      const fetch = jest.spyOn(component, 'debouncedFetchAsyncOptions').mockImplementation(() => undefined);
      component.internalOptions = [{ id: 'a', text: 'Add a tag' }];
      component.lastFetchedQuery = 'tag';

      (page.root!.shadowRoot!.querySelector('.pds-combobox__button-trigger') as HTMLElement).click();
      await page.waitForChanges();

      expect(fetch).toHaveBeenCalledWith('', 1);
    });

    it('starts refetching the empty query when it closes after a search', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="remote-close" trigger="button" mode="select-only" panel-search async-url="/api/actions"></pds-combobox>`,
      });
      const component = page.rootInstance;
      const fetch = jest.spyOn(component, 'debouncedFetchAsyncOptions').mockImplementation(() => undefined);
      component.internalOptions = [{ id: 'a', text: 'Add a tag' }];
      component.isOpen = true;
      await page.waitForChanges();
      component.lastFetchedQuery = 'tag';

      component.isOpen = false;
      await page.waitForChanges();

      expect(fetch).toHaveBeenCalledWith('', 1);
    });

    it('keeps the last loaded query when a refetch fails, so the next reopen tries again', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="remote-fail" trigger="button" mode="select-only" panel-search async-url="/api/actions"></pds-combobox>`,
      });
      const component = page.rootInstance;
      component.internalOptions = [{ id: 'a', text: 'Add a tag' }];
      component.lastFetchedQuery = 'tag';
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
      const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      try {
        await component.fetchOptions('', 1);
      } finally {
        global.fetch = originalFetch;
        error.mockRestore();
      }

      expect(component.lastFetchedQuery).toBe('tag');
    });

    it('places the dropdown again as the panel search filters the list', async () => {
      const { component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search');
      const place = jest.spyOn(component, 'openDropdownPositioning').mockImplementation(() => undefined);

      jest.useFakeTimers();
      try {
        search(root).value = 'tag';
        search(root).dispatchEvent(new Event('input'));
        jest.advanceTimersByTime(0);
      } finally {
        jest.useRealTimers();
      }

      expect(place).toHaveBeenCalled();
    });

    it('refetches an empty query on a keyboard reopen too', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="remote-reopen" trigger="button" mode="select-only" panel-search async-url="/api/actions"></pds-combobox>`,
      });
      const component = page.rootInstance;
      const fetch = jest.spyOn(component, 'debouncedFetchAsyncOptions').mockImplementation(() => undefined);
      component.internalOptions = [{ id: 'a', text: 'Add a tag' }];
      component.lastFetchedQuery = 'tag';

      const trigger = page.root!.shadowRoot!.querySelector('.pds-combobox__button-trigger') as HTMLElement;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      await page.waitForChanges();

      expect(component.isOpen).toBe(true);
      expect(fetch).toHaveBeenCalledWith('', 1);
    });

    it('emits an empty search when closing clears what was typed in the panel', async () => {
      const { page, component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search debounce="0"');
      const searched = jest.fn();
      page.root!.addEventListener('pdsComboboxSearch', searched);

      jest.useFakeTimers();
      try {
        search(root).value = 'tag';
        search(root).dispatchEvent(new Event('input'));
        component.isOpen = false;
        jest.advanceTimersByTime(0);
      } finally {
        jest.useRealTimers();
      }

      expect(searched.mock.calls[searched.mock.calls.length - 1]?.[0].detail.query).toBe('');
      expect(component.panelQuery).toBe('');
    });

    it('keeps focus in the search field when the panel\'s padding is pressed', async () => {
      const { root } = await openWithSearch('trigger="button" mode="select-only" panel-search');
      const panel = root.querySelector('.pds-combobox__listbox--with-search')!;

      const onPanel = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      panel.dispatchEvent(onPanel);
      const onField = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      search(root).dispatchEvent(onField);

      expect(onPanel.defaultPrevented).toBe(true);
      expect(onField.defaultPrevented).toBe(false);
    });

    it('fetches from async-url as you type in the panel, and loads more for that query', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="remote" trigger="button" mode="select-only" panel-search async-url="/api/actions"></pds-combobox>`,
      });
      const component = page.rootInstance;
      const fetchSpy = jest.spyOn(component, 'debouncedFetchAsyncOptions').mockImplementation(() => undefined);
      component.isOpen = true;
      await page.waitForChanges();

      const input = page.root!.shadowRoot!.querySelector('.pds-combobox__panel-search-input') as HTMLInputElement;
      input.value = 'tag';
      input.dispatchEvent(new Event('input'));
      expect(fetchSpy).toHaveBeenCalledWith('tag', 1);

      component.hasMore = true;
      component.currentPage = 1;
      component.handleScroll({ target: { scrollHeight: 100, scrollTop: 90, clientHeight: 10 } } as unknown as Event);
      expect(fetchSpy).toHaveBeenLastCalledWith('tag', 2);
    });

    it('stays open when focus moves to the trigger inside the shadow root', async () => {
      const { component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search');

      const trigger = root.querySelector('[part="button-trigger"]') as HTMLElement;
      component.onComboboxFocusOut({ relatedTarget: trigger } as unknown as FocusEvent);

      expect(component.isOpen).toBe(true);
    });

    it('puts aria-activedescendant on the search field, not the trigger', async () => {
      const { page, component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search');

      component.highlightedIndex = 2;
      await page.waitForChanges();

      expect(search(root).getAttribute('aria-activedescendant')).toBe('searchy-option-2');
      expect(root.querySelector('[part="button-trigger"]')!.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('clears the search when the dropdown closes', async () => {
      const { page, component, root } = await openWithSearch('trigger="button" mode="select-only" panel-search');

      search(root).value = 'remove';
      search(root).dispatchEvent(new Event('input'));
      await page.waitForChanges();
      component.isOpen = false;
      await page.waitForChanges();

      expect(component.panelQuery).toBe('');
    });
  });

  describe('dropdownMount body', () => {
    afterEach(() => {
      document.querySelectorAll('.pds-combobox-dropdown-portal').forEach(el => el.remove());
    });

    it('renders the listbox in document.body when open', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="portal-combobox" dropdown-mount="body" label="Pick">
          <option value="a">A</option>
          <option value="b">B</option>
        </pds-combobox>`,
      });

      const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input?.getAttribute('aria-controls')).toBe('portal-combobox-listbox');
      expect(document.querySelector('.pds-combobox-dropdown-portal')).toBeNull();

      input?.click();
      await page.waitForChanges();

      const portal = document.querySelector('.pds-combobox-dropdown-portal');
      expect(portal).not.toBeNull();
      const listbox = portal?.querySelector('ul[role="listbox"]');
      expect(listbox?.id).toBe('portal-combobox-listbox');
      expect(page.root?.shadowRoot?.querySelector('ul[role="listbox"]')).toBeNull();
    });

    it('appends the portal inside an open dialog ancestor when present', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<dialog open>
          <pds-combobox component-id="portal-in-dialog" dropdown-mount="body" label="Pick">
            <option value="a">A</option>
          </pds-combobox>
        </dialog>`,
      });

      const dialog = page.doc.querySelector('dialog');
      const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await page.waitForChanges();

      const portal = dialog?.querySelector('.pds-combobox-dropdown-portal');
      expect(portal).not.toBeNull();
      expect(portal?.parentElement === dialog).toBe(true);
    });

    it('appends the portal inside pds-modal native dialog (nested slots / shadow)', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox, PdsModal],
        html: `<pds-modal component-id="cb-portal-modal" open="false">
          <pds-combobox component-id="cb-in-pine-modal" dropdown-mount="body" label="Pick">
            <option value="a">A</option>
          </pds-combobox>
        </pds-modal>`,
      });

      const modal = page.doc.querySelector('pds-modal');
      const dialog = modal?.querySelector('dialog');
      expect(dialog).not.toBeNull();

      const combobox = page.doc.querySelector('pds-combobox');
      const input = combobox?.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await page.waitForChanges();

      const portal = dialog?.querySelector('.pds-combobox-dropdown-portal');
      expect(portal).not.toBeNull();
      expect(portal?.parentElement === dialog).toBe(true);
    });

    it('does not leave duplicate listboxes in the portal on rapid reopen', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="portal-rapid" dropdown-mount="body" label="Pick">
          <option value="a">A</option>
        </pds-combobox>`,
      });

      const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
      const component = page.rootInstance as PdsCombobox;

      input?.click();
      await page.waitForChanges();

      component.isOpen = false;
      await page.waitForChanges();
      component.isOpen = true;
      await page.waitForChanges();

      const portal = document.querySelector('.pds-combobox-dropdown-portal');
      const listboxes = portal?.querySelectorAll('ul[role="listbox"]');
      expect(listboxes?.length).toBe(1);
    });

    it('removes the portal container when the dropdown closes', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="portal-combobox-2" dropdown-mount="body" label="Pick">
          <option value="a">A</option>
        </pds-combobox>`,
      });

      const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await page.waitForChanges();
      expect(document.querySelector('.pds-combobox-dropdown-portal')).not.toBeNull();

      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await page.waitForChanges();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(document.querySelector('.pds-combobox-dropdown-portal')).toBeNull();
    });

    it('renders the listbox in document.body for button trigger', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="portal-button" dropdown-mount="body" trigger="button" label="Pick">
          <option value="a">A</option>
        </pds-combobox>`,
      });

      const trigger = page.root?.shadowRoot?.querySelector('.pds-combobox__button-trigger') as HTMLElement;
      trigger?.click();
      await page.waitForChanges();

      expect(document.querySelector('.pds-combobox-dropdown-portal ul[role="listbox"]')).not.toBeNull();
    });

    it('starts body portal autoUpdate once per open', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="portal-autoupdate" dropdown-mount="body" label="Pick">
          <option value="a">A</option>
          <option value="b">B</option>
        </pds-combobox>`,
      });

      const component = page.rootInstance as PdsCombobox;
      const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await page.waitForChanges();

      expect((component as any).bodyPortalAutoUpdateActive).toBe(true);

      component.displayText = 'a';
      await page.waitForChanges();

      expect((component as any).bodyPortalAutoUpdateActive).toBe(true);
    });

    it('does not re-mount the listbox on re-render while open', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="portal-stable" dropdown-mount="body" label="Pick">
          <option value="a">A</option>
          <option value="b">B</option>
        </pds-combobox>`,
      });

      const component = page.rootInstance as PdsCombobox;
      const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await page.waitForChanges();

      const listbox = document.querySelector('.pds-combobox-dropdown-portal ul[role="listbox"]');
      component.displayText = 'a';
      await page.waitForChanges();

      expect(document.querySelector('.pds-combobox-dropdown-portal ul[role="listbox"]') === listbox).toBe(true);
    });

    it('removes the portal when the component disconnects while open', async () => {
      const page = await newSpecPage({
        components: [PdsCombobox],
        html: `<pds-combobox component-id="portal-unmount" dropdown-mount="body" label="Pick">
          <option value="a">A</option>
        </pds-combobox>`,
      });

      const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await page.waitForChanges();
      expect(document.querySelector('.pds-combobox-dropdown-portal')).not.toBeNull();

      page.root?.parentNode?.removeChild(page.root);
      await page.waitForChanges();

      expect(document.querySelector('.pds-combobox-dropdown-portal')).toBeNull();
    });
  });
});

describe('pds-combobox validation messages', () => {
  const render = async (attrs: string) => {
    const { root } = await newSpecPage({
      components: [PdsCombobox],
      html: `<pds-combobox component-id="cb" ${attrs}></pds-combobox>`,
    });

    const shadow = root.shadowRoot;
    const trigger = shadow.querySelector('[role="combobox"]');

    return {
      shadow,
      trigger,
      describedBy: trigger.getAttribute('aria-describedby'),
      ariaInvalid: trigger.getAttribute('aria-invalid'),
      describedText: (id: string) => shadow.querySelector(`#${id}`)?.textContent,
    };
  };

  it('renders the error message with an id the trigger can reference', async () => {
    const { shadow, describedBy, ariaInvalid, describedText } = await render(
      'invalid error-message="Please choose one"'
    );

    expect(shadow.querySelector('.pds-combobox__error')).toBeTruthy();
    expect(describedBy).toBe('cb__error-message');
    expect(ariaInvalid).toBe('true');
    expect(describedText(describedBy)).toContain('Please choose one');
  });

  it('treats an error message on its own as an invalid state', async () => {
    const { describedBy, ariaInvalid } = await render('error-message="Please choose one"');

    expect(describedBy).toBe('cb__error-message');
    expect(ariaInvalid).toBe('true');
  });

  it('renders the helper message and describes it when valid', async () => {
    const { shadow, describedBy, ariaInvalid, describedText } = await render(
      'helper-message="Start typing to filter"'
    );

    expect(shadow.querySelector('.pds-combobox__helper')).toBeTruthy();
    expect(describedBy).toBe('cb__helper-message');
    expect(ariaInvalid).toBeNull();
    expect(describedText(describedBy)).toContain('Start typing to filter');
  });

  it('hides the helper message while an error message is shown', async () => {
    const { shadow, describedBy } = await render(
      'invalid helper-message="Start typing" error-message="Required"'
    );

    expect(shadow.querySelector('.pds-combobox__helper')).toBeNull();
    expect(shadow.querySelector('.pds-combobox__error')).toBeTruthy();
    expect(describedBy).toBe('cb__error-message');
  });

  it('describes nothing and is not invalid without messages', async () => {
    const { shadow, describedBy, ariaInvalid } = await render('label="Country"');

    expect(shadow.querySelector('.pds-combobox__helper')).toBeNull();
    expect(shadow.querySelector('.pds-combobox__error')).toBeNull();
    expect(describedBy).toBeNull();
    expect(ariaInvalid).toBeNull();
  });

  it('applies the invalid modifier to the input trigger', async () => {
    const { trigger } = await render('invalid error-message="Required"');

    expect(trigger.classList.contains('pds-combobox__input--invalid')).toBe(true);
  });

  it('does not apply the invalid modifier when valid', async () => {
    const { trigger } = await render('helper-message="Pick one"');

    expect(trigger.classList.contains('pds-combobox__input--invalid')).toBe(false);
  });

  it.each(['input', 'button', 'chip'])('wires the error association on the %s trigger', async (trigger) => {
    const { describedBy, ariaInvalid, describedText } = await render(
      `trigger="${trigger}" invalid error-message="Required"`
    );

    expect(describedBy).toBe('cb__error-message');
    expect(ariaInvalid).toBe('true');
    expect(describedText(describedBy)).toContain('Required');
  });
});
