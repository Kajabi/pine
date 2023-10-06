import { Component, Prop, h, Host} from '@stencil/core';

@Component({
  tag: 'pds-grid',
  styleUrl: 'pds-grid.scss',
})
export class PdsGrid {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  render() {
    return (
      <Host class="pds-grid">
      </Host>
      );
  }
}
