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
   * If `true`, the box will have a bottom.
   */
  @Prop() bordered? = false;
  
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
   * Size of the column for all screen sizes that are not explicitly set.
   */
  @Prop() size?: string;

  /**
   * At screen sizes less than the `XS` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeXs?: string;

  /**
   * At screen sizes greater than the `SM` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeSm?: string;

  /**
   * At screen sizes greater than the `MD` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeMd?: string;

  /**
   * At screen sizes greater than the `LG` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeLg?: string;

  /**
   * At screen sizes greater than the `XL` breakpoint, this will take the number of columns specified.
   */
  @Prop() sizeXl?: string;

  render() {
    const boxClasses = `
      ${this.alignItems ? `pds-align-items-${this.alignItems}` : ''}
      ${this.display ? `pds-display-${this.display}` : ''}
      ${this.justifyContent ? `pds-justify-content-${this.justifyContent}` : ''}
      ${this.size ? `pds-box pds-box-${this.size}` : ''}
      ${this.sizeSm ? `pds-box-sm-${this.sizeSm}` : ''}
      ${this.sizeMd ? `pds-box-md-${this.sizeMd}` : ''}
      ${this.sizeLg ? `pds-box-lg-${this.sizeLg}` : ''}
      ${this.sizeXl ? `pds-box-xl-${this.sizeXl}` : ''}
      ${!this.size && !this.sizeSm && !this.sizeMd && !this.sizeLg && !this.sizeXl ? 'pds-box' : ''}
    `;

    const boxInlineStyles = {
      ...(this.minHeight && { 'min-height': this.minHeight }),
    };

    return (
      <Host class={boxClasses} style={boxInlineStyles}>
      </Host>
    );
  }
}
