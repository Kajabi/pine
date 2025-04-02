import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { closest } from '@utils/closest';

@Component({
  tag: 'pds-table-head',
  styleUrls: ['pds-table-head.scss'],
  shadow: true,
})
export class PdsTableHead {
  @Element() hostElement: HTMLPdsTableHeadElement;
  private tableRef: HTMLPdsTableElement

   /**
    * Determines if the select all checkbox is in an indeterminate state.
    */
   @Prop({ mutable: true }) indeterminate?: boolean;

   /**
   * Determines if the table row is currently selected.
   * @defaultValue false
   */
   @Prop({mutable: true}) isSelected: boolean;

  /**
   * Event that is emitted when the select all checkbox is clicked, carrying the selected value.
   */
  @Event() pdsTableSelectAll: EventEmitter<{ isSelected: boolean }>;

  private generateUniqueId = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uniqueId = `${randomString}-${timestamp}`;

    return uniqueId;
  }

  private handleInput = (ev: Event) => {
    this.isSelected = !(ev.target as HTMLInputElement).checked
    this.handleSelect(this.isSelected)
  };

  private handleSelect = (isSelected: boolean) => {
    this.indeterminate = false

    if ( closest('pds-table-head', this.hostElement) ) {
      this.pdsTableSelectAll.emit({ isSelected });
    }
  }

  componentWillLoad() {
    if (this.isSelected) {
      this.handleSelect(this.isSelected)
    }
  }

  componentWillRender() {
    this.tableRef = this.hostElement.closest('pds-table') as HTMLPdsTableElement;

    if (this.tableRef && this.tableRef.fixedColumn) {
      const tableCell = this.hostElement.querySelector('pds-table-head-cell:first-child');
      tableCell?.classList.add("is-fixed");
    }
  }

  render() {
    return (
      <Host role="row">
        {this.tableRef && this.tableRef.selectable && (
          <pds-table-head-cell part={this.tableRef.selectable ? 'checkbox-cell' : ''}>
            <pds-checkbox
              componentId={this.generateUniqueId()}
              indeterminate={this.indeterminate}
              onInput={this.handleInput}
              label={"Select All Rows"}
              hideLabel={true}
              checked={this.isSelected}
            />
          </pds-table-head-cell>
        )}
        <slot></slot>
      </Host>
    );
  }
}
