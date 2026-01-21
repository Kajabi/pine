import { newSpecPage } from '@stencil/core/testing';
import { PdsMultiselect } from '../pds-multiselect';

// Mock MutationObserver for testing environment
if (typeof MutationObserver === 'undefined') {
  (global as any).MutationObserver = class {
    observe() {}
    disconnect() {}
  };
}

describe('pds-multiselect', () => {
  it('renders with label', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" label="Select Tags"></pds-multiselect>`,
    });

    expect(page.root).toMatchSnapshot();
    expect(page.root.shadowRoot.querySelector('.pds-multiselect__label')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.pds-multiselect__label').textContent).toBe('Select Tags');
  });

  it('renders with placeholder', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" placeholder="Search..."></pds-multiselect>`,
    });

    const input = page.root.shadowRoot.querySelector('.pds-multiselect__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Search...');
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
    const container = page.root.shadowRoot.querySelector('.pds-multiselect__container');
    expect(container.classList.contains('pds-multiselect__container--disabled')).toBe(true);
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

  it('renders with preselected values', async () => {
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

    // Check that chips are rendered for selected values
    const chips = page.root.shadowRoot.querySelectorAll('pds-chip');
    expect(chips.length).toBe(2);
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
    page.rootInstance.selectOption({ id: '1', text: 'Option 1' });
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalled();
    expect(changeSpy.mock.calls[0][0].detail.values).toEqual(['1']);
  });

  it('emits pdsMultiselectSearch on input', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test" debounce-ms="0"></pds-multiselect>`,
    });

    const searchSpy = jest.fn();
    page.root.addEventListener('pdsMultiselectSearch', searchSpy);

    const input = page.root.shadowRoot.querySelector('.pds-multiselect__input') as HTMLInputElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].detail.query).toBe('test');
  });

  it('removes selection when chip close is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    page.rootInstance.value = ['1'];
    page.rootInstance.internalOptions = [
      { id: '1', text: 'Option 1' },
    ];
    page.rootInstance.selectedItems = [{ id: '1', text: 'Option 1' }];
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root.addEventListener('pdsMultiselectChange', changeSpy);

    // Simulate removing the selection
    page.rootInstance.removeSelection({ id: '1', text: 'Option 1' });
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalled();
    expect(changeSpy.mock.calls[0][0].detail.values).toEqual([]);
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

    // Try to select a third option
    page.rootInstance.selectOption({ id: '3', text: 'Option 3' });
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

  it('sets focus on input when setFocus is called', async () => {
    const page = await newSpecPage({
      components: [PdsMultiselect],
      html: `<pds-multiselect component-id="test"></pds-multiselect>`,
    });

    const input = page.root.shadowRoot.querySelector('.pds-multiselect__input') as HTMLInputElement;
    const focusSpy = jest.spyOn(input, 'focus');

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
      page.rootInstance.handleInputKeyDown(event);
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
      page.rootInstance.handleInputKeyDown(event);
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
      page.rootInstance.handleInputKeyDown(event);
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
      page.rootInstance.handleInputKeyDown(event);
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('removes last selection on Backspace when search is empty', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      page.rootInstance.value = ['1', '2'];
      page.rootInstance.internalOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      page.rootInstance.selectedItems = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      page.rootInstance.searchQuery = '';
      await page.waitForChanges();

      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      page.rootInstance.handleInputKeyDown(event);
      await page.waitForChanges();

      expect(changeSpy).toHaveBeenCalled();
      // Should remove 'Option 2' (the last item)
      expect(changeSpy.mock.calls[0][0].detail.values).toEqual(['1']);
    });

    it('does not remove selection on Backspace when search has text', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      const changeSpy = jest.fn();
      page.root.addEventListener('pdsMultiselectChange', changeSpy);

      page.rootInstance.value = ['1'];
      page.rootInstance.internalOptions = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.selectedItems = [{ id: '1', text: 'Option 1' }];
      page.rootInstance.searchQuery = 'test';
      await page.waitForChanges();

      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      page.rootInstance.handleInputKeyDown(event);
      await page.waitForChanges();

      // Should NOT remove selection since there's search text
      expect(changeSpy).not.toHaveBeenCalled();
    });
  });

  describe('dropdown behavior', () => {
    it('opens dropdown on input click', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test"></pds-multiselect>`,
      });

      expect(page.rootInstance.isOpen).toBe(false);

      page.rootInstance.handleInputClick();
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(true);
    });

    it('does not open dropdown when disabled', async () => {
      const page = await newSpecPage({
        components: [PdsMultiselect],
        html: `<pds-multiselect component-id="test" disabled></pds-multiselect>`,
      });

      expect(page.rootInstance.isOpen).toBe(false);

      page.rootInstance.handleInputClick();
      await page.waitForChanges();

      expect(page.rootInstance.isOpen).toBe(false);
    });

    it('filters out already selected options from dropdown', async () => {
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
      await page.waitForChanges();

      // Get filtered options - should not include already selected
      const filteredOptions = page.rootInstance.getFilteredOptions();
      expect(filteredOptions.length).toBe(1);
      expect(filteredOptions[0].id).toBe('2');
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

});
