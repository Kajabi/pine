import { Component, Host, h, Prop } from '@stencil/core';
import { messageId } from '../../utils/form';
import { PdsLabel } from '../_internal/pds-label/pds-label';

@Component({
  tag: 'pds-select',
  styleUrls: ['../../global/styles/base.scss', 'pds-select.scss'],
  shadow: true,
})
export class PdsSelect {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Indicates whether or not the select field is disabled.
   */
  @Prop() disabled?: boolean;

  /**
   * Displays a message or hint below the input field.
   */
  @Prop() hasError?: boolean;

  /**
   * Displays a message or hint below the input field.
   */
  @Prop() helperMessage?: string;

  /**
   * Text to be displayed as the select label.
   */
  @Prop() label?: string;

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name?: string;

  /**
   * Indicates whether or not the select field is required.
   */
  @Prop() required?: boolean;

  render() {
    return (
      <Host aria-disabled={this.disabled ? 'true' : null}>
        <div class="pds-select">
          <PdsLabel htmlFor={this.componentId} text={this.label} />
          <select class="pds-select__field" disabled={this.disabled} has-error={this.hasError} id={this.componentId} name={this.name} required={this.required}>
            <option value="">Please choose an option</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
          </select>
          {this.helperMessage && (
            <p class="pds-select__helper-message" id={messageId(this.componentId, 'helper')}>
              {this.helperMessage}
            </p>
          )}
        </div>
      </Host>
    );
  }
}
