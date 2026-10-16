import { autoUpdate, computePosition, flip, hide, offset, shift, size } from '@floating-ui/dom';
import type { VirtualElement } from '@floating-ui/dom';
import type { ChipSentimentType } from '@utils/types';

/**
 * Internal to Pine: the grouped panel behind `pds-combobox`'s `group-display` modes. It owns the
 * group model, hover intent and flyout positioning; the combobox owns rendering and selection,
 * so options keep the indexes its click, hover and keyboard handlers already use.
 */

/** An option in the panel, with its index among the combobox's selectable options. */
export interface PanelOption {
  option: HTMLOptionElement;
  index: number;
}

export interface PanelGroup {
  /** The group's identity: two optgroups may share a label. */
  optgroup: HTMLOptGroupElement;
  label: string;
  /** Pine icon name from the optgroup's `data-icon`, or null. */
  icon: string | null;
  options: PanelOption[];
}

export type PanelEntry = { kind: 'group'; group: PanelGroup } | ({ kind: 'option' } & PanelOption);

/** The optgroup an option sits in, or null for an ungrouped option. */
export function parentOptgroupOf(option: HTMLOptionElement | null | undefined): HTMLOptGroupElement | null {
  const parent = option?.parentElement;
  return parent !== null && parent !== undefined && parent.tagName === 'OPTGROUP' ? (parent as HTMLOptGroupElement) : null;
}

/** A Pine icon name: letters, digits and hyphens, such as `hashtag`. Never a URL or file path. */
const PINE_ICON_NAME = /^[a-z0-9-]+$/i;

/**
 * An optgroup's `data-icon` when it's a Pine icon name, or null. One definition of a usable group
 * icon for every mode, checked here rather than trusting `pds-icon` to reject anything else; it is
 * only ever passed to `pds-icon` as `name`.
 */
export function groupIconOf(optgroup: HTMLOptGroupElement): string | null {
  return iconOf(optgroup);
}

/** An option's `data-icon` when it's a Pine icon name, or null; the same check as a group's. */
export function optionIconOf(option: HTMLOptionElement): string | null {
  return iconOf(option);
}

/** Every `pds-chip` sentiment: a sentiment added to `ChipSentimentType` fails to compile until it's listed. */
const BADGE_SENTIMENTS: Record<ChipSentimentType, true> = {
  accent: true,
  brand: true,
  danger: true,
  info: true,
  neutral: true,
  solid: true,
  subtle: true,
  success: true,
  warning: true,
};

const isBadgeSentiment = (value: string | null): value is ChipSentimentType =>
  value !== null && Object.prototype.hasOwnProperty.call(BADGE_SENTIMENTS, value);

export interface OptionBadge {
  label: string;
  sentiment: ChipSentimentType;
  /** A Pine icon name, or null. */
  icon: string | null;
}

/**
 * An option's badge from its `data-badge*` attributes, or null without a label. An unknown
 * sentiment falls back to `neutral`, and an icon that isn't a Pine icon name is dropped: the
 * badge is a `pds-chip`, whose `icon` also loads URLs.
 */
export function optionBadgeOf(option: HTMLOptionElement): OptionBadge | null {
  const label = option.getAttribute('data-badge')?.trim();
  if (label === undefined || label === '') return null;
  const sentiment = option.getAttribute('data-badge-sentiment');
  const icon = option.getAttribute('data-badge-icon');
  return {
    label,
    sentiment: isBadgeSentiment(sentiment) ? sentiment : 'neutral',
    icon: icon !== null && PINE_ICON_NAME.test(icon) ? icon : null,
  };
}

function iconOf(element: Element): string | null {
  const icon = element.getAttribute('data-icon');
  return icon !== null && PINE_ICON_NAME.test(icon) ? icon : null;
}

/** An option is disabled by its own `disabled` or its optgroup's, as in a native select. */
export function isOptionDisabled(option: HTMLOptionElement | null | undefined): boolean {
  if (option === null || option === undefined) return false;
  return option.hasAttribute('disabled') || parentOptgroupOf(option)?.hasAttribute('disabled') === true;
}

/** A group with no option left to choose. It still opens, so its options can be seen. */
export function isGroupDisabled(group: PanelGroup): boolean {
  return group.options.every(({ option }) => isOptionDisabled(option));
}

/**
 * Groups the combobox's filtered items for the panel: each optgroup becomes one entry holding its
 * options, and ungrouped options stay where they are. Indexes count options in list order, the
 * same as the inline listbox, so `data-option-index` means the same thing in every mode.
 *
 * `position`, when given, orders the entries instead: an ungrouped option or an optgroup it knows
 * goes where it reports, and the rest keep their place after those. Options from the `options` prop
 * use it, so a row the data lists between two groups is drawn between them.
 */
export function buildPanelEntries(items: Element[], position?: (element: Element) => number | undefined): PanelEntry[] {
  const entries: PanelEntry[] = [];
  const groups = new Map<HTMLOptGroupElement, PanelGroup>();
  let index = 0;

  items.forEach(item => {
    if (item.tagName !== 'OPTION') return;
    const option = item as HTMLOptionElement;
    const optgroup = parentOptgroupOf(option);

    if (optgroup !== null) {
      let group = groups.get(optgroup);
      if (!group) {
        group = { optgroup, label: optgroup.label, icon: groupIconOf(optgroup), options: [] };
        groups.set(optgroup, group);
        entries.push({ kind: 'group', group });
      }
      group.options.push({ option, index: index++ });
    } else {
      entries.push({ kind: 'option', option, index: index++ });
    }
  });

  if (position === undefined) return entries;
  const at = (entry: PanelEntry) => position(entry.kind === 'group' ? entry.group.optgroup : entry.option) ?? Infinity;
  // Array.prototype.sort is stable, so entries with no position keep their order.
  return entries.sort((a, b) => {
    const [first, second] = [at(a), at(b)];
    return first === second ? 0 : first < second ? -1 : 1;
  });
}

/** The label of the optgroup an option sits in, or null for an ungrouped option. */
export function groupLabelOf(option: HTMLOptionElement | null | undefined): string | null {
  return parentOptgroupOf(option)?.label ?? null;
}

/** Where the keyboard is in the grouped panel: a group's row, or an option by its index. */
export type PanelItem = HTMLOptGroupElement | number;

/**
 * The items Up and Down move through from `current`, one tree level at a time: the panel's rows
 * (groups and ungrouped options), or the open group's options. Drilled into a group, its row
 * (drawn as the row back) comes first, above its options, as a tree draws a parent above its children.
 * Disabled options and groups stay in it, as the APG listbox and tree patterns advise, so they're
 * announced as unavailable rather than hidden from the keyboard.
 */
export function panelColumn(
  entries: PanelEntry[],
  openGroup: HTMLOptGroupElement | null,
  current: PanelItem | null,
  drilledIn: boolean,
): PanelItem[] {
  const open = openGroup === null ? undefined : findGroup(entries, openGroup);
  if (open !== undefined) {
    const options = open.options.map(({ index }) => index);
    if (drilledIn) return [open.optgroup, ...options];
    if (typeof current === 'number' && options.includes(current)) return options;
  }
  return entries.map(entry => (entry.kind === 'group' ? entry.group.optgroup : entry.index));
}

/** The panel's group for an optgroup, if it's showing. */
export function findGroup(entries: PanelEntry[], optgroup: HTMLOptGroupElement): PanelGroup | undefined {
  for (const entry of entries) {
    if (entry.kind === 'group' && entry.group.optgroup === optgroup) return entry.group;
  }
  return undefined;
}

/** Moving from one group row to another waits this long, so a diagonal trip into the flyout doesn't switch groups. */
const SWITCH_DELAY_MS = 120;
/** Leaving a group (into the gap beside its flyout, say) waits this long before closing it. */
const CLOSE_DELAY_MS = 200;
/** Space between the panel's edge and the flyout: --pine-dimension-050 (4px), per the Figma frames. */
const FLYOUT_GAP_PX = 4;
/** How close the flyout may come to the viewport edge: --pine-dimension-100 (8px). */
const VIEWPORT_PADDING_PX = 8;
/** A flyout never shrinks below roughly three rows, even when little space is left. */
const MIN_FLYOUT_HEIGHT_PX = 120;

/**
 * Opens and closes a group's flyout with hover intent, and keeps the open flyout positioned beside
 * its group row. The flyout renders inside the row, so moving the pointer into it never leaves
 * the row; the delays cover the gap between panel and flyout and diagonal moves across rows.
 */
/**
 * Scrolls `el` into view inside `container` only. A flyout option needs this: the flyout is `fixed`
 * beside the panel but sits inside it in the DOM, so `scrollIntoView` would also scroll the panel
 * and the page, moving the flyout's row out from under it.
 */
export function scrollIntoViewWithin(container: HTMLElement, el: HTMLElement) {
  const bounds = container.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  if (rect.top < bounds.top) {
    container.scrollTop -= bounds.top - rect.top;
  } else if (rect.bottom > bounds.bottom) {
    container.scrollTop += rect.bottom - bounds.bottom;
  }
}

export class FlyoutController<T> {
  private switchTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;
  private stopAutoUpdate?: () => void;
  private positionedFlyout?: HTMLElement;
  /** An option to scroll into view once the flyout is placed and its height capped. */
  private pendingReveal?: HTMLElement;

  constructor(
    private readonly getOpenGroup: () => T | null,
    private readonly setOpenGroup: (group: T | null) => void,
  ) {}

  /** Pointer entered a group row (or its flyout, which sits inside it). */
  enter(label: T) {
    this.clearClose();
    const open = this.getOpenGroup();
    if (open === label) {
      this.clearSwitch();
      return;
    }
    if (open === null) {
      this.setOpenGroup(label);
      return;
    }
    this.clearSwitch();
    this.switchTimer = setTimeout(() => {
      this.switchTimer = undefined;
      this.setOpenGroup(label);
    }, SWITCH_DELAY_MS);
  }

  /** Pointer left a group row and its flyout. */
  leave(label: T) {
    this.clearSwitch();
    if (this.getOpenGroup() !== label) return;
    this.clearClose();
    this.closeTimer = setTimeout(() => {
      this.closeTimer = undefined;
      if (this.getOpenGroup() === label) this.setOpenGroup(null);
    }, CLOSE_DELAY_MS);
  }

  /**
   * A click or tap on a group row opens it. It never closes it: on desktop the hover that preceded
   * the click has already opened it, and touch browsers fire an emulated mouseenter and then click
   * in the same tap. Closing happens on leaving the row or closing the panel.
   */
  open(label: T) {
    this.clearTimers();
    this.setOpenGroup(label);
  }

  /**
   * Keeps `flyout` beside `row`: horizontally against the panel's edge, vertically so its first
   * option lines up with the row. `fixed` positioning so the panel's scrolling can't clip it,
   * including when the panel is portaled into a dialog.
   */
  position(row: HTMLElement, panel: HTMLElement, flyout: HTMLElement) {
    if (this.positionedFlyout === flyout && this.stopAutoUpdate) return;
    this.stopPositioning();
    this.positionedFlyout = flyout;

    const reference: VirtualElement = {
      getBoundingClientRect: () => {
        const panelRect = panel.getBoundingClientRect();
        const rowRect = row.getBoundingClientRect();
        return {
          x: panelRect.x,
          y: rowRect.y,
          left: panelRect.left,
          right: panelRect.right,
          top: rowRect.top,
          bottom: rowRect.bottom,
          width: panelRect.width,
          height: rowRect.height,
        } as DOMRect;
      },
      contextElement: row,
    };
    // The flyout's own top padding, so its first option, not its edge, lines up with the row.
    const flyoutPaddingTop = parseFloat(getComputedStyle(flyout).paddingTop) || 0;

    const update = () =>
      computePosition(reference, flyout, {
        placement: 'right-start',
        strategy: 'fixed',
        middleware: [
          offset({ mainAxis: FLYOUT_GAP_PX, crossAxis: -flyoutPaddingTop }),
          flip({ fallbackPlacements: ['left-start'] }),
          shift({ padding: VIEWPORT_PADDING_PX }),
          // A long group scrolls inside the flyout instead of running off the viewport.
          size({
            padding: VIEWPORT_PADDING_PX,
            apply({ availableHeight }) {
              flyout.style.maxHeight = `${Math.max(availableHeight, MIN_FLYOUT_HEIGHT_PX)}px`;
            },
          }),
          // Hidden with its row when the panel scrolls the row out of view.
          hide({ strategy: 'referenceHidden' }),
        ],
      }).then(({ x, y, middlewareData }) => {
        // It starts hidden (see the stylesheet) so it never flashes in the row before it's placed.
        Object.assign(flyout.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
          visibility: middlewareData.hide?.referenceHidden === true ? 'hidden' : 'visible',
        });
        const reveal = this.pendingReveal;
        this.pendingReveal = undefined;
        if (reveal !== undefined && flyout.contains(reveal)) scrollIntoViewWithin(flyout, reveal);
      });

    this.stopAutoUpdate = autoUpdate(reference, flyout, () => {
      void update();
    });
  }

  /**
   * Scrolls `option` into view inside its flyout. Before the flyout's first placement its height
   * isn't capped yet, so the option looks visible; it's revealed again once the placement lands.
   */
  reveal(flyout: HTMLElement, option: HTMLElement) {
    scrollIntoViewWithin(flyout, option);
    if (flyout.style.maxHeight === '') this.pendingReveal = option;
  }

  stopPositioning() {
    this.stopAutoUpdate?.();
    this.stopAutoUpdate = undefined;
    this.positionedFlyout = undefined;
    this.pendingReveal = undefined;
  }

  /** The panel closed or the component left the page. */
  reset() {
    this.clearTimers();
    this.stopPositioning();
  }

  private clearTimers() {
    this.clearSwitch();
    this.clearClose();
  }

  private clearSwitch() {
    if (this.switchTimer !== undefined) clearTimeout(this.switchTimer);
    this.switchTimer = undefined;
  }

  private clearClose() {
    if (this.closeTimer !== undefined) clearTimeout(this.closeTimer);
    this.closeTimer = undefined;
  }
}
