import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_LINK>', {
  props: {
    color: figma.enum('Variant', {
      'destructive': 'danger',
      'accent': 'accent',
      'inverted': 'secondary',
    }),
    external: figma.enum('Variant', {
      'external': true,
    }),
    fontSize: figma.enum('Size', {
      'md': undefined,
      'sm': 'sm',
    }),
    label: figma.string('Label'),
    variant: figma.enum('Variant', {
      'plain': 'plain',
      'inline': 'inline',
    }),
  },
  example: (props) => html`\
  <pds-link
    href="#"
    color=${props.color}
    external=${props.external}
    font-size=${props.fontSize}
    variant=${props.variant}
  >
    ${props.label}
  </pds-link>`,
});
