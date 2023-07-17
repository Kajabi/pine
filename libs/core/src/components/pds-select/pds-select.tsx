import { Component, Element, Host, h, Prop, Event, EventEmitter, Listen, Watch } from '@stencil/core';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect {
  @Element() el!: HTMLPdsSelectElement;
  @Prop() selectedOptionValue?: string;

  @Prop() componentId!: string;
  @Prop() disabled = false;
  @Prop() errorMessage?: string;
  @Prop() hintMessage?: string;
  @Prop({ mutable: true }) invalid = false;
  @Prop() label?: string;
  @Prop() name: string = this.componentId;
  @Prop() placeholder?: string;
  @Prop() readonly = false;
  @Prop() required = false;
  @Prop({ mutable: true }) value?: string;


  @Event() pdsSelectChange!: EventEmitter<string>;

  @Listen('pdsSelectOptionSelected')
  pdsSelectedOption(event: CustomEvent<any>) {
    const { value } = event.detail;

    if (this.selectedOptionValue !== value) {
      // Deselect the previous selected option, if any
      const prevSelectedOption = this.el.querySelector('pds-select-option[selected]') as HTMLPdsSelectOptionElement;

      if (prevSelectedOption) {
        prevSelectedOption.selected = false;
      }

      // Select the newly clicked option
      this.selectedOptionValue = value;
      const selectedOption = this.el.querySelector(`pds-select-option[value="${value}"]`) as HTMLPdsSelectOptionElement;

      if (selectedOption) {
        selectedOption.selected = true;
      }
      console.log(value);
      this.pdsSelectChange.emit(this.selectedOptionValue);
    }
  }

  private selectClassNames() {
    const classNames = ['combo-input'];

    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }
    return classNames.join(' ');
  }

  componentDidRender() {
    const comboInput = this.el.querySelector('.combo-input');

    if (comboInput) {
      comboInput.textContent = this.selectedOptionValue || '';
    }
  }

  render() {
    return (
      <Host>
        <div class="pds-select combo js-select">
          {this.label && (
            <label
              htmlFor={this.componentId}
              id={`${this.componentId}-label`}
              class="pds-select__label combo-label"
            >
              {this.label}
            </label>
          )}

          <div
            aria-controls={`${this.componentId}-listbox`}
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-labelledby={`${this.componentId}-label`}
            aria-activedescendant={`${this.componentId}-option-${this.value}`}
            class={this.selectClassNames()}
            id={this.componentId}
            role="combobox"
            tabindex="0"
          >
            {this.selectedOptionValue}
          </div>

          <div
            aria-labelledby={`${this.componentId}-label`}
            class="pds-select__menu combo-menu"
            id={`${this.componentId}-listbox`}
            role="listbox"
            tabindex="-1"
          >
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
