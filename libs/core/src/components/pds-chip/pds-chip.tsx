import { downSmall, remove } from '@pine-ds/icons/icons';
import { Component, Host, h, Prop, Event, EventEmitter, Element } from '@stencil/core';
import type { ChipSentimentType, ChipSizeType, ChipVariantType } from '@utils/types';
import { setupTruncationTooltip } from '../../utils/truncation-tooltip';

/**
 * @slot (default) - The chip's label text.
 * @part button
 */

@Component({
  tag: 'pds-chip',
  styleUrls: ['pds-chip.tokens.scss', 'pds-chip.scss'],
  shadow: true,
})
export class PdsChip {
  @Element() el: HTMLPdsChipElement;

  /** The label span that clips; the overflow anchor for the truncation tooltip. */
  private labelTextEl?: HTMLElement;
  /** The node the tooltip is currently bound to, so a remount can re-bind. */
  private tooltipBoundEl?: HTMLElement | null;
  private truncationCleanup: (() => void) | null = null;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether a dot should be displayed on the chip.
   * Note: This prop is ignored when sentiment is 'brand'.
   * @defaultValue false
   */
  @Prop() dot = false;

  /**
   * The name of the icon to display before the chip text.
   */
  @Prop() icon?: string;

  /**
   * Sets the size of the chip.
   * @defaultValue 'md'
   */
  @Prop() size?: ChipSizeType;

  /**
   * Defines the color scheme of the chip.
   * @defaultValue 'neutral'
   */
  @Prop() sentiment: ChipSentimentType = 'neutral';

  /**
   * Sets the style variant of the chip.
   * Note: This prop is ignored when sentiment is 'brand'.
   * @defaultValue 'text'
   */
  @Prop() variant: ChipVariantType = 'text';

  /**
   * URL to navigate to when the remove button is clicked.
   * When provided, renders the close button as a link instead of a button.
   * Only applies to tag variant.
   */
  @Prop() removeUrl?: string;

  /**
   * HTTP method to use for the remove action.
   * Adds data-method and data-turbo-method attributes for Rails/Turbo compatibility.
   * Only applies when removeUrl is provided.
   */
  @Prop() removeHttpMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete';

  /**
   * Specifies where to open the linked document when removeUrl is provided.
   * Only applies when removeUrl is set.
   */
  @Prop() removeTarget?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Accessible label for the remove button. Pass a translated string to localize it; defaults to English.
   * @defaultValue 'Remove'
   */
  @Prop() dismissLabel = 'Remove';

  /**
   * Sets the maximum width of the chip, truncating the label with an ellipsis when it overflows.
   * Accepts any CSS length (e.g. '200px', '20ch'). The slot is documented as label text — slotting richer markup may not truncate the way you expect.
   */
  @Prop({ reflect: true }) maxWidth?: string;

  /**
   * Event emitted when the close button is clicked on a tag variant chip.
   */
  @Event() pdsTagCloseClick: EventEmitter<void>;

  // Bind (and re-bind) here, not just on load: changing variant/size remounts
  // the label span, so the tooltip has to re-attach to the current node or it
  // would keep measuring a detached one. Keyed on node identity so an unrelated
  // re-render doesn't tear a working tooltip down.
  componentDidRender() {
    if (this.maxWidth && this.labelTextEl) {
      if (this.labelTextEl !== this.tooltipBoundEl) {
        this.initTruncationTooltip();
      }
    } else if (this.tooltipBoundEl) {
      this.destroyTruncationTooltip();
    }
  }

  disconnectedCallback() {
    this.destroyTruncationTooltip();
  }

  // Reveal the clipped label on hover/focus, matching pds-text / pds-table-cell.
  // getTooltipText reads the host's textContent — the slotted label.
  private initTruncationTooltip() {
    this.destroyTruncationTooltip();

    if (this.labelTextEl) {
      this.truncationCleanup = setupTruncationTooltip({
        hostEl: this.el,
        contentEl: this.labelTextEl,
        getTooltipText: () => this.el.textContent || '',
      });
      this.tooltipBoundEl = this.labelTextEl;
    }
  }

  private destroyTruncationTooltip() {
    if (this.truncationCleanup) {
      this.truncationCleanup();
      this.truncationCleanup = null;
    }
    this.tooltipBoundEl = null;
  }

  private handleCloseClick = () => {
    this.pdsTagCloseClick.emit();
  };

  private get effectiveSize(): ChipSizeType {
    return this.size ?? 'md';
  }

  private classNames() {
    const classNames = ['pds-chip'];

    const size = this.effectiveSize;
    if (size && size !== 'md') {
      classNames.push('pds-chip--' + size);
    }

    // For brand sentiment, always use text variant
    const effectiveVariant = this.sentiment === 'brand' ? 'text' : this.variant;
    if (effectiveVariant) {
      classNames.push('pds-chip--' + effectiveVariant);
    }

    if (this.sentiment) {
      classNames.push('pds-chip--' + this.sentiment);
    }

    return classNames.join(' ');
  }

  private get effectiveVariant() {
    // For brand sentiment, force text variant behavior
    return this.sentiment === 'brand' ? 'text' : this.variant;
  }

  private get iconSize() {
    switch (this.effectiveSize) {
      case 'sm': return '10px';
      case 'lg': return '14px';
      default: return '12px';
    }
  }

  private setChipContent() {
    const isDropdown = this.effectiveVariant === 'dropdown';

    // For brand sentiment, ignore dot prop
    const showDot = this.sentiment === 'brand' ? false : this.dot;

    // ::slotted() can only select an assigned element, never a bare text
    // node — and a plain `<pds-chip>Some text</pds-chip>` slots text with no
    // wrapping element. Wrapping the slot itself in an internal span gives
    // maxWidth something to ellipsize regardless of what's slotted.
    // A focus-triggered tooltip needs a focusable anchor. The dropdown's own
    // button already takes focus (focusin bubbles to the host), so only the
    // text/tag label span needs a tabindex — and only when it can truncate.
    const labelTabindex = this.maxWidth ? '0' : undefined;

    const chipContent = isDropdown ? (
      <button class="pds-chip__button" type="button" part="button">
        {this.icon && <pds-icon icon={this.icon} size={this.iconSize} aria-hidden="true"></pds-icon>}
        {showDot && <i class="pds-chip__dot" aria-hidden="true"></i>}
        <span class="pds-chip__label-text" ref={(el) => (this.labelTextEl = el)}>
          <slot></slot>
        </span>
        <pds-icon icon={downSmall} size={this.iconSize} aria-hidden="true"></pds-icon>
      </button>
    ) : (
      <span class="pds-chip__label">
        {this.icon && <pds-icon icon={this.icon} size={this.iconSize} aria-hidden="true"></pds-icon>}
        {showDot && <i class="pds-chip__dot" aria-hidden="true"></i>}
        <span class="pds-chip__label-text" tabindex={labelTabindex} ref={(el) => (this.labelTextEl = el)}>
          <slot></slot>
        </span>
      </span>
    );

    return chipContent;
  }

  private get hostStyles() {
    // Hand maxWidth to the stylesheet as a custom property rather than an inline
    // max-width, so a consumer can override it from a stylesheet (e.g. a media
    // query) without !important — the same pattern pds-box uses for min-width.
    // The width and the min-width/box-sizing that make it work are applied in
    // pds-chip.scss under :host([max-width]).
    return this.maxWidth ? { '--pds-chip-max-width': this.maxWidth } : {};
  }

  private renderCloseButton() {
    const CloseElement = this.removeUrl ? 'a' : 'button';

    const closeAttributes = () => {
      if (this.removeUrl) {
        // Link attributes
        const linkAttrs: any = {
          class: 'pds-chip__close',
          href: this.removeUrl,
          'aria-label': this.dismissLabel,
        };

        // Add target if specified
        if (this.removeTarget) {
          linkAttrs.target = this.removeTarget;
        }

        // Add HTTP method attributes if specified
        if (this.removeHttpMethod) {
          linkAttrs['data-method'] = this.removeHttpMethod;
          linkAttrs['data-turbo-method'] = this.removeHttpMethod;
        }

        // Build rel attribute by collecting all required values
        const relValues = [];

        // Add noopener noreferrer if target is _blank
        if (this.removeTarget === '_blank') {
          relValues.push('noopener', 'noreferrer');
        }

        // Add nofollow for non-GET methods (best practice)
        if (this.removeHttpMethod && this.removeHttpMethod !== 'get') {
          relValues.push('nofollow');
        }

        // Set rel attribute if we have any values
        if (relValues.length > 0) {
          linkAttrs.rel = relValues.join(' ');
        }

        return linkAttrs;
      }

      // Button attributes
      return {
        class: 'pds-chip__close',
        type: 'button',
        'aria-label': this.dismissLabel,
      };
    };

    return (
      <CloseElement {...closeAttributes()} onClick={this.handleCloseClick}>
        <pds-icon icon={remove} size={this.iconSize}></pds-icon>
      </CloseElement>
    );
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId} style={this.hostStyles}>
        {this.setChipContent()}
        {this.effectiveVariant === 'tag' && this.renderCloseButton()}
      </Host>
    );
  }
}
