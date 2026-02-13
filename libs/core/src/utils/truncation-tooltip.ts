import { PlacementType } from './types';
import {
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

export interface TruncationTooltipOptions {
  /** The host element (for hover/focus listeners and positioning anchor) */
  hostEl: HTMLElement;
  /** The inner element where overflow actually occurs (inside shadow root) */
  contentEl: HTMLElement;
  /** Function that returns the full text to display in the tooltip */
  getTooltipText: () => string;
  /** Tooltip placement preference (default: 'top') */
  placement?: PlacementType;
}

/** CSS class prefix used for truncation tooltip portal elements */
const TOOLTIP_CLASS = 'pds-truncation-tooltip';

/**
 * Injects the truncation tooltip styles into the document head.
 * Uses the same design tokens as pds-tooltip for visual consistency.
 * Only injects once — checks the DOM to avoid duplicates.
 *
 * Z-Index Strategy:
 * Uses --pine-z-index-nuclear (9999) to ensure tooltips appear above all other UI elements.
 * This is necessary because tooltips are portaled to document.body and must overlay:
 * - Modal dialogs
 * - Dropdown menus
 * - Other floating UI elements
 * If you encounter z-index conflicts, ensure your overlays use Pine's z-index tokens
 * or adjust --pine-z-index-nuclear in your theme.
 */
function injectStyles(): void {
  if (document.querySelector('[data-pds-truncation-tooltip]')) return;

  const style = document.createElement('style');
  style.setAttribute('data-pds-truncation-tooltip', '');
  style.textContent = `
    .${TOOLTIP_CLASS} {
      position: fixed;
      z-index: var(--pine-z-index-nuclear, 9999);
    }
    .${TOOLTIP_CLASS}__content {
      background-color: var(--pine-color-primary, #1a1a2e);
      border-radius: calc(var(--pine-dimension-xs, 4px) * 1.25);
      box-shadow: var(--pine-box-shadow, 0 2px 8px rgba(0,0,0,0.15));
      color: var(--pine-color-text-primary, #fff);
      cursor: text;
      font-family: var(--pine-font-family-body, sans-serif);
      font-size: var(--pine-font-size-body-sm, 0.875rem);
      letter-spacing: var(--pine-letter-spacing, normal);
      line-height: var(--pine-line-height-body, 1.5);
      max-width: 320px;
      opacity: 0;
      padding: var(--pine-dimension-xs, 4px) calc(var(--pine-dimension-md, 12px) / 2);
      transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
      user-select: text;
      visibility: hidden;
      width: max-content;
      word-break: break-word;
    }
    .${TOOLTIP_CLASS}--visible .${TOOLTIP_CLASS}__content {
      opacity: 1;
      visibility: visible;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Checks if an element's content is overflowing horizontally (i.e. text is truncated).
 */
function isOverflowing(el: HTMLElement): boolean {
  return el.scrollWidth > el.clientWidth;
}

/**
 * Sets up automatic tooltip behavior for a truncated element.
 *
 * When the element's text overflows, hovering or focusing the host element
 * will display a tooltip showing the full text content. The tooltip is
 * rendered as a portal on document.body and positioned with Floating UI.
 *
 * @returns A cleanup function that removes all listeners, observers, and DOM elements.
 */
export function setupTruncationTooltip(options: TruncationTooltipOptions): () => void {
  const { hostEl, contentEl, getTooltipText, placement = 'top' } = options;

  injectStyles();

  let portalEl: HTMLElement | null = null;
  let isHovering = false;
  let isHoveringPortal = false;
  let isFocused = false;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let resizeDebounce: ReturnType<typeof setTimeout> | null = null;

  // Use ResizeObserver to re-evaluate overflow when the element resizes
  // Debounced to prevent performance issues during rapid window resizing
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (resizeDebounce) {
        clearTimeout(resizeDebounce);
      }
      resizeDebounce = setTimeout(() => {
        resizeDebounce = null;
        // If tooltip is showing but text no longer overflows, hide it
        if (portalEl && portalEl.isConnected && !isOverflowing(contentEl)) {
          hideTooltip();
        }
      }, 100);
    });
    resizeObserver.observe(contentEl);
  }

  function createPortal(): void {
    if (portalEl) return;

    const text = getTooltipText();
    if (!text || text.trim() === '') return;

    portalEl = document.createElement('div');
    portalEl.className = TOOLTIP_CLASS;
    portalEl.setAttribute('role', 'tooltip');
    portalEl.setAttribute('aria-hidden', 'false');

    const contentDiv = document.createElement('div');
    contentDiv.className = `${TOOLTIP_CLASS}__content`;
    contentDiv.textContent = text.trim();

    portalEl.appendChild(contentDiv);
    document.body.appendChild(portalEl);

    // Allow the user to hover into the tooltip to select/copy text
    portalEl.addEventListener('mouseenter', handlePortalMouseEnter);
    portalEl.addEventListener('mouseleave', handlePortalMouseLeave);

    positionTooltip().then(() => {
      if (portalEl) {
        portalEl.classList.add(`${TOOLTIP_CLASS}--visible`);
      }
    });
  }

  async function positionTooltip(): Promise<void> {
    if (!portalEl) return;

    try {
      const { x, y } = await computePosition(hostEl, portalEl, {
        placement,
        strategy: 'fixed',
        middleware: [offset(4), flip(), shift({ padding: 5 })],
      });

      Object.assign(portalEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    } catch {
      // Fallback: position above the element with bounds checking
      if (portalEl) {
        const rect = hostEl.getBoundingClientRect();
        const portalRect = portalEl.getBoundingClientRect();
        const padding = 5;

        // Ensure tooltip stays within viewport bounds
        const left = Math.max(padding, Math.min(rect.left, window.innerWidth - portalRect.width - padding));
        const top = Math.max(padding, rect.top - portalRect.height - 8);

        portalEl.style.left = `${left}px`;
        portalEl.style.top = `${top}px`;
      }
    }
  }

  function removePortal(): void {
    if (portalEl) {
      portalEl.removeEventListener('mouseenter', handlePortalMouseEnter);
      portalEl.removeEventListener('mouseleave', handlePortalMouseLeave);
      portalEl.classList.remove(`${TOOLTIP_CLASS}--visible`);
      // Check if portal is still in the DOM before removing
      if (portalEl.parentNode && portalEl.isConnected) {
        try {
          portalEl.parentNode.removeChild(portalEl);
        } catch (e) {
          // Portal was already removed, ignore error
        }
      }
      portalEl = null;
    }
  }

  function cancelHideTimeout(): void {
    if (hideTimeout !== null) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }

  function showTooltip(): void {
    cancelHideTimeout();
    if (!isOverflowing(contentEl)) return;
    createPortal();
  }

  function hideTooltip(): void {
    if (isHovering || isHoveringPortal || isFocused) return;
    removePortal();
  }

  /**
   * Schedules tooltip removal after a short delay.
   *
   * The 100ms delay serves two purposes:
   * 1. Gives users time to move their cursor from the truncated text to the tooltip portal
   *    without it closing, enabling text selection/copying from the tooltip
   * 2. Prevents flickering when the user briefly moves the cursor during normal interaction
   */
  function scheduleHide(): void {
    cancelHideTimeout();
    hideTimeout = setTimeout(() => {
      hideTimeout = null;
      hideTooltip();
    }, 100);
  }

  function handleMouseEnter(): void {
    isHovering = true;
    showTooltip();
  }

  function handleMouseLeave(): void {
    isHovering = false;
    scheduleHide();
  }

  function handlePortalMouseEnter(): void {
    isHoveringPortal = true;
    cancelHideTimeout();
  }

  function handlePortalMouseLeave(): void {
    isHoveringPortal = false;
    scheduleHide();
  }

  function handleFocusIn(): void {
    isFocused = true;
    showTooltip();
  }

  function handleFocusOut(): void {
    isFocused = false;
    scheduleHide();
  }

  hostEl.addEventListener('mouseenter', handleMouseEnter);
  hostEl.addEventListener('mouseleave', handleMouseLeave);
  hostEl.addEventListener('focusin', handleFocusIn);
  hostEl.addEventListener('focusout', handleFocusOut);

  // Return cleanup function
  return () => {
    cancelHideTimeout();
    if (resizeDebounce) {
      clearTimeout(resizeDebounce);
      resizeDebounce = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    hostEl.removeEventListener('mouseenter', handleMouseEnter);
    hostEl.removeEventListener('mouseleave', handleMouseLeave);
    hostEl.removeEventListener('focusin', handleFocusIn);
    hostEl.removeEventListener('focusout', handleFocusOut);
    removePortal();
  };
}
