import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { SortableType } from './sortable-interface';
import Sortable from 'sortablejs';

@Component({
  tag: 'pds-sortable',
  styleUrl: 'pds-sortable.scss',
  scoped: true,
})
export class PdsSortable {
  @Element() el: HTMLPdsSortableElement;

  /**
   * Event emitted when a sortable item is moved.
   */
  @Event() pdsSortableItemMoved: EventEmitter;

  /**
   * Determines whether `sortable` should have a border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) border = false;

  /**
   * A unique identifier used for the sortable container `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Deternines whether `sortable` items should be divided with border.
   */
  @Prop({ reflect: true }) dividers = false;

  /**
   * Determines the grabbable area for the `pds-sortable-item`.
   */
  @Prop() handleType: 'handle' | 'row' = 'row';

  private classNames() {
    const classNames = ['pds-sortable'];

    if (this.border) {
      classNames.push('pds-sortable--bordered');
    }

    if (this.dividers) {
      classNames.push('pds-sortable--divided');
    }

    if (this.handleType !== undefined) {
      classNames.push(`pds-sortable--handle-type-${this.handleType}`);
    }

    return classNames.join('  ');
  }

  componentDidLoad() {

    let sortableOptions: SortableType = {
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

    Sortable.create(this.el, sortableOptions);
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId}>
        <slot></slot>
      </Host>
    );
  }
}
