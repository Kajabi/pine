import { Component, Element, Host, h, Prop, State, Listen } from '@stencil/core';
@Component({
  tag: 'sage-tabs',
  styleUrl: 'sage-tabs.scss',
  shadow: true,
})
export class SageTabs {
  private tabs;
  private tabPanels;
  @Element() el: HTMLDivElement;

  @Prop() tablistLabel = "tablist label";
  @State() activeTab = "one";

  @Listen('tabClick', {
    passive: true,
    target: 'body',
  }) 
  tabClickHandler(event: CustomEvent<string>) {
    this.activeTab = event.detail;
  }

  private passPropsToChildren = () => {
    this.tabs = this.el.shadowRoot.querySelectorAll('sage-tab');
    this.tabPanels = this.el.shadowRoot.querySelectorAll('sage-tab-panel');
    this.tabs.forEach(child => {
      child['activeTab'] = this.activeTab.toString();
    });
    this.tabPanels.forEach(child => {
      child['activeTab'] = this.activeTab.toString();
    });
  }

  @Listen('keydown', {
    passive: true,
  })
  handleKeyDown(ev: KeyboardEvent){
    const tabList = Array.from(this.el.shadowRoot.querySelectorAll('[role="tab"]'));
    const activeEl = this.getActiveElement();
    const tabLocations = this.getTabLocations(tabList);
    this.getActiveElement();
    if (ev.key === 'ArrowLeft') {
      if (activeEl.id === tabLocations[0].id) {
        const lastTabNumber = tabLocations.length - 1;
        tabLocations[lastTabNumber].focus();
      } else {
        for (let i = 0; i < tabLocations.length; i += 1) {
          if(tabLocations[i].id === activeEl.id ) {
            tabLocations[i - 1].focus();
          }
        }
      }
    }

    if (ev.key === 'ArrowRight') {
      const lastTabNumber = tabLocations.length - 1;
      if (activeEl.id === tabLocations[lastTabNumber].id) {
        tabLocations[0].focus();
      } else {
        for (let i = 0; i < tabLocations.length; i += 1) {
          if(tabLocations[i].id === activeEl.id ) {
            tabLocations[i + 1].focus();
          }
        }
      }
    }
  }

  getTabLocations(tabList) {
    const tabs = [];
    for (let i = 0; i < tabList.length; i += 1) {
      const tab = tabList[i];

      tabs.push(tab);
    }
    return(tabs);
  }

  // Copied code - might be overkill or ideal to make global?
  getActiveElement(root: Document | ShadowRoot = document): Element | null {
    const activeEl = root.activeElement;
  
    if (!activeEl) {
      return null;
    }
  
    if (activeEl.shadowRoot) {
      return this.getActiveElement(activeEl.shadowRoot);
    } else {
      return activeEl;
    }
  }
  
  componentDidRender() {
    this.passPropsToChildren()
  }

  render() {    
    return (
      <Host>
        {this.activeTab}
        <div role="tablist" aria-label={this.tablistLabel}>
          <sage-tab tab="one">Test</sage-tab>
          <sage-tab tab="two">Test</sage-tab>
          <sage-tab tab="three">Test</sage-tab>
        </div>

        <sage-tab-panel tab="one">
          <b>testing 1</b>
          <p>testing string</p>
        </sage-tab-panel>

        <sage-tab-panel tab="two">
          Content 2
        </sage-tab-panel>

        <sage-tab-panel tab="three">
          Content 3
        </sage-tab-panel>
      </Host>
      
    );
  }
}
