import figma, { html } from '@figma/code-connect/html';

const sharedProps = {
  label: figma.string('Label'),
  iconStart: figma.boolean("Leading icon", {
    true: html`<pds-icon name="home" slot="start" aria-hidden="true"></pds-icon>`,
    false: undefined,
  }),
  iconEnd: figma.boolean("Trailing icon", {
    true: html`<pds-icon name="home" slot="end" aria-hidden="true"></pds-icon>`,
    false: undefined,
  }),
  isDisabled: figma.enum("State",{
    disabled: true
  }),
  isLoading: figma.enum("State",{
    loading: true
  }),
  size: figma.enum("Size", {
    "default - 36px": undefined,
    "small - 32px": "small",
    "micro - 24px": "micro",
  }),
}

figma.connect('<FIGMA_BUTTON_PRIMARY>', {
  props: {
    ...sharedProps,
    variant: figma.enum('Variant', {
      "primary": "primary",
      "secondary": "secondary",
      "tertiary": "tertiary",
      "destructive": "destructive",
      "accent": "accent",
    }),
    iconOnlyAttr: figma.boolean('Icon only', {
      true: "true",
      false: undefined,
    }),
    iconOnlyIcon: figma.boolean('Icon only', {
      true: html`<pds-icon slot="start" aria-hidden="true" name="gear"></pds-icon>`,
      false: undefined,
    }),
    label: figma.string('Label'),
  },
  example: (props) => html`\
  <pds-button
    disabled=${props.isDisabled}
    loading=${props.isLoading}
    icon-only=${props.iconOnlyAttr}
    size=${props.size}
    variant=${props.variant}
  >
    ${props.iconOnlyIcon}
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

figma.connect('<FIGMA_BUTTON_FILTER>', {
  props: {
    isDisabled: figma.enum("Property 1",{
      disabled: true
    }),
  },
  example: (props) => html`\
  <pds-button
    disabled=${props.isDisabled}
    variant="filter"
  >
    Filter option
  </pds-button>`,
});
