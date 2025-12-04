import { Component, Host, h, Prop, Element, Watch, Event, EventEmitter, Listen } from '@stencil/core';
import { messageId } from '../../utils/form';
import { danger } from '@pine-ds/icons/icons';
import { RadioGroupChangeEventDetail } from './radio-group-interface';

/**
 * @slot (default) - Child pds-radio components
 */
@Component({
  tag: 'pds-radio-group',
  styleUrls: ['pds-radio-group.scss'],
  scoped: true,
})
export class PdsRadioGroup {
  @Element() el: HTMLPdsRadioGroupElement;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId: string;

  /**
   * Layout direction for the radio group.
   * @defaultValue column
   */
  @Prop() direction: 'row' | 'column' = 'column';

  /**
   * Displays error message text describing an invalid state for the entire group.
   */
  @Prop() errorMessage: string;

  /**
   * Displays helper message text below the radio group.
   */
  @Prop() helperMessage: string;

  /**
   * Spacing between radio items. Accepts t-shirt sizes (none, xxs, xs, sm, md, lg, xl, xxl) or core spacing tokens (025, 050, 100, etc.).
   * @defaultValue sm
   */
  @Prop() gap: string = 'sm';

  /**
   * Determines whether or not the radio group is disabled.
   * @defaultValue false
   */
  @Prop() disabled = false;

  /**
   * Determines whether or not the radio group is invalid.
   * @defaultValue false
   */
  @Prop() invalid = false;

  /**
   * String used for group label/heading.
   */
  @Prop() groupLabel: string;

  /**
   * String used for radio `name` attribute. Applied to all child radios.
   */
  @Prop() name: string;

  /**
   * Determines whether or not the radio group is required.
   * @defaultValue false
   */
  @Prop() required = false;

  /**
   * Emits when a radio in the group is selected, providing the selected value and component ID.
   */
  @Event() pdsRadioGroupChange: EventEmitter<RadioGroupChangeEventDetail>;

  @Watch('name')
  @Watch('disabled')
  @Watch('invalid')
  @Watch('required')
  handlePropsChange() {
    this.updateChildRadios();
  }

  @Listen('change', {
    target: 'body',
  })
  handleRadioChange(event: Event) {
    const target = event.target as HTMLInputElement;

    // Only handle events from radio inputs within this group
    if (target.type !== 'radio' || !this.el.contains(target.closest('pds-radio'))) {
      return;
    }

    // Only emit if the radio is being checked (not unchecked)
    if (target.checked) {
      const radioElement = target.closest('pds-radio') as HTMLPdsRadioElement;
      if (radioElement) {
        this.pdsRadioGroupChange.emit({
          checked: true,
          value: radioElement.value,
          componentId: radioElement.componentId,
        });
      }
    }
  }

  private updateChildRadios() {
    const radios = this.el.querySelectorAll('pds-radio');
    radios.forEach((radio) => {
      if (this.name) {
        radio.setAttribute('name', this.name);
      }
      if (this.disabled) {
        radio.setAttribute('disabled', 'true');
      } else {
        radio.removeAttribute('disabled');
      }
      if (this.invalid) {
        radio.setAttribute('invalid', 'true');
      } else {
        radio.removeAttribute('invalid');
      }
      if (this.required) {
        radio.setAttribute('required', 'true');
      } else {
        radio.removeAttribute('required');
      }
    });
  }

  componentDidLoad() {
    this.updateChildRadios();
  }

  private classNames() {
    const classNames = [];

    if (this.invalid) {
      classNames.push('is-invalid');
    }
    // The host always uses flex-direction: column, so the label stays above.
    // The direction prop now only affects the .pds-radio-group__radios container.
    // No class needed on host for direction.

    return classNames.join(' ');
  }

  private getGapValue(): string {
    // Map t-shirt sizes to dimension tokens
    const gapMap: Record<string, string> = {
      none: '0',
      xxs: 'var(--pine-dimension-xxs)',
      xs: 'var(--pine-dimension-xs)',
      sm: 'var(--pine-dimension-sm)',
      md: 'var(--pine-dimension-md)',
      lg: 'var(--pine-dimension-lg)',
      xl: 'var(--pine-dimension-xl)',
      xxl: 'var(--pine-dimension-xxl)',
    };

    // If it's a t-shirt size, use the mapped value
    if (gapMap[this.gap]) {
      return gapMap[this.gap];
    }

    // Otherwise, assume it's a dimension token like "100", "200", etc.
    return `var(--pine-dimension-${this.gap})`;
  }

  render() {
    const groupId = this.componentId || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
    const gapValue = this.getGapValue();

    return (
      <Host
        class={this.classNames()}
        id={groupId}
        style={{
          '--pds-radio-group-gap': gapValue,
        }}
      >
        {this.groupLabel && (
          <div class="pds-radio-group__label">
            {this.groupLabel}
          </div>
        )}
        <div class={{
          'pds-radio-group__radios': true,
          'pds-radio-group__radios--row': this.direction === 'row',
          'pds-radio-group__radios--column': this.direction === 'column',
        }}>
          <slot onSlotchange={() => this.updateChildRadios()} />
        </div>
        {this.helperMessage && (
          <div
            class="pds-radio-group__message"
            id={messageId(groupId, 'helper')}
          >
            {this.helperMessage}
          </div>
        )}
        {this.errorMessage && (
          <div
            class="pds-radio-group__message pds-radio-group__message--error"
            id={messageId(groupId, 'error')}
            aria-live="assertive"
          >
            <pds-icon icon={danger} size="small" />
            {this.errorMessage}
          </div>
        )}
      </Host>
    );
  }
}

