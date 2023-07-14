import { Component, Element, Host, h, Prop, Event, EventEmitter, ComponentInterface } from '@stencil/core';

@Component({
  tag: 'pds-select',
  styleUrl: 'pds-select.scss',
  shadow: true,
})
export class PdsSelect implements ComponentInterface {
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

  private onSelectChange = (ev: Event) => {
    const select = ev.target as HTMLSelectElement;
    if (select) {
      this.value = select.value;
    }
    this.pdsSelectChange.emit(this.value);
  };

  private selectClassNames() {
    const classNames = ['combo-input'];
    if (this.invalid && this.invalid === true) {
      classNames.push('is-invalid');
    }
    return classNames.join(' ');
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
            class={this.selectClassNames()}
            id={this.componentId}
            role="combobox"
            tabindex="0"
            onChange={this.onSelectChange}
            // disabled={this.disabled}
          ></div>

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
