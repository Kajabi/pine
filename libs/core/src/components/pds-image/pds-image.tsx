import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-image',
  styleUrl: 'pds-image.scss',
  shadow: true,
})
export class PdsImage {
  /**
   * The image's alt tag. If none is provided,
   * it will default to an empty string.
   */
  @Prop() alt? = '';

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * The height of the image in pixels. Setting this will
   * devote space in the layout to prevent layout
   * shifts when the image is loaded.
   */
  @Prop() height?: number;

  /**
   * Indicates how the browser should load the image.
   */
  @Prop() loading?: 'eager' | 'lazy' = 'eager';

  /**
   * Determines the intended display size of an image
   * within certian breakpoints. Has no effect if `srcset`
   * is not set or value has no width descriptor.
   */
  @Prop() sizes?: string;

  /**
   * The image's source.
   */
  @Prop() src: string;

  /**
   * A set of image sources for the browser to use.
   */
  @Prop() srcset?: string

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
          'pds-image': true,
        }}
        id={this.componentId}
      >
        <img
          alt={this.alt}
          height={this.height}
          loading={this.loading}
          sizes={this.sizes}
          src={this.src}
          srcset={this.srcset}
          width={this.width}
        />
      </Host>
    );
  }
}
