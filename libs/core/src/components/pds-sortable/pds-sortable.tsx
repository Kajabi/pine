import { Component, Element, Event, EventEmitter, Host, h, Prop, Watch } from '@stencil/core';
import type { SortableEvent } from 'sortablejs';
import { SortableType } from './sortable-interface';
import Sortable from 'sortablejs';

@Component({
  tag: 'pds-sortable',
  styleUrls: ['pds-sortable.scss'],
  scoped: true,
})
export class PdsSortable {
  @Element() el: HTMLPdsSortableElement;

  /**
   * Event emitted when a sortable item is moved.
   */
  @Event() pdsSortableItemMoved: EventEmitter<SortableEvent>;

  /**
   * Determines whether `sortable` should have a border.
   * @defaultValue false
   */
  @Prop({ reflect: true }) border = false;

  /**
   * Determines whether or not the sortable is disabled.
   * @defaultValue false
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * A unique identifier used for the sortable container `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines whether `sortable` items should be divided with border.
   */
  @Prop({ reflect: true }) dividers = false;

  /**
   * Determines the grabbable area for the `pds-sortable-item`.
   */
  @Prop() handleType: 'handle' | 'row' = 'row';

  private sortableInstance: InstanceType<typeof Sortable>;

  @Watch('disabled')
  handleDisabledChange() {
    this.sortableInstance?.option('disabled', this.disabled);
  }

  private classNames() {
    const classNames = ['pds-sortable'];

    if (this.border) {
      classNames.push('pds-sortable--bordered');
    }

    if (this.disabled) {
      classNames.push('pds-sortable--disabled');
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
      disabled: this.disabled,
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

    this.sortableInstance = Sortable.create(this.el as HTMLElement, sortableOptions);
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId}>
        <slot></slot>
      </Host>
    );
  }
}
