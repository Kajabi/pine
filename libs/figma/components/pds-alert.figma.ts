import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_ALERT>', {
  props: {
    actions: figma.enum('Actions', {
      "none": undefined,
      "primary only": html`<pds-button slot='actions'>Primary</pds-button>`,
      "primary + secondary": html`<pds-button slot='actions'>Primary</pds-button><pds-button slot='actions' variant='secondary'>Secondary</pds-button>`,
    }),
    // actions: figma.children('Actions'),
    description: figma.string('Description'),
    dismissable: figma.boolean('Dismissable'),
    heading: figma.string('Heading'),
    small: figma.boolean('Small'),
    variant: figma.enum('Variant', {
      "default": "default",
      "info": "info",
      "success": "success",
      "warning": "warning",
      "danger/critical": "danger",
    }),
  },
  example: (props) => html`<pds-alert
    dismissible=${props.dismissable}
    heading=${props.heading}
    variant=${props.variant}
    small=${props.small}
  >${props.description}
  ${props.actions}
  </pds-alert>`,
});
