import { Component, Element, Host, h, Prop, Listen, State } from '@stencil/core';
@Component({
  tag: 'sage-tab-panel',
  styleUrl: 'sage-tab-panel.scss',
  shadow: false,
})
export class SageTabPanel {
  @Element() el: HTMLElement;

  @Prop() tab: string;
  @Prop({mutable: true}) activeTab: string;
  @Prop({mutable: true}) selected = false;
  
  @State() generatedClassName: string;
  @Prop() ariaControlledBy: string;

  @Listen('tabClick', {
    passive: true,
    target: 'body',
  }) 
  tabClickHandler(event: CustomEvent<string>) {
    this.activeTab = event.detail;
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
        <div 
          role="tabpanel"
          id={this.tab + '-panel'}
          aria-labelledby={this.tab}
          class={this.selected ? "sage-tabs__tabpanel is-active" : "sage-tabs__tabpanel"}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
