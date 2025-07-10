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
  @Prop() icon?: string;

  private classNames() {
    return 'pds-property';
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId}>
        <pds-box align-items="center" gap="xs">
          {this.icon && (
            <pds-box align-items="center" justify-content="center" flex-shrink="0" class="pds-property__icon">
              <pds-icon icon={this.icon} size="16px" aria-hidden="true"></pds-icon>
            </pds-box>
          )}
          <pds-box align-items="center" class="pds-property__text">
            <slot />
          </pds-box>
        </pds-box>
      </Host>
    );
  }
}