import { setupTruncationTooltip } from '../truncation-tooltip';

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;
  static instances: MockResizeObserver[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();

  // Helper to trigger a resize
  trigger() {
    this.callback([] as any, this as any);
  }
}

// Small helper to advance past the hide delay (100ms)
function advanceHideDelay() {
  jest.advanceTimersByTime(150);
}

// The spec DOM can't evaluate :focus-visible, so each focus states whether it came from the keyboard.
function focusIn(target: HTMLElement, { visible = true } = {}) {
  jest.spyOn(target, 'matches').mockImplementation((selector) => visible && selector === ':focus-visible');
  target.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
}

describe('truncation-tooltip', () => {
  let hostEl: HTMLElement;
  let contentEl: HTMLElement;
  let originalResizeObserver: typeof ResizeObserver;

  beforeAll(() => {
    originalResizeObserver = (globalThis as any).ResizeObserver;
    (globalThis as any).ResizeObserver = MockResizeObserver;
  });

  afterAll(() => {
    (globalThis as any).ResizeObserver = originalResizeObserver;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    MockResizeObserver.instances = [];

    hostEl = document.createElement('div');
    contentEl = document.createElement('div');
    document.body.appendChild(hostEl);
    hostEl.appendChild(contentEl);

    // Default: no overflow
    Object.defineProperty(contentEl, 'scrollWidth', { value: 100, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 200, configurable: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    // Remove injected style elements
    document.querySelectorAll('[data-pds-truncation-tooltip]').forEach((el) => { el.remove(); });
  });

  it('returns a cleanup function', () => {
    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Test text',
    });

    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('observes the content element with ResizeObserver', () => {
    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Test text',
    });

    expect(MockResizeObserver.instances.length).toBeGreaterThan(0);
    const observer = MockResizeObserver.instances[MockResizeObserver.instances.length - 1];
    expect(observer.observe).toHaveBeenCalledWith(contentEl);

    cleanup();
  });

  it('injects styles into the document head', () => {
    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Test text',
    });

    const styleEl = document.querySelector('[data-pds-truncation-tooltip]');
    expect(styleEl).not.toBeNull();
    expect(styleEl?.textContent).toContain('pds-truncation-tooltip');

    cleanup();
  });

  it('does not create a tooltip portal when text is not overflowing on hover', () => {
    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Test text',
    });

    // scrollWidth (100) < clientWidth (200) => not overflowing
    hostEl.dispatchEvent(new MouseEvent('mouseenter'));

    const portal = document.querySelector('.pds-truncation-tooltip');
    expect(portal).toBeNull();

    cleanup();
  });

  it('creates a tooltip portal when text is overflowing on hover', async () => {
    // Make content overflow
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text content here',
    });

    hostEl.dispatchEvent(new MouseEvent('mouseenter'));

    const portal = document.querySelector('.pds-truncation-tooltip');
    expect(portal).not.toBeNull();
    expect(portal?.getAttribute('role')).toBe('tooltip');
    expect(portal?.textContent).toContain('Full text content here');

    cleanup();
  });

  it('removes tooltip portal on mouseleave after delay', async () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    hostEl.dispatchEvent(new MouseEvent('mouseleave'));

    // Tooltip stays briefly to allow moving cursor to it
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    // After delay, tooltip is removed
    advanceHideDelay();
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

    cleanup();
  });

  it('creates tooltip on keyboard focus when overflowing', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    focusIn(contentEl);

    const portal = document.querySelector('.pds-truncation-tooltip');
    expect(portal).not.toBeNull();

    cleanup();
  });

  it('does not create tooltip on focus that is not :focus-visible, such as from a click', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    focusIn(contentEl, { visible: false });

    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

    cleanup();
  });

  it('treats focus as visible in an engine without :focus-visible', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    jest.spyOn(contentEl, 'matches').mockImplementation(() => {
      throw new DOMException("':focus-visible' is not a valid selector", 'SyntaxError');
    });
    contentEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    cleanup();
  });

  it('hides after the pointer leaves when focus came from a click', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    focusIn(contentEl, { visible: false });
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    hostEl.dispatchEvent(new MouseEvent('mouseleave'));
    advanceHideDelay();
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

    cleanup();
  });

  // Focus inside a shadow root reaches a host listener with the host as its
  // target; only composedPath() still leads to the element that has focus.
  it('tests :focus-visible on the innermost focused element, not the retargeted host', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    const dispatchRetargeted = (innerVisible: boolean) => {
      jest.spyOn(contentEl, 'matches').mockImplementation((selector) => innerVisible && selector === ':focus-visible');
      jest.spyOn(hostEl, 'matches').mockImplementation((selector) => !innerVisible && selector === ':focus-visible');
      const event = new FocusEvent('focusin', { bubbles: true });
      Object.defineProperty(event, 'composedPath', { value: () => [contentEl, hostEl] });
      hostEl.dispatchEvent(event);
    };

    dispatchRetargeted(false);
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

    dispatchRetargeted(true);
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    cleanup();
  });

  it('removes tooltip on focusout after delay', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    focusIn(contentEl);
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    hostEl.dispatchEvent(new FocusEvent('focusout'));
    advanceHideDelay();
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

    cleanup();
  });

  it('keeps tooltip visible when hover and focus overlap', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    // Hover in + keyboard focus in
    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    focusIn(contentEl);

    // Mouse leaves but focus remains
    hostEl.dispatchEvent(new MouseEvent('mouseleave'));
    advanceHideDelay();

    // Tooltip should still be visible because focus is active
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    // Focus leaves too
    hostEl.dispatchEvent(new FocusEvent('focusout'));
    advanceHideDelay();
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

    cleanup();
  });

  it('keeps tooltip visible when user hovers from host to portal', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text to copy',
    });

    // Hover the host to show tooltip
    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    const portal = document.querySelector('.pds-truncation-tooltip') as HTMLElement;
    expect(portal).not.toBeNull();

    // Mouse leaves host (heading toward tooltip)
    hostEl.dispatchEvent(new MouseEvent('mouseleave'));

    // Mouse enters the portal before the hide delay fires
    portal.dispatchEvent(new MouseEvent('mouseenter'));

    // Even after the delay, tooltip should remain because portal is hovered
    advanceHideDelay();
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    // Mouse leaves the portal
    portal.dispatchEvent(new MouseEvent('mouseleave'));
    advanceHideDelay();
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

    cleanup();
  });

  it('tooltip text is selectable (user-select: text)', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Selectable text',
    });

    hostEl.dispatchEvent(new MouseEvent('mouseenter'));

    const styleEl = document.querySelector('[data-pds-truncation-tooltip]');
    expect(styleEl?.textContent).toContain('user-select: text');
    expect(styleEl?.textContent).toContain('cursor: text');

    cleanup();
  });

  it('does not create tooltip when text content is empty', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => '',
    });

    hostEl.dispatchEvent(new MouseEvent('mouseenter'));

    const portal = document.querySelector('.pds-truncation-tooltip');
    expect(portal).toBeNull();

    cleanup();
  });

  it('cleans up all listeners and observers on cleanup', () => {
    const removeListenerSpy = jest.spyOn(hostEl, 'removeEventListener');

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Test',
    });

    const observer = MockResizeObserver.instances[MockResizeObserver.instances.length - 1];

    cleanup();

    expect(observer.disconnect).toHaveBeenCalled();
    expect(removeListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('focusin', expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith('focusout', expect.any(Function));
  });

  it('removes portal on cleanup even if tooltip is visible', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    cleanup();
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();
  });

  describe('tabindex management', () => {
    it('gives the content element a tab stop when it overflows', () => {
      Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
      Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
      });

      expect(contentEl.getAttribute('tabindex')).toBe('0');

      cleanup();
    });

    it('does not give the content element a tab stop when it fits', () => {
      // beforeEach's default fixture already has no overflow (scrollWidth < clientWidth)
      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Short text',
      });

      expect(contentEl.hasAttribute('tabindex')).toBe(false);

      cleanup();
    });

    it('drops the tab stop once a resize makes the content fit again', () => {
      Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
      Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
      });
      expect(contentEl.getAttribute('tabindex')).toBe('0');

      // Simulate the element growing until the text fits.
      Object.defineProperty(contentEl, 'scrollWidth', { value: 100, configurable: true });
      const observer = MockResizeObserver.instances[MockResizeObserver.instances.length - 1];
      observer.trigger();
      jest.advanceTimersByTime(150); // resize handling is debounced 100ms

      expect(contentEl.hasAttribute('tabindex')).toBe(false);

      cleanup();
    });

    it('leaves a consumer-owned tabindex alone', () => {
      contentEl.setAttribute('tabindex', '-1');
      Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
      Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
      });

      // Ownership is tracked, not inferred from value — a pre-existing
      // tabindex (a roving -1, say) is the consumer's and must not be
      // overwritten or removed on cleanup.
      expect(contentEl.getAttribute('tabindex')).toBe('-1');

      cleanup();
      expect(contentEl.getAttribute('tabindex')).toBe('-1');
    });

    it('never sets a tab stop when manageTabIndex is false, even while overflowing', () => {
      Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
      Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
        manageTabIndex: false,
      });

      expect(contentEl.hasAttribute('tabindex')).toBe(false);

      // Still holds after a resize re-measure.
      const observer = MockResizeObserver.instances[MockResizeObserver.instances.length - 1];
      observer.trigger();
      jest.advanceTimersByTime(150);
      expect(contentEl.hasAttribute('tabindex')).toBe(false);

      cleanup();
    });

    it('still shows the tooltip on focusin when manageTabIndex is false', () => {
      // Covers the case this option exists for: contentEl sits inside its own
      // focusable control, which triggers the tooltip via focusin bubbling to
      // hostEl rather than via a tabindex on contentEl itself.
      Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
      Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
        manageTabIndex: false,
      });

      focusIn(contentEl);

      expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();
      expect(contentEl.hasAttribute('tabindex')).toBe(false);

      cleanup();
    });
  });

  // A wrapping control outside hostEl (a consumer's pds-button around a chip)
  // never bubbles its focus into hostEl, so it needs the focus listeners itself.
  describe('focusEl', () => {
    let focusEl: HTMLElement;

    beforeEach(() => {
      focusEl = document.createElement('button');
      document.body.appendChild(focusEl);
      Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
      Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });
    });

    it('shows the tooltip while focusEl has focus', () => {
      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
        manageTabIndex: false,
        focusEl,
      });

      focusIn(focusEl);
      expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

      focusEl.dispatchEvent(new FocusEvent('focusout'));
      advanceHideDelay();
      expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

      cleanup();
    });

    it('moves only the focus listeners, leaving hover on hostEl', () => {
      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
        focusEl,
      });

      focusIn(contentEl);
      expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

      hostEl.dispatchEvent(new MouseEvent('mouseenter'));
      expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

      cleanup();
    });

    it('stops listening on focusEl after cleanup', () => {
      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
        focusEl,
      });

      cleanup();
      focusIn(focusEl);

      expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();
    });

    it('ignores focusEl focus that is not :focus-visible', () => {
      const cleanup = setupTruncationTooltip({
        hostEl,
        contentEl,
        getTooltipText: () => 'Full text',
        manageTabIndex: false,
        focusEl,
      });

      focusIn(focusEl, { visible: false });
      expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

      cleanup();
    });
  });
});
