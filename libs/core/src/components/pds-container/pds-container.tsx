import { Component, Host, h, Prop } from '@stencil/core';

const NAMED_SIZES = new Set(['sm', 'md', 'lg', 'xl', 'full']);

/**
 * @part container - The inner semantic container element
 */
@Component({
  tag: 'pds-container',
  styleUrl: 'pds-container.scss',
  shadow: true,
})
export class PdsContainer {
  /**
   * Sets the maximum width of the container. Accepts a named size token
   * (`'sm'` | `'md'` | `'lg'` | `'xl'` | `'full'`) or any valid CSS length value (e.g. `'640px'`, `'50rem'`).
   * When omitted, no max-width is applied.
   */
  @Prop() size?: string;

  /**
   * Sets the semantic HTML tag rendered as the inner container element.
   * @default 'div'
   */
  @Prop() tag: 'div' | 'main' | 'section' | 'article' = 'div';

  /**
   * If `true`, the container is centered horizontally using `margin-inline: auto`.
   * @default true
   */
  @Prop() centered: boolean = true;

  render() {
    const Tag = this.tag;
    const isNamed = this.size !== undefined && NAMED_SIZES.has(this.size);
    const customSize = this.size !== undefined && !isNamed ? this.size : undefined;

    const hostStyle: Record<string, string> = {};
    if (customSize) hostStyle['--pine-container-max-width'] = customSize;
    if (!this.centered) hostStyle['margin-inline'] = '0';

    return (
      <Host
        class={{ [`pds-container--${this.size}`]: isNamed }}
        style={Object.keys(hostStyle).length ? (hostStyle as any) : undefined}
      >
        <Tag part="container">
          <slot />
        </Tag>
      </Host>
    );
  }
}
