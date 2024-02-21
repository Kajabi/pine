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
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Label for the accordion trigger button.
   */
  @Prop() label: string;

  /**
   * The left icon for the trigger button.
   */
  @Prop() leftIcon: string;
  
  /**
   * Can be used to manually set the open state of the accordion.
   */
  @Prop({ 
    attribute: 'open',
    mutable: true,
    reflect: true 
  }) isOpen: boolean = false;

  /**
   * The right icon for the trigger button.
   */
  @Prop() rightIcon: string;


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

  private renderLeftIcon = () => {
    if (this.leftIcon) {
      return <pds-icon name={this.leftIcon}></pds-icon>;
    } else {
      return null;
    }
  }
    
  private renderRightIcon = () => {
    if (this.rightIcon) {
      return <pds-icon name={this.rightIcon}></pds-icon>;
    } else {
      return null;
    }
  }

  render() {
    return (
      <Host class="pds-accordion" id={this.componentId}>
        <details {...this.getOpenAttribute()} ref={(el) => this.detailsEl = el as HTMLDetailsElement}>
          <summary>
            {this.renderLeftIcon()}
            {this.label}
            {this.renderRightIcon()}
          </summary>
          <slot />
        </details>
      </Host>
    );
  }
}
