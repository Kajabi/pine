import { Component, Element, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-select-option',
  styleUrl: 'pds-select-option.scss',
  shadow: true,
})
export class PdfSelectOption {
  @Element() element!: HTMLPdsSelectOptionElement;


  /**
   * The id for the option
   */
  @Prop() componentId: string;

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
  @Prop() value: string;

  /**
   * Triggered when an option is clicked
   */
  // @Event({ bubbles: true, composed: true }) pdsSelectOptionSelected: EventEmitter<{ value: string; event: Event }>;
  @Event({ bubbles: true, composed: true }) pdsSelectOptionSelected: EventEmitter;

  private onOptionSelected = (ev: Event) => {
    console.log(this);
    this.selected = true;
    this.pdsSelectOptionSelected.emit({value: this.value as string, event: ev});
  }

  componentDidLoad() {
    this.updateSelectedAttribute();
  }

  componentDidUpdate() {
    this.updateSelectedAttribute();
  }

  // Is this solution better or the `aria-selected` in the render?
  // Currenlty they are doing the same thing.
  private updateSelectedAttribute() {
    const optionElement = this.element.shadowRoot.querySelector('li');

    if (optionElement) {
      optionElement.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }
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
        // aria-selected={this.selected}
        class={this.selectOptionClassNames()}
        id={this.componentId}
        role="option"
        onMouseDown={this.onOptionSelected}
        // onFocus={}
        // onBlur={}
      >
       {this.text || this.value}
      </li>
    );
  }
}


// TODO if it have a value`,` make it an li, otherwise make div and fill the slot
// do in a method rather to not have extra code
