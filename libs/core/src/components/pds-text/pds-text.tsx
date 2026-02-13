import { Component, h, Prop, Element, Watch } from '@stencil/core';
import { setColor } from '../../utils/utils';
import { setupTruncationTooltip } from '../../utils/truncation-tooltip';

/**
 * @part content - The text content container
 */
@Component({
  tag: 'pds-text',
  styleUrl: 'pds-text.scss',
  shadow: true,
})
export class PdsText {
  @Element() el: HTMLPdsTextElement;
  private contentEl: HTMLElement;
  private truncationCleanup: (() => void) | null = null;
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
   * When text overflows, a tooltip showing the full text will appear on hover/focus.
   * Note: When truncate is enabled, the element automatically receives tabindex="0" for keyboard accessibility.
   */
  @Prop({ reflect: true }) truncate?: boolean;

  @Watch('truncate')
  handleTruncateChange(newValue: boolean) {
    if (newValue) {
      this.initTruncationTooltip();
    } else {
      this.destroyTruncationTooltip();
    }
  }

  componentDidLoad() {
    if (this.truncate) {
      this.initTruncationTooltip();
    }
  }

  disconnectedCallback() {
    this.destroyTruncationTooltip();
  }

  private initTruncationTooltip() {
    // Clean up any existing tooltip before setting up a new one
    this.destroyTruncationTooltip();

    if (this.contentEl) {
      this.truncationCleanup = setupTruncationTooltip({
        hostEl: this.el,
        contentEl: this.contentEl,
        getTooltipText: () => this.el.textContent || '',
      });
    }
  }

  private destroyTruncationTooltip() {
    if (this.truncationCleanup) {
      this.truncationCleanup();
      this.truncationCleanup = null;
    }
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
      <Tag
        ref={(el) => this.contentEl = el}
        style={this.color && setColor(this.color)}
        class={typeClasses}
        part="content"
        tabIndex={this.truncate ? 0 : undefined}
      >
        <slot />
      </Tag>
    );
  }
}
