import {
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
});
