import { Component, h, Host,  Prop } from '@stencil/core';

@Component({
  tag: 'pds-grid-col',
  styleUrl: 'pds-grid-col.scss',
})
export class PdsGridCol {
  /**
   * Represents the starting grid column
   */
  @Prop() colStart?: string;

  /**
   * Represents the ending grid column
   */
  @Prop() colEnd?: string;
  
  /**
   * Non-responsive size
   */
  @Prop() size?: string;

  /**
   * Size for small screens
   */
  @Prop() sizeSm?: string;

  /**
   * Size for medium screens
   */
  @Prop() sizeMd?: string;

  /**
   * Size for large screens
   */
  @Prop() sizeLg?: string;

  /**
   * Size for Extra-large screens
   */
  @Prop() sizeXl?: string;

  render() {
    const responsiveClasses = `
      ${this.sizeSm ? `pds-grid-col-sm-${this.sizeSm}` : ''}
      ${this.sizeMd ? `pds-grid-col-md-${this.sizeMd}` : ''}
      ${this.sizeLg ? `pds-grid-col-lg-${this.sizeLg}` : ''}
      ${this.sizeXl ? `pds-grid-col-xl-${this.sizeXl}` : ''}
      ${this.colStart ? `pds-grid-start-${this.colStart}` :  ''}
      ${this.colEnd ? `pds-grid-start-${this.colEnd}` :  ''}
    `;

    return (
      <Host class={`pds-grid-col ${this.size ? `pds-grid-col-${this.size}` : ''} ${responsiveClasses}`}>
      </Host>
    );
  }
}
