import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=35829-10264', {
  props: {
    helperMessage: figma.boolean("Help text", {
      true: figma.string("Help content"),
      false: undefined,
    }),
    label: figma.boolean("Label", {
        true: figma.string("Label content"),
        false: undefined,
      }),
    disabled: figma.enum("State", {
      disabled: "true",
    }),
    errorMessage: figma.nestedProps(".error-message", {
      text: figma.string("Error content"),
    }),
    invalid: figma.enum("State", {
      error: "true",
    }),
    readonly: figma.enum("State", {
      'read-only': "true",
    }),
    value: figma.nestedProps(".Input text", {
      text: figma.string("Message"),
    }),
  },
  example: (props) => html`\
    <pds-textarea
      disabled=${props.disabled}
      error-message=${props.errorMessage.text}
      helper-message=${props.helperMessage}
      invalid=${props.invalid}
      label=${props.label}
      readonly=${props.readonly}
      value=${props.value.text}
    ></pds-textarea>
  `,
});