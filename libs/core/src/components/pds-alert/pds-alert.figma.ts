import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/file/CC1YmaGKHnsvB28yLY9mEH?node-id=34239-39546', {
  props: {
    heading: figma.string('Heading'),
    variant: figma.enum('Variant', {
  "Default": "default",
  "Danger": "danger",
  "Info": "info",
  "Success": "success",
  "Warning": "warning"
}),
    small: figma.boolean('Small'),
  },
  example: (props) => html`<pds-alert
    heading=${props.heading}
    variant=${props.variant}
    ?small=${props.small}
  ></pds-alert>`,
});
