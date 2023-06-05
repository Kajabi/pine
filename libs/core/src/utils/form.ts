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
