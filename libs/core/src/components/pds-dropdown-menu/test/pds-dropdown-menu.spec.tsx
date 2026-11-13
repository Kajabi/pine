import { newSpecPage } from '@stencil/core/testing';
import { PdsDropdownMenu } from '../pds-dropdown-menu';
import { PdsDropdownMenuItem } from '../pds-dropdown-menu-item/pds-dropdown-menu-item';
import { PdsDropdownMenuSeparator } from '../pds-dropdown-menu-separator/pds-dropdown-menu-separator';
import { PdsBox } from '../../../components/pds-box/pds-box';

describe('pds-dropdown-menu', () => {
  it('renders with empty structure', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `<pds-dropdown-menu></pds-dropdown-menu>`,
    });

    const shadowRoot = page.root?.shadowRoot;
    const triggerSlot = shadowRoot?.querySelector('slot[name="trigger"]');
    const menuBox = shadowRoot?.querySelector('pds-box');

    expect(triggerSlot).not.toBeNull();
    expect(menuBox).not.toBeNull();
    expect(menuBox?.classList.contains('is-hidden')).toBe(true);
    expect(menuBox).toHaveClass('is-hidden');

    const menu = menuBox?.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(menu?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('renders the header slot outside the menu role and hides it when empty', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `<pds-dropdown-menu></pds-dropdown-menu>`,
    });

    const panel = page.root?.shadowRoot?.querySelector('pds-box');
    const headerSlot = panel?.querySelector('slot[name="header"]');

    expect(headerSlot).not.toBeNull();
    expect(headerSlot?.closest('[role="menu"]')).toBeNull();
    expect(headerSlot?.parentElement).toHaveClass('is-hidden');
  });

  it('shows the header when content is slotted into it', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <div slot="header">John Doe</div>
        </pds-dropdown-menu>
      `,
    });

    const header = page.root?.shadowRoot?.querySelector('slot[name="header"]')?.parentElement;
    expect(header).not.toHaveClass('is-hidden');
  });

  it('hides the header again when its content is removed', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `
        <pds-dropdown-menu>
          <div slot="header">John Doe</div>
        </pds-dropdown-menu>
      `,
    });

    const headerSlot = page.root?.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement;
    Object.defineProperty(headerSlot, 'assignedElements', { value: () => [] });
    headerSlot.dispatchEvent(new Event('slotchange'));
    await page.waitForChanges();

    expect(headerSlot.parentElement).toHaveClass('is-hidden');
  });

  it('does not write component-id onto the host id', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `<pds-dropdown-menu component-id="test"></pds-dropdown-menu>`,
    });

    expect(page.root?.id).toBe('');
  });

  it('keeps an author-set id even when component-id is also set', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `<pds-dropdown-menu id="author-id" component-id="test"></pds-dropdown-menu>`,
    });

    expect(page.root?.id).toBe('author-id');
  });

  it('renders with trigger and menu items', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsDropdownMenuSeparator, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <pds-dropdown-menu-separator></pds-dropdown-menu-separator>
          <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `,
    });

    const shadowRoot = page.root?.shadowRoot;
    const triggerSlot = shadowRoot?.querySelector('slot[name="trigger"]');
    const contentSlot = shadowRoot?.querySelector('[role="menu"] > slot');

    expect(triggerSlot).not.toBeNull();
    expect(contentSlot).not.toBeNull();
  });

  it('sets proper ARIA attributes for accessibility', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
        </pds-dropdown-menu>
      `,
    });

    // Manually trigger the handleTriggerSlotChange method to simulate slot assignment
    const component = page.rootInstance;
    const triggerSlot = page.root.shadowRoot?.querySelector('slot[name="trigger"]');

    // Create a mock event with assigned elements
    const mockEvent = {
      target: triggerSlot,
      assignedElements: () => [page.body.querySelector('button')]
    };

    // Call the method
    component.handleTriggerSlotChange(mockEvent as any);

    // Assert aria attributes are set
    const triggerButton = page.body.querySelector('button');
    expect(triggerButton.getAttribute('aria-haspopup')).toBe('menu');
    expect(triggerButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('handles slot change for menu items', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsDropdownMenuSeparator, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <pds-dropdown-menu-separator></pds-dropdown-menu-separator>
          <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    const contentSlot = page.root.shadowRoot?.querySelector('[role="menu"] > slot');

    // Create a mock event with assigned elements
    const mockEvent = {
      target: contentSlot,
      assignedElements: () => [
        page.body.querySelector('pds-dropdown-menu-item:first-child'),
        page.body.querySelector('pds-dropdown-menu-separator'),
        page.body.querySelector('pds-dropdown-menu-item:last-child')
      ]
    };

    // Call the method
    component.handleSlotChange(mockEvent as any);

    // Verify menu items are stored correctly
    expect(component.menuItems.length).toBe(2);
  });

  it('warns when invalid elements are in the slot', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <div>Invalid Element</div>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    const contentSlot = page.root.shadowRoot?.querySelector('[role="menu"] > slot');

    // Create a mock event with invalid assigned elements
    const mockEvent = {
      target: contentSlot,
      assignedElements: () => [page.body.querySelector('div')]
    };

    // Spy on console.warn
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Call should warn (not throw)
    component.handleSlotChange(mockEvent as any);

    // Verify warning was logged
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unexpected element(s) found: div')
    );

    warnSpy.mockRestore();
  });

  it('allows raw <a> elements in the slot', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <a href="/delete" data-method="delete">Delete</a>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    const contentSlot = page.root.shadowRoot?.querySelector('[role="menu"] > slot');

    // Create a mock event with menu item and raw anchor
    const mockEvent = {
      target: contentSlot,
      assignedElements: () => [
        page.body.querySelector('pds-dropdown-menu-item'),
        page.body.querySelector('a')
      ]
    };

    // Spy on console.warn to ensure no warning is logged
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Call should not warn
    component.handleSlotChange(mockEvent as any);

    // No warning should be logged for allowed elements
    expect(warnSpy).not.toHaveBeenCalled();

    // Both elements should be in menuItems for keyboard navigation
    expect(component.menuItems.length).toBe(2);

    warnSpy.mockRestore();
  });

  it('allows raw <button> elements in the slot', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <button type="button">Raw Button</button>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    const contentSlot = page.root.shadowRoot?.querySelector('[role="menu"] > slot');

    // Get the raw button (not the trigger)
    const rawButton = page.body.querySelectorAll('button')[1];

    // Create a mock event with menu item and raw button
    const mockEvent = {
      target: contentSlot,
      assignedElements: () => [
        page.body.querySelector('pds-dropdown-menu-item'),
        rawButton
      ]
    };

    // Spy on console.warn to ensure no warning is logged
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Call should not warn
    component.handleSlotChange(mockEvent as any);

    // No warning should be logged for allowed elements
    expect(warnSpy).not.toHaveBeenCalled();

    // Both elements should be in menuItems for keyboard navigation
    expect(component.menuItems.length).toBe(2);

    warnSpy.mockRestore();
  });

  it('skips disabled items during keyboard navigation', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <pds-dropdown-menu-item disabled>Item 2 (Disabled)</pds-dropdown-menu-item>
          <pds-dropdown-menu-item>Item 3</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    component.isOpen = true;

    // Setup slot change to populate menuItems
    const contentSlot = page.root?.shadowRoot?.querySelector('[role="menu"] > slot');
    const mockEvent = {
      target: contentSlot,
      assignedElements: () => Array.from(page.body.querySelectorAll('pds-dropdown-menu-item'))
    };
    component.handleSlotChange(mockEvent as any);

    // Verify we have 3 items
    expect(component.menuItems.length).toBe(3);

    // Start at first item
    component.currentFocusIndex = 0;

    // Call focusNextItem - should skip disabled item 2 and go to item 3
    component.focusNextItem();
    expect(component.currentFocusIndex).toBe(2); // Should skip index 1 (disabled)
  });

  it('keeps informational items in keyboard navigation, without warning', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Used on</button>
          <pds-dropdown-menu-item href="/offers">3 offers</pds-dropdown-menu-item>
          <pds-dropdown-menu-item informational>2 forms</pds-dropdown-menu-item>
          <pds-dropdown-menu-item informational disabled>1 coupon</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    const contentSlot = page.root?.shadowRoot?.querySelector('[role="menu"] > slot');
    component.handleSlotChange({ target: contentSlot } as any);
    component.currentFocusIndex = 0;
    const informational = page.body.querySelectorAll('pds-dropdown-menu-item')[1];
    const focusSpy = jest.spyOn(informational.shadowRoot!.querySelector('[role="menuitem"]') as HTMLElement, 'focus');

    component.focusNextItem();

    expect(component.menuItems).toHaveLength(3);
    expect(component.currentFocusIndex).toBe(1);
    expect(focusSpy).toHaveBeenCalled();

    component.focusNextItem();

    expect(component.currentFocusIndex).toBe(0);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('applies specified placement', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `<pds-dropdown-menu placement="top-end"></pds-dropdown-menu>`,
    });

    expect(page.rootInstance.placement).toBe('top-end');
  });

  it('toggles dropdown open and closed', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    const triggerSlot = page.root.shadowRoot?.querySelector('slot[name="trigger"]');

    // Setup trigger
    const mockEvent = {
      target: triggerSlot,
      assignedElements: () => [page.body.querySelector('button')]
    };
    component.handleTriggerSlotChange(mockEvent as any);

    // Mock the panelEl
    component.panelEl = page.root.shadowRoot?.querySelector('pds-box') as HTMLPdsBoxElement;
    component.panelEl.classList.add('is-hidden');

    // Initial state should be closed
    expect(component.isOpen).toBe(false);

    // Open the dropdown
    component.toggleDropdown();
    expect(component.isOpen).toBe(true);
    expect(component.panelEl.classList.contains('is-hidden')).toBe(false);

    // Close the dropdown
    component.toggleDropdown();
    expect(component.isOpen).toBe(false);
    expect(component.panelEl.classList.contains('is-hidden')).toBe(true);
  });

  it('handles click on trigger element', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    const triggerSlot = page.root.shadowRoot?.querySelector('slot[name="trigger"]');

    // Setup trigger
    const mockEvent = {
      target: triggerSlot,
      assignedElements: () => [page.body.querySelector('button')]
    };
    component.handleTriggerSlotChange(mockEvent as any);

    // Mock the panelEl
    component.panelEl = page.root.shadowRoot?.querySelector('pds-box') as HTMLPdsBoxElement;
    component.panelEl.classList.add('is-hidden');

    // Spy on toggleDropdown
    const toggleSpy = jest.spyOn(component, 'toggleDropdown');

    // Trigger the click
    component.handleClick();

    // Verify toggleDropdown was called
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('closes dropdown on escape key', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `,
    });

    if (!page.root) {
      fail('Root element not found');
    }

    const component = page.rootInstance;
    component.panelEl = page.root?.shadowRoot?.querySelector('pds-box') as HTMLPdsBoxElement;

    // We need to manually trigger the slot change first to initialize the component
    const shadowRoot = page.root?.shadowRoot;
    if (!shadowRoot) {
      fail('Shadow root not found');
    }

    // Mock the trigger slot change event to initialize component.triggerEl
    const slotEvent = new CustomEvent('slotchange');
    const triggerSlot = shadowRoot?.querySelector('slot[name="trigger"]');
    if (triggerSlot) {
      triggerSlot.dispatchEvent(slotEvent);
    }

    // Setup the dropdown as open
    component.isOpen = true;
    component.panelEl.classList.remove('is-hidden');

    // Spy on closeDropdown
    const closeSpy = jest.spyOn(component, 'closeDropdown');

    // Create mock event
    const keyEvent = new KeyboardEvent('keydown', { key: 'Escape' });

    // Trigger the key event
    component.handleEscapeKeyDown(keyEvent);

    // Verify closeDropdown was called
    expect(closeSpy).toHaveBeenCalled();
  });

  it('handles arrow key navigation', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    component.panelEl = page.root?.shadowRoot?.querySelector('pds-box') as HTMLPdsBoxElement;
    component.isOpen = true;

    // Mock menuItems and setup slot change
    const contentSlot = page.root?.shadowRoot?.querySelector('[role="menu"] > slot');
    const mockEvent = {
      target: contentSlot,
      assignedElements: () => [
        page.body.querySelector('pds-dropdown-menu-item:first-child'),
        page.body.querySelector('pds-dropdown-menu-item:last-child')
      ]
    };
    component.handleSlotChange(mockEvent as any);

    // Spy on focus methods
    const nextSpy = jest.spyOn(component, 'focusNextItem');
    const prevSpy = jest.spyOn(component, 'focusPreviousItem');

    // Test ArrowDown key
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    component.handleKeyDown(downEvent);
    expect(nextSpy).toHaveBeenCalled();

    // Test ArrowUp key
    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    component.handleKeyDown(upEvent);
    expect(prevSpy).toHaveBeenCalled();
  });

  it('handles Home and End key navigation', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
          <pds-dropdown-menu-item>Item 3</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    component.isOpen = true;

    // Mock menuItems and setup slot change
    const contentSlot = page.root?.shadowRoot?.querySelector('[role="menu"] > slot');
    const mockEvent = {
      target: contentSlot,
      assignedElements: () => [
        page.body.querySelector('pds-dropdown-menu-item:nth-child(1)'),
        page.body.querySelector('pds-dropdown-menu-item:nth-child(2)'),
        page.body.querySelector('pds-dropdown-menu-item:nth-child(3)')
      ]
    };
    component.handleSlotChange(mockEvent as any);

    // Spy on focusItemByIndex
    const focusSpy = jest.spyOn(component, 'focusItemByIndex');

    // Test Home key
    const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
    component.handleKeyDown(homeEvent);
    expect(focusSpy).toHaveBeenCalledWith(0);

    // Test End key
    const endEvent = new KeyboardEvent('keydown', { key: 'End' });
    component.handleKeyDown(endEvent);
    expect(focusSpy).toHaveBeenCalledWith(2);
  });

  it('handles Tab key forward navigation when trigger is focused', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
      html: `
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
          <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
          <pds-dropdown-menu-item disabled>Item 3 (Disabled)</pds-dropdown-menu-item>
        </pds-dropdown-menu>
      `,
    });

    if (!page.root) {
      fail('Root element not found');
    }

    const component = page.rootInstance;
    component.isOpen = true;

    // Mock the trigger element
    const mockTrigger = document.createElement('button');
    component.triggerEl = mockTrigger;

    // Create menu items for testing with proper tagName property
    let activeElement: unknown = mockTrigger;
    component.menuItems = [false, false, true].map((disabled) => {
      const item = { tagName: 'PDS-DROPDOWN-MENU-ITEM', disabled } as any;
      item.focus = jest.fn(() => { activeElement = item; });
      return item;
    });

    // Mock document.activeElement to be the trigger
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: function() { return activeElement; }
    });

    // Spy on focus methods
    const focusItemSpy = jest.spyOn(component, 'focusItemByIndex');

    // Create Tab event (forward)
    const preventDefault = jest.fn();
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' }) as any;
    tabEvent.preventDefault = preventDefault;

    // Handle Tab keydown
    component.handleKeyDown(tabEvent);

    // Should prevent default and focus first item
    expect(preventDefault).toHaveBeenCalled();
    expect(focusItemSpy).toHaveBeenCalledWith(0);
  });

  describe('Tab from a menu item', () => {
    // Enabled items at 1 and 3, with disabled ones before, between and after them.
    const openWithItemFocused = async (focusedIndex: number) => {
      const page = await newSpecPage({
        components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
        html: `
          <pds-dropdown-menu>
            <button slot="trigger">Toggle Menu</button>
            <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
            <pds-dropdown-menu-item>Item 2</pds-dropdown-menu-item>
          </pds-dropdown-menu>
        `,
      });

      const component = page.rootInstance;
      const items = [true, false, true, false, true].map((disabled) =>
        Object.assign(document.createElement('button'), { disabled }),
      );
      let active: Element = items[focusedIndex];
      items.forEach((item) => {
        item.focus = () => {
          active = item;
        };
      });
      component.isOpen = true;
      component.menuItems = items;
      component.currentFocusIndex = focusedIndex;
      Object.defineProperty(document, 'activeElement', {
        configurable: true,
        get: () => active,
      });

      return {
        component,
        items,
        closeSpy: jest.spyOn(component, 'closeDropdown'),
        focusItemSpy: jest.spyOn(component, 'focusItemByIndex'),
      };
    };

    const pressTab = (component: PdsDropdownMenu, init: KeyboardEventInit = {}) => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', ...init });
      component.handleTabKeyDown(event);
      component.handleKeyDown(event);
      return event;
    };

    it('moves to the next enabled item', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithItemFocused(1);

      const event = pressTab(component);

      expect(focusItemSpy).toHaveBeenCalledTimes(1);
      expect(focusItemSpy).toHaveBeenCalledWith(3);
      expect(event.defaultPrevented).toBe(true);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('closes the menu past an enabled item that refuses focus', async () => {
      const { component, items, closeSpy, focusItemSpy } = await openWithItemFocused(1);
      items[3].focus = () => undefined;

      const event = pressTab(component);

      expect(focusItemSpy).toHaveBeenCalledWith(3);
      expect(closeSpy).toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it('closes the menu and leaves the Tab to the browser on the last enabled item', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithItemFocused(3);

      const event = pressTab(component);

      expect(closeSpy).toHaveBeenCalled();
      expect(component['isOpen']).toBe(false);
      expect(event.defaultPrevented).toBe(false);
      expect(focusItemSpy).not.toHaveBeenCalled();
    });

    it('moves to the previous enabled item on Shift+Tab', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithItemFocused(3);

      const event = pressTab(component, { shiftKey: true });

      expect(focusItemSpy).toHaveBeenCalledTimes(1);
      expect(focusItemSpy).toHaveBeenCalledWith(1);
      expect(event.defaultPrevented).toBe(true);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('closes the menu and takes the Shift+Tab from the first enabled item', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithItemFocused(1);

      const event = pressTab(component, { shiftKey: true });

      expect(closeSpy).toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
      expect(focusItemSpy).not.toHaveBeenCalled();
    });

    it('leaves the menu open when another handler has already taken the Tab', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithItemFocused(3);
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      event.preventDefault();

      component.handleTabKeyDown(event);
      component.handleKeyDown(event);

      expect(closeSpy).not.toHaveBeenCalled();
      expect(component['isOpen']).toBe(true);
      expect(focusItemSpy).not.toHaveBeenCalled();
    });

    it('ignores Tab while the menu is closed', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithItemFocused(1);
      component['isOpen'] = false;
      const event = new KeyboardEvent('keydown', { key: 'Tab' });

      component.handleTabKeyDown(event);

      expect(closeSpy).not.toHaveBeenCalled();
      expect(focusItemSpy).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('Tab from the trigger', () => {
    const openWithTriggerFocused = async (disabled: boolean[]) => {
      const page = await newSpecPage({
        components: [PdsDropdownMenu, PdsDropdownMenuItem, PdsBox],
        html: `
          <pds-dropdown-menu>
            <button slot="trigger">Toggle Menu</button>
            <pds-dropdown-menu-item>Item 1</pds-dropdown-menu-item>
          </pds-dropdown-menu>
        `,
      });

      const component = page.rootInstance;
      const trigger = document.createElement('button');
      const items = disabled.map((isDisabled) => Object.assign(document.createElement('button'), { disabled: isDisabled }));
      let active: Element = trigger;
      items.forEach((item) => {
        item.focus = () => {
          active = item;
        };
      });
      component.isOpen = true;
      component.triggerEl = trigger;
      component.menuItems = items;
      Object.defineProperty(document, 'activeElement', {
        configurable: true,
        get: () => active,
      });

      return {
        component,
        closeSpy: jest.spyOn(component, 'closeDropdown'),
        focusItemSpy: jest.spyOn(component, 'focusItemByIndex'),
      };
    };

    const pressTab = (component: PdsDropdownMenu, init: KeyboardEventInit = {}) => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', ...init });
      component.handleTabKeyDown(event);
      component.handleKeyDown(event);
      return event;
    };

    it('moves to the first enabled item on Tab', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithTriggerFocused([true, false]);

      const event = pressTab(component);

      expect(focusItemSpy).toHaveBeenCalledWith(1);
      expect(event.defaultPrevented).toBe(true);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('closes the menu and leaves Tab to the browser when every item is disabled', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithTriggerFocused([true, true]);

      const event = pressTab(component);

      expect(closeSpy).toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
      expect(focusItemSpy).not.toHaveBeenCalled();
    });

    it('closes the menu and leaves Shift+Tab to the browser', async () => {
      const { component, closeSpy, focusItemSpy } = await openWithTriggerFocused([false, false]);

      const event = pressTab(component, { shiftKey: true });

      expect(closeSpy).toHaveBeenCalled();
      expect(component['isOpen']).toBe(false);
      expect(event.defaultPrevented).toBe(false);
      expect(focusItemSpy).not.toHaveBeenCalled();
    });
  });

  it('closes dropdown on outside click', async () => {
    const page = await newSpecPage({
      components: [PdsDropdownMenu, PdsBox],
      html: `
        <div id="outside">Outside Element</div>
        <pds-dropdown-menu>
          <button slot="trigger">Toggle Menu</button>
        </pds-dropdown-menu>
      `,
    });

    const component = page.rootInstance;
    component.panelEl = page.root?.shadowRoot?.querySelector('pds-box') as HTMLPdsBoxElement;

    // Setup the dropdown as open
    component.isOpen = true;

    // Setup Trigger
    const triggerSlot = page.root?.shadowRoot?.querySelector('slot[name="trigger"]');
    const mockEvent = {
      target: triggerSlot,
      assignedElements: () => [page.body.querySelector('button')]
    };
    component.handleTriggerSlotChange(mockEvent as any);

    // Spy on closeDropdown
    const closeSpy = jest.spyOn(component, 'closeDropdown');

    // Create mock event with outside target
    const clickEvent = { target: page.body.querySelector('#outside') } as unknown as MouseEvent;

    // Trigger the window click handler
    component.handleWindowClick(clickEvent);

    // Verify closeDropdown was called
    expect(closeSpy).toHaveBeenCalled();
  });
});
