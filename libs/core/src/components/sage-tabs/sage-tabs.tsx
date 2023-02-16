import { Component, Element, Host, h, Prop, Listen } from '@stencil/core';
@Component({
  tag: 'sage-tabs',
  styleUrl: 'sage-tabs.scss',
  shadow: true,
  // scoped: true,
})
export class SageTabs {
  private tabs;
  private tabPanels;
  @Element() el: HTMLDivElement;

  @Prop() variant: 'primary' | 'availability' | 'filter' = 'primary';
  @Prop() tablistLabel: string;
  @Prop({mutable: true}) activeTab: string;
  @Prop() id: string;

  @Listen('tabClick', {
    passive: true,
    target: 'body',
  }) 
  private tabClickHandler(event: CustomEvent<string>) {
    if (this.id === event.detail[1]) {
      this.activeTab = event.detail[0];
    }
  }

  private passPropsToChildren = () => {
    this.tabs = this.el.querySelectorAll('sage-tab');
    this.tabPanels = this.el.querySelectorAll('sage-tab-panel');
    this.tabs.forEach(child => {
      child['activeTab'] = this.activeTab.toString();
      child['parentComponent'] = this.id.toString();
      child['variant'] = this.variant.toString();
    });
    this.tabPanels.forEach(child => {
      child['activeTab'] = this.activeTab.toString();
      child['parentComponent'] = this.id.toString();
      child['variant'] = this.variant.toString();
    });
  }

  @Listen('keydown', {
    passive: true,
  })
  private handleKeyDown(ev: KeyboardEvent){
    const tabList = Array.from(this.el.querySelectorAll('[role="tab"]'));
    const activeEl = this.getActiveElement();
    const tabLocations = this.getTabLocations(tabList);
    const firstTabNumber = 0;
    const lastTabNumber = tabLocations.length - 1;

    if (ev.key === 'ArrowLeft') {
      if (activeEl.id === tabLocations[0].id) {
        tabLocations[lastTabNumber].focus();
        this.activeTab = tabLocations[lastTabNumber].id;
      } else {
        for (let i = 0; i < tabLocations.length; i += 1) {
          if(tabLocations[i].id === activeEl.id ) {
            tabLocations[i - 1].focus();
            this.activeTab = tabLocations[i - 1].id;
          }
        }
      }
    }

    if (ev.key === 'ArrowRight') {
      if (activeEl.id === tabLocations[lastTabNumber].id) {
        tabLocations[firstTabNumber].focus();
        this.activeTab = tabLocations[firstTabNumber].id;
      } else {
        for (let i = 0; i < tabLocations.length; i += 1) {
          if(tabLocations[i].id === activeEl.id ) {
            tabLocations[i + 1].focus();
            this.activeTab = tabLocations[i + 1].id;
          }
        }
      }
    }

    if (ev.key === 'Home') {
      if (activeEl.id != tabLocations[firstTabNumber].id) {
        tabLocations[firstTabNumber].focus();
        this.activeTab = tabLocations[firstTabNumber].id;
      }
    }

    if (ev.key === 'End') {
      if (activeEl.id != tabLocations[lastTabNumber].id) {
        tabLocations[lastTabNumber].focus();
        this.activeTab = tabLocations[lastTabNumber].id;
      }
    }
  }

  private classNames = () => {
    let className = `sage-tabs`;
    if (this.variant && this.variant != 'primary') {
      const variantClassName = `sage-tabs--${this.variant}`;
      className += ' ' + variantClassName;
    }
    return className;
  };

  private getTabLocations(tabList) {
    const tabs = [];
    for (let i = 0; i < tabList.length; i += 1) {
      const tab = tabList[i];

      tabs.push(tab);
    }
    return(tabs);
  }

  // Copied code - might be overkill or ideal to make global?
  private getActiveElement(root: Document | ShadowRoot = document): Element | null {
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
      <Host active-tab={this.activeTab} class={this.classNames()}>
        <div class="sage-tabs__tablist" role="tablist" aria-label={this.tablistLabel}>
          <slot name="tabs" />
        </div>
        <slot name="tab-panels" />
      </Host>
    );
  }
}
