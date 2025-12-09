import { Component, Host, h, Prop, Event, EventEmitter, Element, State } from '@stencil/core';
import { assignDescription, messageId, exposeTypeProperty } from '../../utils/form';
import { danger } from '@pine-ds/icons/icons';

/**
 * @slot image - Custom image content to display instead of the default radio input
 * @part image-container - The container for the image
 */
@Component({
  tag: 'pds-radio',
  styleUrls: ['../../global/styles/utils/label.scss', 'pds-radio.scss'],
  scoped: true,
})
export class PdsRadio {
  private readonly _type = 'radio' as const;

  @Element() el: HTMLPdsRadioElement;

  @State() private _hasImage = false;

  /**
   * Determines whether or not the radio is checked.
   * @defaultValue false
   */
  @Prop() checked = false;

  /**
   * A unique identifier used for the underlying component `id` attribute and the label `for` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Determines whether or not the radio is disabled.
   * @defaultValue false
   */
  @Prop() disabled = false;

  /**
   * Displays error message text describing an invalid state.
   */
  @Prop() errorMessage: string;

  /**
   * Displays helper message text below radio.
   */
  @Prop() helperMessage: string;

  /**
   * Adds a border around the radio component for better visual separation.
   * @defaultValue false
   */
  @Prop() hasBorder = false;

    /**
   * Determines whether or not the radio is invalid.
   * @defaultValue false
   */
    @Prop() invalid = false;

  /**
   * String used for label text next to radio.
   */
  @Prop() label: string;

  /**
   * Visually hides the label text for instances where only the radio should be displayed. Label remains accessible to assistive technology such as screen readers.
   */
  @Prop() hideLabel: boolean;

  /**
   * String used for radio `name` attribute.
   */
  @Prop() name: string;

  /**
   * Determines whether or not the radio is required.
   * @defaultValue false
   */
  @Prop() required = false;

  /**
   * The value of the radio that is submitted with a form.
   */
  @Prop() value: string;


  /**
   * Emits a boolean indicating whether the radio is currently checked or unchecked.
   */
  @Event() pdsRadioChange: EventEmitter<boolean>;

  private handleRadioChange = (e: Event) => {
    if (this.disabled) {
      return;
    }

    const target = e.target as HTMLInputElement;
    const isChecked = target.checked;

    // If this radio is inside a pds-radio-group, don't emit the individual event
    // The group will handle emitting its own event
    if (this.el.closest('pds-radio-group')) {
      return;
    }

    this.pdsRadioChange.emit(isChecked);
  }

  private hasImageSlot(): boolean {
    const imageSlot = this.el.querySelector('[slot="image"]');
    return !!imageSlot;
  }

  private hasImage(): boolean {
    return this._hasImage;
  }

  private classNames() {
    const classNames = [];

    if (this.invalid) {
      classNames.push('is-invalid');
    }
    if (this.disabled) {
      classNames.push('is-disabled');
    }
    if (this.hasBorder) {
      classNames.push('has-border');
    }
    if (this.hasImage()) {
      classNames.push('has-image');
    }

    return classNames.join(' ');
  }

  componentWillLoad() {
    this._hasImage = this.hasImageSlot();
  }

  connectedCallback() {
    // Expose type property on the element instance to match native form element behavior
    exposeTypeProperty(this.el, () => this._type);
  }

  render() {
    const renderLabelAndMessages = () => [
      <label htmlFor={this.componentId} key={`${this.componentId}-label`}>
        <input
          aria-describedby={assignDescription(this.componentId, this.invalid, this.helperMessage)}
          aria-invalid={this.invalid ? "true" : undefined}
          type="radio"
          id={this.componentId}
          name={this.name}
          value={this.value}
          checked={this.checked}
          required={this.required}
          disabled={this.disabled}
          onChange={this.handleRadioChange}
          class={this.hasImage() ? 'visually-hidden' : ''}
        />
        <span class={this.hideLabel ? 'visually-hidden' : ''}>
          {this.label}
        </span>
      </label>,
      this.helperMessage && (
        <div
          key={`${this.componentId}-helper`}
          class={'pds-radio__message'}
          id={messageId(this.componentId, 'helper')}
        >
          {this.helperMessage}
        </div>
      ),
      this.errorMessage && (
        <div
          key={`${this.componentId}-error`}
          class={`pds-radio__message pds-radio__message--error`}
          id={messageId(this.componentId, 'error')}
          aria-live="assertive"
        >
          <pds-icon icon={danger} size="small" />
          {this.errorMessage}
        </div>
      )
    ];

    return (
      <Host class={this.classNames()}>
        {this.hasImage() && (
          <div class="pds-radio__image-container" part="image-container">
            <slot name="image" onSlotchange={() => (this._hasImage = this.hasImageSlot())} />
          </div>
        )}
        {this.hasImage() ? (
          <div class="pds-radio__content-wrapper">
            {renderLabelAndMessages()}
          </div>
        ) : (
          renderLabelAndMessages()
        )}
      </Host>
    );
  }
}
