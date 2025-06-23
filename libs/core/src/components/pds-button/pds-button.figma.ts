import figma, { html } from '@figma/code-connect/html';

figma.connect('https://www.figma.com/design/CC1YmaGKHnsvB28yLY9mEH?node-id=34239-33855', {
  props: {
    iconStart: figma.boolean("Leading icon", {
      true: figma.instance("pds-icon"),
      false: undefined,
    }),
    iconEnd: figma.boolean("Trailing icon", {
      true: figma.instance("pds-icon"),
      false: undefined,
    }),
    isDisabled: figma.enum("State",{
      disabled: true
    }),
    isLoading: figma.enum("State",{
      loading: true
    }),
    variant: figma.enum('Variant', {
      "primary": "primary",
      "secondary": "secondary",
      "destructive": "destructive",
      "accent": "accent",
    }),
    label: figma.string('Label'),
  },
  example: (props) => html`\
  <pds-button
    disabled=${props.isDisabled}
    loading=${props.isLoading}
    variant=${props.variant}
  >
    ${props.iconStart}
    ${props.label}
    ${props.iconEnd}
  </pds-button>`,
});