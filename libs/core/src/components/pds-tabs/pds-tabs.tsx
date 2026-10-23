import { Component, Element, Host, h, Prop, Listen } from '@stencil/core';
import { HostStylingKeeper } from '@utils/attributes';

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
  private hostKeeper = new HostStylingKeeper();
  private tabsSlot: HTMLSlotElement;
  private tabPanelsSlot: HTMLSlotElement;
  private slotChangeScheduled = false;
  private activeTabNameBeforeSlotChange: string | undefined;
  // The tab that most recently had focus, tracked continuously via `focusin` rather
  // than sampled inside handleSlotChange: removing a focused element blurs it to
  // <body> synchronously, but slotchange only fires later (a microtask checkpoint),
  // by which point the sample would already read <body>.
  private lastFocusedTab: Element | null = null;

  connectedCallback() {
    this.hostKeeper.connect(this.el);
    this.el.addEventListener('focusin', this.handleFocusIn);
    this.el.addEventListener('focusout', this.handleFocusOut);
    // componentDidLoad only runs once, so a reconnect (the element moved in the DOM) re-attaches
    // the slotchange listeners disconnectedCallback removed. Before the first render the slots
    // don't exist yet, so this is a no-op and componentDidLoad attaches them.
    const isReconnect = this.tabsSlot != null;
    this.setupSlotChangeListeners();
    // Content can change while detached, with no listener to see it — re-collect now
    // instead of waiting on a slotchange that may never come if nothing changes again.
    if (isReconnect) this.handleSlotChange();
  }

  disconnectedCallback() {
    this.hostKeeper.disconnect();
    this.el.removeEventListener('focusin', this.handleFocusIn);
    this.el.removeEventListener('focusout', this.handleFocusOut);
    this.tabsSlot?.removeEventListener('slotchange', this.handleSlotChange);
    this.tabPanelsSlot?.removeEventListener('slotchange', this.handleSlotChange);
  }

  private handleFocusIn = (event: FocusEvent) => {
    const tab = (event.target as HTMLElement)?.closest('pds-tab');
    if (tab && tab.closest('pds-tabs') === this.el) {
      this.lastFocusedTab = tab;
    }
  };

  // Focus that leaves a tab forgets it, so replacing the tab later doesn't pull focus back,
  // including focus that moves into a panel. Focus moving to another tab is tracked again
  // by focusin, which follows focusout. Removing a focused tab also fires focusout (with no
  // relatedTarget), while the tab is still connected, so that case is checked a microtask
  // later: a tab that's gone by then was removed, and is kept so its focus can be restored.
  private handleFocusOut = (event: FocusEvent) => {
    const tab = this.lastFocusedTab;
    if (event.relatedTarget) {
      this.lastFocusedTab = null;
      return;
    }
    queueMicrotask(() => {
      if (this.lastFocusedTab === tab && tab?.isConnected) this.lastFocusedTab = null;
    });
  };

  componentDidLoad() {
    this.setupSlotChangeListeners();
  }

  /**
   * Sets the aria-label attached to the tablist element
   */
  @Prop() tablistLabel!: string;

  /**
   * A unique identifier for this component instance, passed down to its tabs and panels.
   * Does not set the host element's `id` attribute — set `id` directly if you need one.
   */
  @Prop() componentId!: string;

  /**
   * Sets tabs variant styles as outlined in Figma documentation.
   * Applies in both panel and nav mode; omitting it renders the primary style.
   */
  @Prop() variant?: 'primary' | 'availability' | 'filter' | 'pill';

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
  // `navMode`), so the tabs present when the strip initializes can't mix the two.
  // Unlike child discovery (re-run on slotchange), `nav` itself isn't watched — it's
  // a load-time mode switch, not something a consumer is expected to toggle live.
  private get isNav() {
    return !!this.nav;
  }

  // `nav` and per-tab `href` should agree. Warn on the two authoring mistakes
  // rather than silently rendering a link with no destination, or ignoring an href.
  private warnOnNavConfig() {
    if (!this.tabs?.length) return;
    // An empty `href=""` is not a usable destination, so it counts as missing.
    const withHref = this.tabs.filter((tab) => {
      const href = tab.getAttribute('href');
      return href != null && href !== '';
    }).length;
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

  // The initial collection (componentWillLoad) only sees tabs/panels present at load.
  // A tab or panel added, removed or replaced afterwards — including by a DOM morph
  // swapping in a fresh copy — needs to be re-collected the same way pds-dropdown-menu,
  // pds-select and pds-multiselect already do for their own slotted content.
  private setupSlotChangeListeners() {
    this.tabsSlot = this.el.shadowRoot?.querySelector('slot[name="tabs"]');
    this.tabPanelsSlot = this.el.shadowRoot?.querySelector('slot[name="tabpanels"]');

    this.tabsSlot?.addEventListener('slotchange', this.handleSlotChange);
    this.tabPanelsSlot?.addEventListener('slotchange', this.handleSlotChange);
  }

  // The tabs and tabpanels slots fire slotchange separately, even for the same morph
  // (both swapped together). Coalesce same-tick firings into one re-collection pass
  // with a microtask, the way a single DOM mutation already only triggers one event.
  private handleSlotChange = () => {
    if (this.slotChangeScheduled) return;
    this.slotChangeScheduled = true;
    this.activeTabNameBeforeSlotChange = this.activeTabName;

    queueMicrotask(() => {
      this.slotChangeScheduled = false;
      this.recollectAfterSlotChange();
    });
  };

  private recollectAfterSlotChange() {
    const previousActiveTabName = this.activeTabNameBeforeSlotChange;
    // A removed node stays referenced but disconnected — checked before
    // findAllChildren() re-collects, since that doesn't affect this either way.
    const focusedTabWasRemoved = !this.isNav && this.lastFocusedTab != null && !this.lastFocusedTab.isConnected;

    this.findAllChildren();
    this.warnOnNavConfig();

    // Keep the current selection if it still exists. Otherwise clear it so
    // passPropsToChildren() falls back to the first enabled tab, the same way
    // it does when a consumer never set activeTabName in the first place.
    if (previousActiveTabName != null && !this.tabs.some((tab) => tab.name === previousActiveTabName)) {
      this.activeTabName = undefined;
    }

    this.passPropsToChildren();

    // If the tab that last had focus was removed (e.g. replaced by a fresh copy),
    // the browser already silently dropped focus to <body> — restore it to the new
    // active tab's button so keyboard/screen-reader users don't lose their place.
    // Deferred a frame since a freshly-created pds-tab's button doesn't exist until
    // its own render completes; re-checked then in case focus moved on its own, to
    // the tabs or anywhere else — only focus the removal dropped to <body> is restored.
    if (focusedTabWasRemoved) {
      this.lastFocusedTab = null;
      requestAnimationFrame(() => {
        const active = document.activeElement;
        if (active && active !== document.body) return;
        const newActiveTab = this.tabs.find((tab) => tab.name === this.activeTabName);
        (newActiveTab?.querySelector('button') as HTMLButtonElement)?.focus();
      });
    }
  }

  private propGeneration(child, index = 0) {
    child.parentComponentId = this.componentId.toString();
    child.variant = this.variant;
    child.selected = (this.activeTabName === child.name) ? true : false;
    child['index'] = index;
  }

  private passPropsToChildren() {
    // Panel mode needs a selected tab so the tablist stays keyboard-reachable
    // (an all-unselected tablist has every button at tabindex="-1"). Default to
    // the first ENABLED tab when the consumer omits `activeTabName` — a disabled
    // tab is itself tabindex="-1", so selecting it would recreate the trap. Nav
    // mode has no roving/selection, so it's left unset there.
    if (!this.nav && this.activeTabName == null && this.tabs.length) {
      const firstEnabled = this.tabs.find((tab) => !tab.disabled) ?? this.tabs[0];
      this.activeTabName = firstEnabled.name;
    }

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

    const hostClass = this.classNames();
    // Only the classes: `active-tab-name` backs the mutable activeTabName prop, so a morph that drops
    // it is a prop change, not a strip.
    this.hostKeeper.record(hostClass);

    return (
      <Host active-tab-name={this.activeTabName} class={hostClass}>
        {tabList}
        <slot name="tabpanels" />
      </Host>
    );
  }
}
