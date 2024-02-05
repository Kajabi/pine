import { Component, Prop, h, Host} from '@stencil/core';

import { BoxTShirtSizeType } from '../../utils/types';

@Component({
  tag: 'pds-row',
  styleUrl: 'pds-row.scss',
})
export class PdsRow {
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
  @Prop() colGap?: BoxTShirtSizeType | null;

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

  private colGapMap: { [key in BoxTShirtSizeType]: string } = {
    none: '0',
    xs: '.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2.25rem',
  };

  render() {
    const rowClasses = `
      ${this.alignItems ? `pds-align-items-${this.alignItems}` : ''}
      ${this.bordered ? 'pds-row--bordered' : ''}
      ${this.justifyContent ? `pds-justify-content-${this.justifyContent}` : ''}
      ${this.noWrap ? 'pds-row--no-wrap' : ''}
    `;

    const rowInlineStyles = {
      ...(this.colGap && {
        '--pine-gap-x': this.colGap ? this.colGapMap[this.colGap] : '',
        '--pine-gap-y': this.colGap ? this.colGapMap[this.colGap] : '',
      }),
      ...(this.minHeight && {
        'min-height': this.minHeight,
      }),
    };

    return (
      <Host class={`pds-row ${rowClasses}`} style={rowInlineStyles}>
      </Host>
      );
  }
}
