import type { EventEmitter } from "@stencil/core";

export const hasShadowDom = (el: HTMLElement) => {
  return !!el.shadowRoot && !!(el as any).attachShadow
}

export const debounceEvent = (event: EventEmitter, wait: number): EventEmitter => {
  const original = (event as any)._original || event;
  return {
    _original: event,
    emit: debounce(original.emit.bind(original), wait),
  } as EventEmitter;
};

export const debounce = (func: (...args: any[]) => void, wait = 0) => {
  let timer: any;
  return (...args: any[]): any => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
};

// Add shared color normalization utility to unify token handling across components
/**
 * Normalizes color values to ensure consistent CSS variable usage
 * @param value - Raw token (--token), CSS variable (var(--token)), semantic name, or literal color
 * @param options.semanticMap - Optional mapping of semantic names to CSS variables
 * @returns Normalized color value or undefined for invalid inputs
 */
export const normalizeColorValue = (
  value: string | undefined,
  options?: { semanticMap?: Record<string, string> }
): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  // Treat whitespace-only as undefined to avoid invalid CSS values
  if (trimmed === '') return undefined;

  // If a semantic map is provided and the value matches a key, return mapped CSS var
  if (options?.semanticMap && options.semanticMap[trimmed]) {
    return options.semanticMap[trimmed];
  }

  // If already a CSS var, pass through
  if (trimmed.startsWith('var(')) return trimmed;

  // If raw token is provided (e.g., --pine-color-foo), wrap in var(...)
  if (trimmed.startsWith('--')) return `var(${trimmed})`;

  // Otherwise treat as literal CSS color value
  return trimmed;
};

export const setColor = (color: string, customColors?: Record<string, string>) => {
  // Return an empty object for empty/whitespace/undefined inputs to avoid invalid CSS styles
  if (!color) return {} as Record<string, string>;

  const defaultColors: Record<string, string> = {
    primary: 'var(--pine-color-text-primary)',
    secondary: 'var(--pine-color-text-secondary)',
    neutral: 'var(--pine-color-text-neutral)',
    accent: 'var(--pine-color-text-accent)',
    danger: 'var(--pine-color-text-danger)',
    info: 'var(--pine-color-text-info)',
    success: 'var(--pine-color-text-success)',
    warning: 'var(--pine-color-text-warning)',
  };

  // Merge defaults with any custom overrides so defaults are preserved
  const semanticMap = { ...defaultColors, ...(customColors || {}) };

  // Use the shared normalizer so components accept semantic names, raw tokens, var(...), or literals
  const resolved = normalizeColorValue(color, { semanticMap });

  // Ensure we never return an undefined style value; if unresolved, omit the property
  if (!resolved) return {} as Record<string, string>;

  return {
    '--color': resolved
  };
}
