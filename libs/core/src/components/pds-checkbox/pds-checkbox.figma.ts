import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=34239-44824', {
  props: {
    checked: figma.boolean('Checked', {
      true: "true",
      false: undefined,
    }),
    disabled: figma.enum("State", {
      disabled: "true",
    }),
    helperMessage: figma.boolean("Supporting text", {
      true: figma.string("↪️ Message"),
      false: undefined,
    }),
    indeterminate: figma.boolean('Indeterminate', {
      true: "true",
      false: undefined,
    }),
    label: figma.boolean("Label", {
      true: figma.string("↪️ Message"),
      false: undefined,
    }),
  },
  example: (props) => html`\
  <pds-checkbox
    checked=${props.checked}
    disabled=${props.disabled}
    helper-message=${props.helperMessage}
    indeterminate=${props.indeterminate}
    label=${props.label}
  ></pds-checkbox>
  `,
});