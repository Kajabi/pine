import { Component, Host, h, Prop } from '@stencil/core';

/**
 * @slot (default) - The property text content.
 */

@Component({
  tag: 'pds-property',
  styleUrls: ['pds-property.scss'],
  shadow: true,
})
export class PdsProperty {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * The name of the icon to display before the property text.
   */
  @Prop() icon: string = 'star';

  render() {
    return (
      <Host id={this.componentId}>
        <pds-box align-items="center" gap="xs">
          <pds-icon icon={this.icon} size="var(--pine-dimension-sm)" aria-hidden="true"></pds-icon>
          <slot />
        </pds-box>
      </Host>
    );
  }
}
