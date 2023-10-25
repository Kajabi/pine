import { Component, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pds-table-row',
  styleUrl: 'pds-table-row.scss',
  shadow: true,
})
export class PdsTableRow {
  /**
   * A property to hold the value associated with the row and the `pdsCheckbox`.
   */
  @Prop() value: string;

  /**
   *  Prop to receive the selectable value from the `pdsTable` parent component.
   */
  @Prop() selectable: boolean;

  /**
   * Event that is emitted when the checkbox is clicked, carrying the selected value.
   */
  @Event() pdsTableRowSelected: EventEmitter<string>;

  /**
   * A local state to track whether the row is currently selected.
   */
  @State() isSelected: boolean = false;

  private handleCheckboxClick = () => {
    this.isSelected = !this.isSelected; // Toggle the selected state
    this.pdsTableRowSelected.emit(this.value); // Emit the custom event with the value

    console.log('Event emitted: pdsTableRowSelected');
    console.log('Value:', this.value);
    console.log('IsSelected:', this.isSelected);
  }

  private classNames() {
    const classNames = [];

    if (this.isSelected) {
      classNames.push("is-selected");
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host
        class={this.classNames()}
        role="row"
        value={this.value}
      >
        {this.selectable && (
          <pds-table-checkbox-cell>
            {/* TODO: ADD LABEL BACK TO CHECKBOX  */}
            <pds-checkbox
              componentId={this.value}
              onClick={this.handleCheckboxClick}
              value={this.value}
            />
          </pds-table-checkbox-cell>
        )}
        <slot></slot>
      </Host>
    );
  }
}
