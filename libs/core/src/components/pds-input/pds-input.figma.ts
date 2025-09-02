import figma, { html } from '@figma/code-connect/html';

const sharedProps = {
  disabled: figma.enum("State", {
    disabled: "true",
  }),
  errorMessage: figma.nestedProps(".error-message", {
    text: figma.string("Error content"),
  }),
  helperMessage: figma.boolean("Has help message", {
    true: figma.string("Help message"),
    false: undefined,
  }),
  invalid: figma.enum("State", {
    error: "true",
  }),
  label: figma.boolean("Has label", {
    true: figma.string("Label"),
    false: undefined,
  }),
  prefix: figma.boolean("Prefix", {
    true: "Prefix",
    false: undefined,
  }),
  readonly: figma.enum("State", {
    'read-only': "true",
  }),
  value: figma.nestedProps(".Input text", {
    text: figma.string("Message"),
  }),
}

figma.connect('<FIGMA_INPUT_TEXT>', {
  props: {
    ...sharedProps,
  },
  example: (props) => html`\
    <pds-input
      disabled=${props.disabled}
      error-message=${props.errorMessage.text}
      helper-message=${props.helperMessage}
      invalid=${props.invalid}
      label=${props.label}
      readonly=${props.readonly}
      value=${props.value.text}
    ></pds-input>
  `,
});

figma.connect('<FIGMA_INPUT_SEARCH>', {
  props: {
    ...sharedProps,
  },
  example: (props) => html`\
    <pds-input
      disabled=${props.disabled}
      error-message=${props.errorMessage.text}
      helper-message=${props.helperMessage}
      invalid=${props.invalid}
      label=${props.label}
      readonly=${props.readonly}
      type="number"
      value=${props.value.text}
    ></pds-input>
  `,
});

figma.connect('<FIGMA_INPUT_EMAIL>', {
  props: {
    value: figma.string('Message'),
  },
  example: (props) => html`\
    <pds-input value=${props.value}></pds-input>
  `,
});

figma.connect('<FIGMA_INPUT_EMAIL>', {
  props: {
    value: figma.string('Message'),
  },
  example: (props) => html`\
    <pds-input value=${props.value}></pds-input>
  `,
})

figma.connect('<FIGMA_INPUT_PASSWORD>', {
  props: {
    errorMessage: figma.instance('Error message'),
  },
  example: (props) => html`\
    <pds-input error-message=${props.errorMessage}></pds-input>
  `,
});