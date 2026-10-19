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
   * A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one.
   */
  @Prop() componentId: string;

  render() {
    return (
      <Host>
        <div class="pds-filters">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
