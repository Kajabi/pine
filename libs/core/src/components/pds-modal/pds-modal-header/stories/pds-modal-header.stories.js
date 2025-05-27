import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-modal-header'),
  component: 'pds-modal-header',
  decorators: [withActions],
  title: 'components/Modal/Modal Header',
}

const BaseTemplate = (args) => html`
<pds-modal open="true" component-id="${args.componentId}">
  <pds-modal-header>
    <pds-box fit padding="md">
      <h1 id="modal-header-demo-heading">Modal Header</h1>
    </pds-box>
  </pds-modal-header>
  <pds-modal-content>
    <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
      Modal content goes here
    </pds-box>
  </pds-modal-content>
  <pds-modal-footer>
    <pds-box fit justify-content="end" padding="md" gap="sm">
      <pds-button>Close</pds-button>
    </pds-box>
  </pds-modal-footer>
</pds-modal>
`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'modal-header-demo',
};

const WithCloseButtonTemplate = (args) => html`
<pds-modal open="true" component-id="${args.componentId}">
  <pds-modal-header>
    <pds-box direction="column" fit padding="md">
      <pds-box
        align-items="center"
        fit
        justify-content="space-between"
      >
        <pds-text tag="h2" size="h3">Modal Title</pds-text>
        <pds-button
          class="pds-modal__close"
          variant="unstyled"
          icon-only="true"
          onclick="document.querySelector('#${args.componentId}').open = false"
          aria-label="Close modal"
          part="close-button"
        >
          <pds-icon slot="start" name="remove" aria-hidden="true"></pds-icon>
        </pds-button>
      </pds-box>
      <pds-box>
        <pds-text tag="p" size="md">Modal Subtitle</pds-text>
      </pds-box>
    </pds-box>
  </pds-modal-header>
  <pds-modal-content>
    <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
      Modal content goes here
    </pds-box>
  </pds-modal-content>
  <pds-modal-footer>
    <pds-box fit justify-content="end" padding="md" gap="sm">
      <pds-button>Close</pds-button>
    </pds-box>
  </pds-modal-footer>
</pds-modal>
`;

export const WithCloseButton = WithCloseButtonTemplate.bind({});
WithCloseButton.args = {
  componentId: 'modal-header-close-demo',
};