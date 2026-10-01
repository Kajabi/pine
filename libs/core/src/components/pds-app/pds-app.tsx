import { Component, Host, h, Prop, State } from '@stencil/core';

/**
 * @slot header - Fixed top bar (typically a `pds-topbar`). Not scrolled with the page.
 * @slot nav - Optional side navigation / rail, alongside the main content. Collapses to nothing when empty.
 * @slot (default) - Scrollable main content.
 */
@Component({
  tag: 'pds-app',
  styleUrl: 'pds-app.scss',
  shadow: true,
})
export class PdsApp {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Maximum width of the main content region. Accepts a named size token
   * (`'sm'` | `'md'` | `'lg'` | `'xl'` | `'full'`, matching `pds-container`) or
   * any valid CSS length. When omitted, no max-width is applied.
   */
  @Prop() mainSize?: string;

  // A named slot is always a real element in the shadow tree, whether or not
  // anything is assigned to it — a plain :not(:has(*)) selector would always
  // match the <slot> itself and never collapse. slotchange + assignedNodes
  // is the only reliable way to know if a named slot is actually in use.
  @State() hasHeader: boolean = false;
  @State() hasNav: boolean = false;

  private handleHeaderSlotChange = (event: Event) => {
    this.hasHeader = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

  private handleNavSlotChange = (event: Event) => {
    this.hasNav = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  };

  render() {
    return (
      <Host id={this.componentId}>
        <div class={{ 'pds-app__header': true, 'pds-app__header--empty': !this.hasHeader }}>
          <slot name="header" onSlotchange={this.handleHeaderSlotChange}></slot>
        </div>
        <div class="pds-app__body">
          <div class={{ 'pds-app__nav': true, 'pds-app__nav--empty': !this.hasNav }}>
            <slot name="nav" onSlotchange={this.handleNavSlotChange}></slot>
          </div>
          <pds-container class="pds-app__main" tag="main" size={this.mainSize}>
            <slot></slot>
          </pds-container>
        </div>
      </Host>
    );
  }
}
