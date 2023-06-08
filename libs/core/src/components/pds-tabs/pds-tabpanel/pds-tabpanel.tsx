import { Component, Element, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-tabpanel',
  styleUrl: 'pds-tabpanel.scss',
  shadow: false,
})
export class PdsTabpanel {
  @Element() el: HTMLElement;

  /**
   * Sets the related tab name, this name must match a `pds-tab`'s tab name property
   */
  @Prop() name!: string;

  /**
   * Keeps track of the parentComponentId unique id, this property is passed by parent component
   */
  /** @internal */
  @Prop({mutable: true}) parentComponentId: string;

  /**
   * Keeps track of if the expected tab variant, this property is passed by parent component
   */
  /** @internal */
  @Prop() variant: string;

  /**
   * Keeps track of the tabpanel selected state, this property is passed by parent component
   */
  /** @internal */
  @Prop({mutable: true}) selected = false;

  render() {
    return (
      <Host slot="tabpanels">
        <div
          role="tabpanel"
          id={this.parentComponentId + "__" + this.name + '-panel'}
          tabindex="0"
          aria-labelledby={this.parentComponentId + "__" + this.name}
          class={this.selected ? "pds-tabpanel is-active" : "pds-tabpanel"}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
