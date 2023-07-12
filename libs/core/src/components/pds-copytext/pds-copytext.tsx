import { Component,Event, EventEmitter, Host, h, Prop } from '@stencil/core';

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
   * String used for the component `id` attribute.
   */
  @Prop() componentId: string;
  /**
   * Determines whether `copytext` should expand to the full width of its container.
   */
  @Prop() fullWidth = false;
  /**
   * Determines whether the `value` should truncate and display with an ellipsis.
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

  private copyToClipboard = (value: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value)
        .then(() => {
          this.pdsCopyTextClick.emit('Copied to clipboard');
          console.log(this.pdsCopyTextClick.emit("Copied to clipboard"));
        })
        .catch((err) => {
          this.pdsCopyTextClick.emit('Error writing text to clipboard: ' + err);
          console.log(this.pdsCopyTextClick.emit('Error writing text to clipboard: ' + err));
        });
    } else {
      // fallback for safari
      const el = document.createElement('textarea');
      el.value = value;
      el.setAttribute('readonly', '');
      el.setAttribute('class', 'visually-hidden');
      document.body.appendChild(el);
      el.select();

      document.execCommand('copy');
      document.body.removeChild(el);
      this.pdsCopyTextClick.emit('Copied to clipboard');
    }
  }

  private handleClick = () => {
    this.copyToClipboard(this.value);
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
      <Host class={this.classNames()} id={this.componentId}>
        <pds-button type="button" variant="unstyled" onClick={this.handleClick}>
          <span>{this.value}</span>
          <pds-icon name="copy" size="16px"></pds-icon>
        </pds-button>
      </Host>
    );
  }
}
