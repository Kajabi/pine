import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-avatar',
  styleUrl: 'pds-avatar.scss',
  shadow: true,
})
export class PdsAvatar {

  /**
   * Determines whether the badge is visible or not
   * @defaultValue false
   */
  @Prop() badge? = false;

  /**
   * The src for a custom user image.
   * @defaultValue null
   */
  @Prop() image?: string;

  /**
   * Preset sizes for the avatar. If a custom size is desired,
   * use the `--size` custom property instead.
   * @defaultValue md
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

  private renderIconOrImage = () => (
    this.image
      ? <img alt='Profile' src={this.image} />
      : <pds-icon name="user-filled" size="normal"></pds-icon>
  );

  private renderBadge = () => (
    this.badge
      && <pds-icon class="pds-avatar__badge" name="check-circle-filled" size="normal"></pds-icon>
  )

  private classNames = () => (
    {
      'pds-avatar': true,
      [`pds-avatar--${this.size}`]: this.size != undefined,
      [`pds-avatar--${this.variant}`]: this.variant === 'admin'
    }
  )

  render() {
    return (
      <Host
        class={{...this.classNames()}}
      >
        <div>
          {this.renderIconOrImage}
          {this.renderBadge}
        </div>
      </Host>
    );
  }
}
