import { Component, Host, h, Prop } from '@stencil/core';
import { checkCircleFilled, userFilled } from '@pine-ds/icons/icons';

/**
 * @part asset-wrapper
 * @part button
 * @part image - The main image element that represents the avatar component.
*/
@Component({
  tag: 'pds-avatar',
  styleUrls: ['pds-avatar.scss'],
  shadow: true,
})
export class PdsAvatar {

  /**
   * The alt for a custom user image.
   * @defaultValue null
   */
  @Prop() alt?: string | null = null;

  /**
   * Determines whether the badge is visible or not.
   * @defaultValue false
   */
  @Prop() badge? = false;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Determines whether the avatar functions as a dropdown trigger.
   * @defaultValue false
   */
  @Prop() dropdown? = false;

  /**
   * The src for a custom user image.
   * @defaultValue null
   */
  @Prop() image?: string | null = null;

  /**
   * The initials to display in the avatar when no image is provided.
   * @defaultValue null
   */
  @Prop() initials?: string | null = null;

  /**
   * Size of the avatar. Value can be preset or custom.
   * @defaultValue lg
   */
  @Prop({ reflect: true }) size?:
  | 'xl' // 64px
  | 'lg' // 56px
  | 'md' // 40px
  | 'sm' // 32px
  | 'xs' // 24px
  | string = 'lg';

  /**
   * Displays a presence status indicator (a dot) on the avatar: `online`
   * (success), `away` (warning), or `offline` (neutral). For a simple
   * active/inactive presence, map active to `online` and inactive to `offline`.
   * Takes precedence over `badge` — they share the same corner, so the badge is
   * hidden while `status` is set.
   * @defaultValue null
   */
  @Prop({ reflect: true }) status?: 'online' | 'away' | 'offline' | null = null;

  /**
   * Accessible label for the presence status indicator. Pass a translated
   * string to localize it; defaults to English (`"{status} status"`). Has no
   * effect on dropdown avatars, where the trigger's `triggerLabel` owns the
   * accessible name — fold presence into `triggerLabel` there.
   * @defaultValue null
   */
  @Prop() statusLabel?: string;

  /**
   * Determines whether a ring is shown around the avatar in the `status` color.
   * Has no effect unless `status` is set.
   * @defaultValue false
   */
  @Prop() statusRing? = false;

  /**
   * Determines the variant of avatar. Changes appearance accordingly.
   * @defaultValue customer
   */
  @Prop({ reflect: true }) variant?: 'customer' | 'admin' = 'customer';

  /**
   * Accessible label for the dropdown trigger button. Pass a translated string
   * to localize it; defaults to English.
   * @defaultValue 'Avatar dropdown trigger'
   */
  @Prop() triggerLabel = 'Avatar dropdown trigger';

  private avatarSize() {
    const sizes: { [key: string]: any } = {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '56px',
      xl: '64px',
    }

    if (sizes[this.size]) {
      return sizes[this.size];
    } else {
      return this.size
    }
  }

  private renderAssetWrapper = () => {
    const style = {
      height: this.avatarSize(),
      width: this.avatarSize()
    };

    return (
      <div style={style} part="asset-wrapper">
        {this.renderIconOrImage()}
        {this.renderBadge()}
        {this.renderStatus()}
      </div>
    )
  };

  private renderAvatar = () => {
    return (
      this.dropdown
        ?
        <button class="pds-avatar__button" type="button" part="button" aria-label={this.triggerLabel}>
        {this.renderAssetWrapper()}
        </button>
        :
        this.renderAssetWrapper()
    )
  };

  private renderBadge = () => (
    // `badge` and `status` share the bottom-end corner; `status` wins so the
    // presence dot is never painted over the badge.
    this.badge && !this.status
    // Percentage is average size of icon in relation to total avatar size
    // of all preset sizes found in Figma.
    // Used to allow icons to scale to container size
      && <pds-icon color="var(--pine-color-purple-600)" class="pds-avatar__badge" icon={checkCircleFilled} size="33.53%"></pds-icon>
  );

  private renderStatus = () => {
    if (!this.status) return null;

    // Inside the dropdown trigger, the button's aria-label owns the accessible
    // name, so the dot's own label is never announced. Mark it decorative there
    // and let consumers convey presence via `triggerLabel`.
    if (this.dropdown) {
      return <span class="pds-avatar__status" part="status" aria-hidden="true"></span>;
    }

    return (
      <span
        class="pds-avatar__status"
        part="status"
        role="img"
        aria-label={this.statusLabel ?? `${this.status} status`}
      ></span>
    );
  };

  private renderIconOrImage = () => {
    if (this.image) {
      return <img alt={this.alt} src={this.image} />;
    }

    if (this.initials) {
      return (
        <svg class="pds-avatar__initials" viewBox="0 0 32 32">
          <text x="16" y="20">{this.initials}</text>
        </svg>
      );
    }

    // Percentage is average size of icon in relation to total avatar size
    // of all preset sizes found in Figma.
    // Used to allow icons to scale to container size
    return <pds-icon color="var(--pine-color-brand)" icon={userFilled} size="33.53%"></pds-icon>;
  };

  private classNames = () => (
    {
      'pds-avatar': true,
      [`pds-avatar--has-image`]: this.image !== '' && this.image !== null, // Remove when FF supports :has selector
      [`pds-avatar--has-initials`]: this.initials !== '' && this.initials !== null,
      [`pds-avatar--${this.variant}`]: this.variant === 'admin',
      [`pds-avatar--status-ring`]: !!this.status && this.statusRing,
    }
  );

  render() {

    return (
      <Host
        id={this.componentId}
        class={{...this.classNames()}}
      >
        {this.renderAvatar()}
      </Host>
    );
  }
}
