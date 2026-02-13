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
    document.body.innerHTML = '';
    // Remove injected style elements
    document.querySelectorAll('[data-pds-truncation-tooltip]').forEach(el => el.remove());
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

  it('removes tooltip portal on mouseleave', async () => {
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
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

    cleanup();
  });

  it('creates tooltip on focusin when overflowing', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    hostEl.dispatchEvent(new FocusEvent('focusin'));

    const portal = document.querySelector('.pds-truncation-tooltip');
    expect(portal).not.toBeNull();

    cleanup();
  });

  it('removes tooltip on focusout', () => {
    Object.defineProperty(contentEl, 'scrollWidth', { value: 300, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    const cleanup = setupTruncationTooltip({
      hostEl,
      contentEl,
      getTooltipText: () => 'Full text',
    });

    hostEl.dispatchEvent(new FocusEvent('focusin'));
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    hostEl.dispatchEvent(new FocusEvent('focusout'));
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

    // Hover in + focus in
    hostEl.dispatchEvent(new MouseEvent('mouseenter'));
    hostEl.dispatchEvent(new FocusEvent('focusin'));

    // Mouse leaves but focus remains
    hostEl.dispatchEvent(new MouseEvent('mouseleave'));

    // Tooltip should still be visible because focus is active
    expect(document.querySelector('.pds-truncation-tooltip')).not.toBeNull();

    // Focus leaves too
    hostEl.dispatchEvent(new FocusEvent('focusout'));
    expect(document.querySelector('.pds-truncation-tooltip')).toBeNull();

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
});
