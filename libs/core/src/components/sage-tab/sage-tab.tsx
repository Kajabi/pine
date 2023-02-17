import { Component, Element, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
@Component({
  tag: 'sage-tab',
  styleUrl: 'sage-tab.scss',
  shadow: false,
})
export class SageTab {
  @Element() el: HTMLElement;

  /**
   * Sets the related tab name, this name must match a `sage-tabpanel`'s tab property, required
  */
  @Prop() tab: string;

  /**
   * Keeps track of the activeTab, this property is passed in by parent component
  */
  @Prop({mutable: true}) activeTab: string;

  /**
   * Keeps track of the parentComponent unique id, this property is passed in by parent component
  */
  @Prop({mutable: true}) parentComponent: string;

  /**
   * Keeps track of if the expected tab variant, this property is passed in by parent component
  */
  @Prop({mutable: true}) variant: string;

  /**
   * Keeps track of if the tabpanel is selected, this property is computed on `componentWillUpdate()`
  */
  @Prop({mutable: true}) selected = false;
 
  /**
   * Emits an event upon tab click for `sage-tab` and `sage-tabpanel` to listen for
   */
  @Event({composed: false}) tabClick: EventEmitter<object>;
  private onTabClick(tab, parentComponent) {
    this.activeTab = tab;
    this.tabClick.emit([tab, parentComponent]);
  }

  private matchActiveTab() {
    if (this.tab === this.activeTab) {
      this.selected = true;
    } else {
      this.selected = false;
    }
  }

  componentWillUpdate() {
    this.matchActiveTab();
  }

  render() {
    const availabilityTabEdgeInlineStart = (
      <span class="sage-tab-edge"></span>
    )

    const availabilityTabEdgeInlineEnd = (
      <span class="sage-tab-edge sage-tab-edge--end"></span>
    )

    return (
      <Host variant={this.variant} slot="tabs">
        <button 
          role="tab"
          id={this.parentComponent + "-" + this.tab}
          aria-controls={this.parentComponent + "-" + this.tab + "-panel"}
          tabindex={this.selected ? "0" : "-1"}
          aria-selected={this.selected ? "true" : "false"}
          class={this.selected ? "sage-tab is-active" : "sage-tab"}
          onClick={this.onTabClick.bind(this, this.tab, this.parentComponent)}
        >
          {(this.variant && this.variant === "availability") && availabilityTabEdgeInlineStart}
          <div class="sage-tab__content"><slot/></div>
          {(this.variant && this.variant === "availability") && availabilityTabEdgeInlineEnd}
        </button>
      </Host>
    );
  }
}
