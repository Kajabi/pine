import figma, { html } from '@figma/code-connect/html';

figma.connect('<FIGMA_MODAL>', {
  props: {
    // description: figma.nestedProps('Header Container', {
    //   text: figma.textContent('Text Layer'),
    // }),
    description: figma.textContent('Container'),
    footer: figma.children('Button group'),
    header: figma.children('Container'),
    size: figma.enum('Size', {
      'small (520px)': 'sm',
      'medium (700px)': 'md',
      'large (900px)': 'lg',
    }),
    // title: figma.nestedProps('Title', {
    //   text: figma.textContent('Title'),
    // }),
    title: figma.textContent('Title'),
  },
  example: (props) => html`
  <pds-modal size=${props.size}>
    <pds-modal-header>
      <pds-box direction="column" fit padding="md">
        <pds-box
          align-items="center"
          fit
          justify-content="space-between"
        >
          <pds-text tag="h2" size="h3">${props.title}</pds-text>
          <pds-button
            class="pds-modal__close"
            variant="unstyled"
            icon-only="true"
            onclick="document.querySelector('#default-modal-1').open = false"
            aria-label="Close modal"
            part="close-button"
          >
            <pds-icon slot="start" name="remove" aria-hidden="true"></pds-icon>
          </pds-button>
        </pds-box>
        <pds-box>
          <pds-text tag="p" size="md">${props.description}</pds-text>
        </pds-box>
      </pds-box>
    </pds-modal-header>
    <pds-modal-content>
      MODAL CONTENT
    </pds-modal-content>
    <pds-modal-footer>${props.footer}</pds-modal-footer>
  </pds-modal>`,
});