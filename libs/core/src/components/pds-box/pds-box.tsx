import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pds-box',
  styleUrl: 'pds-box.scss',
})
export class PdsBox {
  /**
   * Defines the vertical alignment of the box items.
  */
  @Prop() alignItems?: `start` | `center` | `end` | `baseline` | `stretch`;

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
   * Defines the display style of the box.
  */
  @Prop() display?: `flex` | `inline-flex`;

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
      ${this.bordered ? 'pds-box--bordered' : ''}
      ${this.borderRadius ? `pds-border-radius-${this.borderRadius}` : ''}
      ${this.display ? `pds-display-${this.display}` : ''}
      ${this.justifyContent ? `pds-justify-content-${this.justifyContent}` : ''}
      ${this.offset ? `pds-box-offset-${this.offset}` : ''}
      ${this.offsetXs ? `pds-box-offset-xs-${this.offsetXs}` : ''}
      ${this.offsetSm ? `pds-box-offset-sm-${this.offsetSm}` : ''}
      ${this.offsetMd ? `pds-box-offset-md-${this.offsetMd}` : ''}
      ${this.offsetLg ? `pds-box-offset-lg-${this.offsetLg}` : ''}
      ${this.offsetXl ? `pds-box-offset-xl-${this.offsetXl}` : ''}
      ${this.padding ? `pds-padding-${this.padding}` : ''}
      ${this.shadow ? `pds-shadow-${this.shadow}` : ''}
      ${this.size ? `pds-box pds-box-${this.size}` : ''}
      ${this.sizeXs ? `pds-box-xs-${this.sizeXs}` : ''}
      ${this.sizeSm ? `pds-box-sm-${this.sizeSm}` : ''}
      ${this.sizeMd ? `pds-box-md-${this.sizeMd}` : ''}
      ${this.sizeLg ? `pds-box-lg-${this.sizeLg}` : ''}
      ${this.sizeXl ? `pds-box-xl-${this.sizeXl}` : ''}
      ${!this.size && !this.sizeSm && !this.sizeMd && !this.sizeLg && !this.sizeXl ? 'pds-box' : ''}
    `;

    const boxInlineStyles = {
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
