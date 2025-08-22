import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_RADIO>', {
  props: {
    checked: figma.boolean("Checked"),
    disabled: figma.enum("State", {
      disabled: "true",
    }),
    helperMessage: figma.boolean("Supporting text", {
      true: figma.string("↪️ Message"),
      false: undefined,
    }),
    label: figma.string("Label content"),
  },
  example: (props) => html`\
    <pds-radio
      checked=${props.checked}
      component-id="radio-example"
      disabled=${props.disabled}
      helper-message=${props.helperMessage}
      label=${props.label}
      name="radio-example"
    ></pds-radio>
  `,
});