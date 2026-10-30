import { Component, h, Prop, Element, Watch } from '@stencil/core';
import { setColor } from '../../utils/utils';
import { FOCUSABLE_WRAPPER, setupTruncationTooltip } from '../../utils/truncation-tooltip';
import { TEXT_SIZES, TextSizeType } from '../../utils/types';

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
  @Prop() decoration?: 'strikethrough' | 'underline-dotted';

  /**
   * Set the bottom margin for the text.
   */
  @Prop() gutter?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';

  /**
   * If set or `true`, the text will be italic.
   */
  @Prop() italic?: boolean;

  /**
   * Sets the font size.
   */
  @Prop() size?: TextSizeType;

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
    | 'span'
    | 'code'
    | 'pre'
    | 'strong'
    | 'em' = 'p';

  /**
   * If set or `true`, the text will be truncated. Must add a `width` to the element.
   * When text overflows, a tooltip showing the full text will appear on hover/focus.
   * Note: While the text is overflowing, the element receives tabindex="0" so the
   * tooltip can be reached by keyboard. Text that fits is left out of the tab order.
   * Inside a link or button (including `pds-button`, `pds-link`, `pds-tab`, and
   * `pds-dropdown-menu-item`) that holds no other truncated text, no tab stop is
   * added; the tooltip appears when that control receives keyboard focus.
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

  @Watch('size')
  validateSize(newValue?: string) {
    // Skip when the prop is omitted or explicitly cleared (an empty string is a
    // common "unset" sentinel), or its attribute was removed (Stencil sets the
    // prop to `null`). Any other unsupported value — including a
    // whitespace-only string — is a developer mistake worth warning about.
    if (newValue == null || newValue === '') {
      return;
    }

    if (!(TEXT_SIZES as readonly string[]).includes(newValue)) {
      const display = newValue.length > 80 ? `${newValue.slice(0, 80)}…` : newValue;
      console.warn(
        `pds-text: invalid size "${display}". Valid values are: ${TEXT_SIZES.join(', ')}.`,
      );
    }
  }

  componentWillLoad() {
    // Validate the initial value before the first render so the warning precedes
    // any attempt to apply an unknown size class. @Watch covers later changes.
    this.validateSize(this.size);
  }

  // componentDidLoad runs once, so a moved element re-binds here what disconnectedCallback tore
  // down. Before the first render there's no contentEl yet, and componentDidLoad binds it.
  connectedCallback() {
    if (this.truncate && this.contentEl) {
      this.initTruncationTooltip();
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
      const wrapper = this.soleTruncatedTextWrapper();
      this.truncationCleanup = setupTruncationTooltip({
        hostEl: this.el,
        contentEl: this.contentEl,
        getTooltipText: () => this.el.textContent || '',
        // A wrapping link or button already takes focus, so its focus reveals the text instead of a nested tab stop.
        manageTabIndex: wrapper === null,
        focusEl: wrapper ?? this.el,
      });
    }
  }

  // One focus on the wrapper would open every clipped text's tooltip at once, stacked over each
  // other, so a control holding more than one truncated text leaves each its own tab stop.
  private soleTruncatedTextWrapper(): HTMLElement | null {
    const wrapper = this.el.closest<HTMLElement>(FOCUSABLE_WRAPPER);
    return wrapper !== null && wrapper.querySelectorAll('pds-text[truncate]').length === 1 ? wrapper : null;
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
      ${
        this.align != null && this.align.trim() !== ''
          ? `pds-text--align-${this.align}`
          : ''
      }
      ${
        this.gutter != null && this.gutter.trim() !== ''
          ? `pds-text--gutter-${this.gutter}`
          : ''
      }
      ${
        this.size != null && this.size.trim() !== ''
          ? `pds-text--size-${this.size}`
          : ''
      }
      ${
        this.weight != null && this.weight.trim() !== ''
          ? `pds-text--weight-${this.weight}`
          : ''
      }
      ${
        this.decoration != null && this.decoration.trim() !== ''
          ? `pds-text--decoration-${this.decoration}`
          : ''
      }
    `;

    return (
      <Tag
        ref={(el) => (this.contentEl = el)}
        style={this.color && setColor(this.color)}
        class={typeClasses}
        part="content"
      >
        <slot />
      </Tag>
    );
  }
}
