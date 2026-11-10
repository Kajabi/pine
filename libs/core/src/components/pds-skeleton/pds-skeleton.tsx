import { Component, Host, h, Prop } from '@stencil/core';

/**
 * @part sheen - Exposes the moving highlight so it can be restyled or hidden.
 */

@Component({
  tag: 'pds-skeleton',
  styleUrls: ['pds-skeleton.scss'],
  shadow: true,
})
export class PdsSkeleton {
  /**
   * Sets the height of the placeholder. Accepts any CSS length. When unset, the height
   * comes from `variant`.
   */
  @Prop() height?: string;

  /**
   * Sets the shape of the placeholder.
   * @defaultValue 'text'
   */
  @Prop({ reflect: true }) variant?: 'text' | 'rect' | 'circle' = 'text';

  /**
   * Sets the width of the placeholder. Accepts any CSS length. When unset, the width
   * comes from `variant`.
   */
  @Prop() width?: string;

  private hostStyles() {
    const styles: { [key: string]: string } = {};

    if (this.height !== undefined) {
      styles['--sizing-skeleton-height'] = this.height;
    }

    if (this.width !== undefined) {
      styles['--sizing-skeleton-width'] = this.width;
    }

    return styles;
  }

  render() {
    return (
      // Placeholders carry no information, so the element is always hidden from
      // assistive tech. Announce the load from a `role="status"` region around the
      // group instead — see the Accessibility section of the docs.
      <Host class="pds-skeleton" style={this.hostStyles()} aria-hidden="true">
        <span class="pds-skeleton__sheen" part="sheen"></span>
      </Host>
    );
  }
}
