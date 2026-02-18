import { newSpecPage } from '@stencil/core/testing';
import { PdsCopytext } from '../pds-copytext';
import { copy as copyIcon } from '@pine-ds/icons/icons';

// Mock ResizeObserver for truncation tooltip tests
(globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver || class {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

describe('pds-copytext', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext border class="pds-copytext pds-copytext--bordered">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span></span>
            <pds-icon icon="${copyIcon}" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('renders without border when border prop is false', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext border="false"></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext class="pds-copytext" border="false">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span></span>
            <pds-icon icon="${copyIcon}" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('renders full width when full-width prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext full-width="true"></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext border class="pds-copytext pds-copytext--bordered pds-copytext--full-width" full-width="true">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span></span>
            <pds-icon icon="${copyIcon}" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('renders truncated when trucate prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext truncate="true"></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext border class="pds-copytext pds-copytext--bordered pds-copytext--truncated" truncate="true">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span></span>
            <pds-icon icon="${copyIcon}" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('renders value text when value prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="custom value text"></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext border class="pds-copytext pds-copytext--bordered" value="custom value text">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span>custom value text</span>
            <pds-icon icon="${copyIcon}" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('copies value text to clipboard when button is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="custom value text"></pds-copytext>`,
    });

    // Set the mock clipboard object on the navigator
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      configurable: true,
    });

    // Spy on the writeText method of the clipboard mock
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
    writeTextSpy.mockResolvedValue(undefined); // Mock a resolved promise

    // Attach a spy to the component's event emitter
    const emitSpy = jest.spyOn(page.rootInstance.pdsCopyTextClick, 'emit');

    const button = page.root?.shadowRoot?.querySelector('pds-button') as HTMLButtonElement;
    button.click();

    // Ensure Clipboard API process finishes
    await Promise.resolve();

    expect(emitSpy).toHaveBeenCalledWith('Copied to clipboard');
    expect(writeTextSpy).toHaveBeenCalledWith('custom value text');
  });

  it('emits error event when clipboard writeText fails', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="custom value text"></pds-copytext>`,
    });

    // Set the mock clipboard object on the navigator
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      configurable: true,
    });

    // Spy on the writeText method of the clipboard mock
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
    writeTextSpy.mockRejectedValue(new Error('Clipboard write error')); // Mock a rejected promise

    // Attach a spy to the component's event emitter
    const emitSpy = jest.spyOn(page.rootInstance.pdsCopyTextClick, 'emit');

    const button = page.root?.shadowRoot?.querySelector('pds-button') as HTMLButtonElement;
    button.click();

    // Ensure Clipboard API process finishes
    await Promise.resolve();

    expect(emitSpy).toHaveBeenCalledWith('Error writing text to clipboard: Error: Clipboard write error');
    expect(writeTextSpy).toHaveBeenCalledWith('custom value text');
  });

  it('initializes truncation tooltip when truncate is set', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="very long text content" truncate="true"></pds-copytext>`,
    });

    // Verify the component loaded without errors
    expect(page.root).toBeTruthy();
    expect(page.rootInstance.truncate).toBe(true);
  });

  it('cleans up truncation tooltip on disconnect', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="text" truncate="true"></pds-copytext>`,
    });

    // Should not throw when disconnected
    page.root!.remove();
    await page.waitForChanges();
  });

  it('shows tooltip when text overflows', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="This is a very long text that will definitely overflow the container" truncate="true"></pds-copytext>`,
    });

    // Get the value span element from shadow root
    const valueSpan = page.root!.shadowRoot!.querySelector('span') as HTMLElement;
    expect(valueSpan).toBeTruthy();

    // Mock overflow by setting scrollWidth > clientWidth
    Object.defineProperty(valueSpan, 'scrollWidth', { value: 500, configurable: true });
    Object.defineProperty(valueSpan, 'clientWidth', { value: 100, configurable: true });

    // Simulate mouseenter on the host element
    page.root!.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Check that a tooltip portal was created
    const tooltip = document.querySelector('.pds-truncation-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
    expect(tooltip?.textContent).toContain('This is a very long text');

    // Cleanup
    page.root!.dispatchEvent(new MouseEvent('mouseleave'));
  });

  it('does not show tooltip when text fits', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="Short" truncate="true"></pds-copytext>`,
    });

    // Get the value span element from shadow root
    const valueSpan = page.root!.shadowRoot!.querySelector('span') as HTMLElement;
    expect(valueSpan).toBeTruthy();

    // Mock no overflow: scrollWidth <= clientWidth
    Object.defineProperty(valueSpan, 'scrollWidth', { value: 50, configurable: true });
    Object.defineProperty(valueSpan, 'clientWidth', { value: 100, configurable: true });

    // Simulate mouseenter
    page.root!.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    // Check that no tooltip was created
    const tooltip = document.querySelector('.pds-truncation-tooltip');
    expect(tooltip).toBeNull();
  });

  it('updates tooltip when value changes', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="Original text" truncate="true"></pds-copytext>`,
    });

    // Get the value span element from shadow root
    const valueSpan = page.root!.shadowRoot!.querySelector('span') as HTMLElement;
    expect(valueSpan).toBeTruthy();

    // Mock overflow
    Object.defineProperty(valueSpan, 'scrollWidth', { value: 500, configurable: true });
    Object.defineProperty(valueSpan, 'clientWidth', { value: 100, configurable: true });

    // Show tooltip with original value
    page.root!.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    let tooltip = document.querySelector('.pds-truncation-tooltip');
    expect(tooltip?.textContent).toContain('Original text');

    // Hide tooltip
    page.root!.dispatchEvent(new MouseEvent('mouseleave'));
    await page.waitForChanges();

    // Change the value
    page.rootInstance.value = 'Updated text';
    await page.waitForChanges();

    // Show tooltip again
    page.root!.dispatchEvent(new MouseEvent('mouseenter'));
    await page.waitForChanges();

    tooltip = document.querySelector('.pds-truncation-tooltip');
    expect(tooltip?.textContent).toContain('Updated text');
  });
});
