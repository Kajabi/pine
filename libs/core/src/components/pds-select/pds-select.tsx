import { Component, Element, Host, h, Prop, Event, EventEmitter, Listen } from '@stencil/core';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect {
  @Element() el!: HTMLPdsSelectElement;

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

  // private onSelectChange = (ev: Event) => {
  //   console.log('ran');
  //   const select = ev.target as HTMLSelectElement;
  //   if (select) {
  //     this.value = select.value;
  //   }
  //   this.pdsSelectChange.emit(this.value);

  //   console.log('this.value: ', this.value);
  // };

  @Listen('pdsSelectOptionSelected')
  pdsSelectedOption(event: CustomEvent<any>) {
    this.value = event.detail.value;
  }

  private selectClassNames() {
    const classNames = ['combo-input'];
    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }
    return classNames.join(' ');
  }

  private updateSelectedOptionText() {
    const selectedOption = this.el.querySelector('pds-select-option[selected]');
    if (selectedOption) {
      this.value = selectedOption.getAttribute('value');
      const comboInput = this.el.querySelector('.combo-input');
      if (comboInput) {
        comboInput.textContent = this.value;
      }
    }
  }

  private handleOptionSelected = (event: CustomEvent<{ value: string; event: Event }>) => {
    const { value } = event.detail;
    this.value = value;
    this.pdsSelectChange.emit(this.value);
    // this.updateSelectedOptionText();
  };

  componentDidRender() {
    this.updateSelectedOptionText();
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
            // onChange={this.onSelectChange}
            // disabled={this.disabled}
          >
            {this.value}
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
