import { Component, Element, Host, h, Prop, Listen, State } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { PlacementType } from '@utils/types';
import { setAttributesIfChanged } from '@utils/attributes';
import { limitRestores } from '@utils/keep-hydrated';
import {  computePosition,
  flip,
  offset,
  shift,
  autoUpdate,
} from '@floating-ui/dom';

/**
 * Union type for focusable menu items (component or raw elements)
 */
type MenuItemElement = HTMLPdsDropdownMenuItemElement | HTMLAnchorElement | HTMLButtonElement;

/**
 * @part menu-panel - Exposes the dropdown menu container for styling.
 */
@Component({
  tag: 'pds-dropdown-menu',
  styleUrl: 'pds-dropdown-menu.scss',
  shadow: true,
})
export class PdsDropdownMenu implements BasePdsProps {
  private slotEl: HTMLSlotElement;
  private triggerEl: HTMLElement;
  private panelEl: HTMLPdsBoxElement;
  private isOpen: boolean = false;
  private menuItems: MenuItemElement[] = [];
  private cleanupAutoUpdate: (() => void) | null = null;
  private triggerObserver: MutationObserver | null = null;

  @Element() host: HTMLPdsDropdownMenuElement;

  @State() currentFocusIndex: number = -1;

  /**
   * A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one.
   */
  @Prop() componentId: string;

  /**
   * The placement of the dropdown panel relative to the trigger.
   */
  @Prop() placement: PlacementType = 'bottom-start';

  componentDidRender() {
    this.panelEl = this.host.shadowRoot?.querySelector('pds-box') as HTMLPdsBoxElement;
  }

  connectedCallback() {
    // Moved within the page, the trigger slot doesn't change, so watch the same trigger again, and
    // fix anything changed while the menu was detached and unobserved.
    this.observeTrigger();
    this.syncTriggerAria();
  }

  disconnectedCallback() {
    // Clean up auto-update when component is removed from DOM
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }

    this.triggerObserver?.disconnect();
    this.triggerObserver = null;
  }

  private handleTriggerSlotChange = (event: Event) => {
    this.slotEl = event.target as HTMLSlotElement;

    // Get all elements assigned to this slot
    const assignedElements = this.slotEl.assignedElements();

    this.triggerEl = assignedElements[0] as HTMLElement;
    if (this.triggerEl) {
      this.triggerEl.onclick = this.handleClick;
      this.syncTriggerAria();
    }
    this.observeTrigger();
  }

  // Writes the trigger's ARIA from the menu's state, so the observer's own callback doesn't loop.
  private syncTriggerAria = () => {
    if (!this.triggerEl) return false;

    return setAttributesIfChanged(this.triggerEl, { 'aria-haspopup': 'menu', 'aria-expanded': String(this.isOpen) });
  }

  // The trigger is the consumer's element, so anything can rewrite its attributes (a Turbo morph
  // matches it to server HTML that has no ARIA). Put Pine's values back when that happens.
  private observeTrigger() {
    this.triggerObserver?.disconnect();
    this.triggerObserver = null;
    if (!this.triggerEl || typeof MutationObserver === 'undefined') return;

    // Capped against a script that keeps undoing it; opening and closing still write it directly.
    this.triggerObserver = new MutationObserver(
      limitRestores(
        this.syncTriggerAria,
        'pds-dropdown-menu: stopped restoring its trigger ARIA, as another script keeps changing it. It may be wrong until the menu opens or closes.',
        this.triggerEl,
      ),
    );
    this.triggerObserver.observe(this.triggerEl, {
      attributes: true,
      attributeFilter: ['aria-haspopup', 'aria-expanded'],
    });
  }

  private handleSlotChange = (event: Event) => {
    this.slotEl = event.target as HTMLSlotElement;

    // Get all elements assigned to this slot
    const assignedElements = this.slotEl.assignedElements();

    // Allowed elements: pds-dropdown-menu-item, pds-dropdown-menu-separator, <a>, <button>
    // Raw <a> and <button> elements are allowed for edge cases requiring native browser/framework
    // behavior (e.g., Rails UJS, Turbo) that cannot work through Shadow DOM.
    const allowedTags = ['pds-dropdown-menu-item', 'pds-dropdown-menu-separator', 'a', 'button'];
    const invalidElements = assignedElements.filter(
      el => !allowedTags.includes(el.tagName.toLowerCase())
    );

    if (invalidElements.length > 0) {
      const invalidTags = invalidElements.map(el => el.tagName.toLowerCase()).join(', ');
      console.warn(
        `pds-dropdown-menu: Unexpected element(s) found: ${invalidTags}. ` +
        `Expected: ${allowedTags.join(', ')}`
      );
    }

    // Store all focusable items for keyboard navigation
    // This includes pds-dropdown-menu-item components and raw <a>/<button> elements
    this.menuItems = assignedElements.filter(el => {
      const tag = el.tagName.toLowerCase();
      return tag === 'pds-dropdown-menu-item' || tag === 'a' || tag === 'button';
    }) as MenuItemElement[];
  }

  // Toggle dropdown open/closed
  private toggleDropdown = () => {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  // Open the dropdown and position it
  private openDropdown = () => {
    const updatePosition = () => {
      computePosition(this.triggerEl, this.panelEl as HTMLElement, {
        placement: this.placement,
        strategy: 'fixed',
        middleware: [offset(6), flip(), shift({padding: 5})],
      }).then(({ x, y }) => {
        Object.assign(this.panelEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    };

    // Initial position
    updatePosition();

    // Set up auto-update for window resize and scroll
    this.cleanupAutoUpdate = autoUpdate(
      this.triggerEl,
      this.panelEl as HTMLElement,
      updatePosition
    );

    this.host.shadowRoot?.querySelector('pds-box').classList.remove('is-hidden');
    this.isOpen = true;
    this.syncTriggerAria();
  }

  // Close the dropdown
  private closeDropdown = () => {
    this.host.shadowRoot?.querySelector('pds-box').classList.add('is-hidden');
    this.isOpen = false;

    // Clean up auto-update
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }

    this.syncTriggerAria();

    // Reset focus index
    this.currentFocusIndex = -1;

    // Return focus to trigger
    if (this.isFocusInMenu()) {
      this.triggerEl.focus();
    }
  }

  // Outside clicks and scripted closes leave focus where it is; only focus in the menu or on its trigger returns.
  private isFocusInMenu(): boolean {
    const focused = (this.host.getRootNode() as Document | ShadowRoot).activeElement;
    return focused != null && this.host.contains(focused);
  }

  // Handle click on the trigger element
  private handleClick = () => {
    this.toggleDropdown();
  }

  // Check if a menu item is disabled (handles both component and raw elements)
  private isItemDisabled(item: MenuItemElement): boolean {
    const tagName = item.tagName.toLowerCase();

    if (tagName === 'pds-dropdown-menu-item') {
      return (item as HTMLPdsDropdownMenuItemElement).disabled;
    } else if (tagName === 'button') {
      return (item as HTMLButtonElement).disabled;
    } else if (tagName === 'a') {
      return item.getAttribute('aria-disabled') === 'true';
    }
    return false;
  }

  // Get the index of the currently focused menu item
  private getFocusedItemIndex(): number {
    const activeElement = document.activeElement as MenuItemElement | null;
    if (!activeElement) return -1;

    // For raw elements, check direct match
    // For pds-dropdown-menu-item, also check if the active element is inside the shadow root
    return this.menuItems.findIndex(item => {
      if (item === activeElement) return true;

      // Check if activeElement is inside the item's shadow root (for pds-dropdown-menu-item)
      if (item.tagName.toLowerCase() === 'pds-dropdown-menu-item') {
        const shadowRoot = (item as HTMLPdsDropdownMenuItemElement).shadowRoot;
        if (shadowRoot?.contains(activeElement)) return true;
      }

      return false;
    });
  }

  // Focus a specific menu item by index
  private focusItemByIndex(index: number): void {
    if (index >= 0 && index < this.menuItems.length) {
      this.currentFocusIndex = index;
      const item = this.menuItems[index];
      const tagName = item.tagName.toLowerCase();

      if (tagName === 'pds-dropdown-menu-item') {
        // For pds-dropdown-menu-item, focus the inner element
        const menuItem = item as HTMLPdsDropdownMenuItemElement;
        const innerButton = menuItem.shadowRoot?.querySelector('button');
        const innerLink = menuItem.shadowRoot?.querySelector('pds-link')?.shadowRoot?.querySelector('a')
          || menuItem.shadowRoot?.querySelector('a');

        if (innerButton) {
          innerButton.focus();
        } else if (innerLink) {
          innerLink.focus();
        } else {
          // Fallback to focusing the host
          menuItem.focus();
        }
      } else {
        // For raw <a> or <button> elements, focus directly
        (item as HTMLElement).focus();
      }
    }
  }

  // Focus the next menu item
  private focusNextItem(): void {
    let nextIndex = (this.currentFocusIndex + 1) % this.menuItems.length;

    // Skip disabled items
    let attempts = 0;
    const maxAttempts = this.menuItems.length;

    while (attempts < maxAttempts && this.isItemDisabled(this.menuItems[nextIndex])) {
      nextIndex = (nextIndex + 1) % this.menuItems.length;
      attempts++;
    }

    // Only focus if we found a non-disabled item
    if (attempts < maxAttempts) {
      this.focusItemByIndex(nextIndex);
    }
  }

  // Focus the previous menu item
  private focusPreviousItem(): void {
    let prevIndex = this.currentFocusIndex <= 0
      ? this.menuItems.length - 1
      : this.currentFocusIndex - 1;

    // Skip disabled items
    let attempts = 0;
    const maxAttempts = this.menuItems.length;

    while (attempts < maxAttempts && this.isItemDisabled(this.menuItems[prevIndex])) {
      prevIndex = prevIndex <= 0 ? this.menuItems.length - 1 : prevIndex - 1;
      attempts++;
    }

    // Only focus if we found a non-disabled item
    if (attempts < maxAttempts) {
      this.focusItemByIndex(prevIndex);
    }
  }

  // Handle keyboard events for the dropdown
  @Listen('keydown', { target: 'window' })
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem();
        break;

      case 'Home':
        event.preventDefault();
        if (this.menuItems.length > 0) {
          // Find first non-disabled item
          let firstIndex = 0;
          while (firstIndex < this.menuItems.length && this.isItemDisabled(this.menuItems[firstIndex])) {
            firstIndex++;
          }
          if (firstIndex < this.menuItems.length) {
            this.focusItemByIndex(firstIndex);
          }
        }
        break;

      case 'End':
        event.preventDefault();
        if (this.menuItems.length > 0) {
          // Find last non-disabled item
          let lastIndex = this.menuItems.length - 1;
          while (lastIndex >= 0 && this.isItemDisabled(this.menuItems[lastIndex])) {
            lastIndex--;
          }
          if (lastIndex >= 0) {
            this.focusItemByIndex(lastIndex);
          }
        }
        break;

      case 'Tab':
        if (event.shiftKey) {
          // Let Shift+Tab navigate naturally from first item to trigger
          // For all other items, move to previous item
          const currentIndex = this.getFocusedItemIndex();

          if (currentIndex > 0) {
            // If not on first item, prevent default and go to previous item
            event.preventDefault();
            this.focusPreviousItem(); // Use our method that skips disabled items
          }
          // If on first item or no item, let natural tab order move back to trigger
        } else {
          // Forward Tab navigation
          const activeElement = document.activeElement;
          const isTriggerFocused = activeElement === this.triggerEl;
          const currentIndex = this.getFocusedItemIndex();

          if (isTriggerFocused && this.menuItems.length > 0) {
            // If trigger is focused, move to first non-disabled menu item
            event.preventDefault();

            // Find the first non-disabled item
            let firstFocusableIndex = 0;
            while (firstFocusableIndex < this.menuItems.length && this.isItemDisabled(this.menuItems[firstFocusableIndex])) {
              firstFocusableIndex++;
            }

            if (firstFocusableIndex < this.menuItems.length) {
              this.focusItemByIndex(firstFocusableIndex);
            }
          } else if (currentIndex === -1 && this.menuItems.length > 0) {
            // If no menu item is focused, focus the first non-disabled one
            event.preventDefault();

            // Find the first non-disabled item
            let firstFocusableIndex = 0;
            while (firstFocusableIndex < this.menuItems.length && this.isItemDisabled(this.menuItems[firstFocusableIndex])) {
              firstFocusableIndex++;
            }

            if (firstFocusableIndex < this.menuItems.length) {
              this.focusItemByIndex(firstFocusableIndex);
            }
          } else if (currentIndex !== -1) {
            // Use our method that skips disabled items
            event.preventDefault();
            this.focusNextItem();
          }
        }
        break;
    }
  }

  // Handle clicks outside the dropdown to close it
  @Listen('click', { target: 'window' })
  handleWindowClick(event: MouseEvent) {
    if (this.isOpen && !this.host.contains(event.target as Node) && event.target !== this.triggerEl) {
      this.closeDropdown();
    }
  }


  render() {
    return (
      <Host>
        <slot
          name="trigger"
          onSlotchange={this.handleTriggerSlotChange}
        ></slot>
        <pds-box
          border-radius="sm"
          display="flex"
          direction="column"
          class="pds-dropdown-menu--panel is-hidden"
          shadow="100"
          role="menu"
          aria-orientation="vertical"
          part="menu-panel"
        >
          <slot onSlotchange={this.handleSlotChange}></slot>
        </pds-box>
      </Host>
    );
  }
}
