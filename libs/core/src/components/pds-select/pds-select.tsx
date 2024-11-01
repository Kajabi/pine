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
   * Text to be displayed as the select label.
   */
  @Prop() label?: string;

  render() {
    return (
      <Host>
        <div class="pds-select">
          <PdsLabel htmlFor={this.componentId} text={this.label} />
          <select class="pds-select__field" id={this.componentId} name="pets">
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
