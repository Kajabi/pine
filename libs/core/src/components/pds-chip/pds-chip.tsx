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
   * @defaultValue false
   */
  @Prop() dot = false;


  /**
   * Determines whether the chip should be displayed in a larger size.
   * @defaultValue false
   */
  @Prop() large = false;

  /**
   * Defines the color scheme of the chip.
   * @defaultValue 'neutral'
   */
  @Prop() sentiment: 'accent' | 'danger' | 'info' | 'neutral' | 'success' | 'warning' = 'neutral';

  /**
   * Sets the style variant of the chip.
   * @defaultValue 'text'
   */
  @Prop() variant: 'text' | 'tag' | 'dropdown' = 'text';

  /**
   * Event emitted when the close button is clicked on a tag variant chip.
   */
  @Event() pdsTagCloseClick: EventEmitter;

  /**
   * Event emitted when the dropdown button is clicked on a dropdown variant chip.
   */
  @Event() pdsClick: EventEmitter;

  private handleCloseClick = () => {
    this.pdsTagCloseClick.emit();
  };

  private handleDropdownClick = () => {
    this.pdsClick.emit();
  };

  private classNames() {
    const classNames = ['pds-chip'];

    if (this.large) {
      classNames.push('pds-chip--large');
    }
    if (this.variant) {
      classNames.push('pds-chip--' + this.variant);
    }
    if (this.sentiment) {
      classNames.push('pds-chip--' + this.sentiment);
    }

    return classNames.join(' ');
  }

  private setChipContent() {
    const isDropdown = this.variant === 'dropdown';
    const chipContent = isDropdown ? (
      <button class="pds-chip__button" type="button" onClick={this.handleDropdownClick}>
        {this.dot && <i class="pds-chip__dot" aria-hidden="true"></i>}
        <slot></slot>
        <pds-icon icon={downSmall} size="12px" aria-hidden="true"></pds-icon>
      </button>
    ) : (
      <span class="pds-chip__label">
        {this.dot && <i class="pds-chip__dot" aria-hidden="true"></i>}
        <slot></slot>
      </span>
    );

    return chipContent;
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId}>
        {this.setChipContent()}
        {this.variant === 'tag' && (
          <button class="pds-chip__close" type="button" onClick={this.handleCloseClick} aria-label="Remove">
            <pds-icon icon={remove} size="12px"></pds-icon>
          </button>
        )}
      </Host>
    );
  }
}
