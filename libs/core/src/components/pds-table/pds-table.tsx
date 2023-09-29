import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-table',
  styleUrl: 'pds-table.scss',
  shadow: true,
})
export class PdsTable {
  /**
   * A unique identifier used for the table `id` attribute.
   */
  @Prop() componentId!: string;

  private classNames() {
    const classNames = ['pds-table'];

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId}>
        <slot></slot>
      </Host>
    );
  }
}
