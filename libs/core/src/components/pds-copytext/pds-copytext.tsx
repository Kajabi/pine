import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-copytext',
  styleUrl: 'pds-copytext.scss',
  shadow: true,
})
export class PdsCopytext {
  /**
   * Determines whether `copytext` should have a border.
   */
  @Prop() border = true;
  /**
   * Determines whether `copytext` should expand to the full width of its container.
   */
  @Prop() fullWidth = false;
  /**
   * Determines whether the `value` should truncate and display with an ellipsis.
   */
  @Prop() truncate = false;
  /**
   * The string that is displayed and that is also copied to the clipboard upon interaction.
   */
  @Prop() value!: string;

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

    if (this.truncate) {
      classNames.push('pds-copytext--truncated');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()}>
        <button type="button" onClick={() => this.copyToClipboard(this.value)}>
          <span>{this.value}</span>
          <pds-icon name="copy" size="16px"></pds-icon>
        </button>
      </Host>
    );
  }
}
