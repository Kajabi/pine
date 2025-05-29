import { Component, Element, Host, h, Prop } from '@stencil/core';
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
  @Element() host: HTMLPdsDropdownMenuElement;

  private slotEl: HTMLSlotElement;
  private triggerEl: HTMLElement;
  private panelEl: HTMLPdsBoxElement;
  private isOpen: boolean = false;

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
  }

  // Close the dropdown
  private closeDropdown = () => {
    this.host.shadowRoot?.querySelector('pds-box').classList.add('is-hidden');
    this.isOpen = false;
  }

  // Handle click on the trigger element
  private handleClick = () => {
    this.toggleDropdown();
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
