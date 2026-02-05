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
    expect(menuBox?.getAttribute('role')).toBe('menu');
    expect(menuBox?.getAttribute('aria-orientation')).toBe('vertical');
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
    const contentSlot = shadowRoot?.querySelector('pds-box > slot');

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
    const contentSlot = page.root.shadowRoot?.querySelector('pds-box > slot');

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
    const contentSlot = page.root.shadowRoot?.querySelector('pds-box > slot');

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
    const contentSlot = page.root.shadowRoot?.querySelector('pds-box > slot');

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
    const contentSlot = page.root.shadowRoot?.querySelector('pds-box > slot');

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
    const contentSlot = page.root?.shadowRoot?.querySelector('pds-box > slot');
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
    component.handleKeyDown(keyEvent);

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
    const contentSlot = page.root?.shadowRoot?.querySelector('pds-box > slot');
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
    const contentSlot = page.root?.shadowRoot?.querySelector('pds-box > slot');
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
    component.menuItems = [
      { tagName: 'PDS-DROPDOWN-MENU-ITEM', disabled: false, focus: jest.fn() } as any,
      { tagName: 'PDS-DROPDOWN-MENU-ITEM', disabled: false, focus: jest.fn() } as any,
      { tagName: 'PDS-DROPDOWN-MENU-ITEM', disabled: true, focus: jest.fn() } as any
    ];

    // Mock document.activeElement to be the trigger
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: function() { return mockTrigger; }
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

  it('handles Tab key forward navigation when a menu item is focused', async () => {
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

    if (!page.root) {
      fail('Root element not found');
    }

    const component = page.rootInstance;
    component.isOpen = true;

    // Mock menu items and one is active
    const menuItem1 = document.createElement('button');
    const menuItem2 = document.createElement('button');
    const menuItem3 = document.createElement('button');

    component.menuItems = [
      menuItem1 as any,
      menuItem2 as any,
      menuItem3 as any
    ];
    component.currentFocusIndex = 0; // First item is focused

    // Mock document.activeElement to be the first menu item
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: function() { return menuItem1; }
    });

    // Spy on focusNextItem method
    const focusNextSpy = jest.spyOn(component, 'focusNextItem');

    // Create Tab event (forward)
    const preventDefault = jest.fn();
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' }) as any;
    tabEvent.preventDefault = preventDefault;

    // Handle Tab keydown
    component.handleKeyDown(tabEvent);

    // Should prevent default and focus next item
    expect(preventDefault).toHaveBeenCalled();
    expect(focusNextSpy).toHaveBeenCalled();
  });

  it('handles Shift+Tab backward navigation from menu items', async () => {
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
    component.isOpen = true;

    // Mock menu items
    const menuItem1 = document.createElement('button');
    const menuItem2 = document.createElement('button');

    component.menuItems = [
      menuItem1 as any,
      menuItem2 as any
    ];

    // Test with the second item focused (non-first item case)
    component.currentFocusIndex = 1;

    // Mock document.activeElement to be the second menu item
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: function() { return menuItem2; }
    });

    // Spy on focusPreviousItem method
    const focusPrevSpy = jest.spyOn(component, 'focusPreviousItem');

    // Create Shift+Tab event
    const preventDefault = jest.fn();
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }) as any;
    shiftTabEvent.preventDefault = preventDefault;

    // Handle Shift+Tab keydown
    component.handleKeyDown(shiftTabEvent);

    // Should prevent default and focus previous item
    expect(preventDefault).toHaveBeenCalled();
    expect(focusPrevSpy).toHaveBeenCalled();
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
