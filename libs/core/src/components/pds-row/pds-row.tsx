import { Component, Prop, h, Host } from '@stencil/core';

import { BoxSpacingType } from '../../utils/types';

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
  @Prop() colGap?: BoxSpacingType | null;

  /**
   * Defines the spacing between the row items vertically.
   */
  @Prop() colGapBlock?: BoxSpacingType | null;

  /**
   * Defines the spacing between the row items horizontally.
   */
  @Prop() colGapInline?: BoxSpacingType | null;

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

  private colGapMap: { [key in BoxSpacingType]: string } = {
    none: '0',
    xxs: '.25rem',
    xs: '.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2.25rem',
    xl: '3rem',
    xxl: '4rem',
    '025': 'var(--pine-dimension-025)',
    '050': 'var(--pine-dimension-050)',
    '100': 'var(--pine-dimension-100)',
    '125': 'var(--pine-dimension-125)',
    '150': 'var(--pine-dimension-150)',
    '200': 'var(--pine-dimension-200)',
    '250': 'var(--pine-dimension-250)',
    '300': 'var(--pine-dimension-300)',
    '350': 'var(--pine-dimension-350)',
    '400': 'var(--pine-dimension-400)',
    '450': 'var(--pine-dimension-450)',
    '500': 'var(--pine-dimension-500)',
    '550': 'var(--pine-dimension-550)',
    '600': 'var(--pine-dimension-600)',
    '650': 'var(--pine-dimension-650)',
    '700': 'var(--pine-dimension-700)',
    '750': 'var(--pine-dimension-750)',
    '800': 'var(--pine-dimension-800)'
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
        '--row-gap-x': this.colGap !== undefined && this.colGap.trim() !== '' ? this.colGapMap[this.colGap] : '',
        '--row-gap-y': this.colGap !== undefined && this.colGap.trim() !== '' ? this.colGapMap[this.colGap] : '',
      }),
      ...(this.colGapBlock && {
        '--row-gap-y': this.colGapBlock !== undefined && this.colGapBlock.trim() !== '' ? this.colGapMap[this.colGapBlock] : '',
      }),
      ...(this.colGapInline && {
        '--row-gap-x': this.colGapInline !== undefined && this.colGapInline.trim() !== '' ? this.colGapMap[this.colGapInline] : '',
      }),
      ...(this.minHeight && {
        'min-height': this.minHeight,
      }),
    };

    return <Host class={`pds-row ${rowClasses}`} style={rowInlineStyles}></Host>;
  }
}
