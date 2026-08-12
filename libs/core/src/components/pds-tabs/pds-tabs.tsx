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
   * Adds a divider rule beneath the tab list.
   * @defaultValue false
   */
  @Prop() divider?: boolean = false;

  /**
   * Stretches the component so the active tab panel fills the remaining height.
   * Requires the component to have a constrained height (e.g. a flex parent).
   * @defaultValue false
   */
  @Prop() stretch?: boolean = false;

  /**
   * Renders the tab strip as navigation instead of an in-page panel switcher: each
   * `pds-tab` becomes an `<a href>` inside a `<nav>` landmark (with `aria-current`
   * on the `active` tab) rather than a `role="tab"` button over a `pds-tabpanel`.
   * Give every `pds-tab` an `href` and omit `pds-tabpanel`s.
   * @defaultValue false
   */
  @Prop() nav?: boolean = false;

  /**
   * Sets the starting active tab name and maintains the name as the component re-renders.
   * Panel mode only — in navigation mode (`nav`) the active tab is set per-tab via
   * `active`, so this is not required there.
   */
  @Prop({mutable: true}) activeTabName?: string;

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
    // Navigation mode uses real links: Tab moves focus, Enter follows the href.
    // The roving/arrow model is a panel-mode (role=tab) concern only.
    if (this.isNav) return;

    const keySet = ["ArrowLeft", "ArrowRight", "Home", "End"];

    // Only handle keyboard navigation if the event originated from a tab button
    // that belongs to THIS tabs component
    const target = ev.target as HTMLElement;
    const targetTab = target.closest('pds-tab');

    // Check if the tab belongs to this tabs instance (not a nested one)
    const isOwnTab = targetTab && targetTab.closest('pds-tabs') === this.el;

    if (keySet.includes(ev.key) && isOwnTab) {
      ev.preventDefault();
      this.moveActiveTab(ev.key);
    }
  }

  // Navigation mode is an explicit, single source of truth: `nav` drives both the
  // container (<nav> of links vs role=tablist of buttons) and every child tab (via
  // `navMode`), so a strip can't mix the two.
  private get isNav() {
    return !!this.nav;
  }

  // `nav` and per-tab `href` should agree. Warn on the two authoring mistakes
  // rather than silently rendering a link with no destination, or ignoring an href.
  private warnOnNavConfig() {
    if (!this.tabs?.length) return;
    const withHref = this.tabs.filter((tab) => tab.hasAttribute('href')).length;
    if (this.nav && withHref < this.tabs.length) {
      console.warn('pds-tabs: `nav` is set, so every pds-tab needs an `href`.');
    } else if (!this.nav && withHref > 0) {
      console.warn(
        'pds-tabs: a pds-tab has an `href` but `nav` is not set — add `nav` to pds-tabs for navigation mode; the href is ignored in panel mode.',
      );
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
      child.navMode = this.nav;
    });

    this.tabPanels.forEach((child) => {
      this.propGeneration(child);
      child.stretch = this.stretch;
    });
  }

  private classNames() {
    let className = `pds-tabs`;
    if (this.variant && this.variant != 'primary') {
      const variantClassName = `pds-tabs--${this.variant}`;
      className += ' ' + variantClassName;
    }
    if (this.divider) {
      className += ' pds-tabs--divider';
    }
    if (this.stretch) {
      className += ' pds-tabs--stretch';
    }

    return className;
  };

  componentWillLoad() {
    this.findAllChildren();
    this.warnOnNavConfig();
  }

  componentWillRender() {
    this.passPropsToChildren();
  }

  render() {
    // Navigation mode: a <nav> landmark of links (aria-current marks the current
    // page). Panel mode: the ARIA tablist of role=tab buttons over tabpanels.
    const tabList = this.isNav ? (
      <nav class="pds-tabs__tablist" aria-label={this.tablistLabel || undefined} part="tab-list">
        <slot name="tabs" />
      </nav>
    ) : (
      <div class="pds-tabs__tablist" role="tablist" aria-label={this.tablistLabel} part="tab-list">
        <slot name="tabs" />
      </div>
    );

    return (
      <Host active-tab-name={this.activeTabName} class={this.classNames()} id={this.componentId}>
        {tabList}
        <slot name="tabpanels" />
      </Host>
    );
  }
}
