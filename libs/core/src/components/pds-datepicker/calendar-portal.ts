/**
 * Where the open calendar lives: a `div` in `document.body`, or in the nearest `<dialog>` so it
 * shares a modal's top layer, outside any `overflow: hidden` or transformed ancestor that would
 * clip or misplace a fixed-position popup. The portal has its own shadow root carrying the
 * datepicker's styles, so the calendar looks the same there without any global CSS.
 */
export class CalendarPortal {
  static readonly className = 'pds-datepicker-calendar-portal';

  readonly host: HTMLElement;
  private readonly root: ShadowRoot;

  constructor(private readonly datepicker: HTMLElement) {
    this.host = document.createElement('div');
    this.host.className = CalendarPortal.className;
    this.root = this.host.attachShadow({ mode: 'open' });
  }

  /** Moves the calendar into the portal, mounting the portal first. */
  mount(calendar: HTMLElement) {
    const target = findPortalTarget(this.datepicker);
    if (this.host.parentNode !== target) target.appendChild(this.host);

    this.copyContext();
    if (calendar.parentNode !== this.root) this.root.appendChild(calendar);
  }

  remove() {
    this.host.remove();
  }

  /** Whether a node is the portal or inside it, as a focus or pointer target. */
  contains(node: Node | null): boolean {
    return !!node && (node === this.host || this.root.contains(node));
  }

  /**
   * Carries over what the calendar would otherwise inherit from the datepicker: its styles, the
   * reading direction, a theme set on an ancestor, and size overrides.
   */
  private copyContext() {
    const source = this.datepicker.shadowRoot;
    if (source) {
      if (source.adoptedStyleSheets?.length) {
        this.root.adoptedStyleSheets = source.adoptedStyleSheets;
      } else if (!this.root.querySelector('style')) {
        source.querySelectorAll('style').forEach((style) => this.root.appendChild(style.cloneNode(true)));
      }
    }

    const computed = getComputedStyle(this.datepicker);
    this.host.dir = computed.direction || 'ltr';
    for (const property of ['--pds-datepicker-day-size', '--pds-datepicker-presets-width']) {
      const value = computed.getPropertyValue(property).trim();
      if (value) this.host.style.setProperty(property, value);
    }

    const theme = this.datepicker.closest('[data-theme]')?.getAttribute('data-theme');
    if (theme) {
      this.host.setAttribute('data-theme', theme);
    } else {
      this.host.removeAttribute('data-theme');
    }
  }
}

/**
 * The native `<dialog>` the datepicker sits in, so the calendar stays in the same top layer as
 * `showModal()`, or `document.body`. `closest('dialog')` stops at shadow boundaries and misses a
 * dialog that only wraps slotted content, so this walks assigned slots and shadow hosts, as
 * pds-combobox does, and falls back to `pds-modal`'s dialog.
 */
export function findPortalTarget(from: HTMLElement): HTMLElement {
  const seen = new Set<Node>();
  let current: Node | null = from;

  while (current && !seen.has(current)) {
    seen.add(current);

    if (current.nodeType === Node.ELEMENT_NODE && (current as Element).localName === 'dialog') {
      return current as HTMLElement;
    }

    const assigned = current.nodeType === Node.ELEMENT_NODE ? (current as HTMLElement).assignedSlot : null;
    if (assigned) {
      current = assigned;
      continue;
    }

    const parent: Node | null = current.parentNode;
    current = parent instanceof ShadowRoot ? parent.host : parent;
  }

  return from.closest('pds-modal')?.querySelector('dialog') ?? document.body;
}
