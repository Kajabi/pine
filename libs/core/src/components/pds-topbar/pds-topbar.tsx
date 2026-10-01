import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { menu } from '@pine-ds/icons/icons';

/**
 * @slot logo - Custom logo markup. Falls back to an `<img>` built from `logoSrc`/`logoAlt` when empty.
 * @slot (default) - Right-aligned actions (buttons, avatar, dropdown menu).
 */
@Component({
  tag: 'pds-topbar',
  styleUrl: 'pds-topbar.scss',
  shadow: true,
})
export class PdsTopbar {
  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Image source for the default logo rendering. Ignored if the `logo` slot has content.
   */
  @Prop() logoSrc?: string;

  /**
   * Accessible alt text for the default logo image, and the accessible label
   * for the logo link when `logoHref` is set.
   * @defaultValue 'Home'
   */
  @Prop() logoAlt: string = 'Home';

  /**
   * If provided, wraps the logo in a link to this URL.
   */
  @Prop() logoHref?: string;

  /**
   * Shows a navigation-toggle button before the logo. Pair with `menuButtonControls`.
   * @defaultValue false
   */
  @Prop() menuButton: boolean = false;

  /**
   * The `id` of the element the menu button controls (its `aria-controls` target) —
   * typically a `pds-app` `nav` slot's container.
   */
  @Prop() menuButtonControls?: string;

  /**
   * Whether the controlled navigation is currently expanded. The consumer owns
   * this state — `pds-topbar` only reflects it into `aria-expanded` and toggles
   * it locally when uncontrolled updates aren't wired up by the caller.
   * @defaultValue false
   */
  @Prop({ reflect: true, mutable: true }) menuExpanded: boolean = false;

  /**
   * Accessible label for the menu-toggle button. Pass a translated string to localize it.
   * @defaultValue 'Toggle navigation'
   */
  @Prop() menuButtonLabel: string = 'Toggle navigation';

  /**
   * Emitted when the menu-toggle button is clicked.
   */
  @Event() pdsMenuToggle: EventEmitter<{ expanded: boolean }>;

  private handleMenuClick = () => {
    this.menuExpanded = !this.menuExpanded;
    this.pdsMenuToggle.emit({ expanded: this.menuExpanded });
  };

  private renderLogo() {
    const fallback = this.logoSrc ? (
      <img class="pds-topbar__logo-image" src={this.logoSrc} alt={this.logoHref ? '' : this.logoAlt} />
    ) : null;

    const content = <slot name="logo">{fallback}</slot>;

    if (this.logoHref) {
      return (
        <a class="pds-topbar__logo" href={this.logoHref} aria-label={this.logoAlt}>
          {content}
        </a>
      );
    }

    return <span class="pds-topbar__logo">{content}</span>;
  }

  render() {
    return (
      <Host id={this.componentId} role="banner">
        {this.menuButton && (
          <button
            type="button"
            class="pds-topbar__menu-button"
            aria-controls={this.menuButtonControls}
            aria-expanded={this.menuExpanded ? 'true' : 'false'}
            aria-label={this.menuButtonLabel}
            onClick={this.handleMenuClick}
          >
            <pds-icon icon={menu} size="20px" aria-hidden="true"></pds-icon>
          </button>
        )}
        {this.renderLogo()}
        <span class="pds-topbar__actions">
          <slot></slot>
        </span>
      </Host>
    );
  }
}
