import { Build, Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { getSvgContent, pdsIconContent } from './request';
import { getName, getUrl, inheritAttributes } from './utils';

@Component({
  tag: 'pds-icon',
  assetsDirs: ['svg'],
  styleUrl: 'pds-icon.scss',
  shadow: true,
})
export class PdsIcon {
  private io?: IntersectionObserver;
  private inheritedAttributes: { [k: string]: any } = {};

  @Element() el!: HTMLPdsIconElement;

  @State() private ariaLabel?: string;
  @State() private isVisible = false;
  @State() private svgContent?: string;

  /**
   *
   * The color of the icon
   *
   */
  @Prop() color?: string;

   /**
   * This a combination of both `name` and `src`. If a `src` url is detected
   * it will set the `src` property. Otherwise it assumes it's a built-in named
   * SVG and set the `name` property.
   */
  @Prop() icon?: any;

  /**
   * The name of the icon to use from
   * the built-in set.
   */
  @Prop({ reflect: true }) name?: string;

  /**
   * The size of the icon. This can be
   * 'small', 'regular', 'medium', large, or a
   * custom value (40px, 1rem, etc)
   *
   */
  @Prop({ reflect: true }) size?:
    | 'small'   // 12px
    | 'regular'  // 16px
    | 'medium'  // 20px
    | 'large'   // 24px
    | 'auto'
    | string = 'regular'

  private iconSize() {
    const sizes: { [key: string]: any } = {
      small: '12px',
      regular: '16px',
      medium: '20px',
      large: '24px',
    }

    if (sizes[this.size]) {
      return sizes[this.size];
    } else {
      return this.size;
    }
  }
  componentWillLoad() {
    this.inheritedAttributes = inheritAttributes(this.el, ['aria-label']);
  }

  connectedCallback() {
    this.waitUntilVisible(this.el, '50px', () => {
      this.isVisible = true;
      this.loadIcon();
    })
  }

  disconnectedCallback() {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
  }

  @Watch('name')
  @Watch('icon')
  loadIcon() {
    if (Build.isBrowser && this.isVisible) {
      const url = getUrl(this);

      if (url) {
        if (pdsIconContent.has(url)) {
          this.svgContent = pdsIconContent.get(url);
        } else {
          getSvgContent(url).then(() => (this.svgContent = pdsIconContent.get(url)));
        }
      }
    }

    const label = getName(this.name, this.icon);

    if (label) {
      this.ariaLabel = label.replace(/\-/g, ' ');
    }
  }

  render() {
    const { ariaLabel, inheritedAttributes } = this;

    const style = {
      height: this.iconSize(),
      width: this.iconSize(),
      color: this.color,
    }

    return (

      <Host
        aria-label={ariaLabel !== undefined && !this.hasAriaHidden() ? ariaLabel : null }
        role="img"
        style={style}
        class={{
          ...createColorClasses(this.color),
        }}
        {...inheritedAttributes}
      >
        {Build.isBrowser && this.svgContent ? (
          <div class="icon-inner" innerHTML={this.svgContent}></div>
        ) : (
          <div class="icon-inner"></div>
        )}
      </Host>
    )
  }

  /*****
   * Private Methods
   ****/

  private waitUntilVisible(el: HTMLElement, rootMargin: string, cb: () => void) {
    if (Build.isBrowser && typeof window !== 'undefined' && (window as any).IntersectionObserver) {
      const io = (this.io = new (window as any).IntersectionObserver(
        (data: IntersectionObserverEntry[]) => {
          if (data[0].isIntersecting) {
            io.disconnect();
            this.io = undefined;
            cb();
          }
        },
        { rootMargin },
      ));

      io.observe(el);
    } else {
      // browser doesn't support IntersectionObserver
      // so just fallback to always show it
      cb();
    }
  }

  private hasAriaHidden = () => {
    const { el } = this;

    return el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true';
  }
}

const createColorClasses = (color: string | undefined) => {
  return color
   ? {
       'pds-color': true,
       [`pds-color-${color}`]: true,
     }
   : null;
 };
