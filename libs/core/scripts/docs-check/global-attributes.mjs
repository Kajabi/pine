/**
 * Attributes any element accepts, so they are never reported as unknown on a `pds-*` element.
 *
 * - HTML Standard, "Global attributes": https://html.spec.whatwg.org/multipage/dom.html#global-attributes
 *   (the attributes common to all HTML elements, plus `xmlns` and `xml:lang` from the same section).
 * - DOM Standard: `class`, `id` and `slot` apply to elements in any namespace.
 * - WAI-ARIA in HTML: `role`.
 * - CSS Shadow Parts: `part` and `exportparts`.
 *
 * `aria-*`, `data-*` and inline `on*` event handler attributes are matched by prefix in `isGlobalAttribute`.
 */
export const GLOBAL_ATTRIBUTES = new Set([
  'accesskey',
  'autocapitalize',
  'autocorrect',
  'autofocus',
  'class',
  'contenteditable',
  'dir',
  'draggable',
  'enterkeyhint',
  'exportparts',
  'headingoffset',
  'headingreset',
  'hidden',
  'id',
  'inert',
  'inputmode',
  'is',
  'itemid',
  'itemprop',
  'itemref',
  'itemscope',
  'itemtype',
  'lang',
  'nonce',
  'part',
  'popover',
  'role',
  'slot',
  'spellcheck',
  'style',
  'tabindex',
  'title',
  'translate',
  'writingsuggestions',
  'xml:lang',
  'xmlns',
]);

const PREFIXED = /^(?:aria-|data-)./;
const EVENT_HANDLER = /^on[a-z]+$/;

/** Takes a lowercase name, as the HTML parser gives it. */
export const isGlobalAttribute = (name) => GLOBAL_ATTRIBUTES.has(name) || PREFIXED.test(name) || EVENT_HANDLER.test(name);
