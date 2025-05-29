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

  const colors = customColors || defaultColors;

  return {
    '--color': colors[color] ?? (color.startsWith('--') ? `var(${color})` : color)
  };
}
