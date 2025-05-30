import { Component, Host, h, Prop, Event, EventEmitter, Element, State } from '@stencil/core';

/**
 * @slot actions - Slot for alert actions.
 */

@Component({
  tag: 'pds-alert',
  styleUrls: ['pds-alert.tokens.scss', 'pds-alert.scss'],
  shadow: true,
})
export class PdsAlert {

  @Element() el: HTMLPdsAlertElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Text displayed as the heading of the alert.
   */
  @Prop() heading: string;

  /**
   * If true, the alert is displayed in a smaller size and description text is truncated. Heading is not displayed.
   */
  @Prop() small = false;

  /**
   * If true, shows the dismiss button. If false, the dismiss button is hidden.
   * @defaultValue false
   */
  @Prop() dismissible = false;

  /**
   * Sets the style variant of the alert.
   * @defaultValue 'default'
   */
  @Prop() variant: 'default' | 'danger' | 'info' | 'success' | 'warning' = 'default';

  /**
   * Event emitted when the dismiss button is clicked.
   */
  @Event() pdsAlertDismissClick: EventEmitter<void>;

  @State() hasActionsContent = false;

  private handleCloseClick = () => {
    this.pdsAlertDismissClick.emit();
  };

  componentWillRender() {
    // Check if the actions slot has any content.
    // If not, hide the actions container to prevent empty space.
    const actionsSlot = this.el.querySelector('[slot="actions"]');
    this.hasActionsContent = !!actionsSlot;
  }

  private renderActions(isSmall: boolean) {
    return (
      <pds-box class={isSmall ? "pds-alert__actions--small" : "pds-alert__actions"} gap="sm" flex={isSmall ? "none" : undefined} align-items={isSmall ? undefined : "center"}>
        <slot name="actions"></slot>
      </pds-box>
    );
  }

  private renderContent() {
    if (this.small) {
      return (
        <pds-box display="flex" gap="md" align-items="center">
          <pds-text
            truncate={this.small}
            class="pds-alert__description--small"
            color="var(--pds-alert-color-text)"
            tag="p"
          >
            <slot></slot>
          </pds-text>
          {this.hasActionsContent && this.renderActions(true)}
        </pds-box>
      );
    }

    return (
      <div>
        <pds-text class="pds-alert__description" color="var(--pds-alert-color-text)" tag="p">
          <slot></slot>
        </pds-text>
        {this.hasActionsContent && this.renderActions(false)}
      </div>
    );
  }

  render() {
    const iconMap = {
      danger: 'warning-filled',
      default: 'info-circle-filled',
      info: 'info-circle-filled',
      success: 'check-circle-filled',
      warning: 'info-circle-filled',
    };

    // Get the icon name based on the current variant
    const iconName = iconMap[this.variant] || iconMap.default;

    return (
      <Host class="pds-alert" id={this.componentId} variant={this.variant}>
        <pds-box
          class={`pds-alert__container pds-alert__container--${this.variant}`}
          background-color="var(--pds-alert-background)"
          border-color="var(--pds-alert-border-color)"
          border-radius="md"
          border
          display="block"
          padding="md"
        >
          <pds-box gap="sm" display="flex">
            <pds-icon
              class={`pds-alert__icon ${this.small ? 'pds-alert__icon--small' : ''}`}
              color="var(--pds-alert-color-icon)"
              icon={iconName}
              size="var(--pds-alert-icon-size)"
            />
            <pds-box class="pds-alert__content-wrapper" direction="column" gap="xs" flex="grow">
              {this.heading && !this.small && (
                <pds-text class="pds-alert__heading" color="var(--pds-alert-color-text)" size="h5" tag="h3" weight="medium">
                  {this.heading}
                </pds-text>
              )}

              {this.renderContent()}
            </pds-box>

            {this.dismissible && (
              <button class="pds-alert__dismiss" type="button" aria-label="Dismiss alert" onClick={this.handleCloseClick}>
                <pds-icon icon="remove" size="var(--pds-alert-icon-size)" aria-hidden="true" color="var(--pds-alert-color-dismiss)" />
              </button>
            )}
          </pds-box>
        </pds-box>
      </Host>
    );
  }
}
