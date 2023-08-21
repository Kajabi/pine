import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import Sortable from 'sortablejs';

@Component({
  tag: 'pds-sortable',
  styleUrl: 'pds-sortable.scss',
  scoped: true,
})
export class PdsSortable {
  /**
   * Determines whether `sortable` should have a border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) border = false;

  /**
   * A unique identifier for the sortable container.
   */
  @Prop() componentId!: string;

  /**
   * Deternines whether `sortable` items should be divided with border.
   */
  @Prop({ reflect: true }) dividers = false;

  /**
   * Determines the grab location to use for sortable items.
   */
  @Prop() handleType: 'handle' | 'row' = 'row';

  /**
   * Event when a sortable item is moved.
   */
  @Event() pdsSortableItemMoved: EventEmitter;

  private container: HTMLElement;

  private classNames() {
    const classNames = ['pds-sortable'];

    if (this.border) {
      classNames.push('pds-sortable--bordered');
    }

    if (this.dividers) {
      classNames.push('pds-sortable--divided');
    }

    if (this.handleType) {
      classNames.push(`pds-sortable--handle-type-${this.handleType}`);
    }

    return classNames.join('  ');
  }

  componentDidLoad() {
    let sortableOptions: any = {
      animation: 150,
      ghostClass: 'pds-sortable-item--ghost',
      dragClass: 'pds-sortable-item--drag',
      onEnd: (evt) => {
        this.pdsSortableItemMoved.emit(evt);
      },
    };

    if (this.handleType === 'handle') {
      sortableOptions = {
        ...sortableOptions,
        handle: '.pds-sortable-item__handle',
      };
    }

    Sortable.create(this.container, sortableOptions);
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId} ref={(el) => (this.container = el as HTMLElement)}>
        <slot></slot>
      </Host>
    );
  }
}
