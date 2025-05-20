import {
  Component,
  Element,
  Event,
  Host,
  h,
  Prop,
  EventEmitter,
  Listen,
  Watch
} from '@stencil/core';

@Component({
  tag: 'pds-banner',
  styleUrl: 'pds-banner.scss',
  shadow: true,
})
export class PdsBanner {
  @Element() el: HTMLPdsBannerElement;

  /**
   * Determines if the banner is active.
   */
  @Prop({ mutable: true, reflect: true }) active = false;

  /**
   * Watch for changes to the active property
   */
  @Watch('active')
  watchActiveHandler(newValue: boolean) {
    if (newValue) {
      this.el.classList.add('pds-banner--active');
      // Notify other banners that this one has been activated
      this.pdsBannerActivated.emit(this.componentId);
    } else {
      this.el.classList.remove('pds-banner--active');
    }
  }

  /**
   * If true, displays a close button to dismiss the banner.
   */
  @Prop() dismissable = false;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines the banner variant.
   */
  @Prop() variant: 'default' | 'secondary' | 'warning' | 'danger' = 'default';

  /**
   * Event emitted when a banner is toggled
   */
  @Event() pdsDismiss: EventEmitter;

  /**
   * Event emitted when a banner is currently active
   */
  @Event() pdsBannerActivated: EventEmitter<string>;

  /**
   * Listen for banner activation events from other banners
   */
  @Listen('pdsBannerActivated', { target: 'window' })
  handleBannerActivated(event: CustomEvent<string>) {
    // If the activated banner is not the one targeted by the trigger,
    // deactivate this banner
    if (event.detail !== this.componentId && this.active) {
      this.active = false;
    }
  }

  private dismissBanner = () => {
    this.active = false;
    this.pdsDismiss.emit();
  }

  render() {
    return (
      <Host class={`pds-banner ${this.active ? 'pds-banner--active' : ''}`} id={this.componentId} variant={this.variant} active={this.active}>
        <pds-box
          background-color="var(--banner-background-color)"
          fit
          padding-block-start="sm"
          padding-block-end="sm"
          padding-inline-start="md"
          padding-inline-end="md"
        >
          <pds-box display="flex" justify-content="space-between">
            <pds-box display="flex" align-items="center" gap="xs">
              <pds-icon color="var(--banner-icon-color)" name={this.variant === 'danger' ? 'warning-filled' : 'info-circle-filled'}></pds-icon>
              <pds-text color="var(--banner-text-color)" tag="p">
                <slot name="text"></slot>
              </pds-text>
            </pds-box>
            <pds-box display="flex" align-items="center" gap="sm" justify-content="end">
              <slot name="actions"></slot>
              {this.dismissable && (
                <button class="pds-banner__close" onClick={this.dismissBanner} aria-label="Dismiss banner">
                  <pds-icon color="var(--banner-icon-color)" name="remove" aria-hidden="true"></pds-icon>
                </button>
              )}
            </pds-box>
          </pds-box>
        </pds-box>
      </Host>
    );
  }
}
