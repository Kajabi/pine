import { newSpecPage } from '@stencil/core/testing';
import { PdsFilter } from '../pds-filter';

describe('pds-filter', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test-filter" text="Test Filter"></pds-filter>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root.id).toBe('test-filter');

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger');
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.textContent.trim()).toContain('Test Filter');
  });

  it('renders with default variant', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger');
    expect(trigger).toHaveClass('pds-filter__trigger--default');
  });

  it('renders with selected variant and dropdown icon', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" variant="selected" text="Test"></pds-filter>`,
    });

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger');
    expect(trigger).toHaveClass('pds-filter__trigger--selected');

    const dropdownIcon = page.root.shadowRoot.querySelector('.pds-filter__dropdown-icon');
    expect(dropdownIcon).toBeTruthy();
  });

  it('renders with more variant', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" variant="more" text="Test"></pds-filter>`,
    });

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger');
    expect(trigger).toHaveClass('pds-filter__trigger--more');
  });

  it('renders with clear variant and trash icon', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" variant="clear" text="Test"></pds-filter>`,
    });

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger');
    expect(trigger).toHaveClass('pds-filter__trigger--clear');

    // Clear variant should always show trash icon regardless of icon prop
    const icon = page.root.shadowRoot.querySelector('pds-icon');
    expect(icon).toBeTruthy();
  });

  it('renders with custom icon', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" icon="folder" text="Test"></pds-filter>`,
    });

    const icon = page.root.shadowRoot.querySelector('pds-icon');
    expect(icon).toBeTruthy();
  });

  it('ignores icon prop for clear variant', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" variant="clear" icon="folder" text="Test"></pds-filter>`,
    });

    // Should render trash icon, not folder icon
    const icon = page.root.shadowRoot.querySelector('pds-icon');
    expect(icon).toBeTruthy();
  });

  it('does not render popover initially', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const popover = page.root.shadowRoot.querySelector('.pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('shows popover when isOpen is true', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;
    component.isOpen = true;
    await page.waitForChanges();

    const popover = page.root.shadowRoot.querySelector('.pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(popover.id).toBe('test-popover');
  });

  it('updates trigger classes when open (non-clear variants)', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;
    component.isOpen = true;
    await page.waitForChanges();

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger');
    expect(trigger).toHaveClass('pds-filter__trigger--open');
  });

  it('does not add open class for clear variant', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" variant="clear" text="Clear"></pds-filter>`,
    });

    const component = page.rootInstance;
    component.isOpen = true; // This shouldn't happen for clear, but test the logic
    await page.waitForChanges();

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger');
    expect(trigger).not.toHaveClass('pds-filter__trigger--open');
  });

  it('updates aria-expanded when open', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;
    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger') as HTMLElement;

    // Initially closed
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    component.isOpen = true;
    await page.waitForChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('has proper ARIA attributes', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe('test-popover');
  });

  it('emits pds-filter-open event when opened', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;
    const openEventSpy = jest.fn();
    component.pdsFilterOpen.emit = openEventSpy;

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger') as HTMLElement;
    trigger.click();

    expect(openEventSpy).toHaveBeenCalled();
  });

  it('emits pds-filter-close event when closed', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;

    // Open first
    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger') as HTMLElement;
    trigger.click();

    const closeEventSpy = jest.fn();
    component.pdsFilterClose.emit = closeEventSpy;

    // Close by clicking again
    trigger.click();

    expect(closeEventSpy).toHaveBeenCalled();
  });

  it('emits pds-filter-clear event when clear variant is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" variant="clear" text="Clear"></pds-filter>`,
    });

    const component = page.rootInstance;
    const clearEventSpy = jest.fn();
    component.pdsFilterClear.emit = clearEventSpy;

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger') as HTMLElement;
    trigger.click();

    expect(clearEventSpy).toHaveBeenCalledWith({
      componentId: 'test',
      text: 'Clear',
    });
  });

  it('does not open popover for clear variant', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" variant="clear" text="Clear"></pds-filter>`,
    });

    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger') as HTMLElement;
    trigger.click();

    await page.waitForChanges();

    const popover = page.root.shadowRoot.querySelector('.pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('opens programmatically', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;
    expect(component.isOpen).toBe(false);

    await component.showFilter();

    expect(component.isOpen).toBe(true);
    await page.waitForChanges();

    const popover = page.root.shadowRoot.querySelector('.pds-filter__popover');
    expect(popover).toBeTruthy();
  });

  it('closes programmatically', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;

    // Open first
    await component.showFilter();
    expect(component.isOpen).toBe(true);

    // Then close
    await component.hideFilter();
    expect(component.isOpen).toBe(false);

    await page.waitForChanges();
    const popover = page.root.shadowRoot.querySelector('.pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('does not open when showFilter called on open filter', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;

    await component.showFilter();
    expect(component.isOpen).toBe(true);

    // Calling showFilter again should not change state
    await component.showFilter();
    expect(component.isOpen).toBe(true);
  });

  it('does not close when hideFilter called on closed filter', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;
    expect(component.isOpen).toBe(false);

    await component.hideFilter();
    expect(component.isOpen).toBe(false);
  });

  it('renders slot content in popover', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `
        <pds-filter component-id="test" text="Test">
          <p>Custom content</p>
        </pds-filter>
      `,
    });

    const component = page.rootInstance;
    component.isOpen = true;
    await page.waitForChanges();

    const slot = page.root.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('handles keyboard events', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;
    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger') as HTMLElement;

    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    Object.defineProperty(enterEvent, 'preventDefault', { value: jest.fn() });

    trigger.dispatchEvent(enterEvent);
    expect(component.isOpen).toBe(true);

    // Test Escape key
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    trigger.dispatchEvent(escapeEvent);
    expect(component.isOpen).toBe(false);
  });

  it('handles Space key', async () => {
    const page = await newSpecPage({
      components: [PdsFilter],
      html: `<pds-filter component-id="test" text="Test"></pds-filter>`,
    });

    const component = page.rootInstance;
    const trigger = page.root.shadowRoot.querySelector('.pds-filter__trigger') as HTMLElement;

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    Object.defineProperty(spaceEvent, 'preventDefault', { value: jest.fn() });

    trigger.dispatchEvent(spaceEvent);
    expect(component.isOpen).toBe(true);
  });
});
