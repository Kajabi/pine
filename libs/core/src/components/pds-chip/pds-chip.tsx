import { downSmall, remove } from '@pine-ds/icons/icons';
import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import type { ChipSentimentType, ChipSizeType, ChipVariantType } from '@utils/types';

/**
 * @slot (default) - The chip's label text.
 */

@Component({
  tag: 'pds-chip',
  styleUrls: ['pds-chip.tokens.scss', 'pds-chip.scss'],
  shadow: true,
})
export class PdsChip {
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
   * Determines whether the chip should be displayed in a larger size. DEPRECATED.
   * @defaultValue false
   * @deprecated Use `size` prop instead. Set `size="lg"` for the large variant.
   */
  @Prop() large = false;

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
   * Event emitted when the close button is clicked on a tag variant chip.
   */
  @Event() pdsTagCloseClick: EventEmitter<void>;

  private handleCloseClick = () => {
    this.pdsTagCloseClick.emit();
  };

  private get effectiveSize(): ChipSizeType {
    if (this.size != null) return this.size;
    if (this.large) return 'lg';
    return 'md';
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

    const chipContent = isDropdown ? (
      <button class="pds-chip__button" type="button">
        {this.icon && <pds-icon icon={this.icon} size={this.iconSize} aria-hidden="true"></pds-icon>}
        {showDot && <i class="pds-chip__dot" aria-hidden="true"></i>}
        <slot></slot>
        <pds-icon icon={downSmall} size={this.iconSize} aria-hidden="true"></pds-icon>
      </button>
    ) : (
      <span class="pds-chip__label">
        {this.icon && <pds-icon icon={this.icon} size={this.iconSize} aria-hidden="true"></pds-icon>}
        {showDot && <i class="pds-chip__dot" aria-hidden="true"></i>}
        <slot></slot>
      </span>
    );

    return chipContent;
  }

  private renderCloseButton() {
    const CloseElement = this.removeUrl ? 'a' : 'button';

    const closeAttributes = () => {
      if (this.removeUrl) {
        // Link attributes
        const linkAttrs: any = {
          class: 'pds-chip__close',
          href: this.removeUrl,
          'aria-label': 'Remove',
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
        'aria-label': 'Remove',
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
      <Host class={this.classNames()} id={this.componentId}>
        {this.setChipContent()}
        {this.effectiveVariant === 'tag' && this.renderCloseButton()}
      </Host>
    );
  }
}
