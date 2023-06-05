import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'sage-chip',
  styleUrl: 'sage-chip.scss',
  shadow: true,
})
export class SageChip {
  /**
   * Sets the color scheme of the chip.
   */
  @Prop() sentiment: 'accent' | 'danger' | 'info' | 'neutral' | 'success' | 'warning' = 'neutral';

  /**
   * Determines whether a dot should be displayed on the chip.
   */
  @Prop() dot = false;

  /**
   *  Sets the text label content of the chip.
   */
  @Prop() label: string;

  /**
   * Determines whether the chip should be rendered in a larger size.
   */
  @Prop() large = false;

  /**
   * Sets the style variant of the chip.
   */
  @Prop() variant: 'text' | 'tag' | 'dropdown' = 'text';

  /**
   * Event when close button is clicked on tag variant.
   */
  @Event() sageTagCloseClick: EventEmitter;

  private handleCloseClick = () => {
    this.sageTagCloseClick.emit();
  }

  private classNames() {
    const classNames = ['sage-chip'];

    if (this.large) {
      classNames.push('sage-chip--large');
    }
    if (this.variant) {
      classNames.push('sage-chip--' + this.variant);
    }
    if (this.sentiment) {
      classNames.push('sage-chip--' + this.sentiment);
    }

    return classNames.join('  ');
  }

  private setChipContent() {
    const isDropdown = this.variant === 'dropdown';
    const chipContent = isDropdown ? (
      <button class="sage-chip__button" type="button">
        {this.dot && <i class="sage-chip__dot" aria-hidden="true"></i>}
        {this.label}
        <sage-icon name="down-small" size="12px" aria-hidden="true"></sage-icon>
      </button>
    ) : (
      <span class="sage-chip__label">
        {this.dot && <i class="sage-chip__dot" aria-hidden="true"></i>}
        {this.label}
      </span>
    );

    return chipContent;
  }

  render() {
    return (
      <Host class={this.classNames()}>
        {this.setChipContent()}
        {this.variant === 'tag' && (
          <button class="sage-chip__close" type="button" onClick={this.handleCloseClick} aria-label="Remove">
            <sage-icon name="remove" size="12px"></sage-icon>
          </button>
        )}
      </Host>
    );
  }
}
