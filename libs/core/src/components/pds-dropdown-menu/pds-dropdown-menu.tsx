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
    const activeElement = document.activeElement;
    return this.menuItems.findIndex(item => item === activeElement);
  }

  // Focus a specific menu item by index
  private focusItemByIndex(index: number): void {
    if (index >= 0 && index < this.menuItems.length) {
      this.currentFocusIndex = index;
      this.menuItems[index].focus();
    }
  }

  // Focus the next menu item
  private focusNextItem(): void {
    const currentIndex = this.getFocusedItemIndex();

    if (currentIndex === -1 && this.menuItems.length > 0) {
      this.focusItemByIndex(0);
    } else if (this.menuItems.length > 0) {
      // Calculate the next index, wrapping around to the beginning if necessary
      const nextIndex = (currentIndex + 1) % this.menuItems.length;
      this.focusItemByIndex(nextIndex);
    }
  }

  // Focus the previous menu item
  private focusPreviousItem(): void {
    const currentIndex = this.getFocusedItemIndex();

    if (currentIndex === -1 && this.menuItems.length > 0) {
      this.focusItemByIndex(this.menuItems.length - 1);
    } else if (this.menuItems.length > 0) {
      // Calculate the previous index, wrapping around to the end if necessary
      const prevIndex = (currentIndex - 1 + this.menuItems.length) % this.menuItems.length;
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
          this.focusItemByIndex(0);
        }
        break;

      case 'End':
        event.preventDefault();
        if (this.menuItems.length > 0) {
          this.focusItemByIndex(this.menuItems.length - 1);
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
            this.focusItemByIndex(currentIndex - 1);
          }
          // If on first item or no item, let natural tab order move back to trigger
        } else {
          // Forward Tab navigation
          const activeElement = document.activeElement;
          const isTriggerFocused = activeElement === this.triggerEl;
          const currentIndex = this.getFocusedItemIndex();

          if (isTriggerFocused && this.menuItems.length > 0) {
            // If trigger is focused, move to first menu item
            event.preventDefault();
            this.focusItemByIndex(0);
          } else if (currentIndex === -1 && this.menuItems.length > 0) {
            // If no menu item is focused, focus the first one
            event.preventDefault();
            this.focusItemByIndex(0);
          } else if (currentIndex !== -1) {
            // If on last item, wrap around to first item
            // Otherwise, move to next item
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % this.menuItems.length;
            this.focusItemByIndex(nextIndex);
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
