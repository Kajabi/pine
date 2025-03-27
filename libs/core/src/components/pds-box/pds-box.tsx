import { Component, h, Host, Prop } from '@stencil/core';

import { BoxColumnType, BoxTShirtSizeType, BoxShadowSizeType } from '../../utils/types';

@Component({
  tag: 'pds-box',
  styleUrl: 'pds-box.scss',
})
export class PdsBox {
  /**
   * Defines how items within the box are aligned.
   * @defaultValue start
  */
  @Prop() alignItems?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * Defines how the box is aligned within its container.
   * @defaultValue start
  */
  @Prop() alignSelf?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * If `true`, the box will be sized to fit its contents.
   */
  @Prop() auto?: boolean;

  /**
   *  Defines the background-color of the box.
   */
  @Prop() backgroundColor?: string;

  /**
   * If `true`, the box will have a border.
   */
  @Prop() border? = false;

  /**
   *  Defines the border color of the box.
   */
  @Prop() borderColor?: string;

  /**
   * Defines how rounded the box corners are.
   * @defaultValue none
   */
  @Prop() borderRadius?: `none` | `xs`| `sm` | `md` | `lg` | `circle`;

  /**
   * Defines the orientation of the box items.
   * @defaultValue row
   */
  @Prop() direction?: `row` | `column`;

  /**
   * Defines the display style of the box.
   * @defaultValue flex
  */
  @Prop() display?: `flex` | `inline-flex` | `block` | `inline-block`;

  /**
   * If `true`, sets the box `max-width` to `100%`.
   */
  @Prop() fit?: boolean;

  /**
   * Defines the spacing between the box items.
   * @defaultValue none
  */
  @Prop() gap?: BoxTShirtSizeType;

  /**
   * Defines the spacing between the box item rows.
   * @defaultValue none
  */
  @Prop() gapRow?: BoxTShirtSizeType;

  /**
   * Defines the spacing between the box item columns.
   * @defaultValue none
  */
  @Prop() gapColumn?: BoxTShirtSizeType;

  /**
   * Defines how a box will grow or shrink to fit the space available in its container.
   * @defaultValue none
   */
  @Prop() flex?: `none` | `grow` | `shrink`;

  /**
   * Defines the horizontal alignment of the box items.
   * @defaultValue start
  */
  @Prop() justifyContent?: `start` | `center` | `end` | `space-between` | `space-around`;

  /**
   * Defines the outer spacing between the box and another element.
   * @defaultValue none
  */
  @Prop() margin?: BoxTShirtSizeType;

  /**
   * Defines the box's outer top spacing.
   * @defaultValue none
  */
  @Prop() marginTop?: BoxTShirtSizeType;

  /**
   * Defines the box's outer left spacing.
   * @defaultValue none
  */
  @Prop() marginLeft?: BoxTShirtSizeType;

  /**
   * Defines the box's outer right spacing.
   * @defaultValue none
  */
  @Prop() marginRight?: BoxTShirtSizeType;

  /**
   * Defines the box's outer bottom spacing.
   * @defaultValue none
  */
  @Prop() marginBottom?: BoxTShirtSizeType;

  /**
   * The minimum height of the row. Used in conjunction with alignment props
   */
  @Prop() minHeight?: string;

  /**
   * The minimum width of the row. Used in conjunction with alignment props
   */
  @Prop() minWidth?: string;

  /**
   * Move columns to the end direction of the row for all screen sizes. Increases the starting margin of a column by specified number of columns.
   */
  @Prop() offset?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `XS` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetXs?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `SM` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetSm?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `MD` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetMd?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `LG` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetLg?: BoxColumnType;

  /**
   * Move columns to the end direction of the row for `XL` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetXl?: BoxColumnType;

  /**
   * Defines the spacing between the box items.
   * @defaultValue none
  */
  @Prop() padding?: BoxTShirtSizeType;

  /**
   * Defines the top and bottom spacing.
   * @defaultValue none
  */
  @Prop() paddingBlock?: BoxTShirtSizeType;

  /**
   * Defines the left and right spacing.
   * @defaultValue none
  */
  @Prop() paddingInline?: BoxTShirtSizeType;

  /**
   * Defines the box shadow.
   * @defaultValue none
  */
  @Prop() shadow?: BoxShadowSizeType;

  /**
   * Size of the column for all screen sizes that are not explicitly set.
   */
  @Prop() size?: BoxColumnType;

  /**
   * At screen sizes less than the `XS` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeXs?: BoxColumnType;

  /**
   * At screen sizes greater than the `SM` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeSm?: BoxColumnType;

  /**
   * At screen sizes greater than the `MD` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeMd?: BoxColumnType;

  /**
   * At screen sizes greater than the `LG` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeLg?: BoxColumnType;

  /**
   * At screen sizes greater than the `XL` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeXl?: BoxColumnType;

  render() {
    const boxClasses = `
    ${this.alignItems !== undefined && this.alignItems.trim() !== '' ? `pds-align-items-${this.alignItems}` : ''}
    ${this.alignSelf !== undefined && this.alignSelf.trim() !== '' ? `pds-align-self-${this.alignSelf}` : ''}
    ${this.auto ? 'pds-box--auto' : ''}
    ${this.border ? 'pds-box--border' : ''}
    ${this.borderRadius !== undefined && this.borderRadius.trim() !== '' ? `pds-border-radius-${this.borderRadius}` : ''}
    ${this.direction !== undefined && this.direction.trim() !== '' ? `pds-box-direction-${this.direction}` : ''}
    ${this.display !== undefined && this.display.trim() !== '' ? `pds-box--display-${this.display}` : ''}
    ${this.fit ? 'pds-box--fit' : ''}
    ${this.gap !== undefined && this.gap.trim() !== '' ? `pds-box-gap-${this.gap}` : ''}
    ${this.gapRow !== undefined && this.gapRow.trim() !== '' ? `pds-box-gap-row-${this.gapRow}` : ''}
    ${this.gapColumn !== undefined && this.gapColumn.trim() !== '' ? `pds-box-gap-column-${this.gapColumn}` : ''}
    ${this.flex !== undefined && this.flex.trim() !== '' ? `pds-box--flex-${this.flex}` : ''}
    ${this.justifyContent !== undefined && this.justifyContent.trim() !== '' ? `pds-justify-content-${this.justifyContent}` : ''}
    ${this.margin !== undefined && this.margin.trim() !== '' ? `pds-margin-${this.margin}` : ''}
    ${this.marginTop !== undefined && this.marginTop.trim() !== '' ? `pds-margin-top-${this.marginTop}` : ''}
    ${this.marginLeft !== undefined && this.marginLeft.trim() !== '' ? `pds-margin-left-${this.marginLeft}` : ''}
    ${this.marginRight !== undefined && this.marginRight.trim() !== '' ? `pds-margin-right-${this.marginRight}` : ''}
    ${this.marginBottom !== undefined && this.marginBottom.trim() !== '' ? `pds-margin-bottom-${this.marginBottom}` : ''}
    ${this.offset !== undefined && this.offset.trim() !== '' ? `pds-box-offset-${this.offset}` : ''}
    ${this.offsetXs !== undefined && this.offsetXs.trim() !== '' ? `pds-box-offset-xs-${this.offsetXs}` : ''}
    ${this.offsetSm !== undefined && this.offsetSm.trim() !== '' ? `pds-box-offset-sm-${this.offsetSm}` : ''}
    ${this.offsetMd !== undefined && this.offsetMd.trim() !== '' ? `pds-box-offset-md-${this.offsetMd}` : ''}
    ${this.offsetLg !== undefined && this.offsetLg.trim() !== '' ? `pds-box-offset-lg-${this.offsetLg}` : ''}
    ${this.offsetXl !== undefined && this.offsetXl.trim() !== '' ? `pds-box-offset-xl-${this.offsetXl}` : ''}
    ${this.padding !== undefined && this.padding.trim() !== '' ? `pds-padding-${this.padding}` : ''}
    ${this.paddingBlock !== undefined && this.paddingBlock.trim() !== '' ? `pds-padding-block-${this.paddingBlock}` : ''}
    ${this.paddingInline !== undefined && this.paddingInline.trim() !== '' ? `pds-padding-inline-${this.paddingInline}` : ''}
    ${this.shadow !== undefined && this.shadow.trim() !== '' ? `pds-shadow-${this.shadow}` : ''}
    ${this.size !== undefined && this.size.trim() !== '' ? `pds-box pds-box-${this.size}` : ''}
    ${this.sizeXs !== undefined && this.sizeXs.trim() !== '' ? `pds-box-xs-${this.sizeXs}` : ''}
    ${this.sizeSm !== undefined && this.sizeSm.trim() !== '' ? `pds-box-sm-${this.sizeSm}` : ''}
    ${this.sizeMd !== undefined && this.sizeMd.trim() !== '' ? `pds-box-md-${this.sizeMd}` : ''}
    ${this.sizeLg !== undefined && this.sizeLg.trim() !== '' ? `pds-box-lg-${this.sizeLg}` : ''}
    ${this.sizeXl !== undefined && this.sizeXl.trim() !== '' ? `pds-box-xl-${this.sizeXl}` : ''}
    ${this.size == undefined &&
      this.sizeSm == undefined &&
      this.sizeMd == undefined &&
      this.sizeLg == undefined &&
      this.sizeXl == undefined ? 'pds-box' : ''}
    `;

    const boxInlineStyles = {
      ...(this.backgroundColor && { '--color-background-box': this.backgroundColor }),
      ...(this.borderColor && { '--color-border-box': this.borderColor }),
      ...(this.minHeight && { '--sizing-min-height-box': this.minHeight }),
      ...(this.minWidth && { '--sizing-min-height-box': this.minWidth }),
    };

    return (
      <Host class={boxClasses} style={boxInlineStyles}>
      </Host>
    );
  }
}
