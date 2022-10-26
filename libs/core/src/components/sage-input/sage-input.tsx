import { Component, h, Host, Prop } from '@stencil/core';

/**
 * @slot - Content is placed between the opening closing tags
 */
@Component({
  tag: 'sage-input',
  styleUrl: 'sage-input.scss',
  shadow: true,
})
export class SageInput {
  /**
   * Determines the type of control that will be displayed
   * @defaultValue "text"
   */
  @Prop() type = 'text';

  /**
   * The value of the input
   * "text"
   */
  @Prop() value = '';

  render() {
    return (
      <Host>
        <input class="sage-input" type={this.type} value={this.value} />
      </Host>
    );
  }
}
