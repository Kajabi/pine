import { Component, Element, Event, Host, Prop, State, h, EventEmitter, Watch } from '@stencil/core';
import {
  positionTooltip
} from '../../utils/overlay';

/**
 * @slot (default) - The popover's target element
 * @slot content - HTML content for the popover
 */

@Component({
  tag: 'pds-popover',
  styleUrls: ['../../global/styles/base.scss', 'pds-popover.scss'],
  shadow: true,
})
export class PdsPopover {
  private contentEl: HTMLElement | null;

  /**
   * Reference to the Host element
   */
  @Element() el: HTMLPdsPopoverElement;

  /**
   * Determines when the popover is open
   * @defaultValue false
   */
  @State() isOpen = false;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether or not the popover has an arrow
   * @defaultValue true
   */
  @Prop() hasArrow? = true;

  /**
   * Determines the preferred position of the popover
   * @defaultValue "right"
   */
  @Prop({ reflect: true }) placement:
    'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'right';

  /**
   * Determines whether or not the popover is visible
   * @defaultValue false
   */
  @Prop({mutable: true, reflect: true}) opened = false;

  @Watch('opened')
  handleOpenPopover() {
    if (this.opened) {
      this.handlePopoverShow();
    } else {
      this.handlePopoverHide();
    }
  }

  @Event() pdsPopoverHide: EventEmitter;

  @Event() pdsPopoverShow: EventEmitter;

  componentWillLoad() {
    if (this.opened) {
      this.opened = true;
    }

    this.el.addEventListener('blur', this.handlePopoverHide, true);
    this.el.addEventListener('focus', this.handlePopoverShow, true);
  }

  componentDidUpdate() {
    if (this.opened) {
      this.opened = true;
    }
  }

  componentDidRender() {
    positionTooltip({elem: this.el, elemPlacement: this.placement, overlay: this.contentEl});
  }

  private handlePopoverHide = () => {
    this.opened = false;
    this.pdsPopoverHide.emit();
  };

  private handlePopoverShow = () => {
    this.opened = true;
    this.pdsPopoverShow.emit();
  };

  render() {
    return (
      <Host>
        <slot name="trigger" />
        <div
          class={`pds-popover ${this.isOpen ? 'pds-popover--open' : ''}`}
          ref={(el) => (this.contentEl = el)}
          style={{ position: 'absolute' }}
        >
          <slot name="content" />
        </div>
      </Host>
    );
  }
}
