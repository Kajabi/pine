import figma, { html } from '@figma/code-connect/html';

const sharedProps = {
  label: figma.string('Label'),
  iconStart: figma.boolean("Leading icon", {
    true: html`<pds-icon name="home" slot="start"></pds-icon>`,
    false: undefined,
  }),
  iconEnd: figma.boolean("Trailing icon", {
    true: html`<pds-icon name="home" slot="end"></pds-icon>`,
    false: undefined,
  }),
  isDisabled: figma.enum("State",{
    disabled: true
  }),
  isLoading: figma.enum("State",{
    loading: true
  }),
}

figma.connect('<FIGMA_BUTTON_PRIMARY>', {
  props: {
    ...sharedProps,
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

figma.connect('<FIGMA_BUTTON_ICON>', {
  props: {
    isDisabled: figma.enum("State",{
      disabled: true
    }),
    name: figma.string("Icon swap"),
    variant: figma.enum('Variant', {
      "secondary": "secondary",
      "ghost": "unstyled",
    }),
  },
  example: (props) => html`\
  <pds-button
    disabled=${props.isDisabled}
    iconOnly="true"
    variant=${props.variant}
  >
    <pds-icon slot="start" aria-hidden="true" name=${props.name}></pds-icon>
    ${props.name}
  </pds-button>`,
});

figma.connect('<FIGMA_BUTTON_GROUP>', {
  props: {
    variant: figma.enum('Variant', {
      "Left": "start",
      "Gap": "space-between",
      "Right": "end",
    }),
    button: figma.children("pds-button"),
    link: figma.children("Link"),
  },
  example: (props) => {
    // NOTE: this is not supported by figma, but awaiting the capability
    // const linkBox = props.link ? html`<pds-box>${props.link}</pds-box>` : '';
    // ${props.link ? html`<pds-box>${props.link}</pds-box>` : ''}
    return html`
      <pds-box fit>
        <pds-box
          justify-content=${props.variant}
        >
          ${props.button}
        </pds-box>
      </pds-box>`;
  },
});