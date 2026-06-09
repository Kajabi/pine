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
   * Prompts the user to save the linked URL instead of navigating to it.
   * It can be used without a value to download with the default filename,
   * or with a string value to suggest a specific filename for the download.
   */
  @Prop() download?: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether the link should open in a new tab.
   * @defaultValue false
   * @deprecated Consider using the `target` prop for more control. This prop will be maintained for backward compatibility.
   */
  @Prop() external = false;

  /**
   * Specifies where to open the linked document.
   * @defaultValue undefined
   * @example
   * <pds-link href="https://example.com" target="_blank">Opens in new tab</pds-link>
   */
  @Prop() target?: '_blank' | '_self' | '_parent' | '_top';

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

  /**
   * Enables or disables Turbo Drive for this link.
   * Maps to the `data-turbo` attribute on the inner anchor element.
   */
  @Prop() turbo?: string;

  /**
   * Specifies the Turbo Frame to target for navigation.
   * Maps to the `data-turbo-frame` attribute on the inner anchor element.
   */
  @Prop() turboFrame?: string;

  /**
   * Controls the Turbo visit action type.
   * Maps to the `data-turbo-action` attribute on the inner anchor element.
   */
  @Prop() turboAction?: 'advance' | 'replace';

  /**
   * Changes the HTTP method for the link request.
   * Maps to the `data-turbo-method` attribute on the inner anchor element.
   */
  @Prop() turboMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete';

  /**
   * Displays a confirmation dialog before navigating.
   * Maps to the `data-turbo-confirm` attribute on the inner anchor element.
   */
  @Prop() turboConfirm?: string;

  /**
   * Accepts Turbo Stream responses for GET requests.
   * Maps to the `data-turbo-stream` attribute on the inner anchor element.
   */
  @Prop() turboStream?: string;

  /**
   * Controls link prefetching on hover.
   * Maps to the `data-turbo-prefetch` attribute on the inner anchor element.
   */
  @Prop() turboPrefetch?: string;

  /**
   * Eagerly preloads the link's destination into cache.
   * Maps to the `data-turbo-preload` attribute on the inner anchor element.
   */
  @Prop() turboPreload?: string;

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
    const targetValue = this.target || (this.external ? '_blank' : undefined);
    const showExternalIcon = this.external;
    const relValue = targetValue === '_blank' ? 'noopener noreferrer' : undefined;

    return (
      <a
        class={this.classNames()}
        download={this.download}
        href={this.href}
        id={this.componentId}
        part="link"
        target={targetValue}
        rel={relValue}
        style={this.setLinkStyles()}
        data-turbo={this.turbo || undefined}
        data-turbo-frame={this.turboFrame || undefined}
        data-turbo-action={this.turboAction || undefined}
        data-turbo-method={this.turboMethod || undefined}
        data-turbo-confirm={this.turboConfirm || undefined}
        data-turbo-stream={this.turboStream || undefined}
        data-turbo-prefetch={this.turboPrefetch || undefined}
        data-turbo-preload={this.turboPreload || undefined}
      >
        <slot>{this.href}</slot>
        {showExternalIcon &&
          <pds-icon icon={launch} size={this.fontSize}></pds-icon>
        }
      </a>
    );
  }
}
