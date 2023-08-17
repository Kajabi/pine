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

  /**
   * Determines whether `sortable` should have a border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) border = false;

  private container: HTMLElement;

  private classNames() {
    const classNames = ['pds-sortable'];

    if (this.border) {
      classNames.push('pds-sortable--bordered');
    }

    return classNames.join('  ');
  }

  componentDidLoad() {
    Sortable.create(this.container, {
      animation: 150,
      ghostClass: 'pds-sortable-item--ghost',
      dragClass: "pds-sortable-item--drag"
    });
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        id={this.componentId}
        ref={(el) => (this.container = el as HTMLElement)}>
        <slot></slot>
      </Host>
    );
  }
}
