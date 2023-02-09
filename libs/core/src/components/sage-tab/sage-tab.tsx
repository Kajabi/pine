import { Component, Element, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
@Component({
  tag: 'sage-tab',
  styleUrl: 'sage-tab.scss',
  shadow: false,
})
export class SageTab {
  @Element() el: HTMLElement;

  @Prop() tab: string;
  @Prop({mutable: true}) activeTab: string;
  @Prop({mutable: true}) selected = false;
 
  @Event() tabClick: EventEmitter<any>;
  onTabClick(tab) {
    this.activeTab = tab;
    this.tabClick.emit(tab);
  }

  matchActiveTab() {
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
    return (
      <Host>
        <button 
          role="tab"
          id={this.tab}
          aria-controls={this.tab + "-panel"}
          tabindex={this.selected ? "0" : "-1"}
          aria-selected={this.selected ? "true" : "false"}
          class="sage-tabs__tab"
          // onClick={this.onTabClick.bind(this, this.tab)}
          onClick={this.onTabClick.bind(this, this.tab)}
        >
          <slot />
        </button>
      </Host>
    );
  }
}
