import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-avatar',
  styleUrl: 'pds-avatar.scss',
  shadow: true,
})
export class PdsAvatar {

  /**
   * The alt for a custom user image.
   * @defaultValue null
   */
  @Prop() alt?: string | null;

  /**
   * Determines whether the badge is visible or not
   * @defaultValue false
   */
  @Prop() badge? = false;

  /**
   * The src for a custom user image.
   * @defaultValue null
   */
  @Prop() image?: string | null;

  /**
   * Preset sizes for the avatar. If a custom size is desired,
   * use the `--size` custom property instead.
   */
  @Prop() size?:
  | 'xl'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xs';

  /**
   * Determines the variant of avatar. Changes appearance accordingly.
   * @defaultValue customer
   */
  @Prop({ reflect: true }) variant?: 'customer' | 'admin' = 'customer'

  private renderBadge = () => (
    this.badge
      && <pds-icon class="pds-avatar__badge" name="check-circle-filled" size="normal"></pds-icon>
  );

  private renderIconOrImage = () => (
    this.image
      ? <img alt={this.alt} src={this.image} />
      : <pds-icon name="user-filled" size="normal"></pds-icon>
  );

  private classNames = () => (
    {
      'pds-avatar': true,
      [`pds-avatar--has-image`]: this.image !== undefined || null, // Remove when FF supports :has selector
      [`pds-avatar--${this.size}`]: this.size !== undefined || null,
      [`pds-avatar--${this.variant}`]: this.variant === 'admin'
    }
  );

  render() {
    return (
      <Host
        class={{...this.classNames()}}
      >
        <div>
          {this.renderIconOrImage()}
          {this.renderBadge()}
        </div>
      </Host>
    );
  }
}
