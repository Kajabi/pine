import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pds-accordion',
  styleUrl: 'pds-accordion.scss',
  shadow: true,
})
export class PdsAccordion {

  render() {
    return (
      <details>
        <summary></summary>
      </details>
    );
  }
}
