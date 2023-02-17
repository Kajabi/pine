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
  @Prop({mutable: true}) parentComponent: string;
  @Prop({mutable: true}) selected = false;
  
  @State() generatedClassName: string;
  @Prop() ariaControlledBy: string;

  @Listen('tabClick', {
    passive: true,
    target: 'body',
  }) 
  tabClickHandler(event: CustomEvent<string>) {
    if (this.parentComponent === event.detail[1]) {
      this.activeTab = event.detail[0];
    }
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
    return (
      <Host>
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
