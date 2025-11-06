import { newE2EPage } from '@stencil/core/testing';
import { caretDown, addCircle } from '@pine-ds/icons/icons';

describe('pds-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button></pds-button>');
    const element = await page.find('pds-button');
    expect(element).toHaveClass('hydrated');
  });

  it('submits form', async () => {
    const page = await newE2EPage({
      html: `
        <form>
          <pds-button type="submit"></pds-button>
        </form>
      `
    });

    const elementForm = await page.find('form');
    const elementFormEvent = await elementForm.spyOnEvent('submit');
    await page.evaluate(() => document.querySelector('pds-button')!.click());
    await page.waitForChanges();

    // Confirm onClick has been called
    expect(elementFormEvent).toHaveReceivedEvent();
  });


  it('resets form', async () => {
    const page = await newE2EPage({
      html: `
        <form>
          <input></input>
          <pds-button type="reset"></pds-button>
        </form>
      `
    });

    const elementForm = await page.find('form');
    const elementFormEvent = await elementForm.spyOnEvent('reset');
    await page.evaluate(() => (document.querySelector('input') as HTMLInputElement).value = 'test');
    await page.evaluate(() => document.querySelector('pds-button')!.click());
    await page.waitForChanges();

    // Confirm form received reset event
    expect(elementFormEvent).toHaveReceivedEvent();

    // Confirm input value was reset
    const updatedFormInputValue = await page.evaluate(() => (document.querySelector('input') as HTMLInputElement).value);
    expect(updatedFormInputValue).toBe('');
  });

  it('renders when slot is used', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button>Test Content</pds-button>');
    const component = await page.find('pds-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-button');
    expect(element.textContent).toMatch('Test Content');
  });

  it('renders toggle of disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button></pds-button>');
    const component = await page.find('pds-button');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-button >>> button');
    let value = await element.getProperty('disabled');
    expect(value).toBe(false);

    component.setProperty('disabled', 'true');
    await page.waitForChanges();
    value = await element.getProperty('disabled');
    expect(value).toBe(true);
  });

  it('renders caret-down icon when variant is disclosure', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-button variant="disclosure"></pds-button>');

    const element = await page.find('pds-button >>> button');
    const icon = await element.find('pds-icon');
    const iconName = await icon.getProperty('icon');

    expect(icon).toBeTruthy();
    expect(iconName).toBe(caretDown);
  });

  it('allows loader color customization via CSS parts', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <style>
        .custom-loader::part(loader-svg) {
          color: rgb(255, 0, 0) !important;
        }
      </style>
      <pds-button class="custom-loader" loading="true">Loading Button</pds-button>
    `);

    const button = await page.find('pds-button');
    expect(button).toHaveClass('hydrated');

    // Wait for the component to fully render
    await page.waitForChanges();

    // Get the loader SVG element via the exported part
    const svgColor = await page.evaluate(() => {
      const button = document.querySelector('pds-button');
      const loader = button?.shadowRoot?.querySelector('pds-loader');
      const svg = loader?.shadowRoot?.querySelector('svg[part="loader-svg"]');
      return svg ? window.getComputedStyle(svg).color : null;
    });

    expect(svgColor).toBe('rgb(255, 0, 0)');
  });

  it('exports loader-svg part when loading', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-button loading="true">Loading</pds-button>');

    await page.waitForChanges();

    const hasLoaderPart = await page.evaluate(() => {
      const button = document.querySelector('pds-button');
      const loader = button?.shadowRoot?.querySelector('pds-loader[exportparts]');
      return loader ? loader.getAttribute('exportparts') === 'loader-svg' : false;
    });

    expect(hasLoaderPart).toBe(true);
  });

  it('loader color customization works with different button variants', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <style>
        .custom-accent::part(loader-svg) {
          color: rgb(0, 255, 0) !important;
        }
        .custom-danger::part(loader-svg) {
          color: rgb(255, 165, 0) !important;
        }
      </style>
      <pds-button class="custom-accent" variant="primary" loading="true">Accent Loader</pds-button>
      <pds-button class="custom-danger" variant="secondary" loading="true">Danger Loader</pds-button>
    `);

    await page.waitForChanges();

    const [accentColor, dangerColor] = await page.evaluate(() => {
      const buttons = document.querySelectorAll('pds-button');
      const colors: (string | null)[] = [];

      buttons.forEach(button => {
        const loader = button.shadowRoot?.querySelector('pds-loader');
        const svg = loader?.shadowRoot?.querySelector('svg[part="loader-svg"]');
        if (svg) {
          colors.push(window.getComputedStyle(svg).color);
        } else {
          colors.push(null);
        }
      });

      return colors;
    });

    expect(accentColor).toBe('rgb(0, 255, 0)');
    expect(dangerColor).toBe('rgb(255, 165, 0)');
  });

  describe('Enter key form submission', () => {
    it('submits form when Enter is pressed in input field', async () => {
      const page = await newE2EPage({
        html: `
          <form>
            <input type="text" id="test-input" />
            <pds-button type="submit">Submit</pds-button>
          </form>
        `
      });

      const form = await page.find('form');
      const input = await page.find('#test-input');
      const formSubmitEvent = await form.spyOnEvent('submit');

      // Focus the input and press Enter
      await input.focus();
      await page.keyboard.press('Enter');
      await page.waitForChanges();

      expect(formSubmitEvent).toHaveReceivedEvent();
    });

    it('does not submit form when Enter is pressed in textarea', async () => {
      const page = await newE2EPage({
        html: `
          <form>
            <textarea id="test-textarea"></textarea>
            <pds-button type="submit">Submit</pds-button>
          </form>
        `
      });

      const form = await page.find('form');
      const textarea = await page.find('#test-textarea');
      const formSubmitEvent = await form.spyOnEvent('submit');

      // Focus the textarea and press Enter
      await textarea.focus();
      await page.keyboard.press('Enter');
      await page.waitForChanges();

      // Should not have submitted
      expect(formSubmitEvent).not.toHaveReceivedEvent();
    });

    it('button click still works normally', async () => {
      const page = await newE2EPage({
        html: `
          <form>
            <input type="text" id="test-input" />
            <pds-button type="submit">Submit</pds-button>
          </form>
        `
      });

      const form = await page.find('form');
      const button = await page.find('pds-button');
      const formSubmitEvent = await form.spyOnEvent('submit');

      // Click the button
      await button.click();
      await page.waitForChanges();

      expect(formSubmitEvent).toHaveReceivedEvent();
    });

  });

  describe('size prop E2E', () => {
    it('renders small button correctly', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button size="small">Small</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');

      expect(component).toHaveClass('hydrated');
      expect(element).toBeTruthy();
      expect(component.textContent).toMatch('Small');
    });

    it('renders micro button correctly', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button size="micro">Micro</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');

      expect(component).toHaveClass('hydrated');
      expect(element).toBeTruthy();
      expect(component.textContent).toMatch('Micro');
    });

    it('renders small icon-only button correctly', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button size="small" icon-only="true"><pds-icon slot="start" aria-hidden="true" name="favorite"></pds-icon>Small Icon</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');

      expect(component).toHaveClass('hydrated');
      expect(element).toBeTruthy();
    });

    it('renders micro icon-only button correctly', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button size="micro" icon-only="true"><pds-icon slot="start" aria-hidden="true" name="favorite"></pds-icon>Micro Icon</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');

      expect(component).toHaveClass('hydrated');
      expect(element).toBeTruthy();
    });

    it('small button can be clicked and emits events', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button size="small">Small</pds-button>');

      const component = await page.find('pds-button');
      const clickEvent = await component.spyOnEvent('pdsClick');

      await component.click();
      await page.waitForChanges();

      expect(clickEvent).toHaveReceivedEvent();
    });

    it('micro button can be clicked and emits events', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button size="micro">Micro</pds-button>');

      const component = await page.find('pds-button');
      const clickEvent = await component.spyOnEvent('pdsClick');

      await component.click();
      await page.waitForChanges();

      expect(clickEvent).toHaveReceivedEvent();
    });

    it('size prop works with different variants', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-button size="small" variant="primary">Small Primary</pds-button>
        <pds-button size="micro" variant="secondary">Micro Secondary</pds-button>
      `);

      const buttons = await page.findAll('pds-button');

      expect(buttons[0]).toHaveClass('hydrated');
      expect(buttons[1]).toHaveClass('hydrated');
    });
  });

  describe('tertiary variant E2E', () => {
    it('renders tertiary button correctly', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="tertiary">Tertiary</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');

      expect(component).toHaveClass('hydrated');
      expect(element).toBeTruthy();
      expect(component.textContent).toMatch('Tertiary');
    });

    it('tertiary variant works with disabled state', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="tertiary" disabled="true">Tertiary</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');

      expect(component).toHaveClass('hydrated');
      const disabled = await element.getProperty('disabled');
      expect(disabled).toBe(true);
    });

    it('tertiary variant works with icon', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="tertiary"><pds-icon slot="start" aria-hidden="true" name="favorite"></pds-icon>Tertiary</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');

      expect(component).toHaveClass('hydrated');
      expect(element).toBeTruthy();
    });

    it('tertiary variant works with loading state', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="tertiary" loading="true">Tertiary</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');
      const loader = await element.find('pds-loader');

      expect(component).toHaveClass('hydrated');
      expect(loader).toBeTruthy();
    });

    it('tertiary variant can be clicked and emits events', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="tertiary">Tertiary</pds-button>');

      const component = await page.find('pds-button');
      const clickEvent = await component.spyOnEvent('pdsClick');

      await component.click();
      await page.waitForChanges();

      expect(clickEvent).toHaveReceivedEvent();
    });
  });

  describe('filter variant E2E', () => {
    it('renders add-circle icon when variant is filter', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="filter">Filter option</pds-button>');

      const element = await page.find('pds-button >>> button');
      const icon = await element.find('pds-icon');
      const iconName = await icon.getProperty('icon');

      expect(icon).toBeTruthy();
      expect(iconName).toBe(addCircle);
    });

    it('ignores icon prop and always shows add-circle for filter variant', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="filter" icon="favorite">Filter option</pds-button>');

      const element = await page.find('pds-button >>> button');
      const icon = await element.find('pds-icon');
      const iconName = await icon.getProperty('icon');

      // Should still render add-circle, not favorite
      expect(icon).toBeTruthy();
      expect(iconName).toBe(addCircle);
    });

    it('filter variant works with disabled state', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="filter" disabled="true">Filter option</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');
      const icon = await element.find('pds-icon');

      expect(component).toHaveClass('hydrated');
      const disabled = await element.getProperty('disabled');
      expect(disabled).toBe(true);
      expect(icon).toBeTruthy();
    });

    it('filter variant works with loading state', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="filter" loading="true">Filter option</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> button');
      const icon = await element.find('pds-icon');
      const loader = await element.find('pds-loader');

      expect(component).toHaveClass('hydrated');
      expect(icon).toBeTruthy();
      expect(loader).toBeTruthy();
    });

    it('filter variant works as link when href provided', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="filter" href="/test">Filter option</pds-button>');

      const component = await page.find('pds-button');
      const element = await page.find('pds-button >>> a');
      const icon = await element.find('pds-icon');

      expect(component).toHaveClass('hydrated');
      expect(element).toBeTruthy();
      expect(icon).toBeTruthy();
      await expect(element.getProperty('href')).resolves.toContain('/test');
    });

    it('filter variant can be clicked and emits events', async () => {
      const page = await newE2EPage();
      await page.setContent('<pds-button variant="filter">Filter option</pds-button>');

      const component = await page.find('pds-button');
      const clickEvent = await component.spyOnEvent('pdsClick');

      await component.click();
      await page.waitForChanges();

      expect(clickEvent).toHaveReceivedEvent();
    });
  });
});
