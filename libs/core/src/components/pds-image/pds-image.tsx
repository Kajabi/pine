import { Component, Event, EventEmitter, Host, h, Prop, Watch } from '@stencil/core';
import type { ImageRatioType } from '@utils/types';
import type { ImageErrorEventDetail, ImageLoadEventDetail } from './image-interface';

@Component({
  tag: 'pds-image',
  styleUrls: ['pds-image.scss'],
  shadow: true,
})
export class PdsImage {
  /**
   * The image's alt text. Defaults to an empty string, which marks the image
   * as decorative and hides it from screen readers, so set it on any image
   * that carries information.
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
   * The width of the image in pixels. This reserves the image's width before it
   * loads, but not its height: to reserve the height too, set
   * `--dimension-aspect-ratio` to the image's own proportions.
   */
  @Prop() width?: number;

  /**
   * Emitted when the image loads. Also emitted on first render for an image that
   * finished loading before the component could listen, such as a server-rendered
   * image. Emitted again after `src` or `srcset` changes and the new image loads.
   */
  @Event() pdsImageLoad: EventEmitter<ImageLoadEventDetail>;

  /**
   * Emitted when the image fails to load, such as for a broken or missing `src`.
   * Emitted again after `src` or `srcset` changes and the new image fails.
   */
  @Event() pdsImageError: EventEmitter<ImageErrorEventDetail>;

  private imageEl?: HTMLImageElement;

  /**
   * The source the last event was emitted for. A cached image can report `complete`
   * on first render and still fire its own `load` event afterwards, so this keeps
   * one source from emitting twice.
   */
  private settledSrc: string | null = null;

  @Watch('src')
  @Watch('srcset')
  handleSourceChange() {
    this.settledSrc = null;
  }

  componentDidLoad() {
    const img = this.imageEl;
    if (!img?.complete || img.currentSrc === '') return;

    if (img.naturalWidth > 0) {
      this.emitLoad();
      return;
    }

    // `complete` with no intrinsic width is either a broken image or an SVG with no
    // intrinsic size, and only decoding tells them apart.
    const src = img.currentSrc;
    img.decode().then(
      () => img.currentSrc === src && this.emitLoad(),
      () => img.currentSrc === src && this.emitError(),
    );
  }

  private emitLoad = () => {
    const { currentSrc, naturalHeight, naturalWidth } = this.imageEl;
    if (currentSrc === this.settledSrc) return;

    this.settledSrc = currentSrc;
    this.pdsImageLoad.emit({ currentSrc, naturalHeight, naturalWidth });
  };

  private emitError = () => {
    const { currentSrc } = this.imageEl;
    if (currentSrc === this.settledSrc) return;

    this.settledSrc = currentSrc;
    this.pdsImageError.emit({ currentSrc });
  };

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
          onLoad={this.emitLoad}
          onError={this.emitError}
          ref={(el) => (this.imageEl = el)}
        />
      </Host>
    );
  }
}
