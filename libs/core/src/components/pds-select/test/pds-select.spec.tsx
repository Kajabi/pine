import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';

import { enlarge } from '@pine-ds/icons/icons';

describe('pds-select', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });
    expect(root).toEqualHtml(`
      <pds-select component-id="field-1">
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlFor="field-1"></label>
            <select class="pds-select__field" id="field-1">
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with slotted options', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" label="Name">
               <option value="1">Option 1</option>
               <option value="2">Option 2</option>
             </pds-select>`,
    });

    // Trigger the handleSlotChange logic
    const slot = page.root?.shadowRoot?.querySelector('slot');
    const select = page.root?.shadowRoot?.querySelector('select');
    const slottedOptions = slot?.assignedNodes?.({ flatten: true });

    slottedOptions?.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        select?.appendChild(node.cloneNode(true));
      }
    });

    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <pds-select component-id="field-1" label="Name">
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlfor="field-1">Name</label>
            <select class="pds-select__field" id="field-1"></select>
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </pds-select>
    `);
  });

  it('renders a label', async () => {
    const { root } = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" label="Name"></pds-select>`,
    });
    expect(root).toEqualHtml(`
      <pds-select component-id="field-1" label="Name">
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlFor="field-1">Name</label>
            <select class="pds-select__field" id="field-1"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with error message', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" error-message="Error occurred"></pds-select>`,
    });

    const errorMessage = page.root?.shadowRoot?.querySelector('.pds-select__error-message');
    expect(errorMessage?.textContent).toContain('Error occurred');
  });

  it('renders with helper message', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" helper-message="Helper text"></pds-select>`,
    });

    await page.waitForChanges(); // Ensures component fully renders

    const helperMessage = page.root?.shadowRoot?.querySelector('.pds-select__helper-message');
    expect(helperMessage?.textContent).toBe('Helper text');
  });

  it('renders with disabled attribute', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select aria-disabled="true" component-id="field-1" disabled></pds-select>`,
    });

    await page.waitForChanges(); // Ensures component fully renders

    expect(page.root).toEqualHtml(`
      <pds-select aria-disabled="true" component-id="field-1" disabled="">
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlfor="field-1"></label>
            <select class="pds-select__field" disabled="" id="field-1">
              <slot></slot>
            </select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('updates value prop on value change', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select options='[{"value": "paul", "label": "Paul McCartney"}, {"value": "john", "label": "John Lennon"}]' />`,
    });

    const pdsSelect = page.root;
    if (!pdsSelect || !pdsSelect.shadowRoot) {
      throw new Error('pdsSelect or pdsSelect.shadowRoot is not available');
    }
    const select = pdsSelect.shadowRoot.querySelector('select');

    // Change value to 'paul'
    if (select) {
      select.value = 'paul';
      select.dispatchEvent(new Event('change'));
      await page.waitForChanges();

      // Check if the value is updated
      expect(select.value).toBe('paul');

      // Change value to 'john'
      select.value = 'john';
      select.dispatchEvent(new Event('change'));
      await page.waitForChanges();

      // Check if the value is updated
      expect(select.value).toBe('john');

      // Change value to empty
      select.value = '';
      select.dispatchEvent(new Event('change'));
      await page.waitForChanges();

      // Check if the value is updated
      expect(select.value).toBe('');
    } else {
      throw new Error('select element is not available');
    }
  });

  it('emits pdsSelect event on value change', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select options='[{"value": "paul", "label": "Paul McCartney"}, {"value": "john", "label": "John Lennon"}]' />`,
    });

    const pdsSelect = page.root;
    if (!pdsSelect || !pdsSelect.shadowRoot) {
      throw new Error('pdsSelect or pdsSelect.shadowRoot is not available');
    }
    const select = pdsSelect.shadowRoot.querySelector('select');

    const pdsSelectEvent = jest.fn();
    page.win.addEventListener('pdsSelect', pdsSelectEvent);

    // Change value to 'paul'
    if (select) {
      select.value = 'paul';
      select.dispatchEvent(new Event('change'));
      await page.waitForChanges();

      // Check if the event is emitted
      expect(pdsSelectEvent).toHaveBeenCalled();
    } else {
      throw new Error('select element is not available');
    }
  });

  it('renders autocomplete attribute when property is passed', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select autocomplete="off" component-id="field-1" label="Name"></pds-select>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-select autocomplete="off" component-id="field-1" label="Name">
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlFor="field-1">Name</label>
            <select autocomplete="off" class="pds-select__field" id="field-1"></select>
            <div aria-hidden="true" class="hidden">
              <slot></slot>
            </div>
            <pds-icon class="pds-select__select-icon" icon="${enlarge}"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });
});
