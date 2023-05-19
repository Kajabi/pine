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
