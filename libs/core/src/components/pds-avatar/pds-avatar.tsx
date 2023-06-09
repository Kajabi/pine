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
   * Determines whether the badge is visible or not.
   * @defaultValue false
   */
  @Prop() badge? = false;

  /**
   * The src for a custom user image.
   * @defaultValue null
   */
  @Prop() image?: string | null;

  /**
   * Size of the avatar. Value can be preset or custom.
   */
  @Prop({ reflect: true }) size?:
  | 'xl' // 64px
  | 'lg' // 56px
  | 'md' // 40px
  | 'sm' // 32px
  | 'xs' // 24px
  | string = 'lg';

  /**
   * Determines the variant of avatar. Changes appearance accordingly.
   * @defaultValue customer
   */
  @Prop({ reflect: true }) variant?: 'customer' | 'admin' = 'customer';

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

  private renderBadge = () => (
    this.badge
    // Percentage is average size of icon in relation to total avatar size
    // of all preset sizes found in Figma.
    // Used to allow icons to scale to container size
      && <pds-icon class="pds-avatar__badge" name="check-circle-filled" size="33.53%"></pds-icon>
  );

  private renderIconOrImage = () => (
    this.image
      ? <img alt={this.alt} src={this.image} />
      // Percentage is average size of icon in relation to total avatar size
      // of all preset sizes found in Figma.
      // Used to allow icons to scale to container size
      : <pds-icon name="user-filled" size="33.53%"></pds-icon>
  );

  private classNames = () => (
    {
      'pds-avatar': true,
      [`pds-avatar--has-image`]: this.image !== undefined || null, // Remove when FF supports :has selector
      [`pds-avatar--${this.variant}`]: this.variant === 'admin'
    }
  );

  render() {
    const style = {
      height: this.avatarSize(),
      width: this.avatarSize(),
    };

    return (
      <Host
        class={{...this.classNames()}}
      >
        <div style={style}>
          {this.renderIconOrImage()}
          {this.renderBadge()}
        </div>
      </Host>
    );
  }
}
