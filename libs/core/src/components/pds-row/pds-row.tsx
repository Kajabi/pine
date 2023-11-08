import { Component, Prop, h, Host} from '@stencil/core';

@Component({
  tag: 'pds-row',
  styleUrl: 'pds-row.scss',
})
export class PdsRow {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * If `true`, the row items will not wrap to the next line if horizontal space is not available.
   */
  @Prop() noWrap? = false;

  render() {
    const rowClasses = `
      ${this.noWrap ? 'pds-row--no-wrap' : ''}
    `;

    return (
      <Host class={`pds-row ${rowClasses}`}>
      </Host>
      );
  }
}