import { newSpecPage } from '@stencil/core/testing';
import { PdsListOptions } from '../pds-list-options';
import { PdsListOption } from '../pds-list-option/pds-list-option'

describe('pds-list-options', () => {
  it('renders the component', async () => {
    const page = await newSpecPage({
      components: [PdsListOptions, PdsListOption],
      html: `
      <pds-list-options>
        <pds-list-option>Item 1</pds-list-option>
        <pds-list-option>Item 2</pds-list-option>
        <pds-list-option>Item 3</pds-list-option>
      </pds-list-options>`
    });
    expect(page.root).toEqualHtml(`
      <pds-list-options class="pds-list-options">
        <mock:shadow-root>
        <div class="pds-list-options">
          <slot></slot>
        </div>
        </mock:shadow-root>
        <pds-list-option>
          <div class="pds-list-option">
            Item 1
          </div>
        </pds-list-option>
        <pds-list-option>
          <div class="pds-list-option">
            Item 2
          </div>
        </pds-list-option>
        <pds-list-option>
          <div class="pds-list-option">
            Item 3
          </div>
        </pds-list-option>
      </pds-list-options>
    `);
  });

  it('should handle arrow up key correctly', async () => {
    const page = await newSpecPage({
      components: [PdsListOptions],
      html: `
      <pds-list-options>
        <pds-list-option>Item 1</pds-list-option>
        <pds-list-option>Item 2</pds-list-option>
      </pds-list-options>
      `,
    });
    const component = page.rootInstance;
    const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });

    component.handleKeyDown(mockEvent);

    // Assert that your expectations are met
    expect(component.focusedOptionIndex).toBe(0); // Assuming you have at least one option
  });

  it('should handle arrow down key correctly', async () => {
    const page = await newSpecPage({
      components: [PdsListOptions],
      html: `
      <pds-list-options>
        <pds-list-option>Item 1</pds-list-option>
        <pds-list-option>Item 2</pds-list-option>
      </pds-list-options>
      `,
    });
    const component = page.rootInstance;
    const mockEventKeyDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const mockEventKeyUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });

    // simulate keydown
    component.handleKeyDown(mockEventKeyDown);

    expect(component.focusedOptionIndex).toBe(0);

    // simulate keydown
    component.handleKeyDown(mockEventKeyDown);

    // Assert that your expectations are met
    expect(component.focusedOptionIndex).toBe(1);

    // simulate keyup
    component.handleKeyDown(mockEventKeyUp);

    // Assert that your expectations are met
    expect(component.focusedOptionIndex).toBe(0);
  });
});
