import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-ben',
  styleUrls: ['../../global/styles/base.scss', 'pds-ben.scss'],
  shadow: true,
})
export class PdsBen {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * A little arbitrary stringy
   */
  @Prop() thingy: string;

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
