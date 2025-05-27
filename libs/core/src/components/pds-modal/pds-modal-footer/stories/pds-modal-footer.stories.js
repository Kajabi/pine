import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-modal-footer'),
  component: 'pds-modal-footer',
  decorators: [withActions],
  title: 'components/Modal/Modal Footer',
}

const BaseTemplate = () => html`
<pds-modal open="true" component-id="modal-footer-demo">
  <pds-modal-header>
    <pds-box direction="column" fit padding="md">
      <h1 id="modal-footer-demo-heading">Modal Title</h1>
    </pds-box>
  </pds-modal-header>
  <pds-modal-content>
    <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
      Modal content goes here
    </pds-box>
  </pds-modal-content>
  <pds-modal-footer>
    <pds-box fit justify-content="end" padding="md" gap="sm">
      <pds-button variant="secondary">Cancel</pds-button>
      <pds-button>Submit</pds-button>
    </pds-box>
  </pds-modal-footer>
</pds-modal>
`;

export const Default = BaseTemplate.bind({});
Default.args = {};

const SingleButtonTemplate = () => html`
<pds-modal open="true" component-id="modal-footer-single-demo">
  <pds-modal-header>
    <pds-box direction="column" fit padding="md">
      <h1 id="modal-footer-single-demo-heading">Modal Title</h1>
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

export const SingleButton = SingleButtonTemplate.bind({});
SingleButton.args = {};

const MultipleButtonsTemplate = () => html`
<pds-modal open="true" component-id="modal-footer-multiple-demo">
  <pds-modal-header>
    <pds-box direction="column" fit padding="md">
      <h1 id="modal-footer-multiple-demo-heading">Modal Title</h1>
    </pds-box>
  </pds-modal-header>
  <pds-modal-content>
    <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
      Modal content goes here
    </pds-box>
  </pds-modal-content>
  <pds-modal-footer>
    <pds-box
      justify-content="space-between"
      fit
      padding="md"
    >
      <pds-button variant="unstyled">Close</pds-button>
      <pds-box gap="sm" justify-content="end">
        <pds-button variant="secondary">Cancel</pds-button>
        <pds-button variant="primary">Confirm</pds-button>
      </pds-box>
    </pds-box>
  </pds-modal-footer>
</pds-modal>
`;

export const MultipleButtons = MultipleButtonsTemplate.bind({});
MultipleButtons.args = {};