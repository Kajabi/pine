import { Component, Host, h, Prop } from '@stencil/core';
import Sortable from 'sortablejs';

@Component({
  tag: 'pds-sortable',
  styleUrl: 'pds-sortable.scss',
  scoped: true,
})
export class PdsSortable {
  /**
   * A unique identifier for the sortable container
   */
  @Prop() componentId!: string;

  private container: HTMLElement;

  componentDidLoad() {
    Sortable.create(this.container, {
      animation: 150,
    });
  }

  render() {
    return (
      <Host id={this.componentId} ref={(el) => (this.container = el as HTMLElement)}>
        <slot></slot>
      </Host>
    );
  }
}
