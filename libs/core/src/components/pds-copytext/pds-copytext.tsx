import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-copytext',
  styleUrl: 'pds-copytext.scss',
  shadow: true,
})
export class PdsCopytext {
  @Prop() border = true;
  @Prop() fullWidth = false;
  @Prop() value: string;

  async copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      console.log('✅ Copied to clipboard:', value);
    } catch (err) {
      console.error('🛑 Failed to copy:', err);
    }
  }

  private classNames() {
    const classNames = ['pds-copytext'];

    if (this.border) {
      classNames.push('pds-copytext--bordered');
    }

    if (this.fullWidth) {
      classNames.push('pds-copytext--full-width');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()}>
        <button onClick={() => this.copyToClipboard(this.value)}>
          <span>{this.value}</span>
          <pds-icon name="copy"></pds-icon>
        </button>
      </Host>
    );
  }
}
