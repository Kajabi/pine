import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-progress',
  styleUrl: 'pds-progress.scss',
  shadow: true,
})
export class PdsProgress {

  render() {
    return (
      <Host>
        <progress></progress>
      </Host>
    );
  }

}
