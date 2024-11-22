import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-text',
  styleUrl: 'pds-text.scss',
  shadow: true,
})
export class PdsText {

  /**
   * Sets the text alignment.
   */
  @Prop() align?: 'start' | 'center' | 'end' | 'justify';

  /**
   * Sets the text color.
   */
  @Prop() color?:
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'accent'
  | 'danger'
  | 'info'
  | 'success'
  | 'warning';

  /**
   * Set the bottom margin for the text.
   */
  @Prop() gutter?:
  | '2xl'
  | 'xl'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xs'
  | '2xs';

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
   * Sets the font weight.
   */
  @Prop() weight?:
  | 'extra-light'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold';

  /**
   * Determines what semantic text tag to render.
   */
  @Prop() tag:
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'code'
  | 'pre'
  | 'strong'
  | 'em' = "p";

  render() {
    const Tag = this.tag;

    const typeClasses = `
      pds-text
      ${this.align !== undefined && this.align.trim() !== '' ? `pds-text--align-${this.align}` : ''}
      ${this.color !== undefined && this.color.trim() !== '' ? `pds-text--color-${this.color}` : ''}
      ${this.gutter !== undefined && this.gutter.trim() !== '' ? `pds-text--gutter-${this.gutter}` : ''}
      ${this.size !== undefined && this.size.trim() !== '' ? `pds-text--size-${this.size}` : ''}
      ${this.weight !== undefined && this.weight.trim() !== '' ? `pds-text--weight-${this.weight}` : ''}
    `;

    return (
      <Tag class={typeClasses}>
        <slot />
      </Tag>
    );
  }
}
