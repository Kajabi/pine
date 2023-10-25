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

  /**
   * If `true`, the grid items will not wrap to the next line if horizontal space is not available.
   */
  @Prop() noWrap? = false;

  render() {
    return (
      <Host class="pds-grid">
      </Host>
      );
  }
}
