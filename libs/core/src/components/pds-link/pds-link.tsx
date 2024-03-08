import { Component, h, Prop } from '@stencil/core';

import { launch } from '@pine-ds/icons/icons';

/**
 * @part link - The main link element that represents the link component.
 * @slot - Content is placed between the opening closing tags.
 */
@Component({
  tag: 'pds-link',
  styleUrl: 'pds-link.scss',
  shadow: true,
})
export class PdsLink {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * When enabled, opens link in a new tab.
   * @defaultValue false
   */
  @Prop() external = false;

  /**
   *
   * Modifies the look of the link
   */
  @Prop() variant: 'inline' | 'plain' = 'inline';

  /**
   *
   * The Font size follows t-shirt model
   * sm: 12px
   * md: 14px
   * lg: 16px
   * @defaultValue lg
   */
  @Prop() fontSize: 'sm' | 'md' | 'lg' = 'lg';

  /**
   * The URL that the hyperlink points to.
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

  render() {

    return (
      <a
        class={this.classNames()}
        href={this.href}
        id={this.componentId}
        target={this.external ? '_blank' : undefined}
        part="link"
      >
        <slot>{this.href}</slot>
        {this.external &&
          <pds-icon icon={launch} size={this.fontSize}></pds-icon>
        }
      </a>
    );
  }
}
