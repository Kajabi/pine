import { newSpecPage } from '@stencil/core/testing';
import { PdsCopytext } from '../pds-copytext';
import { copy as copyIcon } from '@pine-ds/icons/icons';

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

    // Create a mock for navigator.clipboard
    const clipboardMock = {
      writeText: jest.fn(),
    };

    // Spy on the writeText method of the clipboard mock
    const writeTextSpy = jest.spyOn(clipboardMock, 'writeText');
    writeTextSpy.mockResolvedValue(undefined); // Mock a resolved promise

    // Mock the navigator.clipboard object
    Object.defineProperty(window, 'navigator', {
      value: {
        clipboard: clipboardMock,
      },
      configurable: true,
    });

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

    // Mock the navigator.clipboard object to simulate writeText failure
    const clipboardMock = {
      writeText: jest.fn()
    };

    // Spy on the writeText method of the clipboard mock
    const writeTextSpy = jest.spyOn(clipboardMock, 'writeText');
    writeTextSpy.mockRejectedValue(new Error('Clipboard write error')); // Mock a rejected promise

    // Set the mock clipboard object on the window.navigator
    Object.defineProperty(window, 'navigator', {
      value: {
        clipboard: clipboardMock,
      },
      configurable: true,
    });

    // Attach a spy to the component's event emitter
    const emitSpy = jest.spyOn(page.rootInstance.pdsCopyTextClick, 'emit');

    const button = page.root?.shadowRoot?.querySelector('pds-button') as HTMLButtonElement;
    button.click();

    // Ensure Clipboard API process finishes
    await Promise.resolve();

    expect(emitSpy).toHaveBeenCalledWith('Error writing text to clipboard: Error: Clipboard write error');
    expect(writeTextSpy).toHaveBeenCalledWith('custom value text');
  });
});
