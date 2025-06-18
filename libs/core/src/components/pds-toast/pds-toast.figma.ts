import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/file/CC1YmaGKHnsvB28yLY9mEH?node-id=2757-22274', {
  props: {
    dismissible: figma.boolean('Dismissible'),
    type: figma.enum('Variant', {
  "Default": "default",
  "Danger": "danger",
  "Loading": "loading"
}),
  },
  example: (props) => html`<pds-toast
    ?dismissible=${props.dismissible}
    type=${props.type}
  ></pds-toast>`,
});
