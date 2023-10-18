import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-table-row',
  styleUrl: 'pds-table-row.scss',
  shadow: true,
})
export class PdsTableRow {
  @Prop() value: string;

  // Prop to receive the selectable value from the pdsTable component
  @Prop() selectable: boolean;

  render() {
    return (
      <Host role="row" value={this.value}>
        {this.selectable && (
          <pds-table-checkbox-cell>
            {/* TODO: ADD LABEL BACK TO CHECKBOX  */}
            <pds-checkbox componentId={this.value} value={this.value} />
          </pds-table-checkbox-cell>
        )}
        <slot></slot>
      </Host>
    );
  }
}
