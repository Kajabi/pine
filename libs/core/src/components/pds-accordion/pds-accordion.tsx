import { Component, Event, EventEmitter, h, Host, Prop, Watch } from '@stencil/core';
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
   * A unique identifier for this component instance. Does not set the host element's `id` attribute — set `id` directly if you need one.
   * @defaultValue null
   */
  @Prop() componentId: string;

  /**
   * Determines whether the accordion is open. Set with the `open` attribute, which is
   * added and removed as the accordion opens and closes.
   * @defaultValue false
   */
  @Prop({
    attribute: 'open',
    mutable: true,
    reflect: true,
  }) isOpen: boolean = false;

  /**
   * Emitted when the accordion opens or closes, carrying the new open state.
   * Also emits when programmatically setting the `isOpen` property or the `open` attribute.
   * Not emitted for the state the accordion starts in.
   */
  @Event() pdsAccordionToggle: EventEmitter<boolean>;

  @Watch('isOpen')
  handleOpenState(newValue: boolean) {
    this.pdsAccordionToggle.emit(newValue);
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
      <Host class="pds-accordion">
        <details {...this.getOpenAttribute()} ref={(el) => (this.detailsEl = el as HTMLDetailsElement)}>
          <summary part="accordion-button">
            <slot name="label">Details</slot>
            <pds-icon aria-hidden="true" icon={downSmall} part="accordion-icon" />
          </summary>
          <div part="accordion-body" class="pds-accordion__body">
            <slot />
          </div>
        </details>
      </Host>
    );
  }
}
