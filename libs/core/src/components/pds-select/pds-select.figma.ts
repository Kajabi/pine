import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_SELECT>', {
  props: {
    disabled: figma.enum("State", {
      disabled: "true",
    }),
    errorMessage: figma.nestedProps(".error-message", {
      text: figma.string("Error content"),
    }),
    helperMessage: figma.boolean("Help text", {
      true: figma.string("↪️ Message"),
      false: undefined,
    }),
    label: figma.boolean("Label", {
      true: figma.string("↪️ Message"),
      false: undefined,
    }),
    readonly: figma.enum("State", {
      'read only': "true",
      false: undefined,
    }),
    value: figma.nestedProps(".Input text", {
      text: figma.string("Message"),
    }),
  },
  example: (props) => html`\
  <pds-select
    disabled=${props.disabled}
    error-message=${props.errorMessage.text}
    helper-message=${props.helperMessage}
    label=${props.label}
    readonly=${props.readonly}
    value=${props.value.text}
  ></pds-select>`,
});