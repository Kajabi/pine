import { Component, Element, Host, h, Prop, Listen } from '@stencil/core';

  /**
 * @slot tabs - Content is placed within the `div[role="tablist"]` element as children
 * @slot tabpanels - Content is placed directly after the `div[role="tablist"]` element as siblings
 */
@Component({
  tag: 'sage-tabs',
  styleUrl: 'sage-tabs.scss',
  shadow: true,
})
export class SageTabs {
  private tabs;
  private tabPanels;

  @Element() el: HTMLDivElement;

  /**
   * Sets the aria-label attached to the tablist element
  */
  @Prop() tablistLabel!: string;
 
  /**
    * Sets unique id on tabs component
  */
  @Prop() componentId!: string;
  
  /**
   * Sets tabs variant styles as outlined in Figma documentation
   * @defaultValue primary
    */
  @Prop() variant?: 'primary' | 'availability' | 'filter' = 'primary';

  /**
   * Sets default active tab
   */
  @Prop({mutable: true}) activeTab!: string;

  @Listen('tabClick', {
    target: 'body',
  })
  tabClickHandler(event: CustomEvent<string>) {
    if (this.componentId === event.detail[1]) {
      this.activeTab = event.detail[0];
    }
  }

  private matchActiveTab(activeTab, tab) {
    if (activeTab && activeTab === tab) {
      return true;
    } else {
      return false;
    }
  }

  private findAllChildren() {
    this.tabs = this.el.querySelectorAll('sage-tab');
    this.tabPanels = this.el.querySelectorAll('sage-tabpanel');
  }

  private propGeneration(child) {
    child['selected'] = this.matchActiveTab(this.activeTab, child.tab);
    if (this.componentId) {child.parentComponent = this.componentId.toString()};
    if (this.variant) {child['variant'] = this.variant.toString()};
  }

  private passPropsToChildren() {
    this.tabs.forEach(child => {
      this.propGeneration(child);
    });
    this.tabPanels.forEach(child => {
      this.propGeneration(child);
    });
  }

  @Listen('keydown', {})
  handleKeyDown(ev: KeyboardEvent) {
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

  private classNames() {
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
  
  componentWillRender() {
    this.findAllChildren()
    this.passPropsToChildren()
  }

  render() {
    return (
      <Host active-tab={this.activeTab} class={this.classNames()}>
        <div class="sage-tabs__tablist" role="tablist" aria-label={this.tablistLabel}>
          <slot name="tabs" />
        </div>
        <slot name="tabpanels" />
      </Host>
    );
  }
}
