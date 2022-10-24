import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'sage-image',
  styleUrl: 'sage-image.scss',
  shadow: true,
})
export class SageImage {
  /**
   * The image's alt tag. If none is provided,
   * it will default to an empty string.
  */
 @Prop() alt? = '';

 /**
  * The image's source.
  */
 @Prop() src: string;

  render() {
    return (
      <Host
        class={{
          'sage-image': true,
        }}
      >
        <img alt={this.alt} src={this.src} />
      </Host>
    );
  }
}
