import { Component, Element, Host, h, Prop } from '@stencil/core';


@Component({
  tag: 'pds-table',
  styleUrl: 'pds-table.scss',
  shadow: true,
})
export class PdsTable {
  @Element() el: HTMLPdsTableElement;

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

  // componentWillLoad(){
  //   console.log("componentWillLoad");
  //   this.passPropsToChildren();
  // }
  // componentDidLoad(){
  //   console.log("componentDidLoad");
  //   this.passPropsToChildren();
  // }
  // componentShouldUpdate(){
  //   console.log("componentShouldUpdate");
  //   this.passPropsToChildren();
  // }
  // componentWillRender(){
  //   console.log("componentWillRender");
  //   this.passPropsToChildren();
  // }
  // componentDidRender(){
  //   console.log("componentDidRender");
  //   this.passPropsToChildren();
  // }
  // componentWillUpdate(){
  //   console.log("componentWillUpdate");
  //   this.passPropsToChildren();
  // }
  // componentDidUpdate(){
  //   console.log("componentDidUpdate");
  //   this.passPropsToChildren();
  // }

  componentDidLoad() {
    this.passPropsToChildren();
  }

  private passPropsToChildren = () => {
    const tableRows = this.el.querySelectorAll('pds-table-row, pds-table-head');
    // Loop through table rows and add the class based on the "selectable" property.
    tableRows.forEach((row) => {
      row['selectable'] = this.selectable;

      const tableCells = row.querySelectorAll('pds-table-cell, pds-table-head-cell');
      const rowHeadCells = row.querySelectorAll('pds-table-head-cell');

      tableCells.forEach((cell, index) => {
        cell['compact'] = this.compact;
        if (this.compact) {
          cell.classList.add('is-compact');
        } else {
          cell.classList.remove('is-compact');
        }

        // Check if it's the first cell and the fixedColumn prop is true.
        if (this.fixedColumn && index === 0) {
          cell.classList.add('is-fixed');
        }
      });

      rowHeadCells.forEach((cell, index) => {
        // Check if it's the first head cell and the fixedColumn prop is true.
        if (this.fixedColumn && index === 0) {
          cell.classList.add('is-fixed');
        }
      });

      const rowShadow = row.shadowRoot;
      console.log('rowShadow', rowShadow);
      console.log('rowShadowCheckbox', rowShadow.querySelectorAll('pds-table-checkbox-cell'));


    });
  };



  private classNames() {
    const classNames = ['pds-table'];

    if (this.compact) {
      classNames.push('is-compact');
    }

    if (this.fixedColumn) {
      classNames.push('is-fixed');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <Host class={this.classNames()} id={this.componentId} role="grid" selectable={this.selectable}>
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
