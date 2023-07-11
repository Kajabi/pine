import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-label',
  styleUrl: 'pds-label.scss',
  shadow: true,
})
export class PdsLabel {

  @Prop() for?: string | null = null;

  render() {
    return (
      <Host class="pds-label">
        <label htmlFor={this.for}>
          <slot></slot>
        </label>
      </Host>
    );
  }
}
