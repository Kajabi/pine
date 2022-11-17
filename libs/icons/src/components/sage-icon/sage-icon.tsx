import { Build, Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { getSvgContent, sageIconContent } from './request';
import { getName, getUrl, inheritAttributes } from './utils';

@Component({
  tag: 'sage-icon',
  assetsDirs: ['svg'],
  styleUrl: 'sage-icon.scss',
  shadow: true,
})
export class SageIcon {
  private io?: IntersectionObserver;
  private inheritedAttributes: { [k: string]: any } = {};

  @Element() el!: HTMLElement;

  @State() private ariaLabel?: string;
  @State() private isVisible = false;
  @State() private svgContent?: string;

  /**
   * The color to be use for the background
   */
  @Prop() color?: string;

  /**
   * The name of the icon to use from
   * the built-in set.
   */
  @Prop({ reflect: true }) name?: string;

  /**
   * The size of the icon. This can be
   * 'small', 'normal', 'medium', large, or a
   * custom value (40px, 1rem, etc)
   *
   */
  @Prop({ reflect: true }) size?:
    | 'small'   // 12px
    | 'normal'  // 16px
    | 'medium'  // 20px
    | 'large'   // 24px
    | 'auto'
    | string = 'normal'

  private iconSize() {
    const sizes: { [key: string]: any } = {
      small: '12px',
      normal: '16px',
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
  loadIcon() {
    if (Build.isBrowser && this.isVisible) {
      const url = getUrl(this);
      if (url) {
        if (sageIconContent.has(url)) {
          this.svgContent = sageIconContent.get(url);
        } else {
          getSvgContent(url).then(() => (this.svgContent = sageIconContent.get(url)));
        }
      }
    }

    const label = getName(this.name);

    if (label) {
      this.ariaLabel = label.replace(/\-/g, ' ');
    }
  }

  render() {
    const { ariaLabel, inheritedAttributes } = this;

    const style = {
      height: this.iconSize(),
      width: this.iconSize()
    }

    return (
      <Host
        aria-label={ariaLabel !== undefined && !this.hasAriaHidden() ? ariaLabel : null }
        role="img"
        style={style}
        {...inheritedAttributes}
      >
        {Build.isBrowser && this.svgContent ? (
          <div innerHTML={this.svgContent}></div>
        ) : (
          <div></div>
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
