import { Component, h, Host, Prop, Watch } from '@stencil/core';
import { downSmall } from '@pine-ds/icons/icons';

/**
 * @part accordion-body - Accordion body styles.
 * @part accordion-button - Accordion button/trigger styles.
 * @part accordion-icon - Accordion icon styles.
 * @slot (default) - Accordion body content.
 * @slot label - Accordion trigger button content.
 */
@Component({
  tag: 'pds-accordion',
  styleUrls: ['pds-accordion.scss'],
  shadow: true,
})
export class PdsAccordion {
  private detailsEl: HTMLDetailsElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   * @defaultValue null
   */
  @Prop() componentId: string;

  /**
   * Can be used to manually set the open state of the accordion.
   * @defaultValue false
   */
  @Prop({
    attribute: 'open',
    mutable: true,
    reflect: true,
  }) isOpen: boolean = false;

  @Watch('isOpen')
  handleOpenState(newValue: boolean) {
    this.isOpen = newValue;
  }

  private handleToggle = () => {
    this.isOpen = this.detailsEl.open;
  };

  private getOpenAttribute = () => {
    if (this.isOpen !== false) {
      return { open: true };
    }
    return '';
  };

  componentDidLoad() {
    this.detailsEl.addEventListener('toggle', this.handleToggle);
  }

  render() {
    return (
      <Host class="pds-accordion" id={this.componentId}>
        <details {...this.getOpenAttribute()} ref={(el) => (this.detailsEl = el as HTMLDetailsElement)}>
          <summary part="accordion-button">
            <slot name="label">Details</slot>
            <pds-icon icon={downSmall} part="accordion-icon" />
          </summary>
          <div part="accordion-body" class="pds-accordion__body">
            <slot />
          </div>
        </details>
      </Host>
    );
  }
}
