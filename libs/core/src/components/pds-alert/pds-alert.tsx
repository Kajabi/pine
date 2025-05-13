import { Component, Host, h, Prop, Event, EventEmitter, Element, State } from '@stencil/core';


/**
 * @slot actions - Slot for alert actions.
 */

@Component({
  tag: 'pds-alert',
  styleUrl: 'pds-alert.scss',
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
   * Text displayed as the description of the alert.
   */
  @Prop() description: string;

  /**
   * If true, the alert is displayed in a smaller size and description text is truncated. Heading is not displayed.
   */
  @Prop() small = false;

  /**
   * If true, shows the close button. If false, the close button is hidden.
   * @defaultValue false
   */
  @Prop() dismissible = false;

  /**
   * Sets the style variant of the alert.
   * @defaultValue 'default'
   */
  @Prop() variant: 'default' | 'danger' | 'info' | 'success' | 'warning' = 'default';

  /**
   * Event emitted when the close button is clicked.
   */
  @Event() pdsAlertCloseClick: EventEmitter<void>;

  @State() hasActionsContent = false;

  private handleCloseClick = () => {
    this.pdsAlertCloseClick.emit();
  };

  componentWillRender() {
    // Check if the actions slot has any content.
    // If not, hide the actions container to prevent empty space.
    const actionsSlot = this.el.querySelector('[slot="actions"]');
    this.hasActionsContent = !!actionsSlot;
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
        <pds-box background-color="var(--pds-alert-current-bg)" border-color="var(--pds-alert-current-border)" border-radius="md" border display="block" padding="md">
          <pds-box gap="sm" display="flex">
            <pds-icon
              class={`pds-alert__icon ${this.small ? 'pds-alert__icon--small' : ''}`}
              color="var(--pds-alert-current-icon-color)"
              icon={iconName}
              size="var(--pds-alert-icon-size)"
            />
            <pds-box class="pds-alert__content-wrapper" direction="column" gap="xs" flex="grow">
              {this.heading && !this.small && (
                <pds-text class={this.small ? 'pds-alert__heading--small' : 'pds-alert__heading'} color="var(--pds-alert-current-text-color)" size="h5" tag="h3" weight="medium">
                  {this.heading}
                </pds-text>
              )}

              {this.small ? (
                <pds-box display="flex" gap="md" align-items="center">
                  <pds-text
                    truncate={this.small}
                    class={this.small ? 'pds-alert__description--small' : 'pds-alert__description'}
                    color="var(--pds-alert-current-text-color)"
                    tag="p"
                  >
                    {this.description}
                  </pds-text>
                  {this.hasActionsContent && (
                    <pds-box class="pds-alert__actions--small" gap="sm" flex="none">
                      <slot name="actions"></slot>
                    </pds-box>
                  )}
                </pds-box>
              ) : (
                <div>
                  <pds-text class="pds-alert__description" color="var(--pds-alert-current-text-color)" tag="p">
                    {this.description}
                  </pds-text>
                  {this.hasActionsContent && (
                    <pds-box class="pds-alert__actions" gap="sm" align-items="center">
                      <slot name="actions"></slot>
                    </pds-box>
                  )}
                </div>
              )}
            </pds-box>

            {this.dismissible && (
              <button class="pds-alert__close" type="button" aria-label="Dismiss alert" onClick={this.handleCloseClick}>
                <pds-icon icon="remove" size="var(--pds-alert-icon-size)" aria-hidden="true" color="var(--pds-alert-close-color)" />
              </button>
            )}
          </pds-box>
        </pds-box>
      </Host>
    );
  }
}
