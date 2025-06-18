import { downSmall, remove } from '@pine-ds/icons/icons';
import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

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
   * Determines whether the chip should be displayed in a larger size.
   * @defaultValue false
   */
  @Prop() large = false;

  /**
   * Defines the color scheme of the chip.
   * @defaultValue 'neutral'
   */
  @Prop() sentiment: 'accent' | 'brand' | 'danger' | 'info' | 'neutral' | 'success' | 'warning' = 'neutral';

  /**
   * Sets the style variant of the chip.
   * Note: This prop is ignored when sentiment is 'brand'.
   * @defaultValue 'text'
   */
  @Prop() variant: 'text' | 'tag' | 'dropdown' = 'text';

  /**
   * Event emitted when the close button is clicked on a tag variant chip.
   */
  @Event() pdsTagCloseClick: EventEmitter;

  private handleCloseClick = () => {
    this.pdsTagCloseClick.emit();
  };

  private classNames() {
    const classNames = ['pds-chip'];

    if (this.large) {
      classNames.push('pds-chip--large');
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
    // Icon size based on large prop
    return this.large ? '14px' : '12px';
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

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId}>
        {this.setChipContent()}
        {this.effectiveVariant === 'tag' && (
          <button class="pds-chip__close" type="button" onClick={this.handleCloseClick} aria-label="Remove">
            <pds-icon icon={remove} size={this.iconSize}></pds-icon>
          </button>
        )}
      </Host>
    );
  }
}
