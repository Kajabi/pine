const TABBABLE = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'iframe',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

/**
 * Collects the tabbable elements under `root` in focus order, walking into open shadow roots and
 * following slots, so a component's own controls (the input inside pds-combobox or pds-textarea)
 * count without being registered here by tag name. Positive tabindex values are not reordered,
 * and a closed shadow root can't be seen into.
 */
function collectTabbable(root: Element | ShadowRoot, found: HTMLElement[]) {
  for (const child of Array.from(root.children)) visitTabbable(child, found);
}

// An editing host reports tabIndex -1 but is still a Tab stop; editable content inside it is not.
const isTabStop = (el: HTMLElement) =>
  el.tabIndex >= 0 || (el.isContentEditable && !el.hasAttribute('tabindex') && !el.parentElement?.isContentEditable);

function visitTabbable(el: Element, found: HTMLElement[]) {
  // A tooltip portaled into a dialog only describes the control that has focus; it's never a stop of its own.
  if (el.hasAttribute('inert') || el.getAttribute('role') === 'tooltip') return;
  if (el.localName === 'slot') {
    const slot = el as HTMLSlotElement;
    // Fallback content renders only when nothing at all is assigned, text included.
    if ((slot.assignedNodes?.({ flatten: true }) ?? []).length === 0) return collectTabbable(el, found);
    for (const slotted of slot.assignedElements({ flatten: true })) visitTabbable(slotted, found);
    return;
  }
  // A delegatesFocus host passes focus to its first control, which the walk below finds.
  const delegates = el.shadowRoot?.delegatesFocus === true;
  if (el instanceof HTMLElement && !delegates && isTabStop(el) && el.matches(TABBABLE) && !el.matches(':disabled')) {
    found.push(el);
  }
  // A shadow host's light children render only through its slots, which the walk reaches.
  collectTabbable(el.shadowRoot ?? el, found);
}

/** The element as a radio in a named group, or `null`. */
const groupedRadio = (el: HTMLElement): HTMLInputElement | null =>
  el instanceof HTMLInputElement && el.type === 'radio' && el.name !== '' ? el : null;

/**
 * Keeps one radio per named group, as the browser does: the checked one, or the first. The others
 * are reached with the arrow keys, so they can't be the first or last stop of the trap.
 */
function oneRadioPerGroup(elements: HTMLElement[]): HTMLElement[] {
  // Radios group by name and form within one tree, so each shadow root starts its own groups.
  const groups: HTMLInputElement[][] = [];
  for (const el of elements) {
    const radio = groupedRadio(el);
    if (radio === null) continue;
    const group = groups.find(
      ([first]) => first.name === radio.name && first.form === radio.form && first.getRootNode() === radio.getRootNode(),
    );
    if (group) group.push(radio);
    else groups.push([radio]);
  }
  const stops = new Set<HTMLElement>(groups.map((radios) => radios.find((radio) => radio.checked) ?? radios[0]));
  return elements.filter((el) => groupedRadio(el) === null || stops.has(el));
}

/** The controls Tab reaches in `root`, in order: visible ones, and one radio per group. */
export function tabbableIn(root: Element): HTMLElement[] {
  const found: HTMLElement[] = [];
  collectTabbable(root, found);
  // checkVisibility() also drops an element inside a hidden ancestor, whose own computed
  // display isn't none; such an element can't take focus.
  const visible = found.filter(el => {
    if (typeof el.checkVisibility === 'function') return el.checkVisibility({ checkVisibilityCSS: true });

    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
  return oneRadioPerGroup(visible);
}
