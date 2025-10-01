import { Component, Host, h, Prop } from '@stencil/core';
import type { BasePdsProps } from '@utils/interfaces';

/**
 * @slot (default) - Container for pds-filter components.
 */

@Component({
  tag: 'pds-filters',
  styleUrl: 'pds-filters.scss',
  shadow: true,
})
export class PdsFilters implements BasePdsProps {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  render() {
    return (
      <Host id={this.componentId}>
        <div class="pds-filters">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
