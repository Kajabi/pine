import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';

/**
 * @slot (default) - The sortable item's content
 */
@Component({
  tag: 'pds-list-option',
  styleUrl: 'pds-list-option.scss',
  scoped: true,
})
export class PdsListOption {
  /**
   * A unique identifier for component.
   */
  @Prop() componentId: string;

  @Element() element: HTMLPdsListOptionElement;

  /**
   * Emitted after a list option is selected
   */
  @Event() pdsListOptionSelected: EventEmitter;

  private handleClick() {
    // Dispatch the custom event with the componentId as its payload
    this.pdsListOptionSelected.emit(this.componentId);
  }

  render() {
    return (
      <Host
        role="menuitem"
        tabIndex={0}
        id={this.componentId}
        onClick={() => this.handleClick()}
      >
        <div class="pds-list-option">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
