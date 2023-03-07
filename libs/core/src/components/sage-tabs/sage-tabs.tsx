import { Component, Element, Host, h, Prop, Listen } from '@stencil/core';
import { move } from 'fs-extra';

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
  */
  @Prop() variant!: 'primary' | 'availability' | 'filter';

  /**
   * Sets starting active tab and maintains active tab as component re-renders
   */
  @Prop({mutable: true}) activeTab!: string;
  
  @Prop({mutable: true}) activeTabIndex!: number;

  @Listen('tabClick', {
    target: 'body',
  })
  tabClickHandler(event: CustomEvent<any>) {
    if (this.componentId === event.detail[1]) {
      this.activeTabIndex = event.detail[0];
      this.activeTab = this.tabs[this.activeTabIndex].tab;
    }
  }

  @Listen('keydown', {passive: true, target: 'window'})
  handleKeyDown(ev: KeyboardEvent) {
    const keySet = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (keySet.includes(ev.key)) {
      this.moveActiveTab(ev.key);
    }
  }

  private moveActiveTab(key) {
    const firstTabNumber = 0;
    const lastTabNumber = this.tabs.length - 1;
    
    let moveFocusTo = null;

    switch (key) {
      case 'ArrowLeft':
        moveFocusTo = (this.activeTabIndex === firstTabNumber) ? lastTabNumber : (this.activeTabIndex + (-1));
        break;
      case 'ArrowRight':
        moveFocusTo = (this.activeTabIndex === lastTabNumber) ? firstTabNumber : (this.activeTabIndex + 1);
        break;
      case 'Home':
        moveFocusTo = firstTabNumber;
        break;
      case 'End':
        moveFocusTo = lastTabNumber;
        break;
    }
  
    // Move focus to the button element within `sage-tab`
    this.tabs[moveFocusTo].children[0].focus();
    this.activeTab = this.tabs[moveFocusTo].tab;
    this.activeTabIndex = moveFocusTo;
  }

  private findAllChildren() {
    this.tabs = this.el.querySelectorAll('sage-tab');
    this.tabPanels = this.el.querySelectorAll('sage-tabpanel');
  }

  private propGeneration(child, index) {
    child.parentComponentId = this.componentId.toString();
    child.variant = this.variant.toString();
    child.selected = (this.activeTab === child.tab) ? true : false;
    child['index'] = index;
  }

  private passPropsToChildren() {
    this.tabs.forEach((child, index) => {
      this.propGeneration(child, index);
    });
    this.tabPanels.forEach((child, index) => {
      this.propGeneration(child, index);
    });
  }

  private classNames() {
    let className = `sage-tabs`;
    if (this.variant && this.variant != 'primary') {
      const variantClassName = `sage-tabs--${this.variant}`;
      className += ' ' + variantClassName;
    }

    return className;
  };

  componentWillRender() {
    this.findAllChildren();
    this.passPropsToChildren();
  }

  render() {
    return (
      <Host active-tab={this.activeTab} class={this.classNames()} id={this.componentId}>
        <div class="sage-tabs__tablist" role="tablist" aria-label={this.tablistLabel}>
          <slot name="tabs" />
        </div>
        <slot name="tabpanels" />
      </Host>
    );
  }
}
