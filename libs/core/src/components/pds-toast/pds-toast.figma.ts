import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/file/CC1YmaGKHnsvB28yLY9mEH?node-id=2757-22274', {
  props: {
    action: figma.boolean("Action", {
      true: html`<pds-link href="URL" color="var(--pine-color-white)">Visit</pds-link>`
    }),
    dismissible: figma.boolean('Dismissible'),
    message: figma.string('Message'),
    type: figma.enum('Variant', {
  "default": "default",
  "danger": "danger",
}),
  },
  example: (props) => html`<pds-toast
    dismissible=${props.dismissible}
    type=${props.type}
  >${props.message} ${props.action}</pds-toast>`,
});
