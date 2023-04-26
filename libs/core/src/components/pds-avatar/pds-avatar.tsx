import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-avatar',
  styleUrl: 'pds-avatar.scss',
  shadow: true,
})
export class PdsAvatar {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
