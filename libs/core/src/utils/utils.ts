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
export const normalizeColorValue = (
  value: string | undefined,
  options?: { semanticMap?: Record<string, string> }
): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();

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
  if (!color) return;

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

  const semanticMap = customColors || defaultColors;

  // Use the shared normalizer so components accept semantic names, raw tokens, var(...), or literals
  const resolved = normalizeColorValue(color, { semanticMap });

  return {
    '--color': resolved
  };
}
