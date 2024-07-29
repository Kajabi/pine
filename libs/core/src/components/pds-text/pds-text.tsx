import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-text',
  styleUrl: 'pds-text.scss',
  shadow: true,
})
export class PdsText {

  /**
   * Sets the font size.
   */
  @Prop() size!: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

  /**
   * Determines what semantic text tag to render.
   */
  @Prop() tag!: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

  render() {
    const Tag = this.tag;

    const typeClasses = `
      ${this.size !== undefined ? `pds-text--size-${this.size}` : ''}
      ${this.size ? 'pds-box--auto' : ''}
      pds-text
    `;

    return (
      <Tag class={typeClasses}>
        <slot />
      </Tag>
    );
  }

}
