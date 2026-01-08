import { Component, Element, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

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

  private classNames() {
    let classNames = 'pds-tab';
    if (this.selected) classNames += ' is-active';
    if (this.disabled) classNames += ' is-disabled';
    return classNames;
  }

  render() {
    const availabilityTabEdgeInlineStart = (
      <span class="pds-tab-edge" role="presentation"></span>
    )

    const availabilityTabEdgeInlineEnd = (
      <span class="pds-tab-edge pds-tab-edge--end" role="presentation"></span>
    )

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
          {this.variant === "availability" && availabilityTabEdgeInlineStart}
          {this.variant === "availability" && availabilityTabEdgeInlineEnd}
          <div class="pds-tab__content"><slot/></div>
        </button>
      </Host>
    );
  }
}
