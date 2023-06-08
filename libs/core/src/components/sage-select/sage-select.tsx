import { Component, Event, EventEmitter, Host, h, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'sage-select',
  styleUrl: 'sage-select.css',
  shadow: true,
})
export class SageSelect {

  /**
   * A unique identifier for the field
   */
  @Prop() componentId: string;

  /**
   * Indicates whether or not the field is disabled
   */
  @Prop() disabled?: boolean;

  /**
   * Displays an error message for the field
   */
  @Prop() errorMessage?: string;

  /**
   * Displays a hint or description of the field
   */
  @Prop() helperMessage?: string;

  /**
   * Indicates whether or not the field is invalid or throws an error
   */
  @Prop() invalid?: boolean;

  /**
   * Text to be displayed as the label
   */
  @Prop() label?: string;

  /**
   * Enables multiselect
   */
  @Prop({ reflect: true }) multiple = false

  /**
   * Specifies the name. Submitted with the form name/value pair
   */
  @Prop() name?: string;

  /**
   * Indicates whether or not the field is required
   */
  @Prop() required?: boolean;

  /**
   * The value of the selected option. If multiple is true, this is an array.
   */
  @Prop({ mutable: true }) value?: string | string[]

  /**
   * TODO
   */
  @State() selectValue: string;

  /**
   * TODO
   */
  @State() selectValueAfter: string;

  /**
   * Emitted when a keyboard input occurred
   */
  @Event() sageSelectChange: EventEmitter<string>;

  // @Listen('selectedOptionValue')
  // selectedOptionValueFunc() {
  //   console.log('event emitted')
  // }

  handleSelect(event) {
    console.log('in');
    console.log(event.target.value);

    this.selectValue = event.target.value;
    this.sageSelectChange.emit(this.selectValue)
  }

  handleSecondSelect(event) {
    console.log(event.target.value);
    this.selectValueAfter = event.target.value;
  }

  // handleChange(event) {
  //   this.value = event.target.value;

  //   if (event.target.validity.typeMismatch) {
  //     console.log('this element is not valid')
  //   }
  // }

  render() {
    return (
      <Host>
        <label htmlFor={this.componentId}>{this.label}</label>

        <select name={this.name} id={this.componentId} onInput={(event) => this.handleSelect(event)}>
          <option value="option 1" selected={this.selectValue === 'option 1'}>options 1</option>
          <option value="option 2" selected={this.selectValue === 'option 2'}>options 2</option>
          <option value="option 3" selected={this.selectValue === 'option 3'}>options 3</option>
        </select>

        {/* <select onInput={(event) => this.handleSecondSelect(event)}>
          {this.avOptions.map(recipient => (
            <option value={recipient.id} selected={this.selectedReceiverIds.indexOf(recipient.id) !== -1}>{recipient.name}</option>
          ))}
        </select> */}

        {/* <select class="inf__filter-input" onChange={(event) => this.handleInputChange(event)}>
          <slot />
          {this.options.map(item => <option>{item.label || item.value}</option>)}
        </select> */}

        {this.helperMessage &&
          <p>{this.helperMessage}</p>
        }

        {this.errorMessage &&
          <p>{this.errorMessage}</p>
        }

        <slot></slot>
      </Host>
    );
  }

}
