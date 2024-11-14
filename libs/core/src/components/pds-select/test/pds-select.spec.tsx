import { newSpecPage } from '@stencil/core/testing';
import { PdsSelect } from '../pds-select';

describe('pds-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1"></pds-select>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with label', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select label="Select Label"></pds-select>`,
    });
    if (page.root && page.root.shadowRoot) {
      const label = page.root.shadowRoot.querySelector('label');
      if (label) {
        expect(label.textContent).toBe('Select Label');
      } else {
        throw new Error('label is not available');
      }
    } else {
      throw new Error('page.root or page.root.shadowRoot is not available');
    }
  });

  it('renders with error message', async () => {
    const page = await newSpecPage({
      components: [PdsSelect],
      html: `<pds-select component-id="field-1" error-message="Error occurred"></pds-select>`,
    });

    const errorMessage = page.root?.shadowRoot?.querySelector('.pds-select__error-message');
    expect(errorMessage?.textContent).toBe('Error occurred');
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
      html: `<pds-select component-id="field-1" disabled></pds-select>`,
    });

    await page.waitForChanges(); // Ensures component fully renders

    expect(page.root).toMatchSnapshot();
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

  describe('parsedOptions getter', () => {
    let instance;

    beforeEach(() => {
      instance = {
        options: null,
        get parsedOptions() {
          try {
            console.log('this.options:', this.options);
            return JSON.parse(this.options) || [];
          } catch (error) {
            console.log('error:', error);
            console.error('Invalid options format:', error);
            return [];
          }
        },
      };
    });

    it('should return parsed options when this.options is a valid JSON string', () => {
      instance.options = JSON.stringify([{ key: 'value' }]);
      expect(instance.parsedOptions).toEqual([{ key: 'value' }]);
    });

    it('should return an empty array and log an error when this.options is an invalid JSON string', () => {
      console.error = jest.fn(); // Mock console.error to verify it's called
      instance.options = '{invalidJSON}';

      expect(instance.parsedOptions).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Invalid options format:', expect.any(Error));
    });

    it('should return an empty array when this.options is null', () => {
      instance.options = null;
      expect(instance.parsedOptions).toEqual([]);
    });

    it('should return an empty array when this.options is an empty string', () => {
      instance.options = '';
      expect(instance.parsedOptions).toEqual([]);
    });
  });
});
