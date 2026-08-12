import { Component, Element, Fragment, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'pds-tab',
  styleUrl: 'pds-tab.scss',
  shadow: false,
})
export class PdsTab {
  @Element() el: HTMLPdsTabElement;

  /**
   * Determines the tab's disabled state.
   * @defaultValue false
   */
  @Prop() disabled? = false;

  /**
   * Turns the tab into a navigation link to this URL. When set, the tab renders
   * an `<a href>` (marked `aria-current="page"` when `active`) instead of a
   * `role="tab"` button, so each tab is its own page/URL — for tab strips that
   * navigate rather than switch in-page panels. Pairs with `pds-tabs` navigation
   * mode; no `pds-tabpanel`s are needed. Apply `href` to all tabs in a
   * `pds-tabs` or none — mixing navigation and panel tabs is not supported.
   */
  @Prop() href?: string;

  /**
   * Marks this tab as the current one in navigation mode (`href` set). Applies
   * the active treatment and `aria-current="page"`. Ignored in panel mode, where
   * the active tab is derived from the parent's `activeTabName`.
   * @defaultValue false
   */
  @Prop() active? = false;

  /**
   * Where to open the linked URL, in navigation mode. Maps to the anchor's
   * `target` attribute.
   */
  @Prop() target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Navigation mode: the Turbo Frame to target. Maps to `data-turbo-frame` on the
   * anchor, so a tab can swap a single frame (e.g. a page body) while leaving the
   * rest of the page in place.
   */
  @Prop() turboFrame?: string;

  /**
   * Navigation mode: the Turbo visit action. Maps to `data-turbo-action` on the
   * anchor (`advance` gives each tab its own history entry).
   */
  @Prop() turboAction?: 'advance' | 'replace';

  /**
   * Sets the related tab name, this name must match a `pds-tabpanel`'s tab name property
   */
  @Prop() name!: string;

  /**
   * Keeps track of the parentComponentId unique id, this property is passed by parent component
   */
  /** @internal */
  @Prop() parentComponentId: string;

  /**
   * Keeps track of if the expected tab variant, this property is passed by parent component
   */
  /** @internal */
  @Prop() variant: string;

  /**
   * Keeps track of if the tab index number, this property is passed by parent component
   */
  /** @internal */
  @Prop() index: number;

  /**
   * Keeps track of the tabpanel selected state, this property is passed by parent component
   */
  /** @internal */
  @Prop() selected = false;

  /**
   * Emits an event upon tab click for `pds-tab` and `pds-tabpanel` to listen for
   */
  /** @internal */
  @Event() pdsTabClick: EventEmitter<object>;
  private onTabClick(index, parentComponentId) {
    if (this.disabled) return;
    this.pdsTabClick.emit([index, parentComponentId]);
  }

  private get isNav() {
    return this.href != null;
  }

  private get isActive() {
    // Navigation mode is server-driven via `active`; panel mode is parent-driven
    // via `selected` (from `activeTabName`).
    return this.isNav ? this.active : this.selected;
  }

  private classNames() {
    const classes = [
      'pds-tab',
      this.isActive && 'is-active',
      this.disabled && 'is-disabled',
    ];
    return classes.filter(Boolean).join(' ');
  }

  render() {
    const availabilityTabEdgeInlineStart = (
      <span class="pds-tab-edge" role="presentation"></span>
    )

    const availabilityTabEdgeInlineEnd = (
      <span class="pds-tab-edge pds-tab-edge--end" role="presentation"></span>
    )

    const content = (
      <Fragment>
        {this.variant === "availability" && availabilityTabEdgeInlineStart}
        {this.variant === "availability" && availabilityTabEdgeInlineEnd}
        <div class="pds-tab__content"><slot/></div>
      </Fragment>
    )

    // Navigation mode: a real anchor, so keyboard activation and navigation are
    // native (and Turbo-driven when framed) with no controller — and the current
    // item carries `aria-current="page"` rather than `role="tab"`/`aria-selected`.
    if (this.isNav) {
      return (
        <Host variant={this.variant} slot="tabs" index={this.index}>
          <a
            href={this.disabled ? undefined : this.href}
            // A disabled tab drops its href, so the anchor loses its implicit
            // link role; restore it explicitly so assistive tech still announces
            // the item (as disabled) rather than as plain text.
            role={this.disabled ? "link" : undefined}
            id={this.parentComponentId + "__" + this.name}
            class={this.classNames()}
            target={this.target}
            rel={this.target === "_blank" ? "noopener noreferrer" : undefined}
            aria-current={this.isActive ? "page" : undefined}
            aria-disabled={this.disabled ? "true" : null}
            tabindex={this.disabled ? "-1" : null}
            data-turbo-frame={this.turboFrame || undefined}
            data-turbo-action={this.turboAction || undefined}
          >
            {content}
          </a>
        </Host>
      );
    }

    return (
      <Host variant={this.variant} slot="tabs" index={this.index}>
        <button
          role="tab"
          id={this.parentComponentId + "__" + this.name}
          aria-controls={this.parentComponentId + "__" + this.name + "-panel"}
          tabindex={this.disabled ? "-1" : (this.selected ? "0" : "-1")}
          aria-selected={this.selected ? "true" : "false"}
          aria-disabled={this.disabled ? "true" : null}
          disabled={this.disabled}
          class={this.classNames()}
          onClick={this.onTabClick.bind(this, this.index, this.parentComponentId)}
        >
          {content}
        </button>
      </Host>
    );
  }
}
