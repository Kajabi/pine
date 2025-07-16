import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=736-21748', {
  props: {
    checked: figma.boolean('Pressed', {
      true: "true",
      false: undefined,
    }),
    disabled: figma.enum("State", {
      disabled: "true",
    }),
    label: figma.boolean("Label", {
      true: figma.string("↪️ Message"),
      false: undefined,
    }),
    helperMessage: figma.boolean("Supporting text", {
      true: figma.string("↪️ Message"),
      false: undefined,
    }),
  },
  example: (props) => html`\
    <pds-switch
      checked=${props.checked}
      disabled=${props.disabled}
      helper-message=${props.helperMessage}
      label=${props.label}
    ></pds-switch>
  `,
});