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
   * image. Emitted again after `src` or `srcset` changes and the new image loads, or
   * when the browser picks a different `srcset` candidate, such as on a resize. Bubbles
   * and is composed, so a listener on an ancestor gets every `pds-image`'s events —
   * check `event.target` when more than one is in scope.
   */
  @Event() pdsImageLoad: EventEmitter<ImageLoadEventDetail>;

  /**
   * Emitted when the image fails to load, such as for a broken or empty `src`. An image
   * with no `src` or `srcset` at all emits neither event, since it has nothing to load.
   * Emitted again after `src` or `srcset` changes and the new image fails. Bubbles and is
   * composed, so a listener on an ancestor gets every `pds-image`'s events — check
   * `event.target` when more than one is in scope.
   */
  @Event() pdsImageError: EventEmitter<ImageErrorEventDetail>;

  private imageEl?: HTMLImageElement;

  /**
   * The source and event last emitted. A cached image can report `complete` on first
   * render and still fire its own `load` event afterwards, so this keeps one source
   * from emitting twice. A `load` still replaces an `error` for the same source, in
   * case `decode()` misjudged an image that did load.
   */
  private settled: { src: string; type: 'load' | 'error' } | null = null;

  @Watch('src')
  @Watch('srcset')
  handleSourceChange() {
    this.settled = null;
  }

  componentDidLoad() {
    const img = this.imageEl;
    // With no `src` or `srcset` there is nothing to load and no event to emit. An empty
    // `src` still counts: the browser treats it as a failed load.
    if (!img?.complete || !this.hasSource()) return;

    if (img.naturalWidth > 0) {
      this.emitLoad();
      return;
    }

    // `complete` with no intrinsic width is either a broken image or an SVG with no
    // intrinsic size, and only decoding tells them apart. Without `decode()`, leave it
    // to the native events.
    if (typeof img.decode !== 'function') return;

    const src = img.currentSrc;
    img.decode().then(
      () => img.currentSrc === src && this.emitLoad(),
      () => img.currentSrc === src && this.emitError(),
    );
  }

  // With no `src` or `srcset` attribute at all there is nothing to load and no event to
  // emit. Clearing `src` can leave a brief window where Stencil has removed the attribute
  // but a native `error` for the old, momentarily-empty `src` is still in flight (Firefox,
  // Safari) — this check, read live at emit time, is what catches that window.
  private hasSource() {
    const img = this.imageEl;
    return img.hasAttribute('src') || img.hasAttribute('srcset');
  }

  /**
   * The resolved absolute URL `src` would become once applied, or `undefined` for no
   * `src`. Resolving it (rather than comparing raw attribute text) matches `img.src`
   * even when Stencil skipped writing the attribute because the resolved value already
   * equaled it, such as a `src` change from a relative to an equivalent absolute URL.
   */
  private resolvedSrc(): string | undefined {
    if (this.src == null) return undefined;
    try {
      return new URL(this.src, document.baseURI).href;
    } catch {
      return this.src;
    }
  }

  /**
   * Whether the inner image is showing the current `src` and `srcset`. Right after
   * either changes, and before the next render applies it, an event can still arrive
   * for the old source, and it shouldn't be emitted for the new one.
   */
  private showsCurrentSource() {
    const img = this.imageEl;

    if ((img.getAttribute('srcset') ?? undefined) !== (this.srcset ?? undefined)) return false;

    const expectedSrc = this.resolvedSrc();
    const srcMatches = expectedSrc === undefined ? !img.hasAttribute('src') : img.src === expectedSrc;
    if (!srcMatches) return false;

    // Without `srcset`, a `load`/`error` for the right `src` should already be reflected in
    // `currentSrc`. If it isn't yet, a stale native event from the previous source is still in
    // flight — such as a cached image's `load` arriving just after a same-tick re-render
    // already applied the new `src`. Skipped for an empty `src`: an empty attribute resolves
    // `img.src` to the document's own URL, which `currentSrc` never settles to. `currentSrc` is
    // already an absolute URL in a real browser, so resolving it here is a no-op there; it only
    // matters in test environments whose mocked `currentSrc` isn't resolved the way `img.src` is.
    if (!this.srcset && this.src) {
      try {
        return new URL(img.currentSrc, document.baseURI).href === img.src;
      } catch {
        return img.currentSrc === img.src;
      }
    }

    return true;
  }

  private emitLoad = () => {
    if (!this.hasSource()) return;

    const { currentSrc, naturalHeight, naturalWidth } = this.imageEl;
    if (!this.showsCurrentSource()) return;
    if (this.settled?.src === currentSrc && this.settled.type === 'load') return;

    this.settled = { src: currentSrc, type: 'load' };
    this.pdsImageLoad.emit({ currentSrc, naturalHeight, naturalWidth });
  };

  private emitError = () => {
    if (!this.hasSource()) return;

    const { currentSrc } = this.imageEl;
    if (!this.showsCurrentSource()) return;
    if (this.settled?.src === currentSrc) return;

    this.settled = { src: currentSrc, type: 'error' };
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
