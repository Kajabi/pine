import { Component, Element, Host, h, Listen, Prop } from '@stencil/core';

@Component({
  tag: 'pds-list-options',
  styleUrl: 'pds-list-options.scss',
  scoped: true,
})
export class PdsListOptions {
  /**
   * A unique identifier for the sortable container.
   */
  @Prop() componentId!: string;

  /**
   * Track the currently focused option index
   */
  @Prop() focusedOptionIndex = -1;

  /**
   * Store the ID of the last selected option
   */
  @Prop() selectedOptionId?: string;

  @Element() element: HTMLPdsListOptionsElement;

  @Listen('click', {})
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const option = target.closest('pds-list-option');
    if (option) {
      this.setSelectedOption(option.id);
    }
  }

  @Listen('pdsListOptionSelected')
  handleOptionSelected(event: CustomEvent<string>) {
    console.log('handleOptionSelected: ', event.detail);
    this.setSelectedOption(event.detail);
  }

  @Listen('keydown', {})
  handleKeyDown(event: KeyboardEvent) {
    const items = this.element.querySelectorAll('pds-list-option');
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusNextItem(items);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusPreviousItem(items);
    }
  }

  // Helper function to focus the next item
  private focusNextItem(items: NodeListOf<HTMLElement>) {
    this.focusedOptionIndex =
      (this.focusedOptionIndex + 1) % items.length;
    items[this.focusedOptionIndex].focus();
  }

  // Helper function to focus the previous item
  private focusPreviousItem(items: NodeListOf<HTMLElement>) {
    this.focusedOptionIndex =
      (this.focusedOptionIndex - 1 + items.length) % items.length;
    console.log('items: ', items);
    console.log('focusPreviousItem: ', this.focusedOptionIndex);
    console.log('items[this.focusedOptionIndex]: ', items[this.focusedOptionIndex])
    items[this.focusedOptionIndex].focus();
  }

  // Add a method to set the selected option
  private setSelectedOption(optionId: string) {
    this.selectedOptionId = optionId;
  }

  private classNames() {
    const classNames = ['pds-list-options'];

    return classNames.join('  ');
  }

  render() {
    return (
      <Host>
        <ul
          aria-labelledby="menu-label"
          class={this.classNames()}
          id={this.componentId}
          // ref={(el) => (this.element = el as HTMLUListElement)}
          role="menu"
        >
          <slot></slot>
        </ul>
      </Host>
    );
  }
}
