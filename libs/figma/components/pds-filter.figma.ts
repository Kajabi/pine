import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_FILTER>', {
  props: {
    variant: figma.enum('State', {
      'rest': 'default',
      'hover': 'default',
      'focus': 'default',
      'active': 'selected',
      'active hover': 'selected',
      'more default': 'more',
      'more hover': 'more',
      'more focus': 'more',
      'clear all': 'clear',
      'clear all hover': 'clear',
    }),
    icon: figma.enum('State', {
      'rest': 'flash',
      'hover': 'flash',
      'focus': 'flash',
      'active': 'flash',
      'active hover': 'flash',
      'more default': 'add-circle',
      'more hover': 'add-circle',
      'more focus': 'add-circle',
      'clear all': undefined,
      'clear all hover': undefined,
    }),
    text: figma.enum('State', {
      'rest': 'Filter Name',
      'hover': 'Filter Name',
      'focus': 'Filter Name',
      'active': 'Filter Name',
      'active hover': 'Filter Name',
      'more default': 'Filter Name',
      'more hover': 'Filter Name',
      'more focus': 'Filter Name',
      'clear all': 'Clear all',
      'clear all hover': 'Clear all',
    }),
    popoverSlot: figma.enum('State', {
      'rest': html`<!-- Popover content goes here -->`,
      'hover': html`<!-- Popover content goes here -->`,
      'focus': html`<!-- Popover content goes here -->`,
      'active': html`<!-- Popover content goes here -->`,
      'active hover': html`<!-- Popover content goes here -->`,
      'more default': html`<!-- Popover content goes here -->`,
      'more hover': html`<!-- Popover content goes here -->`,
      'more focus': html`<!-- Popover content goes here -->`,
      'clear all': undefined,
      'clear all hover': undefined,
    }),
  },
  example: (props) => html`<pds-filter
    component-id="filter-1"
    variant=${props.variant}
    icon=${props.icon}
    text=${props.text}
  >${props.popoverSlot}</pds-filter>`,
});
