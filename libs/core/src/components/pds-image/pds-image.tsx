import { Component, Host, h, Prop, Element } from '@stencil/core';
import { inheritAttributes } from '@utils/attributes';
import type { Attributes } from '@utils/attributes';

@Component({
  tag: 'pds-image',
  styleUrls: ['pds-image.scss'],
  shadow: true,
})
export class PdsImage {
  private inheritedImgSpecificAttrs: Attributes = {};
  private imgAttributesToInherit: string[] = ['alt', 'height', 'loading', 'sizes', 'src', 'srcset', 'width'];
  
  @Element() el!: HTMLPdsImageElement;
  
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  componentWillLoad() {
    this.inheritedImgSpecificAttrs = inheritAttributes(this.el, this.imgAttributesToInherit);
  }

  render() {
    return (
      <Host
        class={{
          'pds-image': true,
        }}
        id={this.componentId}
      >
        <img
          {...this.inheritedImgSpecificAttrs}
          loading={this.inheritedImgSpecificAttrs.loading || 'eager'}
        />
      </Host>
    );
  }
}
