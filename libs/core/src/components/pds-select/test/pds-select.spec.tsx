import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';

describe('pds-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-select component-id="field-1">
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlFor="field-1"></label>
            <select class="pds-select__field" id="field-1"></select>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with options', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select options='[{"value": "1", "label": "Option 1"}, {"value": "2", "label": "Option 2"}]'></pds-select>`,
    });

    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <pds-select options='[{"value": "1", "label": "Option 1"}, {"value": "2", "label": "Option 2"}]'>
        <mock:shadow-root>
          <div class="pds-select">
            <label></label>
            <select class="pds-select__field">
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </select>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with label', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select label="Select Label"></pds-select>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-select label="Select Label">
        <mock:shadow-root>
          <div class="pds-select">
            <label>Select Label</label>
            <select class="pds-select__field"></select>
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
    expect(page.root).toEqualHtml(`
      <pds-select component-id="field-1" error-message="Error occurred">
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlFor="field-1"></label>
            <select class="pds-select__field" id="field-1"></select>
            <p class="pds-select__error-message" id="field-1__error-message" aria-live="assertive">Error occurred</p>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with helper message', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" helper-message="Helper text"></pds-select>`,
    });

    await page.waitForChanges(); // Ensures component fully renders

    expect(page.root).toEqualHtml(`
      <pds-select component-id="field-1" helper-message="Helper text">
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlFor="field-1"></label>
            <select class="pds-select__field" id="field-1"></select>
            <p class="pds-select__helper-message" id="field-1__helper-message">
              Helper text
            </p>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });

  it('renders with disabled attribute', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" disabled></pds-select>`,
    });

    await page.waitForChanges(); // Ensures component fully renders

    expect(page.root).toEqualHtml(`
      <pds-select aria-disabled="true" component-id="field-1" disabled>
        <mock:shadow-root>
          <div class="pds-select">
            <label htmlFor="field-1"></label>
            <select class="pds-select__field" id="field-1" disabled></select>
          </div>
        </mock:shadow-root>
      </pds-select>
    `);
  });
});
