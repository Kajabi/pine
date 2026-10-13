import { closest } from '@utils/closest';

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
  private locale?: string;

  constructor(private readonly datepicker: HTMLElement) {
    this.host = document.createElement('div');
    this.host.className = CalendarPortal.className;
    // The shared stylesheet's `:host` rules match this div too; keep it out of layout, so it never
    // adds a line to the page, while it still passes `dir`, `lang` and the theme down.
    this.host.style.display = 'contents';
    this.root = this.host.attachShadow({ mode: 'open' });
  }

  /**
   * Moves the calendar into the portal, mounting the portal first. Context is copied when the portal
   * is attached or the locale changes, not on every render while it's open (in range mode, every
   * hovered day). A theme set on an ancestor while the calendar is open applies when it next opens.
   */
  mount(calendar: HTMLElement, locale: string) {
    if (!this.host.isConnected) {
      findPortalTarget(this.datepicker).appendChild(this.host);
      this.copyContext(locale);
    } else if (locale !== this.locale) {
      this.copyContext(locale);
    }
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
   * reading direction and language, a theme set on an ancestor, and size overrides.
   */
  private copyContext(locale: string) {
    this.locale = locale;
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
    // So assistive tech reads the month and day names in the calendar's own language.
    this.host.lang = locale;
    for (const property of ['--pds-datepicker-day-size', '--pds-datepicker-presets-width']) {
      const value = computed.getPropertyValue(property).trim();
      if (value) this.host.style.setProperty(property, value);
    }

    // Across shadow boundaries: a theme set above an enclosing component still applies.
    const theme = (closest('[data-theme]', this.datepicker) || null)?.getAttribute('data-theme');
    if (theme) {
      this.host.setAttribute('data-theme', theme);
    } else {
      this.host.removeAttribute('data-theme');
    }
  }
}

/**
 * The native `<dialog>` or open `popover` (as pds-filter's) the datepicker sits in, so the
 * calendar shares its top layer and a click in it isn't outside it; otherwise `document.body`.
 * `closest()` stops at shadow boundaries and misses one that only wraps slotted content, so this
 * walks assigned slots and shadow hosts, as pds-combobox does.
 */
export function findPortalTarget(from: HTMLElement): HTMLElement {
  const seen = new Set<Node>();
  let current: Node | null = from;

  while (current && !seen.has(current)) {
    seen.add(current);

    if (current.nodeType === Node.ELEMENT_NODE && isTopLayerHost(current as Element)) {
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

  return document.body;
}

function isTopLayerHost(el: Element): boolean {
  if (el.localName === 'dialog') return true;
  if (!el.hasAttribute('popover')) return false;
  try {
    return el.matches(':popover-open');
  } catch {
    // A browser without the Popover API: no top layer to share.
    return false;
  }
}
