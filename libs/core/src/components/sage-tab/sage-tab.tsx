import { Component, Element, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';

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
  @Prop() variant: string;

  /**
   * Keeps track of if the tabpanel is selected, this property is computed on `componentWillUpdate()`
  */
  @State() selected = false;
 
  /**
   * Emits an event upon tab click for `sage-tab` and `sage-tabpanel` to listen for
   */
  @Event() tabClick: EventEmitter<object>;
  private onTabClick(tab, parentComponent) {
    this.activeTab = tab;
    this.tabClick.emit([tab, parentComponent]);
  }

  private matchActiveTab() {
    if (this.activeTab && this.activeTab === this.tab) {
      this.selected = true;
    } else {
      this.selected = false;
    }
  }

  componentWillRender() {
    this.matchActiveTab();
  }

  render() {
    const availabilityTabEdgeInlineStart = (
      <span class="sage-tab-edge" role="presentation"></span>
    )

    const availabilityTabEdgeInlineEnd = (
      <span class="sage-tab-edge sage-tab-edge--end" role="presentation"></span>
    )

    return (
      <Host variant={this.variant} slot="tabs">
        <button 
          role="tab"
          id={this.tab}
          aria-controls={this.tab + "-panel"}
          tabindex={this.selected ? "0" : "-1"}
          aria-selected={this.selected ? "true" : "false"}
          class={this.selected ? "sage-tab is-active" : "sage-tab"}
          onClick={this.onTabClick.bind(this, this.tab, this.parentComponent)}
        >
          {this.variant === "availability" && availabilityTabEdgeInlineStart}
          {this.variant === "availability" && availabilityTabEdgeInlineEnd}
          <div class="sage-tab__content"><slot/></div>
        </button>
      </Host>
    );
  }
}
