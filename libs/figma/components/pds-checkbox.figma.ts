import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_CHECKBOX>', {
  props: {
    checked: figma.boolean('Checked', {
      true: "true",
      false: undefined,
    }),
    disabled: figma.enum("State", {
      disabled: "true",
    }),
    helperMessage: figma.boolean("Helper message", {
      true: "Save my login details for next time.",
      false: undefined,
    }),
    indeterminate: figma.boolean('Indeterminate', {
      true: "true",
      false: undefined,
    }),
    label: figma.boolean("Label", {
      true: "Remember me",
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