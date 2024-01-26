import { Component, h, Host, Prop } from '@stencil/core';

import { BoxColumnType, BoxTShirtSizeType } from '../../utils/types';

@Component({
  tag: 'pds-layout-box',
  styleUrl: 'pds-layout-box.scss',
})
export class PdsLayoutBox {
  /**
   * Defines the vertical alignment of the box items.
   * @defaultValue start
  */
  @Prop() alignItems?: `start` | `center` | `end` | `baseline` | `stretch`;

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
  @Prop() bordered? = false;

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
   * Defines the box shadow.
   * @defaultValue none
  */
  @Prop() shadow?: BoxTShirtSizeType;

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
      ${this.alignItems ? `pds-align-items-${this.alignItems}` : ''}
      ${this.auto ? 'pds-layout-box--auto' : ''}
      ${this.bordered ? 'pds-layout-box--bordered' : ''}
      ${this.borderRadius ? `pds-border-radius-${this.borderRadius}` : ''}
      ${this.direction ? `pds-layout-box-direction-${this.direction}` : ''}
      ${this.display ? `pds-layout-box--display-${this.display}` : ''}
      ${this.fit ? 'pds-layout-box--fit' : ''}
      ${this.gap ? `pds-layout-box-gap-${this.gap}` : ''}
      ${this.flex ? `pds-layout-box--flex-${this.flex}` : ''}
      ${this.justifyContent ? `pds-justify-content-${this.justifyContent}` : ''}
      ${this.offset ? `pds-layout-box-offset-${this.offset}` : ''}
      ${this.offsetXs ? `pds-layout-box-offset-xs-${this.offsetXs}` : ''}
      ${this.offsetSm ? `pds-layout-box-offset-sm-${this.offsetSm}` : ''}
      ${this.offsetMd ? `pds-layout-box-offset-md-${this.offsetMd}` : ''}
      ${this.offsetLg ? `pds-layout-box-offset-lg-${this.offsetLg}` : ''}
      ${this.offsetXl ? `pds-layout-box-offset-xl-${this.offsetXl}` : ''}
      ${this.padding ? `pds-padding-${this.padding}` : ''}
      ${this.shadow ? `pds-shadow-${this.shadow}` : ''}
      ${this.size ? `pds-layout-box pds-layout-box-${this.size}` : ''}
      ${this.sizeXs ? `pds-layout-box-xs-${this.sizeXs}` : ''}
      ${this.sizeSm ? `pds-layout-box-sm-${this.sizeSm}` : ''}
      ${this.sizeMd ? `pds-layout-box-md-${this.sizeMd}` : ''}
      ${this.sizeLg ? `pds-layout-box-lg-${this.sizeLg}` : ''}
      ${this.sizeXl ? `pds-layout-box-xl-${this.sizeXl}` : ''}
      ${!this.size && !this.sizeSm && !this.sizeMd && !this.sizeLg && !this.sizeXl ? 'pds-layout-box' : ''}
    `;

    const boxInlineStyles = {
      ...(this.backgroundColor && { '--box-background-color': this.backgroundColor }),
      ...(this.borderColor && { '--box-border-color': this.borderColor }),
      ...(this.minHeight && { '--box-min-height': this.minHeight }),
      ...(this.minWidth && { '--box-min-width': this.minWidth }),
    };

    return (
      <Host class={boxClasses} style={boxInlineStyles}>
      </Host>
    );
  }
}
