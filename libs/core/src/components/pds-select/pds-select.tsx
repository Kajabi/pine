import { Component, Host, h, Prop } from '@stencil/core';
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
   * Text to be displayed as the select label.
   */
  @Prop() label?: string;

  /**
   * Indicates whether or not the select field is required.
   */
  @Prop() required?: boolean;

  render() {
    return (
      <Host aria-disabled={this.disabled ? 'true' : null}>
        <div class="pds-select">
          <PdsLabel htmlFor={this.componentId} text={this.label} />
          <select class="pds-select__field" disabled={this.disabled} id={this.componentId} name="pets" required={this.required}>
            <option value="">Please choose an option</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
          </select>
        </div>
      </Host>
    );
  }
}
