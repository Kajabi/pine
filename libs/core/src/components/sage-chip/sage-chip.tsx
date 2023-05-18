import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-chip',
  styleUrl: 'sage-chip.scss',
  shadow: true,
})
export class SageChip {
  @Prop() color: 'danger' | 'draft' | 'info' | 'locked' | 'success' | 'warning' = 'draft';
  @Prop() label: string;
  @Prop() status: boolean;
  @Prop() variant: 'text' | 'tag' | 'dropdown' = 'text';
  // @Prop() onClose: () => void;

  render() {
    return (
      <Host class={`sage-chip sage-chip--${this.variant} sage-chip--${this.color}`}>
        {this.status && <i class="sage-chip__status" aria-hidden="true"></i>}
        {this.variant !== 'dropdown' && <span class="sage-chip__text">{this.label}</span>}
        {/* {this.variant === 'tag' && <button class="sage-chip__close" onClick={this.onClose}></button>} */}
        {this.variant === 'dropdown' && (
          <span class="sage-chip__dropdown">
            {this.label}
            <i class="sage-chip__dropdown-icon"></i>
          </span>
        )}
      </Host>
    );
  }
}
