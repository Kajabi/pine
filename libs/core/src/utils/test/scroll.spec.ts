import {
  getRtlScrollOffsetFromStart,
  getRtlScrollType,
  getScrollOffsetFromStart,
  isScrolledFromInlineStart,
  resetRtlScrollTypeCache,
} from '../scroll';

describe('scroll utilities', () => {
  afterEach(() => {
    resetRtlScrollTypeCache();
  });

  it('returns 0 when there is no overflow', () => {
    const container = document.createElement('div');
    Object.defineProperty(container, 'scrollWidth', { value: 100, configurable: true });
    Object.defineProperty(container, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(container, 'scrollLeft', { value: 0, writable: true, configurable: true });

    expect(getScrollOffsetFromStart(container)).toBe(0);
    expect(isScrolledFromInlineStart(container)).toBe(false);
  });

  it('uses scrollLeft for LTR containers', () => {
    const container = document.createElement('div');
    container.style.direction = 'ltr';
    document.body.appendChild(container);

    Object.defineProperty(container, 'scrollWidth', { value: 200, configurable: true });
    Object.defineProperty(container, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(container, 'scrollLeft', { value: 25, writable: true, configurable: true });

    expect(getScrollOffsetFromStart(container)).toBe(25);
    expect(isScrolledFromInlineStart(container)).toBe(true);

    document.body.removeChild(container);
  });

  describe('getRtlScrollOffsetFromStart', () => {
    const maxScroll = 100;

    it('default (Blink): rest at scrollLeft=max, offset 0', () => {
      expect(getRtlScrollOffsetFromStart(100, maxScroll, 'default')).toBe(0);
      expect(getRtlScrollOffsetFromStart(75, maxScroll, 'default')).toBe(25);
      expect(getRtlScrollOffsetFromStart(0, maxScroll, 'default')).toBe(100);
    });

    it('reverse (legacy IE/Edge): rest at scrollLeft=0, offset 0', () => {
      expect(getRtlScrollOffsetFromStart(0, maxScroll, 'reverse')).toBe(0);
      expect(getRtlScrollOffsetFromStart(25, maxScroll, 'reverse')).toBe(25);
      expect(getRtlScrollOffsetFromStart(100, maxScroll, 'reverse')).toBe(100);
    });

    it('negative (Firefox): rest at scrollLeft=0, offset increases when negative', () => {
      expect(getRtlScrollOffsetFromStart(0, maxScroll, 'negative')).toBe(0);
      expect(getRtlScrollOffsetFromStart(-25, maxScroll, 'negative')).toBe(25);
      expect(getRtlScrollOffsetFromStart(-100, maxScroll, 'negative')).toBe(100);
    });
  });

  it('detects RTL scroll type with scrollable probe content', () => {
    resetRtlScrollTypeCache();
    const type = getRtlScrollType();
    expect(['negative', 'reverse', 'default']).toContain(type);
  });
});
