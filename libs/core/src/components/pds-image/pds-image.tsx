import { Component, Host, h, Prop } from '@stencil/core';
import type { ImageRatioType } from '@utils/types';

@Component({
  tag: 'pds-image',
  styleUrls: ['pds-image.scss'],
  shadow: true,
})
export class PdsImage {
  /**
   * The image's alt tag. If none is provided,
   * it will default to an empty string, which is desired for
   * decorative images.
   * @defaultValue ''
   */
  @Prop() alt? = '';

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines how the image fills the shape set by `ratio`.
   * Has no effect if `ratio` is not set.
   * @defaultValue cover
   */
  @Prop() fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'cover';

  /**
   * The height of the image in pixels. `height: auto` lets the loaded image's own
   * proportions decide its rendered height, so unlike `width` this does not reserve
   * space before the image loads.
   */
  @Prop() height?: number;

  /**
   * Indicates how the browser should load the image.
   * @defaultValue eager
   */
  @Prop() loading?: 'eager' | 'lazy' = 'eager';

  /**
   * The aspect ratio the image is sized to, cropping whatever overflows the shape. A preset
   * (`square` 1/1, `landscape` 4/3, `wide` 16/9, `portrait` 3/4, `tall` 9/16) or any custom
   * CSS ratio, such as `21 / 9`. Use this, not `height` and `width`, to crop: those only
   * reserve space, and only `width` reliably does even that.
   */
  @Prop() ratio?: ImageRatioType | (string & Record<never, never>);

  /**
   * Determines the intended display size of an image
   * within certain breakpoints. Has no effect if `srcset`
   * is not set or value has no width descriptor.
   */
  @Prop() sizes?: string;

  /**
   * The image's source.
   */
  @Prop() src: string;

  /**
   * A set of image sources for the browser to use
   * for responsiveness.
   */
  @Prop() srcset?: string

  /**
   * The width of the image in pixels. Setting this will
   * devote space in the layout to prevent layout
   * shifts when the image is loaded.
   */
  @Prop() width?: number;

  private imageRatio() {
    const ratios: { [key: string]: string } = {
      square: '1 / 1',
      landscape: '4 / 3',
      wide: '16 / 9',
      portrait: '3 / 4',
      tall: '9 / 16',
    };

    return ratios[this.ratio] ?? this.ratio;
  }

  render() {
    // `!= null`, not `!== undefined`: removing the attribute sets the prop to `null`, not `undefined`.
    const hasRatio = this.ratio != null && this.ratio !== '';
    // `fit` only means something once a ratio gives the image a shape to
    // overflow, so neither is applied until `ratio` is set.
    const ratioStyle = hasRatio
      ? { aspectRatio: this.imageRatio(), objectFit: this.fit }
      : undefined;

    return (
      <Host
        class={{
          'pds-image': true,
          'pds-image--has-ratio': hasRatio,
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
          style={ratioStyle}
          width={this.width}
        />
      </Host>
    );
  }
}
