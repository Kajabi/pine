import { Component, Element, Host, h, Prop, Listen } from '@stencil/core';

  /**
 * @slot tabs - Content is placed within the `div[role="tablist"]` element as children
 * @slot tabpanels - Content is placed directly after the `div[role="tablist"]` element as siblings
 * @part tab-list - Exposes the container element that holds all the tab buttons for styling.
 */
@Component({
  tag: 'pds-tabs',
  styleUrls: ['pds-tabs.scss'],
  shadow: true,
})
export class PdsTabs {
  private tabs;
  private tabPanels;

  @Element() el: HTMLPdsTabsElement;

  /**
   * Sets the aria-label attached to the tablist element
   */
  @Prop() tablistLabel!: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Sets tabs variant styles as outlined in Figma documentation
   */
  @Prop() variant!: 'primary' | 'availability' | 'filter' | 'pill';

  /**
   * Sets the starting active tab name and maintains the name as the component re-renders
   */
  @Prop({mutable: true}) activeTabName!: string;

  /**
   * Sets the starting active tab index number and maintains the index number as the component re-renders
   */
  /** @internal */
  @Prop({mutable: true}) activeTabIndex: number;

  @Listen('pdsTabClick', {
    target: 'body',
  })
  tabClickHandler(event: CustomEvent<any>) {
    if (this.componentId === event.detail[1]) {
      this.activeTabIndex = event.detail[0];
      this.activeTabName = this.tabs[this.activeTabIndex].name;
    }
  }

  @Listen('keydown', {})
  handleKeyDown(ev: KeyboardEvent) {
    const keySet = ["ArrowLeft", "ArrowRight", "Home", "End"];

    // Only handle keyboard navigation if the event did NOT originate from within
    // a tabpanel that belongs to THIS tabs component
    const target = ev.target as HTMLElement;
    const closestTabpanel = target.closest('pds-tabpanel');

    // If there's a tabpanel, check if it belongs to this tabs instance
    // by seeing if this tabs element is the closest tabs parent of the tabpanel
    const isOwnTabpanel = closestTabpanel && closestTabpanel.closest('pds-tabs') === this.el;

    if (keySet.includes(ev.key) && !isOwnTabpanel) {
      ev.preventDefault();
      this.moveActiveTab(ev.key);
    }
  }

  private moveActiveTab(key: string) {
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

    // Move focus to the button element within `pds-tab`
    this.tabs[moveFocusTo].children[0].focus();
    this.activeTabName = this.tabs[moveFocusTo].name;
    this.activeTabIndex = moveFocusTo;
  }

  private findAllChildren() {
    // Only select direct children tabs/tabpanels, not nested ones
    const allTabs = Array.from(this.el.querySelectorAll('pds-tab'));
    const allTabPanels = Array.from(this.el.querySelectorAll('pds-tabpanel'));

    // Filter to only include tabs that belong to this tabs component (not nested)
    this.tabs = allTabs.filter(tab => tab.closest('pds-tabs') === this.el);
    this.tabPanels = allTabPanels.filter(panel => panel.closest('pds-tabs') === this.el);
  }

  private propGeneration(child, index = 0) {
    child.parentComponentId = this.componentId.toString();
    child.variant = this.variant.toString();
    child.selected = (this.activeTabName === child.name) ? true : false;
    child['index'] = index;
  }

  private passPropsToChildren() {
    this.tabs.forEach((child, index) => {
      if (this.activeTabName === child.name) this.activeTabIndex = index;
      this.propGeneration(child, index);
    });

    this.tabPanels.forEach((child) => {
      this.propGeneration(child);
    });
  }

  private classNames() {
    let className = `pds-tabs`;
    if (this.variant && this.variant != 'primary') {
      const variantClassName = `pds-tabs--${this.variant}`;
      className += ' ' + variantClassName;
    }

    return className;
  };

  componentWillLoad() {
    this.findAllChildren();
  }

  componentWillRender() {
    this.passPropsToChildren();
  }

  render() {
    return (
      <Host active-tab-name={this.activeTabName} class={this.classNames()} id={this.componentId}>
        <div class="pds-tabs__tablist" role="tablist" aria-label={this.tablistLabel} part="tab-list">
          <slot name="tabs" />
        </div>
        <slot name="tabpanels" />
      </Host>
    );
  }
}
