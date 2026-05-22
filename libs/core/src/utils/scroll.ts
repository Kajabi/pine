export type RtlScrollType = 'negative' | 'reverse' | 'default';

let cachedRtlScrollType: RtlScrollType | null = null;

/**
 * Detects how this browser reports scrollLeft for RTL overflow containers.
 * @see https://github.com/othree/jquery.rtl-scroll-type
 */
export function getRtlScrollType(): RtlScrollType {
  if (cachedRtlScrollType) {
    return cachedRtlScrollType;
  }

  if (typeof document === 'undefined') {
    cachedRtlScrollType = 'default';
    return cachedRtlScrollType;
  }

  const probe = document.createElement('div');
  probe.style.width = '4px';
  probe.style.height = '1px';
  probe.style.position = 'absolute';
  probe.style.top = '-1000px';
  probe.style.overflow = 'scroll';
  probe.style.direction = 'rtl';

  document.body.appendChild(probe);

  if (probe.scrollLeft > 0) {
    cachedRtlScrollType = 'reverse';
  } else {
    probe.scrollLeft = 1;
    cachedRtlScrollType = probe.scrollLeft === 0 ? 'negative' : 'default';
  }

  document.body.removeChild(probe);
  return cachedRtlScrollType;
}

/** Reset cached RTL scroll type (for tests). */
export function resetRtlScrollTypeCache(): void {
  cachedRtlScrollType = null;
}

/**
 * Distance scrolled from the inline-start edge (LTR: left, RTL: right).
 */
export function getScrollOffsetFromStart(container: HTMLElement): number {
  const { scrollLeft, scrollWidth, clientWidth } = container;
  const maxScroll = Math.max(0, scrollWidth - clientWidth);

  if (maxScroll <= 0) {
    return 0;
  }

  const isRtl = getComputedStyle(container).direction === 'rtl';
  if (!isRtl) {
    return scrollLeft;
  }

  const rtlType = getRtlScrollType();

  switch (rtlType) {
    case 'negative':
      return Math.max(0, -scrollLeft);
    case 'reverse':
      return Math.max(0, maxScroll - scrollLeft);
    case 'default':
    default:
      return scrollLeft;
  }
}

/** True when the container is scrolled away from its inline-start edge. */
export function isScrolledFromInlineStart(container: HTMLElement): boolean {
  return getScrollOffsetFromStart(container) > 0;
}
