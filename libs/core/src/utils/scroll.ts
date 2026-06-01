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
  probe.style.width = '100px';
  probe.style.height = '100px';
  probe.style.position = 'absolute';
  probe.style.top = '-1000px';
  probe.style.overflow = 'scroll';
  probe.style.direction = 'rtl';

  const inner = document.createElement('div');
  inner.style.width = '200px';
  inner.style.height = '100px';
  probe.appendChild(inner);

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

/** True when the element's used text direction is RTL (inherits from ancestors). */
export function isRtlDirection(element: Element): boolean {
  return getComputedStyle(element).direction === 'rtl';
}

/**
 * RTL scroll offset from inline-start for a known browser scrollLeft model.
 * @see https://github.com/othree/jquery.rtl-scroll-type#3-types-of-scrollleft-scrollwidth--100
 */
export function getRtlScrollOffsetFromStart(
  scrollLeft: number,
  maxScroll: number,
  rtlType: RtlScrollType,
): number {
  switch (rtlType) {
    case 'negative':
      return Math.max(0, -scrollLeft);
    case 'reverse':
      return Math.max(0, scrollLeft);
    case 'default':
    default:
      return Math.max(0, maxScroll - scrollLeft);
  }
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

  const isRtl = isRtlDirection(container);
  if (!isRtl) {
    return scrollLeft;
  }

  return getRtlScrollOffsetFromStart(scrollLeft, maxScroll, getRtlScrollType());
}

/** True when the container is scrolled away from its inline-start edge. */
export function isScrolledFromInlineStart(container: HTMLElement): boolean {
  return getScrollOffsetFromStart(container) > 0;
}
