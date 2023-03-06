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
      this.activeTab = this.tabs[this.activeTabIndex].children[0].id;
    }
  }

  private matchActiveTab(activeTab, tab) {
    if (activeTab === tab) {
      return true;
    }

    return false;
  }

  private findAllChildren() {
    this.tabs = this.el.querySelectorAll('sage-tab');
    this.tabPanels = this.el.querySelectorAll('sage-tabpanel');
  }

  private propGeneration(child, index = 0) {
    child['selected'] = this.matchActiveTab(this.activeTab, child.tab);
    if (this.componentId) {child.parentComponent = this.componentId.toString()};
    if (this.variant) {child['variant'] = this.variant.toString()};
    child['index'] = index;
  }

  private passPropsToChildren() {
    this.tabs.forEach((child, idx) => {
      this.propGeneration(child, idx);
    });
    this.tabPanels.forEach((child, idx) => {
      this.propGeneration(child, idx);
    });
  }

  @Listen('keydown', {passive: true, target: 'window'})
  handleKeyDown(ev: KeyboardEvent) {
    const keySet = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (keySet.includes(ev.key)) {
      this.moveActiveTab(ev.key);
    }
  }

  private moveActiveTab(key) {
    this.findAllChildren()
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
    this.activeTab = this.tabs[moveFocusTo].children[0].id;
    this.activeTabIndex = moveFocusTo;
  }

    
    // if (key === "ArrowLeft" || key === "ArrowRight") {
    //   const loopFocusLocation = (key === "ArrowLeft") ? firstTabNumber : lastTabNumber;
    //   const loopFocusNewTarget = (key === "ArrowLeft") ? lastTabNumber : firstTabNumber;
    //   const moveFocusTo = (key === "ArrowLeft") ? -1 : 1;

    //   if (this.activeTab === tabLocations[loopFocusLocation].id) {}

    //   if (this.activeTab === tabLocations[loopFocusLocation].id) {
    //     tabLocations[loopFocusNewTarget].focus();
    //     this.activeTab = tabLocations[loopFocusNewTarget].id;
    //   } else {
    //     for (let i = 0; i < tabLocations.length; i += 1) {
    //       if(tabLocations[i].id === this.activeTab ) {
    //         tabLocations[i + moveFocusTo].focus();
    //         this.activeTab = tabLocations[i +  moveFocusTo].id;
    //         break;
    //       }
    //     }
    //   }
    // } else {
    //   const loopFocusNewTarget = (key === "Home") ? firstTabNumber : lastTabNumber;
    //   if (this.activeTab) {
    //     if (this.activeTab != tabLocations[loopFocusNewTarget].id) {
    //       tabLocations[loopFocusNewTarget].focus();
    //       this.activeTab = tabLocations[loopFocusNewTarget].id;
    //     }
    //   }
    // }
  // }

  private classNames() {
    let className = `sage-tabs`;
    if (this.variant && this.variant != 'primary') {
      const variantClassName = `sage-tabs--${this.variant}`;
      className += ' ' + variantClassName;
    }
    return className;
  };

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
