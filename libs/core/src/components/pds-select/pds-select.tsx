import { Component, Element, Event, EventEmitter, Host, h, Prop, Watch } from '@stencil/core';
import { HostStylingKeeper } from '@utils/attributes';
import { assignDescription, isSpecTest, messageId, exposeTypeProperty } from '../../utils/form';
import { danger, enlarge } from '@pine-ds/icons/icons';

/** The tags of an option list in order, optgroup contents included: equal shapes can be patched in place. */
const shapeOf = (items: Element[]): string =>
  items.map((item) => item.tagName + (item.tagName === 'OPTGROUP' ? `(${shapeOf(Array.from(item.children))})` : '')).join();

/** Brings an existing option or optgroup up to date with its copy, keeping the element itself. */
const patchInPlace = (target: Element, copy: Element) => {
  Array.from(target.attributes).forEach(({ name }) => {
    if (!copy.hasAttribute(name)) target.removeAttribute(name);
  });
  Array.from(copy.attributes).forEach(({ name, value }) => {
    if (target.getAttribute(name) !== value) target.setAttribute(name, value);
  });

  if (copy.tagName === 'OPTGROUP') {
    Array.from(copy.children).forEach((child, index) => patchInPlace(target.children[index], child));
  } else if (target.textContent !== copy.textContent) {
    target.textContent = copy.textContent;
  }
};

/**
 * @slot action - Content to be displayed in the label area, typically for help icons or links
 */
@Component({
  tag: 'pds-select',
  styleUrls: ['pds-select.tokens.scss', '../../global/styles/utils/label.scss', 'pds-select.scss'],
  shadow: true,
  formAssociated: true,
})
export class PdsSelect {

  private selectEl!: HTMLSelectElement;
  private slotContainer!: HTMLDivElement;
  private internals?: ElementInternals;
  private _type: 'select-one' | 'select-multiple' = 'select-one';
  private optionObserver: MutationObserver | null = null;
  private optionSyncFrame: number | null = null;

  @Element() el: HTMLPdsSelectElement;
  private hostKeeper = new HostStylingKeeper();

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
   * Visually hides the label text for instances where only the select should be displayed. Label remains accessible to assistive technology such as screen readers.
   * Note: When true, the action slot is also hidden to maintain a minimal UI.
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
   * Applies highlight styling to the select field.
   */
  @Prop({ reflect: true }) highlight?: boolean;

  /**
   * The value(s) of the selected option(s).
   *
   */
  @Prop({ mutable: true }) value?: string | string[];


  /**
   * Emitted when the select value changes.
   */
  @Event() pdsSelectChange: EventEmitter<InputEvent>;

  /**
   * Emitted when the select loses focus.
   */
  @Event() pdsBlur!: EventEmitter<FocusEvent>;

  /**
   * Emitted when the select gains focus.
   */
  @Event() pdsFocus!: EventEmitter<FocusEvent>;

  /**
   * Emitted when a key is pressed down in the select.
   */
  @Event() pdsKeyDown!: EventEmitter<KeyboardEvent>;

  @Watch('value')
  /**
   * Handles the change in the value of the select component.
   * This method is called whenever the value of the select component changes.
   * It updates the selected option accordingly.
   */
  valueChanged() {
    this.updateSelectedOption();
    this.updateFormValue();
  }

  @Watch('multiple')
  /**
   * Updates the type property when multiple changes to match native select behavior.
   */
  multipleChanged() {
    this.updateType();
  }

  private updateType() {
    this._type = this.multiple ? 'select-multiple' : 'select-one';
  }

  connectedCallback() {
    this.hostKeeper.connect(this.el);
    // Initialize ElementInternals for form association (only once per element instance)
    if (this.el.attachInternals && !this.internals) {
      this.internals = this.el.attachInternals();
    }

    // Expose type property on the element instance to match native form element behavior
    exposeTypeProperty(this.el, () => this._type);

    // Reconnected after a move: componentDidLoad won't run again, and options may have changed
    // while it was out of the document.
    if (this.selectEl !== undefined) {
      this.startOptionSync();
      this.scheduleOptionSync();
    }
  }

  disconnectedCallback() {
    this.hostKeeper.disconnect();
    this.stopOptionSync();
  }

  componentWillLoad() {
    // Set initial type based on multiple prop
    this.updateType();
    this.updateSelectedOption();
  }

  componentDidLoad() {
    // Set initial form value
    this.updateFormValue();
    this.startOptionSync();
  }

  /**
   * Keeps the inner select in step with the slotted options. `slotchange` only fires when
   * top-level options are added or removed, so an option's text, value or disabled state
   * changing, or an option added inside an optgroup, would otherwise never reach the select.
   * Changes are batched into one copy per animation frame.
   */
  private startOptionSync() {
    if (this.optionObserver !== null || typeof MutationObserver === 'undefined' || !this.el.isConnected) return;

    this.optionObserver = new MutationObserver((mutations) => {
      if (mutations.some(this.touchesOption)) this.scheduleOptionSync();
    });
    this.optionObserver.observe(this.el, { childList: true, subtree: true, attributes: true, characterData: true });
  }

  /**
   * Whether a mutation is inside an option or optgroup. The host's own attributes and children
   * (top-level adds and removes reach `slotchange`) and the action slot's content are not.
   */
  private touchesOption = ({ target }: MutationRecord): boolean => {
    const element = target.nodeType === Node.TEXT_NODE ? target.parentElement : (target as Element);
    return target !== this.el && element?.closest('option, optgroup') != null;
  };

  private scheduleOptionSync() {
    if (this.optionSyncFrame !== null) return;

    this.optionSyncFrame = requestAnimationFrame(() => {
      this.optionSyncFrame = null;
      this.handleSlotChange();
    });
  }

  private stopOptionSync() {
    this.optionObserver?.disconnect();
    this.optionObserver = null;
    if (this.optionSyncFrame !== null) {
      cancelAnimationFrame(this.optionSyncFrame);
      this.optionSyncFrame = null;
    }
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

  private onBlur = (ev: FocusEvent) => {
    this.pdsBlur.emit(ev);
  };

  private onFocus = (ev: FocusEvent) => {
    this.pdsFocus.emit(ev);
  };

  private onKeyDown = (ev: KeyboardEvent) => {
    this.pdsKeyDown.emit(ev);
  };

  /**
   * Copies the slotted <option> and <optgroup> elements into the inner select, then
   * reselects the current value. Runs on `slotchange` and when a slotted option changes
   * (see startOptionSync).
   *
   * Nothing happens when the copies match what the select already holds. When only text or
   * attributes changed, the select's own options are updated in place rather than replaced,
   * so an open picker keeps its highlight, a multiple select keeps its range anchor, and a
   * screen reader keeps its place. Selecting programmatically fires no change event, so a
   * copy never emits `pdsSelectChange`.
   */
  private handleSlotChange = () => {
    const slot = this.slotContainer?.querySelector('slot') as HTMLSlotElement | null;
    if (slot === null || slot === undefined || this.selectEl === undefined) return;

    const copies = (slot.assignedElements({ flatten: true }) as Element[])
      .filter((item) => ['OPTION', 'OPTGROUP'].includes(item.tagName))
      .map((item) => item.cloneNode(true) as HTMLOptionElement | HTMLOptGroupElement);
    const current = Array.from(this.selectEl.children);

    const markup = (items: Element[]) => items.map((item) => item.outerHTML).join('');
    if (markup(copies) === markup(current)) return;

    if (shapeOf(copies) === shapeOf(current)) {
      copies.forEach((copy, index) => patchInPlace(current[index], copy));
    } else {
      this.selectEl.innerHTML = '';
      copies.forEach((copy) => this.selectEl.appendChild(copy));
    }

    this.updateSelectedOption();
    this.showNoSelectionWithoutMatch();
    this.updateFormValue();
  };

  /**
   * After a copy, a value whose option was renamed or removed has nothing to select. Like a
   * native select, show nothing selected rather than the first option; the value itself is
   * kept, with no change event.
   */
  private showNoSelectionWithoutMatch() {
    const wanted = ([] as string[]).concat(this.value ?? []).filter((value) => value !== '');
    const options = Array.from(this.selectEl.options) as HTMLOptionElement[];
    if (wanted.length > 0 && !options.some((option) => wanted.includes(option.value))) {
      this.selectEl.selectedIndex = -1;
    }
  }

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
        <pds-icon aria-hidden="true" icon={danger} size="small"></pds-icon>
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

  // The field also renders as invalid whenever an error message is present, via
  // `select:has(~ .pds-select__message .pds-select__error-message)` in the styles.
  private isInvalid(): boolean {
    return Boolean(this.invalid) || Boolean(this.errorMessage);
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

  /**
   * Updates the form value using ElementInternals API
   */
  private updateFormValue() {
    if (isSpecTest()) return;

    if (this.internals && this.internals.setFormValue) {
      const value = this.value;

      // Handle multi-select arrays by converting to FormData or comma-separated string
      if (Array.isArray(value)) {
        if (value.length > 1) {
          // For multiple values, create FormData with multiple entries
          const formData = new FormData();
          value.forEach(val => formData.append(this.name || '', val));
          this.internals.setFormValue(formData);
        } else {
          // Single value in array, use the string value
          this.internals.setFormValue(value[0] || null);
        }
      } else {
        // Single string value
        this.internals.setFormValue(value || null);
      }

      // Set validity based on native select validation
      if (this.selectEl && this.internals && this.internals.setValidity) {
        this.internals.setValidity(
          this.selectEl.validity,
          this.selectEl.validationMessage,
          this.selectEl
        );
      }
    }
  }

  /**
   * Form Associated Custom Elements API: Called when the form is reset
   */
  formResetCallback() {
    this.value = '';
    this.updateFormValue();
  }

  /**
   * Form Associated Custom Elements API: Called when the form is disabled
   */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  /**
   * Form Associated Custom Elements API: Called to restore form state
   */
  formStateRestoreCallback(state: string | FormData | null) {
    if (typeof state === 'string') {
      this.value = state;
    } else if (state instanceof FormData && this.name) {
      // Extract value(s) from FormData using the select's name
      const values = state.getAll(this.name);
      if (values.length > 1) {
        // Multi-select: convert to string array
        this.value = values.filter(v => typeof v === 'string') as string[];
      } else if (values.length === 1 && typeof values[0] === 'string') {
        // Single select: use string value
        this.value = values[0];
      }
    }
  }

  render() {
    const hasAction = this.el.querySelector('[slot="action"]') !== null;

    const hostClass = this.classNames();
    const hostAttributes = {
      'aria-disabled': this.disabled ? 'true' : null,
      'has-action': hasAction && !this.hideLabel ? 'true' : null,
    };
    this.hostKeeper.record(hostClass, {}, hostAttributes);

    return (
      <Host class={hostClass} {...hostAttributes}>
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
            aria-describedby={assignDescription(this.componentId, this.isInvalid(), this.helperMessage, this.errorMessage)}
            aria-invalid={this.isInvalid() ? 'true' : undefined}
            aria-label={this.hideLabel ? this.label : undefined}
            autocomplete={this.autocomplete || undefined}
            class="pds-select__field"
            disabled={this.disabled}
            id={this.componentId}
            multiple={this.multiple}
            name={this.name}
            onBlur={this.onBlur}
            onChange={this.onSelectUpdate}
            onFocus={this.onFocus}
            onKeyDown={this.onKeyDown}
            part="select"
            required={this.required}
            ref={(el) => (this.selectEl = el as HTMLSelectElement)}
          ></select>
          <div aria-hidden="true" class="hidden" ref={(el) => (this.slotContainer = el)}>
            <slot onSlotchange={this.handleSlotChange}></slot>
          </div>
          {this.renderMessages()}
          {!this.multiple && <pds-icon aria-hidden="true" class="pds-select__select-icon" icon={enlarge} />}
        </div>
      </Host>
    );
  }
}
