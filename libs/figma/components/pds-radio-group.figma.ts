import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_RADIO_GROUP>', {
  props: {
    hasBorder: figma.boolean("has-border", {
      true: "true",
      false: undefined,
    }),
    direction: figma.boolean("has-border", {
      true: "row",
      false: undefined,
    }),
    invalid: figma.boolean("Invalid", {
      true: "true",
      false: undefined,
    }),
    checked: figma.boolean("Checked", {
      true: "true",
      false: undefined,
    }),
    errorMessage: figma.boolean("Invalid", {
      true: "Please select an option",
      false: undefined,
    }),
  },
  example: (props) => html`\
    <pds-radio-group
      component-id="radio-group-example"
      direction=${props.direction}
      error-message=${props.errorMessage}
      group-label="Group label"
      invalid=${props.invalid}
      name="radio-group-example"
    >
      <pds-radio checked=${props.checked} component-id="radio-1" has-border=${props.hasBorder} label="Option 1" value="option-1"></pds-radio>
      <pds-radio component-id="radio-2" has-border=${props.hasBorder} label="Option 2" value="option-2"></pds-radio>
      <pds-radio component-id="radio-3" has-border=${props.hasBorder} label="Option 3" value="option-3"></pds-radio>
    </pds-radio-group>
  `,
});
