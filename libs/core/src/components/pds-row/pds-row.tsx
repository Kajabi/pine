import { Component, Prop, h, Host} from '@stencil/core';

@Component({
  tag: 'pds-row',
  styleUrl: 'pds-row.scss',
})
export class PdsRow {
  /**
   * Defines the vertical alignment of the row items.
  */
  @Prop() alignItems?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * If `true`, the row will have a bottom.
   */
  @Prop() bordered? = false;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Defines the spacing between the row items.
  */
  @Prop() gap?: string;

  /**
   * Defines the horizontal alignment of the row items.
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
      ${this.bordered ? 'pds-row--bordered' : ''}
      ${this.justifyContent ? `pds-justify-content-${this.justifyContent}` : ''}
      ${this.noWrap ? 'pds-row--no-wrap' : ''}
    `;

    const rowInlineStyles = {
      ...(this.minHeight && {
        'min-height': this.minHeight,
      }),
      ...(this.gap && {
        '--pine-gap-x': this.gap,
        '--pine-gap-y': this.gap,
      }),
    };

    return (
      <Host class={`pds-row ${rowClasses}`} style={rowInlineStyles}>
      </Host>
      );
  }
}