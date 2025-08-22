import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_LINK>', {
  props: {
    color: figma.enum('Variant', {
      'destructive': 'destructive',
      'accent': 'accent',
    }),
    external: figma.enum('Variant', {
      'external': true,
    }),
    fontSize: figma.enum('Size', {
      'md': 'md',
      'lg': 'lg',
    }),
    label: figma.string('Label'),
    variant: figma.enum('Variant', {
      'plain': 'plain',
    }),
  },
  example: (props) => html`
  <pds-link
    color=${props.color}
    external=${props.external}
    font-size=${props.fontSize}
    variant=${props.variant}
    >${props.label}
  </pds-link>`,
});