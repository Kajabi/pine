import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export default {
  title: 'Components/Multiselect',
  component: 'pds-multiselect',
  parameters: {
    docs: {
      description: {
        component: 'A multiselect component with typeahead search, checkboxes, and optional async data fetching.',
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
      description: 'Placeholder text when no items are selected',
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
    hideLabel: {
      control: 'boolean',
      description: 'Visually hide the label (keeps it accessible)',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
    helperMessage: {
      control: 'text',
      description: 'Helper message below the input',
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
    placeholder: 'Search tags...',
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const WithPreselectedValues = {
  args: {
    componentId: 'multiselect-preselected',
    label: 'Departments',
    placeholder: 'Search departments...',
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      .value=${['1', '3']}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const MaxSelections = {
  args: {
    componentId: 'multiselect-max',
    label: 'Select Up to 3 Tags',
    placeholder: 'Search...',
    maxSelections: 3,
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      max-selections="${args.maxSelections}"
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
    <p style="margin-top: var(--pine-dimension-sm); color: var(--pine-color-text-secondary);">
      Maximum ${args.maxSelections} selections allowed
    </p>
  `,
};

export const WithHelperMessage = {
  args: {
    componentId: 'multiselect-helper',
    label: 'Categories',
    placeholder: 'Search categories...',
    helperMessage: 'Select one or more categories to organize your content.',
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      helper-message="${args.helperMessage}"
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const WithError = {
  args: {
    componentId: 'multiselect-error',
    label: 'Required Tags',
    placeholder: 'Search tags...',
    errorMessage: 'Please select at least one tag.',
    invalid: true,
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      error-message="${args.errorMessage}"
      ?invalid=${args.invalid}
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
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      ?disabled=${args.disabled}
      .value=${['1', '2']}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const HiddenLabel = {
  args: {
    componentId: 'multiselect-hidden-label',
    label: 'Tags (visually hidden)',
    placeholder: 'Search tags...',
    hideLabel: true,
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      ?hide-label=${args.hideLabel}
    >
      ${unsafeHTML(defaultOptions)}
    </pds-multiselect>
  `,
};

export const LongList = {
  args: {
    componentId: 'multiselect-long',
    label: 'Select Countries',
    placeholder: 'Search countries...',
    maxHeight: '200px',
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      max-height="${args.maxHeight}"
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

export const ConsumerManagedAsync = {
  args: {
    componentId: 'multiselect-async-consumer',
    label: 'Search Contacts',
    placeholder: 'Type to search...',
  },
  render: (args) => {
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
        @pdsMultiselectSearch=${(e) => {
          console.log('Search query:', e.detail.query);
          // In a real app, you would filter/fetch data here
        }}
        @pdsMultiselectChange=${(e) => {
          console.log('Selected values:', e.detail.values);
          console.log('Selected items:', e.detail.items);
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
    placeholder: 'Type to search products...',
  },
  render: (args) => html`
    <pds-multiselect
      component-id="${args.componentId}"
      label="${args.label}"
      placeholder="${args.placeholder}"
      .options=${[]}
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
