import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export default {
  title: 'components/Multiselect',
  component: 'pds-multiselect',
  parameters: {
    docs: {
      description: {
        component: 'A multiselect component with a filter-style dropdown. Displays selected count in the trigger, with search and selected items shown in the dropdown panel. Use triggerWidth, panelWidth, and minWidth to control sizing.',
      },
    },
  },
  argTypes: {
    componentId: {
      control: 'text',
      description: 'A unique identifier for the component',
    },
    label: {
      control: 'text',
      description: 'Label text above the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in the trigger when no items are selected. When items are selected, shows "X item(s)" instead.',
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input inside the dropdown panel.',
    },
    closePanelOnSelect: {
      control: 'boolean',
      description: 'Whether to close the panel after an option is selected.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    maxSelections: {
      control: 'number',
      description: 'Maximum number of selections allowed',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of the dropdown',
    },
    minWidth: {
      control: 'text',
      description: 'Minimum width of the dropdown panel',
    },
    triggerWidth: {
      control: 'text',
      description: 'Width of the trigger button (and reference for dropdown positioning)',
    },
    panelWidth: {
      control: 'text',
      description: 'Width of the dropdown panel (defaults to trigger width)',
    },
    hideLabel: {
      control: 'boolean',
      description: 'Visually hide the label (keeps it accessible)',
    },
    hideSelectedItems: {
      control: 'boolean',
      description: 'Hides the selected items summary section in the dropdown panel',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
    helperMessage: {
      control: 'text',
      description: 'Helper message below the input',
    },
    value: {
      control: 'object',
      description: 'Array of selected option values',
    },
  },
};

const defaultOptions = `
  <option value="1">Marketing</option>
  <option value="2">Sales</option>
  <option value="3">Support</option>
  <option value="4">Engineering</option>
  <option value="5">Design</option>
  <option value="6">Product</option>
  <option value="7">Finance</option>
  <option value="8">Human Resources</option>
`;

export const Default = {
  args: {
    componentId: 'multiselect-default',
    label: 'Select Tags',
    placeholder: 'Select...',
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const WithPreselectedValues = {
  args: {
    componentId: 'multiselect-preselected',
    label: 'Departments',
    placeholder: 'Select...',
    value: ['1', '3'],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const MaxSelections = {
  args: {
    componentId: 'multiselect-max',
    label: 'Select Up to 3 Tags',
    placeholder: 'Select...',
    maxSelections: 3,
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      max-selections="${args.maxSelections}"
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
    <p style="margin-top: var(--pine-dimension-sm); color: var(--pine-color-text-secondary);">
      Maximum ${args.maxSelections} selections allowed
    </p>
  `,
};

export const WithMessage = {
  args: {
    componentId: 'multiselect-helper',
    label: 'Categories',
    placeholder: 'Select...',
    helperMessage: 'Select one or more categories to organize your content.',
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      helper-message="${args.helperMessage}"
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const Invalid = {
  args: {
    componentId: 'multiselect-error',
    label: 'Required Tags',
    placeholder: 'Select...',
    errorMessage: 'Please select at least one tag.',
    invalid: true,
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      error-message="${args.errorMessage}"
      ?invalid=${args.invalid}
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const Disabled = {
  args: {
    componentId: 'multiselect-disabled',
    label: 'Disabled Multiselect',
    placeholder: 'Cannot select...',
    disabled: true,
    value: ['1', '2'],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      ?disabled=${args.disabled}
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const DisabledOptions = {
  args: {
    componentId: 'multiselect-disabled-options',
    label: 'Products',
    placeholder: 'Select products...',
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      <option value="ec-1">Classical Guitar Learning Path</option>
      <option value="ec-2" disabled>Piano Lessons (unavailable)</option>
      <option value="ec-3">Music Theory 101</option>
      <option value="cc-1" disabled>Spring Bootcamp 2025 (sold out)</option>
      <option value="cc-2">Fall Workshop Series</option>
    </pds-multiselect>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Individual options can be disabled using the `disabled` attribute on `<option>` elements, or by setting `disabled: true` on items in the `options` prop. Disabled options are non-interactive and visually muted.',
      },
    },
  },
};

export const HiddenLabel = {
  args: {
    componentId: 'multiselect-hidden-label',
    label: 'Tags (visually hidden)',
    placeholder: 'Select...',
    hideLabel: true,
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      ?hide-label=${args.hideLabel}
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const HiddenSelectedItems = {
  args: {
    componentId: 'multiselect-hidden-selected',
    label: 'Departments',
    placeholder: 'Select...',
    hideSelectedItems: true,
    value: ['1', '2', '3'],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const CustomSearchPlaceholder = {
  args: {
    componentId: 'multiselect-search-placeholder',
    label: 'Filter Offers',
    placeholder: 'Select...',
    searchPlaceholder: 'Search offers...',
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      search-placeholder="${args.searchPlaceholder}"
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const ClosePanelOnSelect = {
  args: {
    componentId: 'multiselect-close-on-select',
    label: 'Quick Tags (closes on each pick)',
    placeholder: 'Select...',
    closePanelOnSelect: true,
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      .closePanelOnSelect=${args.closePanelOnSelect}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
    <p style="margin-top: var(--pine-dimension-sm); color: var(--pine-color-text-secondary);">
      Multi-select mode but the panel closes after each selection. Re-open to select more.
    </p>
  `,
};

export const LongList = {
  args: {
    componentId: 'multiselect-long',
    label: 'Select Countries',
    placeholder: 'Select...',
    maxHeight: '200px',
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      max-height="${args.maxHeight}"
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="mx">Mexico</option>
      <option value="uk">United Kingdom</option>
      <option value="de">Germany</option>
      <option value="fr">France</option>
      <option value="es">Spain</option>
      <option value="it">Italy</option>
      <option value="jp">Japan</option>
      <option value="cn">China</option>
      <option value="kr">South Korea</option>
      <option value="au">Australia</option>
      <option value="br">Brazil</option>
      <option value="ar">Argentina</option>
      <option value="in">India</option>
      <option value="ru">Russia</option>
      <option value="za">South Africa</option>
      <option value="ng">Nigeria</option>
      <option value="eg">Egypt</option>
      <option value="se">Sweden</option>
    </pds-multiselect>
  `,
};

export const CustomWidths = {
  args: {
    componentId: 'multiselect-widths',
    label: 'Narrow Trigger, Wide Panel',
    placeholder: 'Select...',
    triggerWidth: '200px',
    panelWidth: '320px',
    minWidth: '250px',
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      trigger-width="${args.triggerWidth}"
      panel-width="${args.panelWidth}"
      min-width="${args.minWidth}"
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const ConsumerManagedAsync = {
  args: {
    componentId: 'multiselect-async-consumer',
    label: 'Search Contacts',
    placeholder: 'Select...',
    value: [],
  },
  render: (args, { updateArgs } = {}) => {
    // Simulated contact data
    const allContacts = [
      { id: '1', text: 'Alice Johnson' },
      { id: '2', text: 'Bob Smith' },
      { id: '3', text: 'Charlie Brown' },
      { id: '4', text: 'Diana Prince' },
      { id: '5', text: 'Edward Norton' },
      { id: '6', text: 'Fiona Apple' },
    ];

    return html`
      <pds-multiselect
        id="consumer-async-example"
        component-id="${args.componentId}"
        label="${args.label}"
        placeholder="${args.placeholder}"
        .options=${allContacts}
        ?hide-selected-items=${args.hideSelectedItems}
        .value=${args.value}
        @pdsMultiselectSearch=${(e) => {
          console.log('Search query:', e.detail.query);
          // In a real app, you would filter/fetch data here
        }}
        @pdsMultiselectChange=${(e) => {
          console.log('Selected values:', e.detail.values);
          console.log('Selected items:', e.detail.items);
          updateArgs?.({ value: e.detail.values });
        }}
      >
      </pds-multiselect>
      <p style="margin-top: var(--pine-dimension-sm); color: var(--pine-color-text-secondary);">
        Open console to see search and change events.
      </p>
    `;
  },
};

export const CustomEmptyState = {
  args: {
    componentId: 'multiselect-custom-empty',
    label: 'Search Products',
    placeholder: 'Select...',
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      .options=${[]}
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      <div slot="empty" style="text-align: center; padding: var(--pine-dimension-md);">
        <pds-icon icon="search" size="large" style="color: var(--pine-color-text-tertiary);"></pds-icon>
        <p style="margin-top: var(--pine-dimension-xs); color: var(--pine-color-text-secondary);">
          No products found. Try a different search term.
        </p>
      </div>
    </pds-multiselect>
  `,
};

export const GroupedOptions = {
  args: {
    componentId: 'multiselect-grouped',
    label: 'Products',
    placeholder: 'Select products...',
    value: [],
  },
  render: (args, { updateArgs } = {}) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      ?hide-selected-items=${args.hideSelectedItems}
      .value=${args.value}
      @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
    >
      <optgroup label="Evergreen Courses">
        <option value="ec-1">Classical Guitar Learning Path</option>
        <option value="ec-2">Piano Lessons</option>
        <option value="ec-3">Music Theory 101</option>
      </optgroup>
      <optgroup label="Cohort Courses">
        <option value="cc-1">Spring Bootcamp 2025</option>
        <option value="cc-2">Fall Workshop Series</option>
      </optgroup>
      <optgroup label="Newsletters">
        <option value="nl-1">Weekly Digest</option>
        <option value="nl-2">Product Updates</option>
      </optgroup>
      <optgroup label="Communities">
        <option value="cm-1">Guitar Players Community</option>
        <option value="cm-2">Producers Hub</option>
      </optgroup>
    </pds-multiselect>
  `,
};

export const GroupedOptionsViaOptions = {
  args: {
    componentId: 'multiselect-grouped-options',
    label: 'Products',
    placeholder: 'Select products...',
    value: [],
  },
  render: (args, { updateArgs } = {}) => {
    const groupedProducts = [
      { id: 'ec-1', text: 'Classical Guitar Learning Path', group: 'Evergreen Courses' },
      { id: 'ec-2', text: 'Piano Lessons', group: 'Evergreen Courses' },
      { id: 'ec-3', text: 'Music Theory 101', group: 'Evergreen Courses' },
      { id: 'cc-1', text: 'Spring Bootcamp 2025', group: 'Cohort Courses' },
      { id: 'cc-2', text: 'Fall Workshop Series', group: 'Cohort Courses' },
      { id: 'nl-1', text: 'Weekly Digest', group: 'Newsletters' },
      { id: 'nl-2', text: 'Product Updates', group: 'Newsletters' },
      { id: 'cm-1', text: 'Guitar Players Community', group: 'Communities' },
      { id: 'cm-2', text: 'Producers Hub', group: 'Communities' },
    ];

    return html`
      <pds-multiselect
        component-id="${args.componentId}"
        label="${args.label}"
        placeholder="${args.placeholder}"
        ?hide-selected-items=${args.hideSelectedItems}
        .options=${groupedProducts}
        .value=${args.value}
        @pdsMultiselectChange=${(e) => updateArgs?.({ value: e.detail.values })}
      >
      </pds-multiselect>
      <p style="margin-top: var(--pine-dimension-sm); color: var(--pine-color-text-muted);">
        Uses the <code>options</code> prop with a <code>group</code> field on each item — useful for dynamic/async data.
      </p>
    `;
  },
};

export const WithCreateOption = {
  args: {
    componentId: 'multiselect-create',
    label: 'Manage Tags',
    placeholder: 'Select or create tags...',
    value: [],
  },
  render: (args, { updateArgs } = {}) => {
    return html`
      <pds-multiselect
        id="create-example"
        component-id="${args.componentId}"
        label="${args.label}"
        placeholder="${args.placeholder}"
        create-url="/api/tags"
        ?hide-selected-items=${args.hideSelectedItems}
        .value=${args.value}
        @pdsMultiselectCreate=${async (e) => {
          console.log('Creating new tag:', e.detail.query);
          // In a real app, the component handles the POST request
          // This event is just for notification/logging
        }}
        @pdsMultiselectChange=${(e) => {
          console.log('Selected values:', e.detail.values);
          console.log('Selected items:', e.detail.items);
          updateArgs?.({ value: e.detail.values });
        }}
      >
        ${unsafeHTML(defaultOptions)}
      </pds-multiselect>
      <p style="margin-top: var(--pine-dimension-sm); color: var(--pine-color-text-secondary);">
        Type a search query that doesn't match any options to see the "Add" option appear.
        Note: In Storybook, the POST request will fail and create events will not be emitted.
      </p>
      <p style="margin-top: var(--pine-dimension-xs); color: var(--pine-color-text-muted); font-size: 0.875rem;">
        In production with a real API endpoint, clicking "Add" creates the new tag, emits the create event,
        and automatically selects the newly created option.
      </p>
    `;
  },
};