import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';

import { copy as copyIcon } from '@pine-ds/icons/icons';

@Component({
  tag: 'pds-copytext',
  styleUrl: 'pds-copytext.scss',
  shadow: true,
})
export class PdsCopytext {
  /**
   * Determines whether `copytext` should have a border.
   * @defaultValue true
   */
  @Prop({ reflect: true }) border = true;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether `copytext` should expand to the full width of its container.
   * @defaultValue false
   */
  @Prop() fullWidth = false;

  /**
   * Determines whether the `value` should truncate and display with an ellipsis.
   * @defaultValue false
   */
  @Prop() truncate = false;

  /**
   * String that is displayed and that is also copied to the clipboard upon interaction.
   */
  @Prop() value!: string;

  /**
   * Event when copyText button is clicked.
   */
  @Event() pdsCopyTextClick: EventEmitter;

  private copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      this.pdsCopyTextClick.emit('Copied to clipboard');
    } catch (err) {
      console.error(err);
      this.pdsCopyTextClick.emit(`Error writing text to clipboard: ${err}`);
    }
  };

  private handleClick = () => {
    this.copyToClipboard(this.value);
  };

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
      <Host class={this.classNames()} id={this.componentId}>
        <pds-button type="button" variant="unstyled" onClick={this.handleClick}>
          <span>{this.value}</span>
          <pds-icon icon={copyIcon} size="16px"></pds-icon>
        </pds-button>
      </Host>
    );
  }
}
