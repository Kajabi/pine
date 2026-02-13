import { newSpecPage } from '@stencil/core/testing';
import { PdsMultiselect } from '../pds-multiselect';

// Mock MutationObserver for testing environment
if (typeof MutationObserver === 'undefined') {
  (global as any).MutationObserver = class {
    observe() {}
    disconnect() {}
  };
}

// Capture original fetch for cleanup
const originalFetch = global.fetch;

describe('pds-multiselect', () => {
  afterEach(() => {
    // Restore original fetch and clean up all mocks after each test
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });
  it('renders with label', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" label="Select Tags"></pds-multiselect>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.pds-multiselect__label')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.pds-multiselect__label').textContent).toBe('Select Tags');
  });

  it('renders trigger with placeholder when no selections', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" placeholder="Select..."></pds-multiselect>`,
    });

    const triggerText = page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text');
    expect(triggerText.textContent).toBe('Select...');
    expect(triggerText.classList.contains('pds-multiselect__trigger-text--placeholder')).toBe(true);
  });

  it('renders trigger with count when selections exist', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    page.rootInstance.value = ['1', '2'];
    page.rootInstance.internalOptions = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
      { id: '3', text: 'Option 3' },
    ];
    await page.waitForChanges();

    const triggerText = page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text');
    expect(triggerText.textContent).toBe('2 items');
    expect(triggerText.classList.contains('pds-multiselect__trigger-text--placeholder')).toBe(false);
  });

  it('renders "1 item" for single selection', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    page.rootInstance.value = ['1'];
    page.rootInstance.internalOptions = [
      { id: '1', text: 'Option 1' },
    ];
    await page.waitForChanges();

    const triggerText = page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text');
    expect(triggerText.textContent).toBe('1 item');
  });

  it('renders with proper ARIA attributes on trigger', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" label="Test"></pds-multiselect>`,
    });

    const trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders static options from slot', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `
        <pds-multiselect component-id="test">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </pds-multiselect>
      `,
    });

    expect(page.root).toBeTruthy();
  });

  it('renders disabled state', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" disabled></pds-multiselect>`,
    });

    expect(page.root.getAttribute('aria-disabled')).toBe('true');
    const trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
    expect(trigger.classList.contains('pds-multiselect__trigger--disabled')).toBe(true);
  });

  it('renders error message', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" error-message="This is required" invalid></pds-multiselect>`,
    });

    const error = page.root.shadowRoot.querySelector('.pds-multiselect__error');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('This is required');
  });

  it('renders helper message', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" helper-message="Select one or more"></pds-multiselect>`,
    });

    const helper = page.root.shadowRoot.querySelector('.pds-multiselect__helper');
    expect(helper).toBeTruthy();
    expect(helper.textContent).toBe('Select one or more');
  });

  it('hides label visually when hideLabel is true', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" label="Hidden Label" hide-label></pds-multiselect>`,
    });

    const label = page.root.shadowRoot.querySelector('.pds-multiselect__label');
    expect(label.classList.contains('visually-hidden')).toBe(true);
  });

  it('parses JSON string value from HTML attribute', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" value='["1", "2"]'></pds-multiselect>`,
    });

    page.rootInstance.internalOptions = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
      { id: '3', text: 'Option 3' },
    ];
    await page.waitForChanges();

    // Value should be parsed from JSON string to array
    expect(Array.isArray(page.rootInstance.value)).toBe(true);
    expect(page.rootInstance.value).toEqual(['1', '2']);

    // Trigger should show count
    const triggerText = page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text');
    expect(triggerText.textContent).toBe('2 items');
  });

  it('emits pdsMultiselectChange when selection changes', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    const changeSpy = jest.fn();
    page.root.addEventListener('pdsMultiselectChange', changeSpy);

    page.rootInstance.internalOptions = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
    ];
    await page.waitForChanges();

    // Simulate selecting an option
    page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalled();
    expect(changeSpy.mock.calls[0][0].detail.values).toEqual(['1']);
  });

  it('toggles option selection', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    const changeSpy = jest.fn();
    page.root.addEventListener('pdsMultiselectChange', changeSpy);

    page.rootInstance.internalOptions = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
    ];
    await page.waitForChanges();

    // Select option
    page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
    await page.waitForChanges();

    expect(changeSpy.mock.calls[0][0].detail.values).toEqual(['1']);

    // Deselect the same option
    page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
    await page.waitForChanges();

    expect(changeSpy.mock.calls[1][0].detail.values).toEqual([]);
  });

  it('respects maxSelections limit', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" max-selections="2"></pds-multiselect>`,
    });

    page.rootInstance.value = ['1', '2'];
    page.rootInstance.internalOptions = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
      { id: '3', text: 'Option 3' },
    ];
    page.rootInstance.selectedItems = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 2' },
    ];
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root.addEventListener('pdsMultiselectChange', changeSpy);

    // Try to select a third option (should not work)
    page.rootInstance.toggleOption({ id: '3', text: 'Option 3' });
    await page.waitForChanges();

    // Should not emit change event since max is reached
    expect(changeSpy).not.toHaveBeenCalled();
  });

  it('filters options based on search query', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    page.rootInstance.internalOptions = [
      { id: '1', text: 'Apple' },
      { id: '2', text: 'Banana' },
      { id: '3', text: 'Cherry' },
    ];
    page.rootInstance.searchQuery = 'app';
    await page.waitForChanges();

    const filtered = page.rootInstance.getFilteredOptions();
    expect(filtered.length).toBe(1);
    expect(filtered[0].text).toBe('Apple');
  });

  it('includes selected items in filtered options', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    page.rootInstance.value = ['1'];
    page.rootInstance.internalOptions = [
      { id: '1', text: 'Apple' },
      { id: '2', text: 'Banana' },
    ];
    page.rootInstance.selectedItems = [{ id: '1', text: 'Apple' }];
    await page.waitForChanges();

    // Get filtered options - should include the selected item
    const filteredOptions = page.rootInstance.getFilteredOptions();
    expect(filteredOptions.length).toBe(2);
    expect(filteredOptions.find(opt => opt.id === '1')).toBeTruthy();
  });

  it('sets focus on trigger when setFocus is called', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    const trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger') as HTMLButtonElement;
    const focusSpy = jest.spyOn(trigger, 'focus');

    await page.rootInstance.setFocus();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('accepts options via prop', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    page.rootInstance.options = [
      { id: '1', text: 'External Option 1' },
      { id: '2', text: 'External Option 2' },
    ];
    await page.waitForChanges();

    expect(page.rootInstance.internalOptions.length).toBe(2);
    expect(page.rootInstance.internalOptions[0].text).toBe('External Option 1');
  });

  describe('keyboard navigation', () => {
    it('closes dropdown on Escape key', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];

      // Open dropdown
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(true);

      // Simulate Escape key via global window handler
      page.rootInstance.handleWindowKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('does not close dropdown on Escape when already closed', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      expect(page.rootInstance.isOpen).toBe(false);

      // Simulate Escape key - should not throw
      page.rootInstance.handleWindowKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('navigates options with ArrowDown key', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
        { id: '3', text: 'Option 3' },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.highlightedIndex = -1;
      await page.waitForChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
      page.rootInstance.handleSearchInputKeyDown(event);
      await page.waitForChanges();

      expect(page.rootInstance.highlightedIndex).toBe(0);
    });

    it('navigates options with ArrowUp key', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
        { id: '3', text: 'Option 3' },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.highlightedIndex = 2;
      await page.waitForChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
      page.rootInstance.handleSearchInputKeyDown(event);
      await page.waitForChanges();

      expect(page.rootInstance.highlightedIndex).toBe(1);
    });

    it('selects highlighted option on Enter key', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.highlightedIndex = 0;
      await page.waitForChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(event, 'preventDefault', { value: jest.fn() });
      page.rootInstance.handleSearchInputKeyDown(event);
      await page.waitForChanges();

      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.mock.calls[0][0].detail.values).toContain('1');
    });

    it('closes dropdown on Tab key', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      page.rootInstance.handleSearchInputKeyDown(event);
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });
  });

  describe('dropdown behavior', () => {
    it('opens dropdown on trigger click', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      expect(page.rootInstance.isOpen).toBe(false);

      page.rootInstance.handleTriggerClick();
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('closes dropdown on second trigger click', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      page.rootInstance.handleTriggerClick();
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('does not open dropdown when disabled', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" disabled></pds-multiselect>`,
      });

      expect(page.rootInstance.isOpen).toBe(false);

      page.rootInstance.handleTriggerClick();
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('renders search input in dropdown panel', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const searchInput = page.root.shadowRoot.querySelector('.pds-multiselect__search-input');
      expect(searchInput).toBeTruthy();
      expect(searchInput.getAttribute('placeholder')).toBe('Find...');
    });

    it('renders selected items list at top of panel', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
        { id: '3', text: 'Option 3' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const selectedSection = page.root.shadowRoot.querySelector('.pds-multiselect__selected-section');
      expect(selectedSection).toBeTruthy();

      const selectedItems = page.root.shadowRoot.querySelectorAll('.pds-multiselect__selected-item');
      expect(selectedItems.length).toBe(2);
    });

    it('does not render selected items section when no selections', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.value = [];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const selectedSection = page.root.shadowRoot.querySelector('.pds-multiselect__selected-section');
      expect(selectedSection).toBeNull();
    });

    it('does not render selected items section when hideSelectedItems is true', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" hide-selected-items></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
        { id: '3', text: 'Option 3' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const selectedSection = page.root.shadowRoot.querySelector('.pds-multiselect__selected-section');
      expect(selectedSection).toBeNull();
    });

    it('still emits pdsMultiselectChange when hideSelectedItems is true', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" hide-selected-items></pds-multiselect>`,
      });

      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();

      page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
      await page.waitForChanges();

      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.mock.calls[0][0].detail.values).toEqual(['1']);
    });
  });

  describe('required validation', () => {
    it('renders with required attribute', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" required></pds-multiselect>`,
      });

      const trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger') as HTMLButtonElement;
      expect(trigger.getAttribute('aria-required')).toBe('true');
    });

    it('does not have required attribute when not set', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger') as HTMLButtonElement;
      expect(trigger.getAttribute('aria-required')).toBeNull();
    });

    it('is valid when required and has selections', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" required></pds-multiselect>`,
      });

      // Add a selection
      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.selectedItems = [{ id: '1', text: 'Option 1' }];
      await page.waitForChanges();

      // Should have selection
      expect(page.rootInstance.value.length).toBe(1);
    });
  });

  describe('trigger states', () => {
    it('trigger has has-value class when selections exist', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      // No selections initially
      let trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
      expect(trigger.classList.contains('pds-multiselect__trigger--has-value')).toBe(false);

      // Add selection
      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.selectedItems = [{ id: '1', text: 'Option 1' }];
      await page.waitForChanges();

      trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
      expect(trigger.classList.contains('pds-multiselect__trigger--has-value')).toBe(true);
    });

    it('trigger has open class when dropdown is open', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      let trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
      expect(trigger.classList.contains('pds-multiselect__trigger--open')).toBe(false);

      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
      expect(trigger.classList.contains('pds-multiselect__trigger--open')).toBe(true);
    });
  });

  describe('preselected values with slot options', () => {
    it('syncs selected items when internalOptions changes', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      // Set value before options are available (simulating race condition)
      page.rootInstance.value = ['1', '2'];
      await page.waitForChanges();

      // Initially no selected items because options aren't loaded
      expect(page.rootInstance.selectedItems.length).toBe(0);

      // Now options become available (simulating slot content load)
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
        { id: '3', text: 'Option 3' },
      ];
      await page.waitForChanges();

      // @Watch('internalOptions') should have triggered syncSelectedItems
      expect(page.rootInstance.selectedItems.length).toBe(2);
      expect(page.rootInstance.selectedItems[0].text).toBe('Option 1');
      expect(page.rootInstance.selectedItems[1].text).toBe('Option 2');
    });
  });

  describe('loading and empty states', () => {
    it('renders loading state', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.loading = true;
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const loadingEl = page.root.shadowRoot.querySelector('.pds-multiselect__loading');
      expect(loadingEl).toBeTruthy();
    });

    it('renders empty state when no options match', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [];
      page.rootInstance.isOpen = true;
      page.rootInstance.loading = false;
      await page.waitForChanges();

      const emptyEl = page.root.shadowRoot.querySelector('.pds-multiselect__empty');
      expect(emptyEl).toBeTruthy();
      expect(emptyEl.textContent).toContain('No options found');
    });
  });

  describe('checkbox states in options', () => {
    it('renders checked checkbox for selected options', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      page.rootInstance.selectedItems = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const options = page.root.shadowRoot.querySelectorAll('.pds-multiselect__option');
      expect(options.length).toBe(2);

      // First option should be selected
      expect(options[0].classList.contains('pds-multiselect__option--selected')).toBe(true);
      expect(options[0].getAttribute('aria-selected')).toBe('true');

      // Second option should not be selected
      expect(options[1].classList.contains('pds-multiselect__option--selected')).toBe(false);
      expect(options[1].getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('searchPlaceholder prop', () => {
    it('uses custom search placeholder text', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" search-placeholder="Search offers..."></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const searchInput = page.root.shadowRoot.querySelector('.pds-multiselect__search-input');
      expect(searchInput.getAttribute('placeholder')).toBe('Search offers...');
    });

    it('defaults to Find... when searchPlaceholder is not set', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const searchInput = page.root.shadowRoot.querySelector('.pds-multiselect__search-input');
      expect(searchInput.getAttribute('placeholder')).toBe('Find...');
    });
  });

  describe('pdsMultiselectDismiss event', () => {
    it('emits dismiss event on Escape key', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const dismissSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectDismiss', dismissSpy);

      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      page.rootInstance.handleWindowKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
      await page.waitForChanges();

      expect(dismissSpy).toHaveBeenCalled();
      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('does not emit dismiss event when dropdown is already closed', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const dismissSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectDismiss', dismissSpy);

      page.rootInstance.handleWindowKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
      await page.waitForChanges();

      expect(dismissSpy).not.toHaveBeenCalled();
    });

    it('emits dismiss event on focus out (click outside)', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const dismissSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectDismiss', dismissSpy);

      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      // Simulate focus leaving the component (click outside)
      page.rootInstance.handleContainerFocusOut();

      // Wait for setTimeout in handleContainerFocusOut
      await new Promise(resolve => setTimeout(resolve, 10));
      await page.waitForChanges();

      expect(dismissSpy).toHaveBeenCalled();
      expect(page.rootInstance.isOpen).toBe(false);
    });
  });

  describe('closePanelOnSelect prop', () => {
    it('keeps panel open by default', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('closes panel when closePanelOnSelect is true', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" close-panel-on-select="true"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('does not emit dismiss event when panel closes via selection with closePanelOnSelect', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" close-panel-on-select="true"></pds-multiselect>`,
      });

      const dismissSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectDismiss', dismissSpy);

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      // Select an option - panel should close but dismiss event should NOT fire
      page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
      expect(dismissSpy).not.toHaveBeenCalled();
    });
  });

  describe('clear method', () => {
    it('clears all selected values', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      page.rootInstance.selectedItems = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();

      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      await page.rootInstance.clear();
      await page.waitForChanges();

      expect(page.rootInstance.value).toEqual([]);
      expect(page.rootInstance.searchQuery).toBe('');
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.mock.calls[0][0].detail.values).toEqual([]);
      expect(changeSpy.mock.calls[0][0].detail.items).toEqual([]);
    });

    it('resets trigger text to placeholder after clear', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" placeholder="Pick one..."></pds-multiselect>`,
      });

      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      await page.waitForChanges();

      await page.rootInstance.clear();
      await page.waitForChanges();

      const triggerText = page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text');
      expect(triggerText.textContent).toBe('Pick one...');
    });
  });

  describe('create option functionality', () => {
    it('should show create option when createUrl is set and no matches found', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Marketing' },
        { id: '2', text: 'Sales' },
      ];
      page.rootInstance.searchQuery = 'NewTag';
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const options = page.root.shadowRoot.querySelectorAll('.pds-multiselect__option');
      expect(options.length).toBe(1);
      expect(options[0].classList.contains('pds-multiselect__option--create')).toBe(true);
      expect(options[0].textContent).toContain('Add "NewTag"');
    });

    it('should not show create option when createUrl is not set', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Marketing' },
      ];
      page.rootInstance.searchQuery = 'NewTag';
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const emptyEl = page.root.shadowRoot.querySelector('.pds-multiselect__empty');
      expect(emptyEl).toBeTruthy();
      expect(emptyEl.textContent).toContain('No options found');
    });

    it('should not show create option when query is empty', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [];
      page.rootInstance.searchQuery = '';
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const emptyEl = page.root.shadowRoot.querySelector('.pds-multiselect__empty');
      expect(emptyEl).toBeTruthy();
    });

    it('should not show create option when query is only whitespace', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [];
      page.rootInstance.searchQuery = '   ';
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const emptyEl = page.root.shadowRoot.querySelector('.pds-multiselect__empty');
      expect(emptyEl).toBeTruthy();
    });

    it('should POST to createUrl when create option is clicked', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '3', text: 'NewTag' }),
        })
      );
      global.fetch = mockFetch as any;

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      page.rootInstance.searchQuery = 'NewTag';
      page.rootInstance.internalOptions = [];

      // Call createOption directly
      await page.rootInstance['createOption']('NewTag');
      await page.waitForChanges();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tags'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ text: 'NewTag' }),
        })
      );
    });

    it('should add newly created option to the list and select it', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '3', text: 'NewTag' }),
        })
      );
      global.fetch = mockFetch as any;

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Marketing' },
        { id: '2', text: 'Sales' },
      ];

      await page.rootInstance['createOption']('NewTag');
      await page.waitForChanges();

      expect(page.rootInstance.internalOptions.length).toBe(3);
      expect(page.rootInstance.internalOptions[2].text).toBe('NewTag');
      expect(page.rootInstance.value).toContain('3');
    });

    it('should emit pdsMultiselectCreate event on successful creation', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '3', text: 'NewTag' }),
        })
      );
      global.fetch = mockFetch as any;

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      const createSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectCreate', createSpy);

      await page.rootInstance['createOption']('NewTag');
      await page.waitForChanges();

      expect(createSpy).toHaveBeenCalled();
      expect(createSpy.mock.calls[0][0].detail).toEqual({
        query: 'NewTag',
        newOption: expect.objectContaining({
          id: '3',
          text: 'NewTag',
        }),
      });
    });

    it('should emit pdsMultiselectChange event after creation', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '3', text: 'NewTag' }),
        })
      );
      global.fetch = mockFetch as any;

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      await page.rootInstance['createOption']('NewTag');
      await page.waitForChanges();

      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.mock.calls[0][0].detail.values).toContain('3');
    });

    it('should show loading state during creation', async () => {
      let resolveCreate;
      const mockFetch = jest.fn(() =>
        new Promise(resolve => {
          resolveCreate = () =>
            resolve({
              ok: true,
              json: () => Promise.resolve({ id: '3', text: 'NewTag' }),
            });
        })
      );
      global.fetch = mockFetch as any;

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      const createPromise = page.rootInstance['createOption']('NewTag');
      await page.waitForChanges();

      expect(page.rootInstance.creating).toBe(true);

      resolveCreate();
      await createPromise;
      await page.waitForChanges();

      expect(page.rootInstance.creating).toBe(false);
    });

    it('should handle create request failures gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      );
      global.fetch = mockFetch as any;

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      await page.rootInstance['createOption']('NewTag');
      await page.waitForChanges();

      expect(consoleSpy).toHaveBeenCalledWith(
        'PdsMultiselect: Failed to create option',
        expect.any(Error)
      );
      expect(page.rootInstance.creating).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should clear search query after successful creation', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '3', text: 'NewTag' }),
        })
      );
      global.fetch = mockFetch as any;

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      page.rootInstance.searchQuery = 'NewTag';
      await page.rootInstance['createOption']('NewTag');
      await page.waitForChanges();

      expect(page.rootInstance.searchQuery).toBe('');
    });

    it('should trim whitespace from query before creating', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: '3', text: 'NewTag' }),
        })
      );
      global.fetch = mockFetch as any;

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      await page.rootInstance['createOption']('  NewTag  ');
      await page.waitForChanges();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tags'),
        expect.objectContaining({
          body: JSON.stringify({ text: 'NewTag' }),
        })
      );
    });

    it('should have proper accessibility attributes on create option', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags"></pds-multiselect>`,
      });

      page.rootInstance.searchQuery = 'NewTag';
      page.rootInstance.internalOptions = [];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const createOption = page.root.shadowRoot.querySelector('.pds-multiselect__option--create');
      expect(createOption).toBeTruthy();
      expect(createOption.getAttribute('aria-label')).toBe('Create new tag: NewTag');
      expect(createOption.getAttribute('role')).toBe('option');
    });
  });

});
