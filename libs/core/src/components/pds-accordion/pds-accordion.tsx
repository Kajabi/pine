import { Component, Event, EventEmitter, h, Host, Prop, Watch } from '@stencil/core';

/**
 * @slot (default) - Accordion body content.
 * @slot label - Accordion trigger button content.
 */
@Component({
  tag: 'pds-accordion',
  styleUrl: 'pds-accordion.scss',
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
    reflect: true 
  }) isOpen: boolean = false;

  @Watch('isOpen')
  handleOpenState(newValue: boolean) {
    this.isOpen = newValue;
  }

  /**
   * Emitted when the accordion is toggled.
   */
  @Event() pdsAccordionToggle: EventEmitter<{open: boolean}>;
  private handleToggle = () => {
    this.isOpen = this.detailsEl.open;
    this.pdsAccordionToggle.emit({ open: this.isOpen });
  }

  private getOpenAttribute = () => {
    if (this.isOpen !== false) {
      return { open: true };
    }
    return '';
  }

  componentDidLoad() {
    this.detailsEl.addEventListener('toggle', this.handleToggle);
  }

  render() {
    return (
      <Host class="pds-accordion" id={this.componentId}>
        <details {...this.getOpenAttribute()} ref={(el) => this.detailsEl = el as HTMLDetailsElement}>
          <summary>
            <slot name="label">Details</slot>
            <pds-icon name={this.isOpen ? 'up-small' : 'down-small'} />
          </summary>
          <div class="pds-accordion__body">
            <slot />
          </div>
        </details>
      </Host>
    );
  }
}
