/**
 * Create id for messaging
 */
export const messageId = (id: string, messageType: string) => {
  return `${id}__${messageType}-message`;
};

/**
 * Assign aria-description id to relate messages with form element
 */
export const assignDescription = (id: string, invalid: boolean, helperMessage: string) => {
  if (!helperMessage) return

  let relatedId = messageId(id, 'helper')

  if (invalid) relatedId = messageId(id, 'error');

  return relatedId;
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
