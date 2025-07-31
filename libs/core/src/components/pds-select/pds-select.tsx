import { Component, Element, Event, EventEmitter, Host, h, Prop, Watch } from '@stencil/core';
import { messageId } from '../../utils/form';
import { danger, enlarge } from '@pine-ds/icons/icons';

/**
 * PdsSelect - A dropdown selection component with validation and accessibility
 *
 * **⚠️ CRITICAL BEHAVIOR:**
 * - **Form Integration**: Automatically handles form submission and validation
 * - **Validation States**: Supports error messages and invalid states
 * - **Accessibility**: Full ARIA support with proper labeling and descriptions
 * - **Multiple Selection**: Supports single and multiple option selection
 * - **Option Management**: Uses slot-based option content for flexibility
 *
 * **⚠️ VISUAL PATTERN CLARIFICATION:**
 *
 * When analyzing screenshots or visual layouts:
 * - **Text above select dropdown**: This is the select's LABEL, not a separate `pds-text` component
 * - **Label Integration**: The `label` prop creates text that appears above the select field
 * - **No Separate Text Needed**: Do not add `pds-text` components for select labels
 * - **Visual Hierarchy**: Label text is styled and positioned automatically by the select component
 *
 * **Common Mistake**: Seeing text above a select dropdown and assuming it's a separate `pds-text` component
 * **Correct Understanding**: The text is the select's integrated label created by the `label` prop
 *
 * **Usage Examples:**
 * ```tsx
 * // Basic select
 * <pds-select label="Country" component-id="country" name="country">
 *   <option value="us">United States</option>
 *   <option value="ca">Canada</option>
 *   <option value="uk">United Kingdom</option>
 * </pds-select>
 *
 * // Select with validation
 * <pds-select
 *   label="Category"
 *   component-id="category"
 *   required
 *   helper-message="Please select a category"
 * >
 *   <option value="">Select a category</option>
 *   <option value="tech">Technology</option>
 *   <option value="design">Design</option>
 * </pds-select>
 *
 * // Multiple select
 * <pds-select
 *   label="Skills"
 *   component-id="skills"
 *   multiple="true"
 * >
 *   <option value="js">JavaScript</option>
 *   <option value="react">React</option>
 *   <option value="node">Node.js</option>
 * </pds-select>
 *
 * // ❌ INCORRECT - Don't add separate text for labels
 * <pds-text>Country</pds-text>
 * <pds-select component-id="country">
 *   <option value="us">United States</option>
 * </pds-select>
 *
 * // ✅ CORRECT - Use the label prop
 * <pds-select label="Country" component-id="country">
 *   <option value="us">United States</option>
 * </pds-select>
 * ```
 *
 * @slot action - Content to be displayed in the label area, typically for help icons or links
 */
@Component({
  tag: 'pds-select',
  styleUrls: ['pds-select.tokens.scss', '../../global/styles/utils/label.scss', 'pds-select.scss'],
  shadow: true,
})
export class PdsSelect {

  private selectEl!: HTMLSelectElement;
  private slotContainer!: HTMLDivElement;

  @Element() el: HTMLPdsSelectElement;

  /**
   * Specifies if and how the browser provides `autocomplete` assistance for the field.
   */
  @Prop() autocomplete: string;

  /**
   * A unique identifier used for the underlying component `id` attribute.
   */
  @Prop() componentId!: string;

  /**
   * Indicates whether or not the select field is disabled.
   * @defaultValue false
   */
  @Prop() disabled = false

  /**
   * Displays error message text describing an invalid state.
   */
  @Prop() errorMessage: string;

  /**
   * Visually hides the label text for instances where only the checkbox should be displayed. Label remains accessible to assistive technology such as screen readers.
   */
  @Prop() hideLabel: boolean;

  /**
   * Displays helper message text below select.
   */
  @Prop() helperMessage: string;

  /**
   * Determines whether or not the select is invalid.
   */
  @Prop() invalid?: boolean;

  /**
   * Text to be displayed as the select label.
   *
   * **⚠️ CRITICAL VISUAL BEHAVIOR:**
   * - **Integrated Label**: Creates text that appears ABOVE the select dropdown
   * - **Not Separate Component**: This is NOT a separate `pds-text` component
   * - **Automatic Styling**: Label is styled and positioned by the select component
   * - **Visual Hierarchy**: Creates proper visual relationship between label and select
   *
   * **Accessibility Impact:**
   * - Creates proper label-select association
   * - Required for screen reader accessibility
   * - Shows required indicator (*) when `required="true"`
   * - Sets `for` attribute to link with select
   *
   * **⚠️ COMMON MISTAKE**: When analyzing screenshots, text above a select dropdown is the LABEL, not a separate text component
   *
   * **Best Practice**: Always provide descriptive labels for select fields
   *
   * **Example**: `label="Country"` for country selection
   */
  @Prop() label?: string;

  /**
   * Indicates whether multiple options can be selected.
   * @defaultValue false
   */
  @Prop() multiple = false;

  /**
   * Specifies the name. Submitted with the form name/value pair.
   */
  @Prop() name!: string;

  /**
   * Indicates whether or not the select field is required.
   * @defaultValue false
   */
  @Prop() required = false;

  /**
   * The value(s) of the selected option(s).
   *
   */
  @Prop({ mutable: true }) value?: string | string[];

  /**
   * Emitted when a keyboard input occurs.
   */
  @Event() pdsSelectChange: EventEmitter<InputEvent>;

  @Watch('value')
  /**
   * Handles the change in the value of the select component.
   * This method is called whenever the value of the select component changes.
   * It updates the selected option accordingly.
   */
  valueChanged() {
    this.updateSelectedOption();
  }

  componentWillLoad() {
    this.updateSelectedOption();
  }

  /**
   * Updates the selected option in the select element based on the current value.
   *
   * This method iterates through all the options of the select element and sets the
   * 'selected' attribute on the option that matches the current value. If an option
   * does not match the current value, the 'selected' attribute is removed.
   *
   * @private
   * @returns {void}
   */
  private updateSelectedOption() {
    if (this.selectEl) {
      const options = this.selectEl.options;

      // Update the selected attribute for all options.
      Array.from(options).map((option: HTMLOptionElement) => {
        if (Array.isArray(this.value)) {
          option.selected = this.value.includes(option.value);
        } else {
          option.selected = this.value === option.value;
        }
      });
    };
  }

  /**
   * Emits an event on input change.
  */
  private onSelectUpdate = (e: Event) => {
    const target = e.target as HTMLSelectElement

    const values = Array.from(target.options)
        .filter((option) => ( option.selected))
        .map((option) => ( option.value));

    if (values.length === 1 && !this.multiple) {
        this.value = values[0];
    } else {
        this.value = values;
    }

    this.pdsSelectChange.emit(e as InputEvent);
  };

  /**
   * Handles the change event for the slot element.
   * This method is triggered when the slot content changes.
   * It updates the inner HTML of the select element by cloning and appending
   * the assigned <option> elements from the slot.
   */
  private handleSlotChange = () => {
    const slot = this.slotContainer.querySelector('slot') as HTMLSlotElement;

    this.selectEl.innerHTML = '';
    const assignedElements = slot.assignedElements({ flatten: true }) as (HTMLOptionElement | HTMLOptGroupElement)[];

    assignedElements.forEach((item) => {
      if ( ['OPTION', 'OPTGROUP'].includes(item.tagName)) {
        const clonedItem = item.cloneNode(true) as HTMLOptionElement | HTMLOptGroupElement;
        if (clonedItem.tagName === 'OPTION' && (clonedItem as HTMLOptionElement).value === this.value) {
          (clonedItem as HTMLOptionElement).selected = true;
        }
        this.selectEl.appendChild(clonedItem);
      }
    });

    this.updateSelectedOption();
  };

  private getHelperMessage() {
    return this.helperMessage && (
      <p class="pds-select__helper-message" id={messageId(this.componentId, 'helper')}>
        {this.helperMessage}
      </p>
    );
  }

  private getErrorMessage() {
    return this.errorMessage && (
      <p class="pds-select__error-message" id={messageId(this.componentId, 'error')} aria-live="assertive">
        <pds-icon icon={danger} size="small"></pds-icon>
        {this.errorMessage}
      </p>
    );
  }

  private renderMessages() {
    if (!this.helperMessage && !this.errorMessage) return null;

    return (
      <div class="pds-select__message">
        {this.getHelperMessage()}
        {this.getErrorMessage()}
      </div>
    );
  }

  private classNames() {
    const classNames = [];

    if (this.invalid) { classNames.push('is-invalid'); }
    if (this.disabled) { classNames.push('is-disabled'); }

    return classNames.join('  ');
  }

  private renderAction() {
    const hasAction = this.el.querySelector('[slot="action"]') !== null;
    if (hasAction) {
      return (
        <div class="pds-select__action" part="action">
          <slot name="action"></slot>
        </div>
      );
    }
    return null;
  }

  render() {
    const hasAction = this.el.querySelector('[slot="action"]') !== null;

    return (
      <Host aria-disabled={this.disabled ? 'true' : null} class={this.classNames()} has-action={hasAction && !this.hideLabel ? 'true' : null}>
        <div class="pds-select">
          {!this.hideLabel && (
            <div class="pds-select__label-wrapper">
              <label htmlFor={this.componentId}>
                <span class={this.hideLabel ? 'visually-hidden' : ''}>
                  {this.label}
                </span>
              </label>
              {hasAction && this.renderAction()}
            </div>
          )}
          <select
            aria-label={this.hideLabel ? this.label : undefined}
            autocomplete={this.autocomplete || undefined}
            class="pds-select__field"
            disabled={this.disabled}
            id={this.componentId}
            multiple={this.multiple}
            name={this.name}
            onChange={this.onSelectUpdate}
            part="select"
            required={this.required}
            ref={(el) => (this.selectEl = el as HTMLSelectElement)}
          ></select>
          <div aria-hidden="true" class="hidden" ref={(el) => (this.slotContainer = el)}>
            <slot onSlotchange={this.handleSlotChange}></slot>
          </div>
          {this.renderMessages()}
          {!this.multiple && <pds-icon class="pds-select__select-icon" icon={enlarge} />}
        </div>
      </Host>
    );
  }
}
