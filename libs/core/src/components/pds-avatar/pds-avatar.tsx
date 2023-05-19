import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pds-avatar',
  styleUrl: 'pds-avatar.scss',
  shadow: true,
})
export class PdsAvatar {

  @Prop() size: string;

  render() {
    return (
      <Host>
        <pds-icon name="user-filled" size="normal"></pds-icon>
      </Host>
    );
  }

}
