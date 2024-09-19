import { Component, Host, h, Prop } from '@stencil/core';
import { checkCircleFilled, userFilled } from '@pine-ds/icons/icons';

/**
 * @part image - The main image element that represents the avatar component.
*/
@Component({
  tag: 'pds-avatar',
  styleUrls: ['../../global/styles/base.scss', 'pds-avatar.scss'],
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

  private renderAssetWrapper = () => {
    const style = {
      height: this.avatarSize(),
      width: this.avatarSize()
    };

    return (
      <div style={style} part="asset-wrapper">
        {this.renderIconOrImage()}
        {this.renderBadge()}
      </div>
    )
  };

  private renderAvatar = () => {
    return (
      this.dropdown
        ?
        <button class="pds-avatar__button" type="button" aria-label="Avatar dropdown trigger">
        {this.renderAssetWrapper()}
        </button>
        :
        this.renderAssetWrapper()
    )
  };

  private renderBadge = () => (
    this.badge
    // Percentage is average size of icon in relation to total avatar size
    // of all preset sizes found in Figma.
    // Used to allow icons to scale to container size
      && <pds-icon class="pds-avatar__badge" icon={checkCircleFilled} size="33.53%"></pds-icon>
  );

  private renderIconOrImage = () => (
    this.image
      ? <img alt={this.alt} src={this.image} />
      // Percentage is average size of icon in relation to total avatar size
      // of all preset sizes found in Figma.
      // Used to allow icons to scale to container size
      : <pds-icon color="var(--pine-color-blue-400)" icon={userFilled} size="33.53%"></pds-icon>
  );

  private classNames = () => (
    {
      'pds-avatar': true,
      [`pds-avatar--has-image`]: this.image !== '' && this.image !== null, // Remove when FF supports :has selector
      [`pds-avatar--${this.variant}`]: this.variant === 'admin'
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
