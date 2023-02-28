import { Component, Element, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-tabpanel',
  styleUrl: 'sage-tabpanel.scss',
  shadow: false,
})
export class SageTabpanel {
  @Element() el: HTMLElement;

  /**
   * Sets the related tab name, this name must match a `sage-tab`'s tab property
  */
  @Prop() tab!: string;
  
  /**
   * Keeps track of the parentComponent unique id, this property is passed by parent component
  */
  /** @internal */
  @Prop({mutable: true}) parentComponent: string;

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
          id={this.tab + '-panel'}
          aria-labelledby={this.tab}
          class={this.selected ? "sage-tabpanel is-active" : "sage-tabpanel"}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
