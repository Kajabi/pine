import { Component, h, Prop, Element } from '@stencil/core';
import { setColor } from '../../utils/utils';

/**
 * PdsText - A versatile text component for content display
 *
 * **⚠️ CRITICAL USAGE CLARIFICATION:**
 * - **Content Display**: Use for general text content, headings, paragraphs, etc.
 * - **NOT for Input Labels**: Do NOT use for input field labels - use the `label` prop on input components instead
 * - **Semantic Text**: Renders appropriate HTML tags (p, h1-h6, code, etc.)
 * - **Typography Control**: Provides size, weight, color, and alignment options
 *
 * **Common Use Cases:**
 * - **Headings**: Use with `tag="h1"` through `tag="h6"`
 * - **Body Text**: Use with `tag="p"` for paragraphs
 * - **Code**: Use with `tag="code"` or `tag="pre"` for code snippets
 * - **Emphasis**: Use with `tag="strong"` or `tag="em"` for emphasis
 *
 * **⚠️ INPUT LABEL MISTAKE:**
 * When you see text above an input field in a screenshot:
 * - **That's the input's LABEL**, not a separate `pds-text` component
 * - **Use the `label` prop** on the input component instead
 * - **Example**: `<pds-input label="Email" component-id="email"></pds-input>`
 *
 * **Usage Examples:**
 * ```tsx
 * // Heading
 * <pds-text tag="h1" size="h1" weight="bold">Page Title</pds-text>
 *
 * // Body text
 * <pds-text tag="p" size="md">This is body text content.</pds-text>
 *
 * // Code snippet
 * <pds-text tag="code" size="sm">const example = "code";</pds-text>
 *
 * // ❌ INCORRECT - Don't use for input labels
 * <pds-text>Email Address</pds-text>
 * <pds-input component-id="email"></pds-input>
 *
 * // ✅ CORRECT - Use input label prop
 * <pds-input label="Email Address" component-id="email"></pds-input>
 * ```
 *
 * @part content - The text content container
 */
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
      <Tag style={this.color && setColor(this.color)} class={typeClasses} part="content">
        <slot />
      </Tag>
    );
  }
}
