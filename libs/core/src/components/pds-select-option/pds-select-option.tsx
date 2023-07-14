import { Component, Element, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-select-option',
  styleUrl: 'pds-select-option.scss',
  shadow: true,
})
export class PdfSelectOption {
  @Element() element: HTMLPdsSelectOptionElement;

  /**
   * Sets the state of the option to
   */
  @Prop({ mutable: true, reflect: true }) selected: boolean;

  /**
   * The text to be displayed in the option
   */
  @Prop() text: string;

  /**
   * The value of that is saved for form data
   */
  @Prop() value: string | number;

  /**
   * Triggered when an option is clicked when allowSelect is false.
   */
  @Event({ bubbles: true, composed: true }) pdsSelectOptionSelected: EventEmitter;

  private onOptionSelected = (ev: Event) => {
    console.log('ev: ', ev);
    this.selected = !this.selected
    this.pdsSelectOptionSelected.emit({value: this.value, event: ev})
  }

  private selectOptionClassNames() {
    const classNames = ['pds-select-option'];

    if (this.selected && this.selected === true) {
      classNames.push('is-selected');
    }

    return classNames.join('  ');
  }

  render() {
    return (
      <li
        aria-selected={this.selected}
        class={this.selectOptionClassNames()}
        role="option"
        onMouseDown={this.onOptionSelected}
        // onFocus={}
        // onBlur={}
      >
        {this.value ? this.value : <slot />}
      </li>
    );
  }
}
