import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-chip',
  styleUrl: 'sage-chip.scss',
  shadow: true,
})
export class SageChip {
  @Prop() color: 'accent' | 'danger' | 'info' | 'neutral' | 'success' | 'warning' = 'neutral';
  @Prop() dot: boolean;
  @Prop() label: string;
  @Prop() large: boolean;
  @Prop() variant: 'text' | 'tag' | 'dropdown' = 'text';

  private classNames() {
    const classNames = ['sage-chip'];

    if (this.large) {
      classNames.push('sage-chip--large');
    }
    if (this.variant) {
      classNames.push('sage-chip--' + this.variant);
    }
    if (this.color) {
      classNames.push('sage-chip--' + this.color);
    }

    return classNames.join('  ');
  }

  render() {
    const isDropdown = this.variant === 'dropdown';
    const chipContent = isDropdown ? (
      <button class="sage-chip__button" type="button">
        {this.dot && <i class="sage-chip__dot" aria-hidden="true"></i>}
        {this.label}
        <sage-icon name="down-small" size="12px"></sage-icon>
      </button>
    ) : (
      <span class="sage-chip__label">
        {this.dot && <i class="sage-chip__dot" aria-hidden="true"></i>}
        {this.label}
      </span>
    );

    return (
      <Host class={this.classNames()}>
        {chipContent}
        {this.variant === 'tag' && (
          <button class="sage-chip__close" type="button">
            <sage-icon name="remove" size="12px"></sage-icon>
          </button>
        )}
      </Host>
    );
  }
}
