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
  @Prop() size?:
  | '2xl'
  | 'xl'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xs'
  | '2xs';

  /**
   * Determines what semantic text tag to render.
   */
  @Prop() tag!: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

  render() {
    const Tag = this.tag;

    const typeClasses = `
      pds-text
      ${this.size !== undefined && this.size.trim() !== '' ? `pds-text--size-${this.size}` : ''}
    `;

    return (
      <Tag class={typeClasses}>
        <slot />
      </Tag>
    );
  }
}
