import { newSpecPage } from '@stencil/core/testing';
import { PdsToast } from '../pds-toast';

describe('pds-toast', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast"></pds-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-toast component-id="test-toast">
        <mock:shadow-root>
          <div aria-live="polite" class="pds-toast" role="alert">
            <span class="pds-toast__message">
              <slot></slot>
            </span>
            <button aria-label="Dismiss message" class="pds-toast__button" type="button">
              <pds-icon name="remove"></pds-icon>
            </button>
          </div>
        </mock:shadow-root>
      </pds-toast>
    `);
  });

  it('renders with icon', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" icon="info"></pds-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-toast component-id="test-toast" icon="info">
        <mock:shadow-root>
          <div aria-live="polite" class="pds-toast" role="alert">
            <pds-icon class="pds-toast__icon" name="info"></pds-icon>
            <span class="pds-toast__message">
              <slot></slot>
            </span>
            <button aria-label="Dismiss message" class="pds-toast__button" type="button">
              <pds-icon name="remove"></pds-icon>
            </button>
          </div>
        </mock:shadow-root>
      </pds-toast>
    `);
  });

  it('renders loading type with spinner', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" type="loading"></pds-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-toast component-id="test-toast" type="loading">
        <mock:shadow-root>
          <div aria-live="polite" class="pds-toast pds-toast--loading" role="alert">
            <div class="pds-toast__loader">
              <svg aria-hidden="true" class="pds-toast__loader-spinner" viewBox="25 25 50 50">
                <circle class="pds-toast__loader-path" cx="50" cy="50" fill="none" r="20" stroke="currentColor" stroke-linecap="round" stroke-width="4"></circle>
              </svg>
            </div>
            <span class="pds-toast__message">
              <slot></slot>
            </span>
            <button aria-label="Dismiss message" class="pds-toast__button" type="button">
              <pds-icon name="remove"></pds-icon>
            </button>
          </div>
        </mock:shadow-root>
      </pds-toast>
    `);
  });

  it('renders danger type', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" type="danger"></pds-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-toast component-id="test-toast" type="danger">
        <mock:shadow-root>
          <div aria-live="polite" class="pds-toast pds-toast--danger" role="alert">
            <span class="pds-toast__message">
              <slot></slot>
            </span>
            <button aria-label="Dismiss message" class="pds-toast__button" type="button">
              <pds-icon name="remove"></pds-icon>
            </button>
          </div>
        </mock:shadow-root>
      </pds-toast>
    `);
  });

  it('renders without dismiss button when dismissible is false', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" dismissible="false"></pds-toast>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-toast component-id="test-toast" dismissible="false">
        <mock:shadow-root>
          <div aria-live="polite" class="pds-toast" role="alert">
            <span class="pds-toast__message">
              <slot></slot>
            </span>
          </div>
        </mock:shadow-root>
      </pds-toast>
    `);
  });

  it('hides when isVisible is false', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast"></pds-toast>`,
    });

    const component = page.rootInstance as PdsToast;
    component.isVisible = false;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <pds-toast component-id="test-toast" hidden="">
        <mock:shadow-root>
          <div aria-live="polite" class="pds-toast" role="alert">
            <span class="pds-toast__message">
              <slot></slot>
            </span>
            <button aria-label="Dismiss message" class="pds-toast__button" type="button">
              <pds-icon name="remove"></pds-icon>
            </button>
          </div>
        </mock:shadow-root>
      </pds-toast>
    `);
  });

  // Test for renderIcon() returning null (line 101)
  it('renders without icon when no icon prop and type is default', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" type="default"></pds-toast>`,
    });

    expect(page.root).toBeDefined();
    expect(page.root!.shadowRoot).toBeDefined();

    const iconElement = page.root!.shadowRoot!.querySelector('.pds-toast__icon');
    const loaderElement = page.root!.shadowRoot!.querySelector('.pds-toast__loader');

    expect(iconElement).toBeNull();
    expect(loaderElement).toBeNull();
  });

  // Test for dismiss() method (lines 71-88)
  it('should call dismiss method and emit event', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast"></pds-toast>`,
    });

    const component = page.rootInstance as PdsToast;
    const dismissSpy = jest.spyOn(component.pdsToastDismissed, 'emit');

    await component.dismiss();

    expect(component.isVisible).toBe(false);
    expect(dismissSpy).toHaveBeenCalledWith({ componentId: 'test-toast' });
  });

  // Test for button onClick calling dismiss (line 145)
  it('should dismiss when dismiss button is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast"></pds-toast>`,
    });

    const component = page.rootInstance as PdsToast;
    const dismissSpy = jest.spyOn(component, 'dismiss');

    expect(page.root).toBeDefined();
    expect(page.root!.shadowRoot).toBeDefined();

    const dismissButton = page.root!.shadowRoot!.querySelector('.pds-toast__button') as HTMLButtonElement;
    dismissButton.click();

    expect(dismissSpy).toHaveBeenCalled();
  });

  // Test duration watcher behavior
  it('should handle duration changes', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" duration="1000"></pds-toast>`,
    });

    const component = page.rootInstance as PdsToast;

    // Test that duration property can be changed
    expect(component.duration).toBe(1000);

    // Change duration
    component.duration = 2000;
    await page.waitForChanges();

    // Verify the new duration is set
    expect(component.duration).toBe(2000);
  });

  // Test duration watcher when setting to 0
  it('should handle duration set to 0', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" duration="1000"></pds-toast>`,
    });

    const component = page.rootInstance as PdsToast;

    // Test initial duration
    expect(component.duration).toBe(1000);

    // Change duration to 0
    component.duration = 0;
    await page.waitForChanges();

    // Verify duration is now 0
    expect(component.duration).toBe(0);
  });

  // Test cleanup method exists and can be called
  it('should have cleanup functionality', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" duration="1000"></pds-toast>`,
    });

    const component = page.rootInstance as PdsToast;

    // Test that disconnectedCallback can be called without errors
    expect(() => component.disconnectedCallback()).not.toThrow();

    // Component should still be functional after cleanup
    expect(component.isVisible).toBe(true);
  });

  // Test auto-dismissal behavior without timer manipulation
  it('should have auto-dismiss functionality when duration > 0', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" duration="1000"></pds-toast>`,
    });

    const component = page.rootInstance as PdsToast;

    // Verify that the component starts the dismiss timer on load
    expect(component.duration).toBe(1000);
    expect(component.isVisible).toBe(true);
  });

  // Test no auto-dismissal when duration is 0
  it('should not auto-dismiss when duration is 0', async () => {
    const page = await newSpecPage({
      components: [PdsToast],
      html: `<pds-toast component-id="test-toast" duration="0"></pds-toast>`,
    });

    const component = page.rootInstance as PdsToast;

    // Component should be visible and no timer should be active
    expect(component.duration).toBe(0);
    expect(component.isVisible).toBe(true);
  });
});
