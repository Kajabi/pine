import { newSpecPage } from '@stencil/core/testing';
import { PdsButton } from '../../pds-button/pds-button';
import { PdsMultiselect } from '../pds-multiselect';

// Mock MutationObserver for testing environment
if (typeof MutationObserver === 'undefined') {
  (global as any).MutationObserver = class {
    observe() {}
    disconnect() {}
  };
}

// Spy on the required module: jest.mock() factories don't intercept in Stencil's spec runtime.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const floatingUI = require('@floating-ui/dom');

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

    it('positions the panel with the fixed strategy so scrolling ancestors do not clip it', async () => {
      const computePositionSpy = jest
        .spyOn(floatingUI, 'computePosition')
        .mockResolvedValue({ x: 10, y: 20, placement: 'bottom-start' });
      jest.spyOn(floatingUI, 'autoUpdate').mockReturnValue(jest.fn());

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      page.rootInstance.positionDropdown();
      await page.waitForChanges();

      expect(computePositionSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ strategy: 'fixed' }),
      );

      const panel = page.root.shadowRoot.querySelector('.pds-multiselect__panel') as HTMLElement;
      expect(panel.style.left).toBe('10px');
      expect(panel.style.top).toBe('20px');
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

  describe('grouped options', () => {
    it('renders group headers when options have a group property', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Classical Guitar', group: 'Courses' },
        { id: '2', text: 'Piano Lessons', group: 'Courses' },
        { id: '3', text: 'Newsletter 1', group: 'Newsletters' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const headers = page.root.shadowRoot.querySelectorAll('.pds-multiselect__group-header');
      expect(headers.length).toBe(2);
      expect(headers[0].textContent).toBe('Courses');
      expect(headers[1].textContent).toBe('Newsletters');
    });

    it('group wrapper is role="group" with aria-label; inner ul is presentation; header is aria-hidden', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option A', group: 'Group 1' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const groupWrapper = page.root.shadowRoot.querySelector('.pds-multiselect__group');
      expect(groupWrapper.getAttribute('role')).toBe('group');
      expect(groupWrapper.getAttribute('aria-label')).toBe('Group 1');

      const header = page.root.shadowRoot.querySelector('.pds-multiselect__group-header');
      expect(header.getAttribute('aria-hidden')).toBe('true');

      const groupList = page.root.shadowRoot.querySelector('.pds-multiselect__group-list');
      expect(groupList.getAttribute('role')).toBe('presentation');
      expect(groupList.getAttribute('aria-label')).toBeNull();
    });

    it('creates separate group headers for the same label when options are not contiguous', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'A in Group X', group: 'Group X' },
        { id: '2', text: 'B in Other', group: 'Other' },
        { id: '3', text: 'C in Group X again', group: 'Group X' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const headers = page.root.shadowRoot.querySelectorAll('.pds-multiselect__group-header');
      expect(headers.length).toBe(3);
      expect(headers[0].textContent).toBe('Group X');
      expect(headers[1].textContent).toBe('Other');
      expect(headers[2].textContent).toBe('Group X');
    });

    it('does not render group headers when options have no group property', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option A' },
        { id: '2', text: 'Option B' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const headers = page.root.shadowRoot.querySelectorAll('.pds-multiselect__group-header');
      expect(headers.length).toBe(0);
    });

    it('hides group headers for groups with no matching options when filtering', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Classical Guitar', group: 'Courses' },
        { id: '2', text: 'Newsletter 1', group: 'Newsletters' },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.searchQuery = 'Newsletter';
      await page.waitForChanges();

      const headers = page.root.shadowRoot.querySelectorAll('.pds-multiselect__group-header');
      expect(headers.length).toBe(1);
      expect(headers[0].textContent).toBe('Newsletters');
    });

    it('renders options with groups alongside options without groups', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Ungrouped Option' },
        { id: '2', text: 'Grouped Option', group: 'Group A' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const headers = page.root.shadowRoot.querySelectorAll('.pds-multiselect__group-header');
      const options = page.root.shadowRoot.querySelectorAll('.pds-multiselect__option');
      expect(headers.length).toBe(1);
      expect(options.length).toBe(2);
    });

    it('options from an optgroup with no label are rendered as flat ungrouped options', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      // Simulate updateOptionsFromSlot result for an optgroup with empty label
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option A' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      // No group header should render, and the option is available as flat
      const headers = page.root.shadowRoot.querySelectorAll('.pds-multiselect__group-header');
      expect(headers.length).toBe(0);

      const options = page.root.shadowRoot.querySelectorAll('.pds-multiselect__option');
      expect(options.length).toBe(1);
    });
  });

  describe('disabled options', () => {
    it('renders a disabled option with aria-disabled and disabled class', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Enabled Option' },
        { id: '2', text: 'Disabled Option', disabled: true },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const options = page.root.shadowRoot.querySelectorAll('.pds-multiselect__option');
      expect(options[1].classList.contains('pds-multiselect__option--disabled')).toBe(true);
      expect(options[1].getAttribute('aria-disabled')).toBe('true');
    });

    it('passes disabled prop to pds-checkbox for disabled options', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Disabled Option', disabled: true },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const checkbox = page.root.shadowRoot.querySelector('pds-checkbox');
      // Stencil sets boolean props as empty-string attributes on mock elements
      expect(checkbox.hasAttribute('disabled')).toBe(true);
    });

    it('does not select a disabled option when clicked', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Disabled Option', disabled: true },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const valueBefore = [...page.rootInstance.value];
      page.rootInstance.toggleOption({ id: '1', text: 'Disabled Option', disabled: true });
      await page.waitForChanges();

      expect(page.rootInstance.value).toEqual(valueBefore);
    });

    it('skips disabled options on ArrowDown', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Disabled', disabled: true },
        { id: '2', text: 'Enabled' },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.highlightedIndex = -1;
      await page.waitForChanges();

      const input = page.root.shadowRoot.querySelector('.pds-multiselect__search-input');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await page.waitForChanges();

      // Should skip index 0 (disabled) and land on index 1
      expect(page.rootInstance.highlightedIndex).toBe(1);
    });

    it('skips disabled options on ArrowUp', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Enabled' },
        { id: '2', text: 'Disabled', disabled: true },
        { id: '3', text: 'Enabled 2' },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.highlightedIndex = 2;
      await page.waitForChanges();

      const input = page.root.shadowRoot.querySelector('.pds-multiselect__search-input');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await page.waitForChanges();

      // Should skip index 1 (disabled) and land on index 0
      expect(page.rootInstance.highlightedIndex).toBe(0);
    });

    it('ArrowUp from initial state (-1) highlights the first enabled option', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Enabled' },
        { id: '2', text: 'Enabled 2' },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.highlightedIndex = -1;
      await page.waitForChanges();

      const input = page.root.shadowRoot.querySelector('.pds-multiselect__search-input');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await page.waitForChanges();

      expect(page.rootInstance.highlightedIndex).toBe(0);
    });

    it('ArrowUp from initial state skips disabled first option', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Disabled', disabled: true },
        { id: '2', text: 'Enabled' },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.highlightedIndex = -1;
      await page.waitForChanges();

      const input = page.root.shadowRoot.querySelector('.pds-multiselect__search-input');
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await page.waitForChanges();

      // Index 0 is disabled so highlightedIndex should not change
      expect(page.rootInstance.highlightedIndex).toBe(-1);
    });

    it('parses disabled attribute from slotted <option> elements', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const makeOption = (value: string, text: string, disabled = false) => {
        const opt = document.createElement('option') as HTMLOptionElement;
        opt.value = value;
        opt.textContent = text;
        opt.disabled = disabled;
        return opt;
      };

      const mockSlot = {
        assignedElements: () => [
          makeOption('1', 'Enabled Option'),
          makeOption('2', 'Disabled Option', true),
        ],
      };

      jest.spyOn(page.rootInstance.el.shadowRoot!, 'querySelector').mockReturnValue(mockSlot as any);
      page.rootInstance.updateOptionsFromSlot();

      const opts = page.rootInstance.internalOptions;
      expect(opts[0].disabled).toBeFalsy();
      expect(opts[1].disabled).toBe(true);
    });

    it('propagates disabled from <optgroup disabled> to all child options', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const makeOption = (value: string, text: string) => {
        const opt = document.createElement('option') as HTMLOptionElement;
        opt.value = value;
        opt.textContent = text;
        return opt;
      };

      const optgroup = document.createElement('optgroup') as HTMLOptGroupElement;
      optgroup.label = 'Locked Group';
      optgroup.disabled = true;
      optgroup.appendChild(makeOption('1', 'Option A'));
      optgroup.appendChild(makeOption('2', 'Option B'));
      optgroup.querySelectorAll = (() => optgroup.children) as typeof optgroup.querySelectorAll;

      const mockSlot = { assignedElements: () => [optgroup] };
      jest.spyOn(page.rootInstance.el.shadowRoot!, 'querySelector').mockReturnValue(mockSlot as any);
      page.rootInstance.updateOptionsFromSlot();

      const opts = page.rootInstance.internalOptions;
      expect(opts.length).toBe(2);
      expect(opts[0].disabled).toBe(true);
      expect(opts[1].disabled).toBe(true);
    });

    it('does not set highlightedIndex when hovering a disabled option', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.internalOptions = [
        { id: '1', text: 'Enabled' },
        { id: '2', text: 'Disabled', disabled: true },
      ];
      page.rootInstance.isOpen = true;
      page.rootInstance.highlightedIndex = 0;
      await page.waitForChanges();

      // Hovering a disabled option should not change highlightedIndex
      page.rootInstance.handleOptionMouseEnter(1, { id: '2', text: 'Disabled', disabled: true })();
      await page.waitForChanges();

      expect(page.rootInstance.highlightedIndex).toBe(0);
    });
  });

  describe('pill variant', () => {
    it('has correct default values for new props', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      expect(page.rootInstance.selectedDisplay).toBe('count');
      expect(page.rootInstance.pillPosition).toBe('inline');
      expect(page.rootInstance.maxInlinePills).toBe(3);
    });

    it('count mode: trigger shows item count text (unchanged behavior)', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();

      const trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
      expect(trigger.tagName.toLowerCase()).toBe('button');
      const triggerText = page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text');
      expect(triggerText.textContent).toBe('2 items');
    });

    it('pill inline empty: shows placeholder span, no chips', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline" placeholder="Select items..."></pds-multiselect>`,
      });

      await page.waitForChanges();

      // Wrapper is a plain div (no role="button"); toggle is a native button inside
      const wrapper = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
      expect(wrapper.tagName.toLowerCase()).toBe('div');
      expect(wrapper.getAttribute('role')).toBeNull();
      const toggleBtn = page.root.shadowRoot.querySelector('.pds-multiselect__pill-toggle');
      expect(toggleBtn.tagName.toLowerCase()).toBe('button');

      const placeholderSpan = page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text--placeholder');
      expect(placeholderSpan).toBeTruthy();
      expect(placeholderSpan.textContent).toBe('Select items...');

      const chips = page.root.shadowRoot.querySelectorAll('pds-chip');
      expect(chips.length).toBe(0);
    });

    it('pill inline with selections: renders chips inside trigger div', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
        { id: '3', text: 'Option 3' },
      ];
      await page.waitForChanges();

      // Wrapper div has no role; ARIA attributes are on the toggle button inside
      const wrapper = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
      expect(wrapper.tagName.toLowerCase()).toBe('div');
      expect(wrapper.getAttribute('role')).toBeNull();
      const toggleBtn = page.root.shadowRoot.querySelector('.pds-multiselect__pill-toggle');
      expect(toggleBtn.getAttribute('aria-haspopup')).toBe('listbox');
      expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');

      const chips = page.root.shadowRoot.querySelectorAll('pds-chip');
      expect(chips.length).toBe(2);
      expect(chips[0].getAttribute('size')).toBe('sm');
      expect(chips[0].getAttribute('variant')).toBe('tag');
      expect(chips[0].getAttribute('sentiment')).toBe('neutral');
    });

    it('pill inline overflow: shows visible chips and +N badge', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline" max-inline-pills="2"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2', '3', '4', '5'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
        { id: '3', text: 'Option 3' },
        { id: '4', text: 'Option 4' },
        { id: '5', text: 'Option 5' },
      ];
      await page.waitForChanges();

      const chips = page.root.shadowRoot.querySelectorAll('pds-chip');
      expect(chips.length).toBe(2);

      const overflow = page.root.shadowRoot.querySelector('.pds-multiselect__pill-overflow');
      expect(overflow).toBeTruthy();
      expect(overflow.textContent).toBe('+3');
    });

    it('pill below: chips rendered outside the trigger with size md', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="below"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();

      // Trigger should be a button (not div) in below mode
      const trigger = page.root.shadowRoot.querySelector('.pds-multiselect__trigger');
      expect(trigger.tagName.toLowerCase()).toBe('button');

      const belowList = page.root.shadowRoot.querySelector('.pds-multiselect__pill-list--below');
      expect(belowList).toBeTruthy();

      const chips = page.root.shadowRoot.querySelectorAll('pds-chip');
      expect(chips.length).toBe(2);
      expect(chips[0].getAttribute('size')).toBe('md');
    });

    it('pill below: not rendered when no selections', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="below"></pds-multiselect>`,
      });

      await page.waitForChanges();

      const belowList = page.root.shadowRoot.querySelector('.pds-multiselect__pill-list--below');
      expect(belowList).toBeNull();
    });

    it('disabled: chips render with text variant (no close button)', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline" disabled></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();

      const chips = page.root.shadowRoot.querySelectorAll('pds-chip');
      expect(chips.length).toBe(2);
      chips.forEach(chip => {
        expect(chip.getAttribute('variant')).toBe('text');
      });
    });

    it('disabled below: chips render with text variant', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="below" disabled></pds-multiselect>`,
      });

      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      await page.waitForChanges();

      const chips = page.root.shadowRoot.querySelectorAll('pds-chip');
      expect(chips.length).toBe(1);
      expect(chips[0].getAttribute('variant')).toBe('text');
    });

    it('chip removal: handlePillRemove deselects item and emits change event', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();

      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      // Call handlePillRemove for Option 1
      page.rootInstance.handlePillRemove({ id: '1', text: 'Option 1' })();
      await page.waitForChanges();

      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.mock.calls[0][0].detail.values).toEqual(['2']);
      expect(page.rootInstance.value).toEqual(['2']);
    });

    it('chip removal: does nothing when disabled', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline" disabled></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();

      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      page.rootInstance.handlePillRemove({ id: '1', text: 'Option 1' })();
      await page.waitForChanges();

      expect(changeSpy).not.toHaveBeenCalled();
      expect(page.rootInstance.value).toEqual(['1', '2']);
    });

    it('ARIA live region: announces removed chip text', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Marketing' },
        { id: '2', text: 'Sales' },
      ];
      await page.waitForChanges();

      page.rootInstance.handlePillRemove({ id: '1', text: 'Marketing' })();
      await page.waitForChanges();

      const liveRegion = page.root.shadowRoot.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion.textContent).toBe('Marketing removed');
    });

    it('chip component-id attribute is set correctly', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="ms-test" selected-display="pill" pill-position="inline"></pds-multiselect>`,
      });

      page.rootInstance.value = ['42'];
      page.rootInstance.internalOptions = [{ id: '42', text: 'Engineering' }];
      await page.waitForChanges();

      const chip = page.root.shadowRoot.querySelector('pds-chip');
      expect(chip.getAttribute('component-id')).toBe('ms-test-pill-42');
    });

    it('handleTriggerKeyDown: Enter on trigger itself opens the dropdown', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline" label="Test"></pds-multiselect>`,
      });

      const toggleBtn = page.root.shadowRoot.querySelector('.pds-multiselect__pill-toggle') as HTMLElement;
      page.rootInstance.triggerEl = toggleBtn;

      const event = { key: 'Enter', target: toggleBtn, preventDefault: jest.fn() } as unknown as KeyboardEvent;
      page.rootInstance.handleTriggerKeyDown(event);
      await page.waitForChanges();

      expect(event.preventDefault).toHaveBeenCalled();
      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('handleTriggerKeyDown: Enter bubbled from a chip does not open the dropdown', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline" label="Test"></pds-multiselect>`,
      });

      const toggleBtn = page.root.shadowRoot.querySelector('.pds-multiselect__pill-toggle') as HTMLElement;
      page.rootInstance.triggerEl = toggleBtn;

      // Simulate event whose target is a chip (retargeted after crossing shadow boundary)
      const chipEl = document.createElement('pds-chip');
      const event = { key: 'Enter', target: chipEl, preventDefault: jest.fn() } as unknown as KeyboardEvent;
      page.rootInstance.handleTriggerKeyDown(event);
      await page.waitForChanges();

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('handleTriggerClick: chip body click does not toggle the dropdown', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [{ id: '1', text: 'Marketing' }];
      await page.waitForChanges();

      const chipEl = document.createElement('pds-chip');
      const event = { composedPath: () => [chipEl], } as unknown as MouseEvent;
      page.rootInstance.handleTriggerClick(event);
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('handleTriggerClick: whitespace click (no chip in path) toggles the dropdown', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [{ id: '1', text: 'Marketing' }];
      await page.waitForChanges();

      const divEl = document.createElement('div');
      const event = { composedPath: () => [divEl], } as unknown as MouseEvent;
      page.rootInstance.handleTriggerClick(event);
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('ARIA live region: re-announces when the same chip is removed twice', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline"></pds-multiselect>`,
      });

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Marketing' },
        { id: '2', text: 'Sales' },
      ];
      await page.waitForChanges();

      // First removal
      page.rootInstance.handlePillRemove({ id: '1', text: 'Marketing' })();
      await page.waitForChanges();

      const liveRegion = page.root.shadowRoot.querySelector('[aria-live="polite"]');
      expect(liveRegion.textContent).toBe('Marketing removed');

      // Re-add and remove the same item again
      page.rootInstance.value = ['1', '2'];
      page.rootInstance.syncSelectedItems();
      await page.waitForChanges();

      page.rootInstance.handlePillRemove({ id: '1', text: 'Marketing' })();
      await page.waitForChanges();

      expect(liveRegion.textContent).toBe('Marketing removed');
    });
  });

  describe('i18n (selected-count plural forms)', () => {
    const triggerTextOf = (page: { root: HTMLElement }) =>
      page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text')?.textContent;

    const selectTwo = async (page: Awaited<ReturnType<typeof newSpecPage>>) => {
      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();
    };

    it('uses translated one/other count labels', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-count-label-one="{count} elemento" selected-count-label-other="{count} elementos"></pds-multiselect>`,
      });
      await selectTwo(page);
      expect(triggerTextOf(page)).toBe('2 elementos');
    });

    it('uses full CLDR forms from a JSON selected-count-labels attribute (Polish "few")', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" lang="pl" selected-count-labels='{"one":"{count} element","few":"{count} elementy","many":"{count} elementów","other":"{count} elementu"}'></pds-multiselect>`,
      });
      await selectTwo(page); // count 2 → Polish "few" (locale from the element's lang)
      expect(triggerTextOf(page)).toBe('2 elementy');
    });

    it('accepts the CLDR forms as an object property (framework consumers)', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" lang="pl"></pds-multiselect>`,
      });
      page.rootInstance.selectedCountLabels = {
        one: '{count} element',
        few: '{count} elementy',
        many: '{count} elementów',
        other: '{count} elementu',
      };
      await selectTwo(page); // count 2 → Polish "few"
      expect(triggerTextOf(page)).toBe('2 elementy');
    });

    it('degrades to the one/other defaults when selected-count-labels is malformed JSON', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-count-labels="not json"></pds-multiselect>`,
      });
      await selectTwo(page);
      expect(triggerTextOf(page)).toBe('2 items');
    });
  });

  describe('i18n (a11y + visible string props)', () => {
    it('keeps a non-empty accessible name on the trigger when placeholder is empty', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" placeholder=""></pds-multiselect>`,
      });
      const triggerText = page.root.shadowRoot.querySelector('.pds-multiselect__trigger-text');
      expect(triggerText.textContent).toBe('Select...'); // never nameless (WCAG 4.1.2)
    });

    it('defaults and localizes the search-input aria-label (searchOptionsLabel)', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" search-options-label="Buscar opciones"></pds-multiselect>`,
      });
      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      const search = page.root.shadowRoot.querySelector('.pds-multiselect__search-input');
      expect(search.getAttribute('aria-label')).toBe('Buscar opciones');
    });

    it('defaults and localizes the listbox aria-label (optionsLabel)', async () => {
      const dflt = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });
      dflt.rootInstance.isOpen = true;
      await dflt.waitForChanges();
      expect(dflt.root.shadowRoot.querySelector('.pds-multiselect__listbox').getAttribute('aria-label')).toBe('Options');

      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" options-label="Opciones"></pds-multiselect>`,
      });
      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      expect(page.root.shadowRoot.querySelector('.pds-multiselect__listbox').getAttribute('aria-label')).toBe('Opciones');
    });

    it('localizes the no-options-found text (noOptionsFoundLabel)', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" no-options-found-label="Sin resultados"></pds-multiselect>`,
      });
      page.rootInstance.internalOptions = [];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      expect(page.root.shadowRoot.querySelector('.pds-multiselect__empty').textContent).toContain('Sin resultados');
    });

    it('localizes the create-option visible text and aria-label (createOptionLabel / createOptionAriaLabel)', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" create-url="/api/tags" create-option-label='Añadir "{text}"' create-option-aria-label="Crear etiqueta: {text}"></pds-multiselect>`,
      });
      page.rootInstance.internalOptions = [{ id: '1', text: 'Marketing' }];
      page.rootInstance.searchQuery = 'NewTag';
      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      const createOption = page.root.shadowRoot.querySelector('.pds-multiselect__option--create');
      expect(createOption.textContent).toContain('Añadir "NewTag"');
      expect(createOption.getAttribute('aria-label')).toBe('Crear etiqueta: NewTag');
    });

    it('defaults and localizes the selected-items region label and pill remove label (pill mode)', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" selected-display="pill" pill-position="inline" selected-items-label="Elementos seleccionados" pill-remove-label="Quitar"></pds-multiselect>`,
      });
      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.selectedItems = [{ id: '1', text: 'Option 1' }];
      await page.waitForChanges();
      const pillList = page.root.shadowRoot.querySelector('.pds-multiselect__pill-list');
      expect(pillList.getAttribute('aria-label')).toBe('Elementos seleccionados');
      const chip = page.root.shadowRoot.querySelector('pds-chip');
      expect(chip.getAttribute('dismiss-label')).toBe('Quitar');
    });
  });

  it('describes the error message when invalid with no helper message', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" invalid error-message="Required"></pds-multiselect>`,
    });

    const shadow = page.root.shadowRoot;
    const describedBy = shadow.querySelector('[aria-describedby]').getAttribute('aria-describedby');

    expect(describedBy).toBe('test__error-message');
    expect(shadow.querySelector(`#${describedBy}`).textContent).toContain('Required');
  });

  it('sends a pending pdsMultiselectSearch event when the debounce changes, and drops it when removed from the DOM', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });
    page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
    page.rootInstance.isOpen = true;
    await page.waitForChanges();
    const emitted = jest.fn();
    page.root!.addEventListener('pdsMultiselectSearch', emitted);
    const field = page.root!.shadowRoot!.querySelector('.pds-multiselect__search-input') as HTMLInputElement;
    const type = (text: string) => {
      field.value = text;
      field.dispatchEvent(new Event('input'));
    };

    jest.useFakeTimers();
    try {
      type('a');
      (page.root as HTMLPdsMultiselectElement).debounce = 100;
      expect(emitted).toHaveBeenCalledTimes(1);
      expect(emitted.mock.calls[0][0].detail.query).toBe('a');

      (page.root as HTMLPdsMultiselectElement).debounce = 50;
      type('ab');
      jest.advanceTimersByTime(50);
      expect(emitted).toHaveBeenCalledTimes(2);
      expect(emitted.mock.calls[1][0].detail.query).toBe('ab');

      type('abc');
      page.root!.remove();
      jest.advanceTimersByTime(1000);
      expect(emitted).toHaveBeenCalledTimes(2);
    } finally {
      jest.useRealTimers();
    }
  });

  // Mock-doc's focus() doesn't move document.activeElement, so focus-out tests set it directly.
  const setActiveElement = (doc: Document, el: Element) => {
    Object.defineProperty(doc, 'activeElement', { configurable: true, get: () => el });
  };

  const makeSlottedOption = (value: string, text: string, attributes: Record<string, string> = {}) => {
    const opt = document.createElement('option') as HTMLOptionElement;
    opt.value = value;
    opt.textContent = text;
    Object.entries(attributes).forEach(([name, attributeValue]) => opt.setAttribute(name, attributeValue));
    return opt;
  };

  describe('trigger slot', () => {
    const triggerHtml = `
      <pds-multiselect component-id="test">
        <option value="1">Bestsellers</option>
        <button slot="trigger" type="button"><span>Add tag</span></button>
      </pds-multiselect>`;

    it('renders the built-in trigger when no trigger is slotted', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      expect(page.root.shadowRoot.querySelector('button.pds-multiselect__trigger')).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('slot[name="trigger"]')).toBeNull();
    });

    it.each([
      ['count', ''],
      ['inline pill', 'selected-display="pill" pill-position="inline"'],
    ])('hides the built-in %s trigger chevron from assistive technology', async (_, attributes) => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" ${attributes}></pds-multiselect>`,
      });

      expect(page.root.shadowRoot.querySelector('.pds-multiselect__icon').getAttribute('aria-hidden')).toBe('true');
    });

    it('renders the slotted trigger in place of the built-in trigger', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: triggerHtml });
      const trigger = page.root.querySelector('[slot="trigger"]');

      expect(page.root.shadowRoot.querySelector('slot[name="trigger"]')).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('.pds-multiselect__trigger')).toBeNull();
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles the panel and aria-expanded when the slotted trigger is clicked', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: triggerHtml });
      const trigger = page.root.querySelector('[slot="trigger"]') as HTMLElement;

      trigger.click();
      await page.waitForChanges();
      expect(page.rootInstance.isOpen).toBe(true);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      trigger.click();
      await page.waitForChanges();
      expect(page.rootInstance.isOpen).toBe(false);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('opens on Enter on the slotted trigger, but not on Enter bubbled from its content', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: triggerHtml });
      const trigger = page.root.querySelector('[slot="trigger"]');

      trigger.querySelector('span').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await page.waitForChanges();
      expect(page.rootInstance.isOpen).toBe(false);

      const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      trigger.dispatchEvent(enter);
      await page.waitForChanges();
      expect(enter.defaultPrevented).toBe(true);
      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('focuses the slotted trigger on Escape and from setFocus', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: triggerHtml });
      const focusSpy = jest.spyOn(page.root.querySelector('[slot="trigger"]') as HTMLElement, 'focus');

      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      page.rootInstance.handleWindowKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
      await page.waitForChanges();
      expect(page.rootInstance.isOpen).toBe(false);
      expect(focusSpy).toHaveBeenCalledTimes(1);

      await (page.root as HTMLPdsMultiselectElement).setFocus();
      expect(focusSpy).toHaveBeenCalledTimes(2);
    });

    it('stays open when focus moves to the slotted trigger', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: triggerHtml });
      const dismissSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectDismiss', dismissSpy);

      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      setActiveElement(page.doc, page.root.querySelector('[slot="trigger"]'));
      page.rootInstance.handleContainerFocusOut();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(page.rootInstance.isOpen).toBe(true);
      expect(dismissSpy).not.toHaveBeenCalled();
    });

    it('positions the panel against the slotted trigger', async () => {
      const computePositionSpy = jest
        .spyOn(floatingUI, 'computePosition')
        .mockResolvedValue({ x: 0, y: 0, placement: 'bottom-start' });
      jest.spyOn(floatingUI, 'autoUpdate').mockReturnValue(jest.fn());
      const page = await newSpecPage({ components: [PdsMultiselect], html: triggerHtml });

      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      page.rootInstance.positionDropdown();

      expect(computePositionSpy).toHaveBeenCalledWith(
        page.root.querySelector('[slot="trigger"]'),
        expect.anything(),
        expect.anything(),
      );
    });

    it('marks the slotted trigger aria-disabled and ignores its keys while disabled', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `
          <pds-multiselect component-id="test" disabled>
            <option value="1">Bestsellers</option>
            <button slot="trigger" type="button">Add tag</button>
          </pds-multiselect>`,
      });
      const trigger = page.root.querySelector('[slot="trigger"]');
      expect(trigger.getAttribute('aria-disabled')).toBe('true');

      const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      trigger.dispatchEvent(enter);
      await page.waitForChanges();
      expect(enter.defaultPrevented).toBe(false);
      expect(page.rootInstance.isOpen).toBe(false);

      (page.root as HTMLPdsMultiselectElement).disabled = false;
      await page.waitForChanges();
      expect(trigger.hasAttribute('aria-disabled')).toBe(false);
    });

    describe('with a slotted pds-button', () => {
      const setup = (buttonAttributes = '') =>
        newSpecPage({
          components: [PdsMultiselect, PdsButton],
          html: `
            <pds-multiselect component-id="test" disabled>
              <option value="1">Bestsellers</option>
              <pds-button slot="trigger" ${buttonAttributes}>Add tag</pds-button>
            </pds-multiselect>`,
        });

      const innerButton = (trigger: HTMLPdsButtonElement) => trigger.shadowRoot.querySelector('button');

      it('disables the button while disabled, and re-enables it', async () => {
        const page = await setup();
        const trigger = page.root.querySelector('pds-button');
        await page.waitForChanges();
        expect(trigger.disabled).toBe(true);
        expect(innerButton(trigger).hasAttribute('disabled')).toBe(true);

        (page.root as HTMLPdsMultiselectElement).disabled = false;
        await page.waitForChanges();
        expect(trigger.disabled).toBe(false);
        expect(innerButton(trigger).hasAttribute('disabled')).toBe(false);
      });

      it('keeps a button the consumer disabled disabled after re-enabling', async () => {
        const page = await setup('disabled');
        const trigger = page.root.querySelector('pds-button');

        (page.root as HTMLPdsMultiselectElement).disabled = false;
        await page.waitForChanges();
        expect(trigger.disabled).toBe(true);
      });

      it('re-enables a button it disabled when the button is swapped out', async () => {
        const page = await setup();
        const first = page.root.querySelector('pds-button');
        const replacement = page.doc.createElement('pds-button');
        replacement.setAttribute('slot', 'trigger');

        first.remove();
        page.root.appendChild(replacement);
        page.rootInstance.syncSlottedTrigger();
        await page.waitForChanges();

        expect(first.disabled).toBe(false);
        expect(replacement.disabled).toBe(true);
      });
    });

    it('wires a trigger slotted after load, and restores the built-in trigger when it is removed', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });
      const trigger = page.doc.createElement('button');
      trigger.setAttribute('slot', 'trigger');

      page.root.appendChild(trigger);
      page.rootInstance.syncSlottedTrigger();
      await page.waitForChanges();
      expect(page.root.shadowRoot.querySelector('slot[name="trigger"]')).toBeTruthy();
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');

      trigger.remove();
      page.rootInstance.syncSlottedTrigger();
      await page.waitForChanges();
      expect(page.root.shadowRoot.querySelector('button.pds-multiselect__trigger')).toBeTruthy();
      expect(trigger.hasAttribute('aria-expanded')).toBe(false);

      trigger.click();
      await page.waitForChanges();
      expect(page.rootInstance.isOpen).toBe(false);
    });
  });

  describe('footer slot', () => {
    const footerHtml = `
      <pds-multiselect component-id="test">
        <option value="1">Bestsellers</option>
        <a slot="footer" href="/tags">Manage tags</a>
      </pds-multiselect>`;

    it('does not render a footer without footer content', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"><option value="1">Bestsellers</option></pds-multiselect>`,
      });
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      expect(page.root.shadowRoot.querySelector('.pds-multiselect__footer')).toBeNull();
      expect(page.root.shadowRoot.querySelector('slot[name="footer"]')).toBeNull();
    });

    it('renders footer content below the listbox', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: footerHtml });
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const panel = page.root.shadowRoot.querySelector('.pds-multiselect__panel');
      const footer = panel.querySelector('.pds-multiselect__footer');
      expect(footer.querySelector('slot[name="footer"]')).toBeTruthy();
      expect(panel.lastElementChild).toBe(footer);
      expect(footer.previousElementSibling.classList.contains('pds-multiselect__listbox')).toBe(true);
    });

    it('keeps focus in the search input when the footer is pressed', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: footerHtml });
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      page.root.shadowRoot.querySelector('.pds-multiselect__footer').dispatchEvent(mousedown);

      expect(mousedown.defaultPrevented).toBe(true);
    });

    it('stays open when focus moves into the footer content', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: footerHtml });
      const dismissSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectDismiss', dismissSpy);

      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      setActiveElement(page.doc, page.root.querySelector('[slot="footer"]'));
      page.rootInstance.handleContainerFocusOut();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(page.rootInstance.isOpen).toBe(true);
      expect(dismissSpy).not.toHaveBeenCalled();
    });

    it('moves Tab from the search input to the first footer link, past the option checkboxes', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: footerHtml });
      const link = page.root.querySelector('[slot="footer"]') as HTMLElement;
      const focusSpy = jest.spyOn(link, 'focus');
      const matches = link.matches.bind(link);
      // Mock-doc's focus() doesn't move focus, so report :focus once focus() has been called.
      jest.spyOn(link, 'matches').mockImplementation((selector: string) =>
        selector === ':focus' ? focusSpy.mock.calls.length > 0 : matches(selector)
      );
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
      page.rootInstance.handleSearchInputKeyDown(tab);
      await page.waitForChanges();

      expect(tab.defaultPrevented).toBe(true);
      expect(focusSpy).toHaveBeenCalled();
      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('closes on Tab when the first footer link cannot take focus', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: footerHtml });
      jest.spyOn(page.root.querySelector('[slot="footer"]') as HTMLElement, 'focus');
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
      page.rootInstance.handleSearchInputKeyDown(tab);
      await page.waitForChanges();

      expect(tab.defaultPrevented).toBe(false);
      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('stays open when focus moves to focusable content in the empty slot', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"><a slot="empty" href="/tags/new">Create one</a></pds-multiselect>`,
      });
      const dismissSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectDismiss', dismissSpy);

      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      setActiveElement(page.doc, page.root.querySelector('[slot="empty"]'));
      page.rootInstance.handleContainerFocusOut();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(page.rootInstance.isOpen).toBe(true);
      expect(dismissSpy).not.toHaveBeenCalled();
    });

    it('closes on Shift+Tab from the search input', async () => {
      const page = await newSpecPage({ components: [PdsMultiselect], html: footerHtml });
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      page.rootInstance.handleSearchInputKeyDown(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('closes on Tab when the footer has nothing to focus', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `
          <pds-multiselect component-id="test">
            <option value="1">Bestsellers</option>
            <p slot="footer">Tags are shared across your site.</p>
          </pds-multiselect>`,
      });
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      page.rootInstance.handleSearchInputKeyDown(new KeyboardEvent('keydown', { key: 'Tab' }));
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('returns Shift+Tab from the first footer link to the search input, and closes on Tab from the last', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `
          <pds-multiselect component-id="test">
            <option value="1">Bestsellers</option>
            <div slot="footer"><a href="/tags">Manage tags</a> <a href="/help">Help</a></div>
          </pds-multiselect>`,
      });
      const [manage, help] = Array.from(page.root.querySelectorAll('[slot="footer"] a')) as HTMLElement[];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      const searchFocusSpy = jest.spyOn(page.rootInstance.searchInputEl, 'focus');
      const tabFrom = (el: HTMLElement, shiftKey: boolean) =>
        ({ key: 'Tab', shiftKey, composedPath: () => [el], preventDefault: jest.fn() }) as unknown as KeyboardEvent;

      const backFromHelp = tabFrom(help, true);
      page.rootInstance.handleFooterKeyDown(backFromHelp);
      expect(backFromHelp.preventDefault).not.toHaveBeenCalled();

      const backFromManage = tabFrom(manage, true);
      page.rootInstance.handleFooterKeyDown(backFromManage);
      expect(backFromManage.preventDefault).toHaveBeenCalled();
      expect(searchFocusSpy).toHaveBeenCalled();

      page.rootInstance.handleFooterKeyDown(tabFrom(manage, false));
      await page.waitForChanges();
      expect(page.rootInstance.isOpen).toBe(true);

      page.rootInstance.handleFooterKeyDown(tabFrom(help, false));
      await page.waitForChanges();
      expect(page.rootInstance.isOpen).toBe(false);
    });
  });

  describe('optionDisplay prop', () => {
    const openWithOptions = async (options: Array<Record<string, unknown>>, attributes = '') => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" ${attributes}></pds-multiselect>`,
      });
      page.rootInstance.internalOptions = options;
      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      return page.root.shadowRoot.querySelector('.pds-multiselect__option pds-checkbox');
    };

    it('defaults to text, and ignores dotColor in text display', async () => {
      const checkbox = await openWithOptions([{ id: '1', text: 'Bestsellers', dotColor: '--pine-color-purple-600' }]);

      expect(checkbox.getAttribute('label')).toBe('Bestsellers');
      expect(checkbox.children.length).toBe(0);
    });

    it('renders each option as a subtle pds-chip with its dot color in chip display', async () => {
      const checkbox = await openWithOptions(
        [{ id: '1', text: 'Bestsellers', dotColor: '--pine-color-purple-600' }],
        'option-display="chip"'
      );
      const chip = checkbox.querySelector('pds-chip[slot="label"]');

      expect(checkbox.getAttribute('label')).toBe('Bestsellers');
      expect(chip.textContent).toBe('Bestsellers');
      expect(chip.hasAttribute('dot')).toBe(true);
      expect(chip.getAttribute('dot-color')).toBe('--pine-color-purple-600');
      expect(chip.getAttribute('sentiment')).toBe('subtle');
    });

    it('renders a chip without a dot for an option with no dotColor in chip display', async () => {
      const checkbox = await openWithOptions([{ id: '1', text: 'Bestsellers' }], 'option-display="chip"');
      const chip = checkbox.querySelector('pds-chip[slot="label"]');

      expect(chip.textContent).toBe('Bestsellers');
      expect(chip.hasAttribute('dot')).toBe(false);
      expect(chip.hasAttribute('dot-color')).toBe(false);
    });

    it('reads dotColor from data-dot-color on slotted options, inside and outside an optgroup', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });
      const optgroup = document.createElement('optgroup') as HTMLOptGroupElement;
      optgroup.label = 'Seasonal';
      optgroup.appendChild(makeSlottedOption('3', 'Spring launch', { 'data-dot-color': 'success' }));
      optgroup.querySelectorAll = (() => optgroup.children) as typeof optgroup.querySelectorAll;
      const mockSlot = {
        assignedElements: () => [
          makeSlottedOption('1', 'Bestsellers', { 'data-dot-color': '--pine-color-purple-600' }),
          makeSlottedOption('2', 'Webinar'),
          optgroup,
        ],
      };

      jest.spyOn(page.rootInstance.el.shadowRoot!, 'querySelector').mockReturnValue(mockSlot as any);
      page.rootInstance.updateOptionsFromSlot();

      const [bestsellers, webinar, springLaunch] = page.rootInstance.internalOptions;
      expect(bestsellers.dotColor).toBe('--pine-color-purple-600');
      expect('dotColor' in webinar).toBe(false);
      expect(springLaunch).toEqual(expect.objectContaining({ dotColor: 'success', group: 'Seasonal' }));
    });
  });

  describe('refreshOptions method', () => {
    it('refetches the first page and updates selected items without emitting a change', async () => {
      const mockFetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ results: [{ id: '1', text: 'Best sellers', dotColor: 'success' }] }),
        })
      );
      global.fetch = mockFetch as unknown as typeof fetch;
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" async-url="/api/tags"></pds-multiselect>`,
      });
      page.rootInstance.internalOptions = [{ id: '1', text: 'Bestsellers' }];
      page.rootInstance.value = ['1'];
      await page.waitForChanges();
      mockFetch.mockClear();
      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      await (page.root as HTMLPdsMultiselectElement).refreshOptions();
      await page.waitForChanges();

      const url = new URL((mockFetch.mock.calls[0] as unknown as [string])[0]);
      expect(url.pathname).toBe('/api/tags');
      expect(url.searchParams.get('page')).toBe('1');
      expect(page.rootInstance.selectedItems).toEqual([{ id: '1', text: 'Best sellers', dotColor: 'success' }]);
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('does nothing without asyncUrl', async () => {
      const mockFetch = jest.fn();
      global.fetch = mockFetch as unknown as typeof fetch;
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      await (page.root as HTMLPdsMultiselectElement).refreshOptions();

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('option action', () => {
    const actionOptions = [
      { id: '1', text: 'Bestsellers', actionIcon: 'pen' },
      { id: '2', text: 'Archived', actionIcon: 'pen', disabled: true },
    ];

    const openWithAction = async (attributes = 'option-actions', options: Array<Record<string, unknown>> = actionOptions) => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" ${attributes}></pds-multiselect>`,
      });
      page.rootInstance.internalOptions = options;
      page.rootInstance.isOpen = true;
      await page.waitForChanges();
      return page;
    };

    const hintFor = (page: Awaited<ReturnType<typeof newSpecPage>>, option: Element) =>
      page.root.shadowRoot.querySelector(`#${option.getAttribute('aria-describedby')}`);

    const pressArrowRight = (page: Awaited<ReturnType<typeof newSpecPage>>) => {
      const arrowRight = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
      page.rootInstance.handleSearchInputKeyDown(arrowRight);
      return arrowRight;
    };

    it('renders no action or hint without optionActions, even when options have an actionIcon', async () => {
      const page = await openWithAction('');
      const shadow = page.root.shadowRoot;

      expect(shadow.querySelector('.pds-multiselect__option-action')).toBeNull();
      expect(shadow.querySelector('.pds-multiselect__option[aria-describedby]')).toBeNull();
      expect(shadow.querySelector('[id$="-action-description"]')).toBeNull();
    });

    it('renders an aria-hidden action on enabled options with an actionIcon, and describes its key', async () => {
      const page = await openWithAction();
      const [enabled, disabled] = Array.from(page.root.shadowRoot.querySelectorAll('.pds-multiselect__option'));
      const action = enabled.querySelector('.pds-multiselect__option-action');

      expect(action.getAttribute('aria-hidden')).toBe('true');
      expect(action.getAttribute('title')).toBe('Edit Bestsellers');
      expect(disabled.querySelector('.pds-multiselect__option-action')).toBeNull();
      expect(disabled.hasAttribute('aria-describedby')).toBe(false);

      const hint = hintFor(page, enabled);
      expect(hint.textContent).toBe('Press Right Arrow to Edit Bestsellers');
      expect(hint.hasAttribute('hidden')).toBe(true);
    });

    it('mounts the action icon only on the highlighted option', async () => {
      const page = await openWithAction('option-actions', [
        { id: '1', text: 'Bestsellers', actionIcon: 'pen' },
        { id: '2', text: 'Archived', actionIcon: 'info-circle', actionLabel: 'View {text}' },
      ]);
      const icons = () =>
        Array.from(page.root.shadowRoot.querySelectorAll('.pds-multiselect__option-action')).map(
          action => action.querySelector('pds-icon')?.getAttribute('name') ?? null
        );

      expect(icons()).toEqual([null, null]);

      page.rootInstance.highlightedIndex = 1;
      await page.waitForChanges();
      expect(icons()).toEqual([null, 'info-circle']);
    });

    it('localizes the action tooltip and hint', async () => {
      const page = await openWithAction(
        'option-actions option-action-label="Modifier {text}" option-action-description="Flèche droite pour {action}"'
      );
      const option = page.root.shadowRoot.querySelector('.pds-multiselect__option');

      expect(option.querySelector('.pds-multiselect__option-action').getAttribute('title')).toBe('Modifier Bestsellers');
      expect(hintFor(page, option).textContent).toBe('Flèche droite pour Modifier Bestsellers');
    });

    it("uses each option's own tooltip, and gives options without an actionIcon no action", async () => {
      const page = await openWithAction('option-actions', [
        { id: '1', text: 'Bestsellers', actionIcon: 'pen' },
        { id: '2', text: 'Archived', actionIcon: 'info-circle', actionLabel: 'View {text}' },
        { id: '3', text: 'Free' },
      ]);
      const [bestsellers, archived, free] = Array.from(page.root.shadowRoot.querySelectorAll('.pds-multiselect__option'));

      expect(bestsellers.querySelector('.pds-multiselect__option-action').getAttribute('title')).toBe('Edit Bestsellers');
      expect(archived.querySelector('.pds-multiselect__option-action').getAttribute('title')).toBe('View Archived');
      expect(hintFor(page, archived).textContent).toBe('Press Right Arrow to View Archived');
      expect(free.querySelector('.pds-multiselect__option-action')).toBeNull();
      expect(free.hasAttribute('aria-describedby')).toBe(false);

      const actionSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectOptionAction', actionSpy);
      page.rootInstance.highlightedIndex = 2;
      expect(pressArrowRight(page).defaultPrevented).toBe(false);
      expect(actionSpy).not.toHaveBeenCalled();
    });

    it('reads data-action-icon and data-action-label from slotted options', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" option-actions></pds-multiselect>`,
      });
      const mockSlot = {
        assignedElements: () => [
          makeSlottedOption('1', 'Bestsellers', { 'data-action-icon': 'pen' }),
          makeSlottedOption('2', 'Archived', { 'data-action-icon': 'info-circle', 'data-action-label': 'View {text}' }),
          makeSlottedOption('3', 'Free'),
        ],
      };

      jest.spyOn(page.rootInstance.el.shadowRoot!, 'querySelector').mockReturnValue(mockSlot as any);
      page.rootInstance.updateOptionsFromSlot();

      const [bestsellers, archived, free] = page.rootInstance.internalOptions;
      expect(bestsellers.actionIcon).toBe('pen');
      expect(archived).toEqual(expect.objectContaining({ actionIcon: 'info-circle', actionLabel: 'View {text}' }));
      expect('actionIcon' in free).toBe(false);
    });

    it('does not add an action to the create option', async () => {
      const page = await openWithAction('option-actions create-url="/api/tags"');
      page.rootInstance.searchQuery = 'Fall 2026';
      await page.waitForChanges();

      expect(page.root.shadowRoot.querySelector('.pds-multiselect__option--create')).toBeTruthy();
      expect(page.root.shadowRoot.querySelector('.pds-multiselect__option-action')).toBeNull();
    });

    it('emits pdsMultiselectOptionAction on an icon click without toggling the option', async () => {
      const page = await openWithAction();
      const actionSpy = jest.fn();
      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectOptionAction', actionSpy);
      page.root.addEventListener('pdsMultiselectChange', changeSpy);
      const action = page.root.shadowRoot.querySelector('.pds-multiselect__option-action');

      const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      action.dispatchEvent(mousedown);
      action.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await page.waitForChanges();

      expect(mousedown.defaultPrevented).toBe(true);
      expect(changeSpy).not.toHaveBeenCalled();
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy.mock.calls[0][0].detail.option).toEqual({ id: '1', text: 'Bestsellers', actionIcon: 'pen' });
      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('runs the action on Right Arrow and returns focus to the trigger', async () => {
      const page = await openWithAction();
      const actionSpy = jest.fn();
      const dismissSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectOptionAction', actionSpy);
      page.root.addEventListener('pdsMultiselectDismiss', dismissSpy);
      const focusSpy = jest.spyOn(page.root.shadowRoot.querySelector('.pds-multiselect__trigger') as HTMLElement, 'focus');

      page.rootInstance.highlightedIndex = 0;
      const arrowRight = pressArrowRight(page);
      await page.waitForChanges();

      expect(arrowRight.defaultPrevented).toBe(true);
      expect(actionSpy.mock.calls[0][0].detail.option.id).toBe('1');
      expect(page.rootInstance.isOpen).toBe(false);
      expect(focusSpy).toHaveBeenCalled();
      expect(dismissSpy).not.toHaveBeenCalled();
    });

    it('leaves Right Arrow to the caret when it is inside typed text', async () => {
      const page = await openWithAction();
      const actionSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectOptionAction', actionSpy);
      const input = page.root.shadowRoot.querySelector('.pds-multiselect__search-input') as HTMLInputElement;
      input.value = 'Best';
      input.selectionStart = 2;
      input.selectionEnd = 2;

      page.rootInstance.highlightedIndex = 0;

      expect(pressArrowRight(page).defaultPrevented).toBe(false);
      expect(actionSpy).not.toHaveBeenCalled();
      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('ignores action icons that are not plain icon names', async () => {
      const page = await openWithAction('option-actions', [
        { id: '1', text: 'Remote', actionIcon: 'https://example.com/icon.svg' },
        { id: '2', text: 'Inline', actionIcon: 'data:image/svg+xml;utf8,<svg onload="alert(1)"/>' },
        { id: '3', text: 'Path', actionIcon: '../pen' },
      ]);
      const shadow = page.root.shadowRoot;

      expect(shadow.querySelector('.pds-multiselect__option-action')).toBeNull();
      expect(shadow.querySelector('.pds-multiselect__option[aria-describedby]')).toBeNull();
    });

    it('mounts every action icon on devices without hover', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" option-actions></pds-multiselect>`,
      });
      const matchMedia = jest.fn().mockReturnValue({ matches: true });
      Object.defineProperty(page.win, 'matchMedia', { configurable: true, value: matchMedia });
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Bestsellers', actionIcon: 'pen' },
        { id: '2', text: 'Archived', actionIcon: 'info-circle' },
      ];
      page.rootInstance.isOpen = true;
      await page.waitForChanges();

      const icons = Array.from(page.root.shadowRoot.querySelectorAll('.pds-multiselect__option-action pds-icon')).map(icon =>
        icon.getAttribute('name')
      );
      expect(matchMedia).toHaveBeenCalledWith('(hover: none)');
      expect(icons).toEqual(['pen', 'info-circle']);
    });

    it('leaves modified Right Arrow presses to the browser', async () => {
      const page = await openWithAction();
      const actionSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectOptionAction', actionSpy);
      page.rootInstance.highlightedIndex = 0;

      const altRight = new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, cancelable: true });
      page.rootInstance.handleSearchInputKeyDown(altRight);

      expect(altRight.defaultPrevented).toBe(false);
      expect(actionSpy).not.toHaveBeenCalled();
      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('ignores Right Arrow without optionActions', async () => {
      const page = await openWithAction('');

      page.rootInstance.highlightedIndex = 0;

      expect(pressArrowRight(page).defaultPrevented).toBe(false);
      expect(page.rootInstance.isOpen).toBe(true);
    });
  });

  describe('change detail', () => {
    const setup = async (attributes = '') => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" ${attributes}></pds-multiselect>`,
      });
      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      await page.waitForChanges();
      return { page, changeSpy };
    };

    it('reports the value each toggle adds or removes', async () => {
      const { page, changeSpy } = await setup();

      page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
      page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });

      expect(changeSpy.mock.calls[0][0].detail).toEqual(expect.objectContaining({ added: ['1'], removed: [] }));
      expect(changeSpy.mock.calls[1][0].detail).toEqual(expect.objectContaining({ added: [], removed: ['1'] }));
    });

    it('reports a removed pill and every cleared value as removed', async () => {
      const { page, changeSpy } = await setup();
      page.rootInstance.value = ['1', '2'];
      await page.waitForChanges();

      page.rootInstance.handlePillRemove({ id: '1', text: 'Option 1' })();
      await (page.root as HTMLPdsMultiselectElement).clear();

      expect(changeSpy.mock.calls[0][0].detail).toEqual(expect.objectContaining({ added: [], removed: ['1'] }));
      expect(changeSpy.mock.calls[1][0].detail).toEqual(expect.objectContaining({ added: [], removed: ['2'] }));
    });

    it('reports a created option as added', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ id: '3', text: 'NewTag' }) })
      ) as unknown as typeof fetch;
      const { page, changeSpy } = await setup('create-url="/api/tags"');

      await page.rootInstance['createOption']('NewTag');

      expect(changeSpy.mock.calls[0][0].detail).toEqual(expect.objectContaining({ added: ['3'], removed: [] }));
    });

    it('does not emit a change when a consumer sets value back after a failed write', async () => {
      const { page, changeSpy } = await setup();
      page.rootInstance.toggleOption({ id: '1', text: 'Option 1' });
      expect(changeSpy).toHaveBeenCalledTimes(1);

      (page.root as HTMLPdsMultiselectElement).value = [];
      await page.waitForChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(page.rootInstance.selectedItems).toEqual([]);
    });
  });

  it('takes its disabled state from a disabled fieldset', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="in-fieldset" label="Label"></pds-multiselect>`,
    });

    page.rootInstance.formDisabledCallback(true);
    await page.waitForChanges();
    expect(page.root.disabled).toBe(true);

    page.rootInstance.formDisabledCallback(false);
    await page.waitForChanges();
    expect(page.root.disabled).toBe(false);
  });
});
