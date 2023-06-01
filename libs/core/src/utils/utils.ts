export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export const hasShadowDom = (el: HTMLElement) => {
  return !!el.shadowRoot && !!(el as any).attachShadow
}

export const isRequired = (target, component) => {
  if ( !target || !component ) return;
  if (component.required === true) {
    (target.checkValidity() === false) ? component.invalid = true : component.invalid = false;
  }
}

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
  let relatedId = messageId(id, 'helper')

  if (!invalid || !helperMessage) return;
  if (invalid) relatedId = messageId(id, 'error');

  return relatedId;
};
