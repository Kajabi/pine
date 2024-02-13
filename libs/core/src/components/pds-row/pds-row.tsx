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
  @Prop() border? = false;

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
    xxs: '.25rem',
    xs: '.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2.25rem',
    xl: '3rem',
    xxl: '4rem',
  };

  render() {
    const rowClasses = `
    ${this.alignItems !== undefined && this.alignItems.trim() !== '' ? `pds-align-items-${this.alignItems}` : ''}
    ${this.border ? 'pds-row--border' : ''}
    ${this.justifyContent !== undefined && this.justifyContent.trim() !== '' ? `pds-justify-content-${this.justifyContent}` : ''}
    ${this.noWrap ? 'pds-row--no-wrap' : ''}
  `;

  const rowInlineStyles = {
    ...(this.colGap && {
      '--pine-gap-x':this.colGap !== undefined &&  this.colGap.trim() !== '' ? this.colGapMap[this.colGap] : '',
      '--pine-gap-y':this.colGap !== undefined &&  this.colGap.trim() !== '' ? this.colGapMap[this.colGap] : '',
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
