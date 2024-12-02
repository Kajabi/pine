import { downSmall, remove } from '@pine-ds/icons/icons';
import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

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
   * Sets the color scheme of the chip.
   * @defaultValue 'neutral'
   */
  @Prop() sentiment: 'accent' | 'danger' | 'info' | 'neutral' | 'success' | 'warning' = 'neutral';

  /**
   * Determines whether a dot should be displayed on the chip.
   * @defaultValue false
   */
  @Prop() dot = false;

  /**
   *  Sets the text label content of the chip.
   */
  @Prop() label: string;

  /**
   * Determines whether the chip should be rendered in a larger size.
   * @defaultValue false
   */
  @Prop() large = false;

  /**
   * Sets the style variant of the chip.
   * @defaultValue 'text'
   */
  @Prop() variant: 'text' | 'tag' | 'dropdown' = 'text';

  /**
   * Event when close button is clicked on tag variant.
   */
  @Event() pdsTagCloseClick: EventEmitter;

  private handleCloseClick = () => {
    this.pdsTagCloseClick.emit();
  }

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

    return classNames.join('  ');
  }

  private setChipContent() {
    const isDropdown = this.variant === 'dropdown';
    const chipContent = isDropdown ? (
      <button class="pds-chip__button" type="button">
        {this.dot && <i class="pds-chip__dot" aria-hidden="true"></i>}
        {this.label}
        <pds-icon icon={downSmall} size="12px" aria-hidden="true"></pds-icon>
      </button>
    ) : (
      <span class="pds-chip__label">
        {this.dot && <i class="pds-chip__dot" aria-hidden="true"></i>}
        {this.label}
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
