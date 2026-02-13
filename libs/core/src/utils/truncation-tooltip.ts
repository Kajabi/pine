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
 */
function injectStyles(): void {
  if (document.querySelector('[data-pds-truncation-tooltip]')) return;

  const style = document.createElement('style');
  style.setAttribute('data-pds-truncation-tooltip', '');
  style.textContent = `
    .${TOOLTIP_CLASS} {
      pointer-events: none;
      position: fixed;
      z-index: var(--pine-z-index-nuclear, 9999);
    }
    .${TOOLTIP_CLASS}__content {
      background-color: var(--pine-color-primary, #1a1a2e);
      border-radius: calc(var(--pine-dimension-xs, 4px) * 1.25);
      box-shadow: var(--pine-box-shadow, 0 2px 8px rgba(0,0,0,0.15));
      color: var(--pine-color-text-primary, #fff);
      font-family: var(--pine-font-family-body, sans-serif);
      font-size: var(--pine-font-size-body-sm, 0.875rem);
      letter-spacing: var(--pine-letter-spacing, normal);
      line-height: var(--pine-line-height-body, 1.5);
      max-width: 320px;
      opacity: 0;
      padding: var(--pine-dimension-xs, 4px) calc(var(--pine-dimension-md, 12px) / 2);
      transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
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
  let isFocused = false;
  let resizeObserver: ResizeObserver | null = null;

  // Use ResizeObserver to re-evaluate overflow when the element resizes
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      // If tooltip is showing but text no longer overflows, hide it
      if (portalEl && !isOverflowing(contentEl)) {
        hideTooltip();
      }
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
        middleware: [offset(8), flip(), shift({ padding: 5 })],
      });

      Object.assign(portalEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    } catch {
      // Fallback: position above the element
      if (portalEl) {
        const rect = hostEl.getBoundingClientRect();
        portalEl.style.left = `${rect.left}px`;
        portalEl.style.top = `${rect.top - 8}px`;
      }
    }
  }

  function removePortal(): void {
    if (portalEl) {
      portalEl.classList.remove(`${TOOLTIP_CLASS}--visible`);
      if (portalEl.parentNode) {
        portalEl.parentNode.removeChild(portalEl);
      }
      portalEl = null;
    }
  }

  function showTooltip(): void {
    if (!isOverflowing(contentEl)) return;
    createPortal();
  }

  function hideTooltip(): void {
    if (isHovering || isFocused) return;
    removePortal();
  }

  function handleMouseEnter(): void {
    isHovering = true;
    showTooltip();
  }

  function handleMouseLeave(): void {
    isHovering = false;
    hideTooltip();
  }

  function handleFocusIn(): void {
    isFocused = true;
    showTooltip();
  }

  function handleFocusOut(): void {
    isFocused = false;
    hideTooltip();
  }

  hostEl.addEventListener('mouseenter', handleMouseEnter);
  hostEl.addEventListener('mouseleave', handleMouseLeave);
  hostEl.addEventListener('focusin', handleFocusIn);
  hostEl.addEventListener('focusout', handleFocusOut);

  // Return cleanup function
  return () => {
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
