import { Component, h, Host,  Prop } from '@stencil/core';

@Component({
  tag: 'pds-grid-col',
  styleUrl: 'pds-grid-col.scss',
})
export class PdsGridCol {
  
  @Prop() bordered?: boolean;
  /**
   * Represents the starting grid column. This is used in place of offsets. Does not need `colEnd` to be set.
   */
  @Prop() colStart?: string;

  /**
   * Represents the ending grid column. They are only used if the `colStart` is also set.
   */
  @Prop() colEnd?: string;

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
    const responsiveClasses = `
      ${this.sizeXs ? `pds-grid-col-xs-${this.sizeXs}` : ''}
      ${this.sizeSm ? `pds-grid-col-sm-${this.sizeSm}` : ''}
      ${this.sizeMd ? `pds-grid-col-md-${this.sizeMd}` : ''}
      ${this.sizeLg ? `pds-grid-col-lg-${this.sizeLg}` : ''}
      ${this.sizeXl ? `pds-grid-col-xl-${this.sizeXl}` : ''}
      ${this.colStart ? `pds-grid-start-${this.colStart}` :  ''}
      ${this.colEnd ? `pds-grid-end-${this.colEnd}` :  ''}
    `;

    return (
      <Host class={`pds-grid-col ${this.size ? `pds-grid-col-${this.size}` : ''} ${responsiveClasses}`}>
      </Host>
    );
  }
}
