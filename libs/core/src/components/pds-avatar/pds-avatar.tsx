import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-avatar',
  styleUrl: 'pds-avatar.scss',
  shadow: true,
})
export class PdsAvatar {

  @Prop() badge? = false;

  @Prop() image?: string;

  @Prop() size?:
  | 'xl'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xs' = 'sm';

  @Prop({ reflect: true }) variant?: 'customer' | 'admin' = 'customer'

  private classNames = (props: object) => {
    return Object.keys(props).join(' ');
  }

  render() {
    return (
      <Host
        class={this.classNames({
          'pds-avatar': true,
          ...(this.size && { [`pds-avatar--${this.size}`] : []}),
          ...(this.variant === 'admin' && { [`pds-avatar--${this.variant}`] : []}),
        })}
      >
        <div>
          {this.image ? <img src={this.image} /> : <pds-icon name="user-filled" size="normal"></pds-icon>}
          {this.badge &&
            <pds-icon class="pds-avatar__badge" name="check-circle-filled" size="normal"></pds-icon>
          }
        </div>
      </Host>
    );
  }
}
