import { newSpecPage } from '@stencil/core/testing';
import { PdsText } from '../pds-text';

// Mock ResizeObserver for truncation tooltip tests
(globalThis as any).ResizeObserver = class {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

describe('pds-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1">
        <mock:shadow-root>
          <h1 class="pds-text" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `);
  });

  it('renders with align class when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" align="center"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" align="center">
        <mock:shadow-root>
          <h1 class="pds-text pds-text--align-center" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `);
  })

  it('renders with predefined color style when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" color="accent"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" color="accent">
        <mock:shadow-root>
          <h1 class="pds-text" style="--color: var(--pine-color-text-accent);" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `)
  });

  it('renders with custom color style when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" color="var(--pine-color-green-400)"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" color="var(--pine-color-green-400)">
        <mock:shadow-root>
          <h1 class="pds-text" style="--color: var(--pine-color-green-400);" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `)
  })

  it('renders with size class when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" size="xl"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" size="xl">
        <mock:shadow-root>
          <h1 class="pds-text pds-text--size-xl" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `)
  });

  it('renders with weight class when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" weight="bold"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" weight="bold">
        <mock:shadow-root>
          <h1 class="pds-text pds-text--weight-bold" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `)
  });

  it('renders with decoration class when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p" decoration="underline-dotted"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="p" decoration="underline-dotted">
        <mock:shadow-root>
          <p class="pds-text pds-text--decoration-underline-dotted" part="content"><slot></slot></p>
        </mock:shadow-root>
      </pds-text>
    `)
  });

  it('renders with part attribute for external CSS targeting', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p">Test content</pds-text>`,
    });
    
    expect(page.root).toBeTruthy();
    expect(page.root!.shadowRoot).toBeTruthy();
    
    const shadowRoot = page.root!.shadowRoot!;
    const contentElement = shadowRoot.querySelector('[part="content"]');
    
    expect(contentElement).toBeTruthy();
    expect(contentElement!.getAttribute('part')).toBe('content');
    expect(contentElement!.tagName.toLowerCase()).toBe('p');
  });

  it('renders with truncate attribute when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p" truncate>Truncated text content</pds-text>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root!.hasAttribute('truncate')).toBe(true);
  });

  it('initializes truncation tooltip on componentDidLoad when truncate is set', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p" truncate>Some long text</pds-text>`,
    });

    // Verify the component loaded without errors
    expect(page.root).toBeTruthy();
    expect(page.rootInstance.truncate).toBe(true);
  });

  it('cleans up truncation tooltip on disconnect', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p" truncate>Some long text</pds-text>`,
    });

    // Should not throw when disconnected
    page.root!.remove();
    await page.waitForChanges();
  });

  it('shows tooltip when text overflows', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p" truncate>This is a very long text that will definitely overflow the container</pds-text>`,
    });

    // Get the content element from shadow root
    const contentEl = page.root!.shadowRoot!.querySelector('[part="content"]') as HTMLElement;
    expect(contentEl).toBeTruthy();

    // Mock overflow by setting scrollWidth > clientWidth
    Object.defineProperty(contentEl, 'scrollWidth', { value: 500, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    // Simulate mouseenter
    page.root!.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Check that a tooltip portal was created in the document
    const tooltip = document.querySelector('.pds-truncation-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');

    // Cleanup
    page.root!.dispatchEvent(new MouseEvent('mouseleave'));
  });

  it('does not show tooltip when text fits', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p" truncate>Short</pds-text>`,
    });

    // Get the content element from shadow root
    const contentEl = page.root!.shadowRoot!.querySelector('[part="content"]') as HTMLElement;
    expect(contentEl).toBeTruthy();

    // Mock no overflow: scrollWidth <= clientWidth
    Object.defineProperty(contentEl, 'scrollWidth', { value: 50, configurable: true });
    Object.defineProperty(contentEl, 'clientWidth', { value: 100, configurable: true });

    // Simulate mouseenter
    page.root!.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Check that no tooltip was created
    const tooltip = document.querySelector('.pds-truncation-tooltip');
    expect(tooltip).toBeNull();
  });

  it('adds tabindex="0" when truncate is enabled', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p" truncate>Text</pds-text>`,
    });

    const contentEl = page.root!.shadowRoot!.querySelector('[part="content"]') as HTMLElement;
    expect(contentEl.getAttribute('tabindex')).toBe('0');
  });

  it('does not add tabindex when truncate is disabled', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p">Text</pds-text>`,
    });

    const contentEl = page.root!.shadowRoot!.querySelector('[part="content"]') as HTMLElement;
    expect(contentEl.getAttribute('tabindex')).toBeNull();
  });

  describe('size validation', () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('warns when size is not a supported value', async () => {
      await newSpecPage({
        components: [PdsText],
        html: `<pds-text size="body-sm">Hi</pds-text>`,
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid size "body-sm"'));
    });

    it('does not warn for a supported size value', async () => {
      await newSpecPage({
        components: [PdsText],
        html: `<pds-text size="lg">Hi</pds-text>`,
      });

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('does not warn when size is not set', async () => {
      await newSpecPage({
        components: [PdsText],
        html: `<pds-text>Hi</pds-text>`,
      });

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('warns when size is updated to an invalid value', async () => {
      const page = await newSpecPage({
        components: [PdsText],
        html: `<pds-text size="lg">Hi</pds-text>`,
      });
      expect(warnSpy).not.toHaveBeenCalled();

      page.rootInstance.size = 'body-md';
      await page.waitForChanges();

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid size "body-md"'));
    });

    it('does not warn for an empty size value', async () => {
      await newSpecPage({
        components: [PdsText],
        html: `<pds-text size="">Hi</pds-text>`,
      });

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('warns for a whitespace-only size value', async () => {
      await newSpecPage({
        components: [PdsText],
        html: `<pds-text size="   ">Hi</pds-text>`,
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid size'));
    });

    it('truncates an excessively long invalid size value in the warning', async () => {
      const longValue = 'x'.repeat(200);
      await newSpecPage({
        components: [PdsText],
        html: `<pds-text size="${longValue}">Hi</pds-text>`,
      });

      const message = warnSpy.mock.calls[0][0] as string;
      expect(message).toContain('…');
      expect(message).not.toContain('x'.repeat(81));
    });
  });
});
