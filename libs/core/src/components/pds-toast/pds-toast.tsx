import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pds-toast',
  styleUrl: 'pds-toast.scss',
  shadow: true,
})
export class PdsToast {
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
   * The icon to display in the toast.
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
    this.isVisible = false;

    // Wait for animation to complete before cleanup
    await new Promise((resolve) => setTimeout(resolve, 300)); // Match --pds-toast-animation-duration

    this.cleanup();
    this.pdsToastDismissed.emit({ componentId: this.componentId });
  }

  // Private methods
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
    if (this.type === 'loading') {
      return (
        <div class="pds-toast__loader">
          <svg class="pds-toast__loader-spinner" viewBox="25 25 50 50" aria-hidden="true">
            <circle class="pds-toast__loader-path" cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
      );
    }

    if (this.icon) {
      return <pds-icon name={this.icon} class="pds-toast__icon" />;
    }

    return null;
  }

  render() {
    return (
      <Host hidden={!this.isVisible}>
        <div
          class={{
            'pds-toast': true,
            [`pds-toast--${this.type}`]: this.type !== 'default',
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
