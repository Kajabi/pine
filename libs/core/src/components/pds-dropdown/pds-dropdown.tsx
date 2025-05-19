import { Component, Element, Host, h, Prop } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';
import { PlacementType } from '@utils/types';
import {  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

@Component({
  tag: 'pds-dropdown',
  styleUrl: 'pds-dropdown.scss',
  shadow: true,
})
export class PdsDropdown implements BasePdsProps {
  @Element() host: HTMLPdsDropdownElement;

  private slotEl: HTMLSlotElement;
  private triggerEl: HTMLElement;
  private panelEl: HTMLPdsBoxElement;

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

  private handleClick = () => {
    computePosition(this.triggerEl, this.panelEl, {
      placement: this.placement,
      middleware: [offset(6), flip(), shift({padding: 5})],
    }).then(({ x, y }) => {
      Object.assign(this.panelEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });

    this.host.shadowRoot?.querySelector('pds-box').classList.toggle('is-hidden')
    ;
  }



  render() {
    return (
      <Host id={this.componentId}>
        <slot name="trigger" onSlotchange={this.handleTriggerSlotChange}></slot>
        <pds-box border-radius="sm" display="flex" direction="column" class="pds-dropdown--panel is-hidden" shadow="100">
          <slot></slot>
        </pds-box>
      </Host>
    );
  }
}
