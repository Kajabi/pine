import { Component, h, Host, Prop, Watch } from '@stencil/core';

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
  private detailsEl: HTMLDetailsElement;
  
  /**
   * Can be used to manually set the open state of the accordion.
   */
  @Prop({ 
    attribute: 'open',
    mutable: true,
    reflect: true 
  }) isOpen: boolean = false;

  @Watch('isOpen')
  handleOpenState(newValue: boolean) {
    this.isOpen = newValue;
  }

  componentDidLoad() {
    this.detailsEl.addEventListener('toggle', this.handleToggle);
  }

  private getOpenAttribute = () => {
    if (this.isOpen !== false) {
      return { open: true };
    }
    return '';
  }

  private handleToggle = () => {
    this.isOpen = this.detailsEl.open;
  }

  render() {
    return (
    <Host>
      <details {...this.getOpenAttribute()} ref={(el) => this.detailsEl = el as HTMLDetailsElement}>
        <summary><slot name="summary" /></summary>
        <slot />
      </details>
    </Host>
    );
  }
}
