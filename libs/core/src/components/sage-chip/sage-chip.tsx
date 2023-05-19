import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-chip',
  styleUrl: 'sage-chip.scss',
  shadow: true,
})
export class SageChip {
  @Prop() color: 'accent' | 'danger' | 'info' | 'neutral' | 'success' | 'warning' = 'neutral';
  @Prop() label: string;
  @Prop() dot: boolean;
  @Prop() variant: 'text' | 'tag' | 'dropdown' = 'text';

  render() {
    const isDropdown = this.variant === 'dropdown';
    const chipLabel = isDropdown ? (
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
      <Host class={`sage-chip sage-chip--${this.variant} sage-chip--${this.color}`}>
        {chipLabel}
        {this.variant === 'tag' && (
          <button class="sage-chip__close" type="button">
            <sage-icon name="remove" size="12px"></sage-icon>
          </button>
        )}
      </Host>
    );
  }
}
