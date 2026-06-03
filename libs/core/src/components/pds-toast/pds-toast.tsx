import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';

/** Fallback when computed `--animation-duration` is unavailable (matches `--pine-motion-duration-slow`). */
const TOAST_DISMISS_ANIMATION_MS = 300;

/**
 * @part dismiss
 */
@Component({
  tag: 'pds-toast',
  styleUrl: 'pds-toast.scss',
  shadow: true,
})
export class PdsToast {
  @Element() el!: HTMLPdsToastElement;

  // Props
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Whether the toast can be dismissed manually via the close button.
   * Note: This only controls manual dismissal. Auto-dismissal via duration still applies.
   * @default true
   */
  @Prop() dismissible: boolean = true;

  /**
   * The duration in milliseconds to show the toast before auto-dismissing.
   * Set to 0 to disable auto-dismiss.
   * @default 4500
   */
  @Prop() duration: number = 4500;

  /**
   * The name of the icon to display in the toast.
   */
  @Prop() icon?: string;

  /**
   * The type of toast to display.
   * - default: Grey background (default)
   * - danger: Red background
   * - loading: With spinner animation
   * @default 'default'
   */
  @Prop() type: 'default' | 'danger' | 'loading' = 'default';

  /**
   * Whether the toast is currently visible.
   */
  @State() isVisible: boolean = true;

  /**
   * Whether the toast is animating out.
   */
  @State() isAnimatingOut: boolean = false;

  // Private properties
  /**
   * Timer for auto-dismissal
   */
  private dismissTimer?: number;

  /**
   * Event emitted when the toast is dismissed, either manually or automatically.
   */
  @Event() pdsToastDismissed: EventEmitter<{ componentId?: string }>;

  componentDidLoad() {
    if (this.duration > 0) {
      this.startDismissTimer();
    }
  }

  disconnectedCallback() {
    this.cleanup();
  }

  @Watch('duration')
  handleDurationChange(newDuration: number) {
    if (this.dismissTimer) {
      window.clearTimeout(this.dismissTimer);
      this.dismissTimer = undefined;
    }
    if (newDuration > 0) {
      this.startDismissTimer();
    }
  }

  @Method()
  async dismiss(): Promise<void> {
    // Start the animation out
    this.isAnimatingOut = true;

    await this.waitForDismissAnimation();

    this.isVisible = false;
    this.cleanup();
    this.pdsToastDismissed.emit({ componentId: this.componentId });
  }

  // Private methods
  private waitForDismissAnimation(): Promise<void> {
    const durationMs = this.getDismissAnimationDurationMs();
    if (durationMs <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => window.setTimeout(resolve, durationMs));
  }

  private getDismissAnimationDurationMs(): number {
    if (typeof window === 'undefined') {
      return TOAST_DISMISS_ANIMATION_MS;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 0;
    }

    const fromCss = this.parseCssDurationToMs(
      getComputedStyle(this.el).getPropertyValue('--animation-duration').trim(),
    );

    return fromCss ?? TOAST_DISMISS_ANIMATION_MS;
  }

  private parseCssDurationToMs(value: string): number | undefined {
    if (!value) {
      return undefined;
    }
    if (value === '0' || value === '0ms' || value === '0s') {
      return 0;
    }
    if (value.endsWith('ms')) {
      const ms = Number.parseFloat(value);
      return Number.isFinite(ms) ? ms : undefined;
    }
    if (value.endsWith('s')) {
      const seconds = Number.parseFloat(value);
      return Number.isFinite(seconds) ? seconds * 1000 : undefined;
    }
    return undefined;
  }

  private cleanup(): void {
    if (this.dismissTimer) {
      window.clearTimeout(this.dismissTimer);
      this.dismissTimer = undefined;
    }
  }

  private startDismissTimer(): void {
    this.dismissTimer = window.setTimeout(() => {
      this.dismiss();
    }, this.duration);
  }

  private renderIcon() {
    // Loading type takes priority
    if (this.type === 'loading') {
      return (
        <div class="pds-toast__loader">
          <svg class="pds-toast__loader-spinner" viewBox="25 25 50 50" aria-hidden="true">
            <circle class="pds-toast__loader-path" cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
      );
    }

    // Return icon if provided, otherwise undefined (which renders as nothing)
    return this.icon && <pds-icon name={this.icon} class="pds-toast__icon" />;
  }

  render() {
    return (
      <Host hidden={!this.isVisible}>
        <div
          class={{
            'pds-toast': true,
            [`pds-toast--${this.type}`]: this.type !== 'default',
            'pds-toast--animating-out': this.isAnimatingOut
          }}
          role="alert"
          aria-live="polite"
        >
          {this.renderIcon()}

          <span class="pds-toast__message">
            <slot></slot>
          </span>

          {this.dismissible && (
            <button
              type="button"
              part="dismiss"
              class="pds-toast__button"
              onClick={() => {
                this.dismiss();
              }}
              aria-label="Dismiss message"
            >
              <pds-icon name="remove" />
            </button>
          )}
        </div>
      </Host>
    );
  }
}
