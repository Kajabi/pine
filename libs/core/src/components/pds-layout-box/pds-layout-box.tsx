import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pds-layout-box',
  styleUrl: 'pds-layout-box.scss',
})
export class PdsLayoutBox {
  /**
   * Defines the vertical alignment of the box items.
  */
  @Prop() alignItems?: `start` | `center` | `end` | `baseline` | `stretch`;

  /**
   * 
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
   */
  @Prop() borderRadius?: `none` | `xs`| `sm` | `md` | `lg` | `circle`;

  // FINISH LOGICAL PROPS during cleanup
  // @Prop() borderRadiusStartStart?: `none` | `xs`| `sm` | `md` | `lg` | `circle`;
  // @Prop() borderRadiusStartEnd?: `none` | `xs`| `sm` | `md` | `lg` | `circle`;
  // @Prop() borderRadiusEndStart?: `none` | `xs`| `sm` | `md` | `lg` | `circle`;
  // @Prop() borderRadiusEndEnd?: `none` | `xs`| `sm` | `md` | `lg` | `circle`;
  
  /**
   * Defines the orientation of the box items.
   */
  @Prop() direction?: `row` | `column`;

  /**
   * Defines the display style of the box.
  */
  @Prop() display?: `flex` | `inline-flex`;

  /**
   * Defines the spacing between the box items.
  */
  @Prop() gap?: `none` | `xs`| `sm` | `md` | `lg`;

  /**
   * Defines the horizontal alignment of the box items.
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
  @Prop() offset?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;;

  /**
   * Move columns to the end direction of the row for `XS` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetXs?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;;

  /**
   * Move columns to the end direction of the row for `SM` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetSm?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;;

  /**
   * Move columns to the end direction of the row for `MD` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetMd?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;;

  /**
   * Move columns to the end direction of the row for `LG` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetLg?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;;

  /**
   * Move columns to the end direction of the row for `XL` screen sizes. Increases the starting margin of a column by specified number of columns.
  */
  @Prop() offsetXl?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;;

  /**
   * Defines the spacing between the box items.
  */
  @Prop() padding?: `none` | `xs`| `sm` | `md` | `lg`;

  // FINISH ON CLEANUP
  // @Prop() paddingTop?: `none` | `xs`| `sm` | `md` | `lg`;
  // @Prop() paddingRight?: `none` | `xs`| `sm` | `md` | `lg`;
  // @Prop() paddingBottom?: `none` | `xs`| `sm` | `md` | `lg`;
  // @Prop() paddingLeft?: `none` | `xs`| `sm` | `md` | `lg`;

  /**
   * Defines the box shadow.
  */
  @Prop() shadow?: `none` | `xs`| `sm` | `md` | `lg`;

  /**
   * Size of the column for all screen sizes that are not explicitly set.
   */
  @Prop() size?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;

  /**
   * At screen sizes less than the `XS` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeXs?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;

  /**
   * At screen sizes greater than the `SM` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeSm?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;

  /**
   * At screen sizes greater than the `MD` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeMd?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;

  /**
   * At screen sizes greater than the `LG` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeLg?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;

  /**
   * At screen sizes greater than the `XL` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeXl?: `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` | `10` | `11` | `12`;

  render() {
    const boxClasses = `
      ${this.alignItems ? `pds-align-items-${this.alignItems}` : ''}
      ${this.auto ? 'pds-layout-box--auto' : ''}
      ${this.bordered ? 'pds-layout-box--bordered' : ''}
      ${this.borderRadius ? `pds-border-radius-${this.borderRadius}` : ''}
      ${this.direction ? `pds-layout-box-direction-${this.direction}` : ''}
      ${this.display ? `pds-layout-box-display-${this.display}` : ''}
      ${this.gap ? `pds-layout-box-gap-${this.gap}` : ''}
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
      ...(this.backgroundColor && { 'background-color': this.backgroundColor }),
      ...(this.borderColor && { 'border-color': this.borderColor }),
      ...(this.minHeight && { 'min-height': this.minHeight }),
      ...(this.minWidth && { 'min-width': this.minWidth }),
    };

    return (
      <Host class={boxClasses} style={boxInlineStyles}>
      </Host>
    );
  }
}
