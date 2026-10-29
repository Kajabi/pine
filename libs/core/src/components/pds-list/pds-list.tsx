import { Component, Host, h, Prop } from '@stencil/core';

/**
 * @slot (default) - The list's `pds-list-item` elements.
 */
@Component({
  tag: 'pds-list',
  styleUrl: 'pds-list.scss',
  shadow: true,
})
export class PdsList {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether `list` should have a border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) border = false;

  /**
   * Determines if the list displays with reduced item padding.
   * @defaultValue false
   */
  @Prop({ reflect: true }) compact = false;

  /**
   * Determines whether `list` items should be divided with border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) dividers = false;

  render() {
    return (
      <Host role="list" id={this.componentId}>
        <slot />
      </Host>
    );
  }
}
