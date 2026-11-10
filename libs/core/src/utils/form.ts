/**
 * Create id for messaging
 */
export const messageId = (id: string, messageType: string) => {
  return `${id}__${messageType}-message`;
};

/**
 * Assign aria-description id to relate messages with form element
 *
 * Returns the error message id when invalid, otherwise the helper message id.
 * Pass only messages the component renders — a described id must exist in the DOM.
 */
export const assignDescription = (
  id: string,
  invalid: boolean,
  helperMessage?: string,
  errorMessage?: string
) => {
  const hasErrorMessage = Boolean(errorMessage);
  const hasHelperMessage = Boolean(helperMessage);

  if (invalid && hasErrorMessage) return messageId(id, 'error');
  if (hasHelperMessage) return messageId(id, 'helper');

  return undefined;
};

/**
 * Updates the `invalid` prop of a form element based on it's values validity
 */
export const isRequired = (target, component) => {
  if ( !target || !component ) return;
  if (component.required === true) {
    (target.checkValidity() === false) ? component.invalid = true : component.invalid = false;
  }
}

/**
 * Exposes a readonly type property on a custom form element to match native form element behavior.
 * This makes the type property enumerable and accessible via element.type, matching native HTML elements.
 * The property is non-configurable, preventing it from being redefined or deleted at runtime.
 *
 * @param element - The custom element to add the type property to
 * @param type - The type value (string literal) or a getter function that returns the type
 */
export function exposeTypeProperty(element: Element, type: string | (() => string)) {
  if (Object.getOwnPropertyDescriptor(element, 'type')) return;

  Object.defineProperty(element, 'type', {
    get: typeof type === 'function' ? type : () => type,
    enumerable: true,
    configurable: false
  });
}

/**
 * Mirrors a native form control's validity onto ElementInternals, as pds-input, pds-select,
 * pds-textarea and pds-checkbox do. A disabled control takes no part in constraint validation —
 * the browser still computes its `validity` flags but clears `validationMessage` to `''` for it,
 * and `setValidity` throws if told a flag is true with an empty message, so a disabled control
 * always reports valid instead of relaying that stale, message-less native state. Callers must
 * also re-run this whenever `disabled` or `required` changes and from `formDisabledCallback`:
 * nothing else does, so a field that renders disabled keeps whatever validity it had while
 * disabled even after becoming enabled.
 */
export const reportNativeValidity = (
  internals: ElementInternals | undefined,
  disabled: boolean | undefined,
  control: { validity: ValidityState; validationMessage: string } | undefined,
  anchor?: HTMLElement,
  fallbackMessage = 'This field is invalid.',
) => {
  if (!internals?.setValidity) return;

  if (disabled || !control) {
    internals.setValidity({});
    return;
  }

  const message = control.validity.valid ? '' : control.validationMessage || fallbackMessage;
  internals.setValidity(control.validity, message, anchor);
};

/**
 * Determines if code is running in Stencil's spec test environment.
 * Stencil's mock-doc logs console.error on any ElementInternals
 * property access during spec tests. Use this guard to skip
 * ElementInternals calls in the mock environment.
 *
 * Uses __STENCIL_SPEC_TESTS__ (the same env var Stencil's mock-doc checks)
 * to avoid false positives in downstream consumer test suites.
 */
export const isSpecTest = (): boolean => {
  return typeof process !== 'undefined' && process.env?.__STENCIL_SPEC_TESTS__ === 'true';
};
