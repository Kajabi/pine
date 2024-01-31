import { Component, Prop, h, Host} from '@stencil/core';

@Component({
  tag: 'pds-layout-row',
  styleUrl: 'pds-layout-row.scss',
})
export class PdsLayoutRow {
  /**
   * Defines the vertical alignment of the row items.
   * @defaultValue start
  */
  @Prop() alignItems?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * If `true`, the row will have a border.
   */
  @Prop() bordered? = false;

  /**
   * Defines the spacing between the row items.
  */
  @Prop() colGap?: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Defines the horizontal alignment of the row items.
   * @defaultValue start
  */
  @Prop() justifyContent?: `start` | `center` | `end` | `space-between` | `space-around`;

  /**
   * The minimum height of the row. Used in conjunction with alignment props
   */
  @Prop() minHeight?: string;

  /**
   * If `true`, the row items will not wrap to the next line if horizontal space is not available.
   */
  @Prop() noWrap? = false;

  render() {
    const rowClasses = `
      ${this.alignItems ? `pds-align-items-${this.alignItems}` : ''}
      ${this.bordered ? 'pds-layout-row--bordered' : ''}
      ${this.justifyContent ? `pds-justify-content-${this.justifyContent}` : ''}
      ${this.noWrap ? 'pds-layout-row--no-wrap' : ''}
    `;

    const rowInlineStyles = {
      ...(this.colGap && {
        '--pine-gap-x': this.colGap,
        '--pine-gap-y': this.colGap,
      }),
      ...(this.minHeight && {
        'min-height': this.minHeight,
      }),
    };

    return (
      <Host class={`pds-layout-row ${rowClasses}`} style={rowInlineStyles}>
      </Host>
      );
  }
}
