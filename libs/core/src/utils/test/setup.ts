/**
 * Global test setup file
 * This file is loaded before all tests to provide mocks and polyfills
 */

/**
 * Mock ElementInternals API for testing
 * The ElementInternals API is used for form-associated custom elements
 * but is not fully supported in Stencil's unit test environment
 */
class MockElementInternals {
  // @ts-expect-error - Stored for mock completeness
  private _formValue: FormData | string | null = null;
  // @ts-expect-error - Stored for mock completeness
  private _formState: FormData | string | null = null;
  private _validationMessage = '';
  private _validity: ValidityState = {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false,
  };

  /**
   * Sets the form value and state for the associated custom element
   */
  setFormValue(
    value: File | string | FormData | null,
    state?: File | string | FormData | null,
  ): void {
    this._formValue = value as FormData | string | null;
    this._formState = state !== undefined ? (state as FormData | string | null) : value as FormData | string | null;
  }

  /**
   * Sets the validity state and validation message
   */
  setValidity(
    flags?: ValidityStateFlags,
    message?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _anchor?: HTMLElement,
  ): void {
    if (flags) {
      this._validity = { ...this._validity, ...flags, valid: !Object.values(flags).some(Boolean) };
    }
    this._validationMessage = message || '';
  }

  /**
   * Checks if the element will pass validation
   */
  checkValidity(): boolean {
    return this._validity.valid;
  }

  /**
   * Checks validity and fires invalid event if not valid
   */
  reportValidity(): boolean {
    return this._validity.valid;
  }

  /**
   * Returns the form associated with this element
   */
  get form(): HTMLFormElement | null {
    return null;
  }

  /**
   * Returns the validation message
   */
  get validationMessage(): string {
    return this._validationMessage;
  }

  /**
   * Returns the validity state
   */
  get validity(): ValidityState {
    return this._validity;
  }

  /**
   * Returns whether the element will be validated
   */
  get willValidate(): boolean {
    return true;
  }

  /**
   * Returns the labels associated with this element
   */
  get labels(): NodeList {
    return {
      length: 0,
      item: () => null,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [Symbol.iterator]: function* () {},
    } as unknown as NodeList;
  }
}

/**
 * Mock attachInternals method on HTMLElement
 */
if (typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.attachInternals === 'undefined') {
  HTMLElement.prototype.attachInternals = function () {
    return new MockElementInternals() as unknown as ElementInternals;
  };
}

/**
 * Suppress specific console warnings that are expected in test environment
 */
const originalConsoleError = console.error;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any[]) => {
  // Filter out the ElementInternals warning since we're mocking it
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Property setFormValue was accessed on ElementInternals')
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

export {};

