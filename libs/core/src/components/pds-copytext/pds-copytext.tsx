import { Component, Element, Event, EventEmitter, Host, h, Prop, Watch } from '@stencil/core';
import { HostStylingKeeper } from '@utils/attributes';

import { copy as copyIcon } from '@pine-ds/icons/icons';
import { restoreReflectedDefault } from '@utils/reflected-attribute-default';
import { setupTruncationTooltip } from '../../utils/truncation-tooltip';

@Component({
  tag: 'pds-copytext',
  styleUrls: ['pds-copytext.scss'],
  shadow: true,
})
export class PdsCopytext {
  @Element() el: HTMLPdsCopytextElement;
  private hostKeeper = new HostStylingKeeper();

  connectedCallback() {
    this.hostKeeper.connect(this.el);
    // componentDidLoad runs once, so a moved element re-binds here what disconnectedCallback tore
    // down. Before the first render there's no valueSpanEl yet, and componentDidLoad binds it.
    if (this.truncate && this.valueSpanEl) {
      this.initTruncationTooltip();
    }
  }

  private truncationCleanup: (() => void) | null = null;
  private valueSpanEl: HTMLSpanElement;

  /**
   * Determines whether `copytext` should have a visible border.
   * @defaultValue true
   */
  @Prop({ reflect: true, mutable: true }) border = true;

  @Watch('border')
  restoreBorderDefault(newValue: typeof this.border) {
    this.border = restoreReflectedDefault(this.el, 'border', newValue, true);
  }

  /**
   * A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one.
   */
  @Prop() componentId: string;

  /**
   * Determines whether `copytext` should expand to the full width of its container.
   * @defaultValue false
   */
  @Prop() fullWidth = false;

  /**
   * Determines whether the `value` should truncate and display with an ellipsis.
   * When text overflows, a tooltip showing the full value will appear on hover/focus.
   * @defaultValue false
   */
  @Prop() truncate = false;

  /**
   * The string displayed that is also copied to the clipboard upon interaction.
   */
  @Prop() value!: string;

  @Watch('truncate')
  handleTruncateChange(newValue: boolean) {
    if (newValue) {
      this.initTruncationTooltip();
    } else {
      this.destroyTruncationTooltip();
    }
  }

  @Watch('value')
  handleValueChange() {
    if (this.truncate) {
      this.initTruncationTooltip();
    }
  }

  componentDidLoad() {
    if (this.truncate) {
      this.initTruncationTooltip();
    }
  }

  disconnectedCallback() {
    this.hostKeeper.disconnect();
    this.destroyTruncationTooltip();
  }

  private initTruncationTooltip() {
    this.destroyTruncationTooltip();

    if (this.valueSpanEl) {
      this.truncationCleanup = setupTruncationTooltip({
        hostEl: this.el,
        contentEl: this.valueSpanEl,
        getTooltipText: () => this.value || '',
        // valueSpanEl already sits inside the `<pds-button>` below, which is
        // already focusable and bubbles focusin to the host — a tabindex on
        // the span too would nest a second tab stop inside the button.
        manageTabIndex: false,
      });
    }
  }

  private destroyTruncationTooltip() {
    if (this.truncationCleanup) {
      this.truncationCleanup();
      this.truncationCleanup = null;
    }
  }

  /**
   * Event fired when copyText button is clicked.
   */
  @Event() pdsCopyTextClick: EventEmitter<string>;

  private copyToClipboard = async (value: string) => {
    try {
      if (typeof navigator.clipboard !== 'undefined') {
        await navigator.clipboard.writeText(value);
        this.pdsCopyTextClick.emit('Copied to clipboard');
      }
    } catch (err) {
      this.pdsCopyTextClick.emit(`Error writing text to clipboard: ${err}`);
    }
  };

  private handleClick = () => {
    this.copyToClipboard(this.value);
  };

  private classNames() {
    const classNames = ['pds-copytext'];

    if (this.border) {
      classNames.push('pds-copytext--bordered');
    }

    if (this.fullWidth) {
      classNames.push('pds-copytext--full-width');
    }

    if (this.truncate) {
      classNames.push('pds-copytext--truncated');
    }

    return classNames.join(' ');
  }

  render() {
    const hostClass = this.classNames();
    this.hostKeeper.record(hostClass);

    return (
      <Host class={hostClass}>
        <pds-button type="button" variant="unstyled" onClick={this.handleClick}>
          <span ref={(el) => this.valueSpanEl = el}>{this.value}</span>
          <pds-icon aria-hidden="true" icon={copyIcon} size="16px"></pds-icon>
        </pds-button>
      </Host>
    );
  }
}
