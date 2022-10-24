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
  * The height of the image in pixels. Setting this will
  * devote space in the layout to prevent layout
  * shifts when the image is loaded.
  */
 @Prop() height?: number;

 /**
  * Indicates how the browser should load the image.
  * Defaults to "eager".
  */
 @Prop() loading?: 'eager' | 'lazy' = 'eager';

 /**
  * The image's source.
  */
 @Prop() src: string;

 /**
  * The width of the image in pixels. Setting this will
  * devote space in the layout to prevent layout
  * shifts when the image is loaded.
  */
 @Prop() width?: number;

  render() {
    return (
      <Host
        class={{
          'sage-image': true,
        }}
      >
        <img 
          alt={this.alt}
          height={this.height}
          loading={this.loading}
          src={this.src}
          width={this.width}
        />
      </Host>
    );
  }
}
