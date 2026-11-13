import { Component, Element, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { closest } from '@utils/closest';

/**
 * @part head - Set on the `pds-table-head` element itself, so `::part(head)` matches it only from a shadow root that contains it. Style `pds-table-head` directly instead.
 * @part select-all-checkbox - Exposes the select-all checkbox for styling. Appears only when the table is `selectable` and `disableSelectAll` isn't set.
 */
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
   * Determines if the select all checkbox is checked.
   * @defaultValue false
   */
   @Prop({mutable: true}) isSelected: boolean;

  /**
   * Adds top and bottom borders to the table head.
   * @defaultValue false
   */
  @Prop({ reflect: true }) border = false;

  /**
   * Adds a subtle background color to the table head.
   * @defaultValue false
   */
  @Prop({ reflect: true }) background = false;

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
      <Host role="row" part="head">
        {this.tableRef && this.tableRef.selectable && (
          <pds-table-head-cell
            part={this.tableRef.selectable ? 'checkbox-cell' : ''}
            width={this.tableRef.tableLayout === 'fixed' ? 'var(--pine-dimension-2xl)' : undefined}
          >
            {!this.tableRef.disableSelectAll && (
              <pds-checkbox
                componentId={this.generateUniqueId()}
                indeterminate={this.indeterminate}
                onInput={this.handleInput}
                label={"Select All Rows"}
                hideLabel={true}
                checked={this.isSelected}
                part="select-all-checkbox"
              />
            )}
          </pds-table-head-cell>
        )}
        <slot></slot>
      </Host>
    );
  }
}
