import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-banner',
  styleUrl: 'pds-banner.scss',
  shadow: true,
})
export class PdsBanner {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines the banner variant.
   */
  @Prop() variant: 'default' | 'secondary' | 'warning' | 'danger' = 'default';

  render() {
    return (
      <Host class="pds-banner" id={this.componentId} variant={this.variant}>
        <pds-box
          background-color="var(--banner-background-color)"
          fit
          padding-block-start="sm"
          padding-block-end="sm"
          padding-inline-start="md"
          padding-inline-end="md"
        >
          <pds-box display="flex" justify-content="space-between">
            <pds-box display="flex" align-items="center" gap="xs">
              <pds-icon color="var(--banner-icon-color)" name={this.variant === 'danger' ? 'warning-filled' : 'info-circle-filled'}></pds-icon>
              <pds-text color="var(--banner-text-color)" tag="p">
                <slot name="text"></slot>
              </pds-text>
            </pds-box>
            <pds-box display="flex" align-items="center" gap="sm" justify-content="end">
              <slot name="actions"></slot>
            </pds-box>
          </pds-box>
        </pds-box>
      </Host>
    );
  }
}
