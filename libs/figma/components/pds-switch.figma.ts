import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_SWITCH>', {
  props: {
    checked: figma.boolean('Pressed', {
      true: "true",
      false: undefined,
    }),
    disabled: figma.enum("State", {
      disabled: "true",
    }),
    label: figma.boolean("Label", {
      true: "Helper message text",
      false: undefined,
    }),
    helperMessage: figma.boolean("Supporting text", {
      true: "Helper message text",
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