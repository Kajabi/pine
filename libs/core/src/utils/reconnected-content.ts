/**
 * Unwraps a stale copy of a light-DOM (`shadow: false`) component's own wrapper,
 * left behind when a page-cache (Turbo, browser bfcache) reconnect nests a
 * component's previous render inside its freshly rendered one. Call from
 * `componentDidRender` with the element that directly contains the rendered
 * `<slot>` and the selector that identifies "another one of me." Unwraps in
 * place (move-then-remove) so nested content is never lost.
 *
 * `contentSelector` is only needed when the wrapper itself further nests a
 * separate content element (e.g. pds-tab's `<a class="pds-tab">` wrapping a
 * `.pds-tab__content` div) — omit it when the wrapper's own children are the
 * slotted content (e.g. pds-tabpanel's `.pds-tabpanel` div).
 */
export function unwrapReconnectedContent(
  container: Element | null,
  selector: string,
  contentSelector?: string,
): void {
  if (container === null) return;

  let stale = container.firstElementChild;
  while (stale?.matches(selector)) {
    const source = contentSelector !== undefined ? (stale.querySelector(contentSelector) ?? stale) : stale;
    Array.from(source.childNodes).forEach((node) => container.insertBefore(node, stale));
    stale.remove();
    stale = container.firstElementChild;
  }
}
