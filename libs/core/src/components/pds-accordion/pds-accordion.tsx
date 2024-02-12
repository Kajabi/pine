import { Component, Host, h } from '@stencil/core';

/**
 * @slot (default) - Accordion body content.
 * @slot summary - Accordion trigger button content.
 */
@Component({
  tag: 'pds-accordion',
  styleUrl: 'pds-accordion.scss',
  shadow: true,
})
export class PdsAccordion {

  render() {
    return (
      <details>
        <summary><slot name="summary"/></summary>
        <slot />
      </details>
    );
  }
}
