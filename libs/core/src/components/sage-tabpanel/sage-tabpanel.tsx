import { Component, Element, Host, h, Prop, Listen, State } from '@stencil/core';

@Component({
  tag: 'sage-tabpanel',
  styleUrl: 'sage-tabpanel.scss',
  shadow: false,
})
export class SageTabpanel {
  @Element() el: HTMLElement;

  /**
   * Sets the related tab name, this name must match a `sage-tab`'s tab property, required
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
   * Keeps track of if the tabpanel is selected, this property is computed on `componentWillUpdate()`
  */
  @State() selected = false;
  
  @Listen('tabClick', {
    target: 'body',
  })
  tabClickHandler(event: CustomEvent<string>) {
    if (this.parentComponent === event.detail[1]) {
      this.activeTab = event.detail[0];
    }
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
