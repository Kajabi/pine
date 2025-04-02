import { Component, h, Prop, Element } from '@stencil/core';

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
  @Prop() color?:
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'accent'
  | 'danger'
  | 'info'
  | 'success'
  | 'warning'
  | string;

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
  @Prop() truncate?: boolean;

  private setColor() {
    if (this.color === undefined) {
      return;
    }

    const style = {};
    const colors: { [key: string]: string } = {
      primary: 'var(--pine-color-text-primary)',
      secondary: 'var(--pine-color-text-secondary)',
      neutral: 'var(--pine-color-text-neutral)',
      accent: 'var(--pine-color-text-accent)',
      danger: 'var(--pine-color-text-danger)',
      info: 'var(--pine-color-text-info)',
      success: 'var(--pine-color-text-success)',
      warning: 'var(--pine-color-text-warning)',
    }

    if (colors.hasOwnProperty(this.color)) {
      style['--color'] = colors[this.color];
    } else if (this.color.startsWith('--')) {
      style['--color'] = `var(${this.color})`;
    } else {
      style['--color'] = this.color;
    }

    return style;
  }

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
      <Tag style={this.color && this.setColor()} class={typeClasses}>
        <slot />
      </Tag>
    );
  }
}
