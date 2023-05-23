import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-avatar',
  styleUrl: 'pds-avatar.scss',
  shadow: true,
})
export class PdsAvatar {

  @Prop() badge? = false;

  @Prop() image?: string;

  @Prop() size: string;

  @Prop() variant?: 'customer' | 'admin' = 'customer'

  render() {
    return (
      <Host
        class={{
          'pds-avatar': true,
        }}
      >
        <pds-icon
          name="user-filled"
          size={`${this.size || 'normal'}`}
        >
        </pds-icon>
      </Host>
    );
  }

}
