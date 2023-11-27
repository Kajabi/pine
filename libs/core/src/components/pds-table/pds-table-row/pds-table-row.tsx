import { Component, Element, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pds-table-row',
  styleUrl: 'pds-table-row.scss',
  shadow: true,
})
export class PdsTableRow {
  @Element() hostElement: HTMLPdsTableRowElement;
  tableRef: HTMLPdsTableElement

  /**
   * A property to hold the value associated with the row and the `pdsCheckbox`.
   */
  @Prop() value: string;

  /**
   * Event that is emitted when the checkbox is clicked, carrying the selected value.
   */
  @Event() pdsTableRowSelected: EventEmitter<{ value: string; isSelected: boolean; }>;

  /**
   * A local state to track whether the row is currently selected.
   */
  @State() isSelected: boolean = false;

  private handleCheckboxClick = () => {
    this.isSelected = !this.isSelected; // Toggle the selected state
    this.pdsTableRowSelected.emit({ value: this.value, isSelected: this.isSelected }); // Emit the custom event with the value
    const selectedIndex = Array.from(this.hostElement.parentNode.children).indexOf(this.hostElement);
    console.log('Event emitted: pdsTableRowSelected', { rowIndex: selectedIndex, isSelected: this.isSelected });
  }

  private classNames() {
    const classNames = [];

    if (this.isSelected) {
      classNames.push("is-selected");
    }

    return classNames.join('  ');
  }

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;

    if (this.tableRef && this.tableRef.fixedColumn) {
      const tableCell = this.hostElement.querySelector('pds-table-cell');
      tableCell?.classList.add("is-fixed");
    }
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        role="row"
        value={this.value}
      >
        <slot name='checkbox'>
        {this.tableRef && this.tableRef.selectable && (
          <pds-table-checkbox-cell part={this.tableRef.fixedColumn ? 'checkbox-cell' : ''} >
            <pds-checkbox
              componentId={this.value}
              onClick={this.handleCheckboxClick}
              label={this.value}
              labelHidden={true}
              checked={this.isSelected}
              value={this.value}
            />
          </pds-table-checkbox-cell>
        )}
        </slot>
        <slot></slot>
      </Host>
    );
  }
}
