import { Component, Element, Host, h, Prop, Listen, State } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { PlacementType } from '@utils/types';
import {  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

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
  private menuItems: HTMLPdsDropdownMenuItemElement[] = [];

  @Element() host: HTMLPdsDropdownMenuElement;

  @State() currentFocusIndex: number = -1;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * The placement of the dropdown panel relative to the trigger.
   */
  @Prop() placement: PlacementType = 'bottom-start';

  componentDidRender() {
    this.panelEl = this.host.shadowRoot?.querySelector('pds-box') as HTMLPdsBoxElement;
  }

  private handleTriggerSlotChange = (event: Event) => {
    this.slotEl = event.target as HTMLSlotElement;

    // Get all elements assigned to this slot
    const assignedElements = this.slotEl.assignedElements();

    this.triggerEl = assignedElements[0] as HTMLElement;
    this.triggerEl.onclick = this.handleClick;

    // Add accessibility attributes to trigger
    this.triggerEl.setAttribute('aria-haspopup', 'menu');
    this.triggerEl.setAttribute('aria-expanded', 'false');
  }

  private handleSlotChange = (event: Event) => {
    this.slotEl = event.target as HTMLSlotElement;

    // Get all elements assigned to this slot
    const assignedElements = this.slotEl.assignedElements();

    // ensure assignedElements only contains pds-dropdown-menu-item or pds-dropdown-menu-separator
    // if there are other elements, throw an error
    const invalidElements = assignedElements.filter(el => el.tagName.toLowerCase() !== 'pds-dropdown-menu-item' && el.tagName.toLowerCase() !== 'pds-dropdown-menu-separator');
    if (invalidElements.length > 0) {
      throw new Error(`pds-dropdown-menu only accepts pds-dropdown-menu-item and pds-dropdown-menu-separator elements`);
    }

    // Store all menu items for keyboard navigation
    this.menuItems = assignedElements.filter(
      el => el.tagName.toLowerCase() === 'pds-dropdown-menu-item'
    ) as HTMLPdsDropdownMenuItemElement[];
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
    computePosition(this.triggerEl, this.panelEl, {
      placement: this.placement,
      middleware: [offset(6), flip(), shift({padding: 5})],
    }).then(({ x, y }) => {
      Object.assign(this.panelEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });

    this.host.shadowRoot?.querySelector('pds-box').classList.remove('is-hidden');
    this.isOpen = true;

    // Update ARIA attributes
    this.triggerEl.setAttribute('aria-expanded', 'true');
  }

  // Close the dropdown
  private closeDropdown = () => {
    this.host.shadowRoot?.querySelector('pds-box').classList.add('is-hidden');
    this.isOpen = false;

    // Update ARIA attributes
    this.triggerEl.setAttribute('aria-expanded', 'false');

    // Reset focus index
    this.currentFocusIndex = -1;

    // Return focus to trigger
    this.triggerEl.focus();
  }

  // Handle click on the trigger element
  private handleClick = () => {
    this.toggleDropdown();
  }

  // Get the index of the currently focused menu item
  private getFocusedItemIndex(): number {
    const activeElement = document.activeElement as HTMLPdsDropdownMenuItemElement | null;
    if (!activeElement) return -1;
    return this.menuItems.findIndex(item => item === activeElement);
  }

  // Focus a specific menu item by index
  private focusItemByIndex(index: number): void {
    if (index >= 0 && index < this.menuItems.length) {
      this.currentFocusIndex = index;

      // Focus the inner button/link instead of the host element
      const menuItem = this.menuItems[index];
      const innerButton = menuItem.shadowRoot?.querySelector('button');
      const innerLink = menuItem.shadowRoot?.querySelector('pds-link')?.shadowRoot?.querySelector('a');

      if (innerButton) {
        return innerButton.focus();
      } else if (innerLink) {
        return innerLink.focus();
      } else {
        // Fallback to focusing the host if we can't find the inner element
        menuItem.focus();
      }
    }
  }

  // Focus the next menu item
  private focusNextItem(): void {
    let nextIndex = (this.currentFocusIndex + 1) % this.menuItems.length;

    // Skip disabled items
    let attempts = 0;
    const maxAttempts = this.menuItems.length;

    while (attempts < maxAttempts && this.menuItems[nextIndex].disabled) {
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

    while (attempts < maxAttempts && this.menuItems[prevIndex].disabled) {
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
          while (firstIndex < this.menuItems.length && this.menuItems[firstIndex].disabled) {
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
          while (lastIndex >= 0 && this.menuItems[lastIndex].disabled) {
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
            while (firstFocusableIndex < this.menuItems.length && this.menuItems[firstFocusableIndex].disabled) {
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
            while (firstFocusableIndex < this.menuItems.length && this.menuItems[firstFocusableIndex].disabled) {
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
      <Host id={this.componentId}>
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
        >
          <slot onSlotchange={this.handleSlotChange}></slot>
        </pds-box>
      </Host>
    );
  }
}
