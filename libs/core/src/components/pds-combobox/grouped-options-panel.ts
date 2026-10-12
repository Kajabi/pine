import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import type { VirtualElement } from '@floating-ui/dom';

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
  label: string;
  /** Pine icon name from the optgroup's `data-icon`, or null. */
  icon: string | null;
  options: PanelOption[];
}

export type PanelEntry = { kind: 'group'; group: PanelGroup } | ({ kind: 'option' } & PanelOption);

/**
 * Groups the combobox's filtered items for the panel: each optgroup becomes one entry holding its
 * options, and ungrouped options stay where they are. Indexes count options in list order, the
 * same as the inline listbox, so `data-option-index` means the same thing in every mode.
 */
export function buildPanelEntries(items: Element[]): PanelEntry[] {
  const entries: PanelEntry[] = [];
  const groups = new Map<HTMLOptGroupElement, PanelGroup>();
  let index = 0;

  items.forEach(item => {
    if (item.tagName !== 'OPTION') return;
    const option = item as HTMLOptionElement;
    const parent = option.parentElement;

    if (parent !== null && parent.tagName === 'OPTGROUP') {
      const optgroup = parent as HTMLOptGroupElement;
      let group = groups.get(optgroup);
      if (!group) {
        const icon = optgroup.getAttribute('data-icon');
        group = { label: optgroup.label, icon: icon !== null && icon !== '' ? icon : null, options: [] };
        groups.set(optgroup, group);
        entries.push({ kind: 'group', group });
      }
      group.options.push({ option, index: index++ });
    } else {
      entries.push({ kind: 'option', option, index: index++ });
    }
  });

  return entries;
}

/** The label of the optgroup an option sits in, or null for an ungrouped option. */
export function groupLabelOf(option: HTMLOptionElement | null | undefined): string | null {
  const parent = option?.parentElement;
  return parent !== null && parent !== undefined && parent.tagName === 'OPTGROUP'
    ? (parent as HTMLOptGroupElement).label
    : null;
}

/** Moving from one group row to another waits this long, so a diagonal trip into the flyout doesn't switch groups. */
const SWITCH_DELAY_MS = 120;
/** Leaving a group (into the gap beside its flyout, say) waits this long before closing it. */
const CLOSE_DELAY_MS = 200;
/** Space between the panel's edge and the flyout. */
const FLYOUT_GAP_PX = 4;

/**
 * Opens and closes a group's flyout with hover intent, and keeps the open flyout positioned beside
 * its group row. The flyout renders inside the row, so moving the pointer into it never leaves
 * the row; the delays cover the gap between panel and flyout and diagonal moves across rows.
 */
export class FlyoutController {
  private switchTimer?: ReturnType<typeof setTimeout>;
  private closeTimer?: ReturnType<typeof setTimeout>;
  private stopAutoUpdate?: () => void;
  private positionedFlyout?: HTMLElement;

  constructor(
    private readonly getOpenGroup: () => string | null,
    private readonly setOpenGroup: (label: string | null) => void,
  ) {}

  /** Pointer entered a group row (or its flyout, which sits inside it). */
  enter(label: string) {
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
  leave(label: string) {
    this.clearSwitch();
    if (this.getOpenGroup() !== label) return;
    this.clearClose();
    this.closeTimer = setTimeout(() => {
      this.closeTimer = undefined;
      if (this.getOpenGroup() === label) this.setOpenGroup(null);
    }, CLOSE_DELAY_MS);
  }

  /** A click or tap on a group row: open it, or close it if it's already open. */
  toggle(label: string) {
    this.clearTimers();
    this.setOpenGroup(this.getOpenGroup() === label ? null : label);
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
          shift({ padding: 8 }),
        ],
      }).then(({ x, y }) => {
        Object.assign(flyout.style, { position: 'fixed', left: `${x}px`, top: `${y}px` });
      });

    this.stopAutoUpdate = autoUpdate(reference, flyout, () => {
      void update();
    });
  }

  stopPositioning() {
    this.stopAutoUpdate?.();
    this.stopAutoUpdate = undefined;
    this.positionedFlyout = undefined;
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
