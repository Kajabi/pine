import { Component, h, Prop } from '@stencil/core';
import { setColor } from '../../utils/utils';

import { launch } from '@pine-ds/icons/icons';

/**
 * @part link - Link element styles.
 * @slot (default) - Text content placed between the opening and closing tags. If no text is provided, the **href** will be used as a fallback.
 */
@Component({
  tag: 'pds-link',
  styleUrls: ['pds-link.scss'],
  shadow: true,
})
export class PdsLink {
  /**
   * Sets the link color.
   */
  @Prop() color?: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether the link should open in a new tab.
   * @defaultValue false
   */
  @Prop() external = false;

  /**
   * Sets the link variant styles.
   * @defaultValue inline
   */
  @Prop() variant: 'inline' | 'plain' = 'inline';

  /**
   * The font size of the link's text.
   * @defaultValue lg
   */
  @Prop() fontSize: 'sm' | 'md' | 'lg' = 'lg';

  /**
   * The hyperlink's destination URL. If no text is provided in the custom slot, the href will be used.
   */
  @Prop() href!: string;

  private classNames() {
    const classNames = ['pds-link'];

    if (this.fontSize) {
      classNames.push('pds-link--' + this.fontSize);
    }

    if (this.variant) {
      classNames.push('pds-link--' + this.variant);
    }

    return classNames.join(' ');
  }

  private setLinkStyles() {
    if (!this.color) return;

    const linkColors = {
      secondary: 'var(--pine-color-text-primary)',
      accent: 'var(--pine-color-accent)',
      danger: 'var(--pine-color-danger)',
    }

    const linkStyles = setColor(this.color, linkColors);

    return linkStyles;
  }

  render() {

    return (
      <a
        class={this.classNames()}
        href={this.href}
        id={this.componentId}
        part="link"
        target={this.external ? '_blank' : undefined}
        style={this.setLinkStyles()}
      >
        <slot>{this.href}</slot>
        {this.external &&
          <pds-icon icon={launch} size={this.fontSize}></pds-icon>
        }
      </a>
    );
  }
}
