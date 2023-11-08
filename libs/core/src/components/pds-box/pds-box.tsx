import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pds-box',
  styleUrl: 'pds-box.scss',
})
export class PdsBox {
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
      ${this.size ? `pds-box pds-box-${this.size}` : ''}
      ${this.sizeSm ? `pds-box-sm-${this.sizeSm}` : ''}
      ${this.sizeMd ? `pds-box-md-${this.sizeMd}` : ''}
      ${this.sizeLg ? `pds-box-lg-${this.sizeLg}` : ''}
      ${this.sizeXl ? `pds-box-xl-${this.sizeXl}` : ''}
      ${!this.size && !this.sizeSm && !this.sizeMd && !this.sizeLg && !this.sizeXl ? 'pds-box' : ''}
    `;
    return (
      <Host class={boxClasses}>
      </Host>
    );
  }
}
