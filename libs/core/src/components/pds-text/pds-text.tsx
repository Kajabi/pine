import { Component, h, Prop, Element } from '@stencil/core';
import { setColor } from '../../utils/utils';

@Component({
  tag: 'pds-text',
  styleUrl: 'pds-text.scss',
  shadow: true,
})
export class PdsText {
  @Element() el: HTMLPdsTextElement;
  /**
   * Sets the text alignment.
   */
  @Prop() align?: 'start' | 'center' | 'end' | 'justify';

  /**
   * Sets the text color.
   */
  @Prop() color?: string;

  /**
   * Sets the text decoration.
   */
  @Prop() decoration?:
  | 'strikethrough'
  | 'underline-dotted';

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
   * If set or `true`, the text will be italic.
   */
  @Prop() italic?: boolean;

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
  | '2xs'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

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

  /**
   * If set or `true`, the text will be truncated. Must add a `width` to the element.
   */
  @Prop({ reflect: true }) truncate?: boolean;

  render() {
    const Tag = this.tag;

    const typeClasses = `
      pds-text
      ${this.align !== undefined && this.align.trim() !== '' ? `pds-text--align-${this.align}` : ''}
      ${this.gutter !== undefined && this.gutter.trim() !== '' ? `pds-text--gutter-${this.gutter}` : ''}
      ${this.size !== undefined && this.size.trim() !== '' ? `pds-text--size-${this.size}` : ''}
      ${this.weight !== undefined && this.weight.trim() !== '' ? `pds-text--weight-${this.weight}` : ''}
      ${this.decoration !== undefined && this.decoration.trim() !== '' ? `pds-text--decoration-${this.decoration}` : ''}
    `;

    return (
      <Tag style={this.color && setColor(this.color)} class={typeClasses}>
        <slot />
      </Tag>
    );
  }
}
