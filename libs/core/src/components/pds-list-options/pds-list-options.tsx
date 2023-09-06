import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-list-options',
  styleUrl: 'pds-list-options.scss',
  scoped: true,
})
export class PdsListOptions {
  /**
   * A unique identifier for the sortable container.
   */
  @Prop() componentId!: string;

  // private container: HTMLElement;

  private classNames() {
    const classNames = ['pds-list-options'];

    return classNames.join('  ');
  }

  render() {
    return (
      // <Host class={this.classNames()} id={this.componentId} ref={(el) => (this.container = el as HTMLElement)}>
      <Host class={this.classNames()} id={this.componentId}>
        <slot></slot>
      </Host>
    );
  }
}
