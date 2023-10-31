import { Component, Element, Host, h, Prop } from '@stencil/core';


@Component({
  tag: 'pds-table',
  styleUrl: 'pds-table.scss',
  shadow: true,
})
export class PdsTable {
  @Element() el: HTMLPdsTableElement;
  tableRef: HTMLElement;

  /**
   * Determines if table displays compact which reduces the spacing of table cells.
   */
  @Prop() compact: boolean;

  /**
   * A unique identifier used for the table `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Enables fixed first column which will make the first column sticky on horizontal scroll. Will also include checkbox if table is selectable.
   */
  @Prop() fixedColumn: boolean;

  /**
   * Determines if table displays checkboxes for selectable rows.
   */
  @Prop() selectable: boolean;

  private classNames() {
    const classNames = ['pds-table'];

    if (this.compact) {
      classNames.push('is-compact');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        id={this.componentId}
        role="grid"
        selectable={this.selectable}
      >
        {this.fixedColumn ? (
          <div class="fixed-container">
            <slot></slot>
          </div>
        ) : (
          <slot></slot>
        )}
      </Host>
    );
  }
}
