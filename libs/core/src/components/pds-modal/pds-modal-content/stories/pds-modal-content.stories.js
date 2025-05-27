import { html } from 'lit-html';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-modal-content'),
  component: 'pds-modal-content',
  decorators: [withActions],
  title: 'components/Modal/Modal Content',
}

const BaseTemplate = (args) => html`
<div>
  <pds-button id="show-modal" onClick="document.querySelector("#${args.componentId}").open = true">
    Open Modal
  </pds-button>

  <pds-modal open="${args.open}" component-id="${args.componentId}">
    <pds-modal-header>
      <pds-box direction="column" fit padding="md">
        <h2 id="modal-content-demo-heading">Modal Title</h2>
      </pds-box>
    </pds-modal-header>
    <pds-modal-content scrollable="${args.scrollable}">
      <p>This is the modal content area. It can contain any HTML content.</p>
      <p>The content can be made scrollable by setting the scrollable property.</p>
    </pds-modal-content>
    <pds-modal-footer>
      <pds-button>Close</pds-button>
    </pds-modal-footer>
  </pds-modal>
</div>
`;

export const Default = BaseTemplate.bind({});
Default.args = {
  componentId: 'modal-content-demo',
  open: false,
  scrollable: false
};

export const Scrollable = BaseTemplate.bind({});
Scrollable.args = {
  scrollable: true
};

const LongContentTemplate = (args) => html`
<pds-modal open="true" component-id="modal-content-scroll-demo" scrollable="${args.scrollable}">
  <pds-modal-header>
    <pds-box direction="column" fit padding="md">
      <h1 id="modal-content-scroll-demo-heading">Scrollable Content</h1>
    </pds-box>
  </pds-modal-header>
  <pds-modal-content scrollable="${args.scrollable}">
    <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
      <p>This is a modal with a lot of content to demonstrate scrolling.</p>
      ${Array(20).fill().map(() => html`<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>`)}
    </pds-box>
  </pds-modal-content>
  <pds-modal-footer>
    <pds-box fit justify-content="end" padding="md" gap="sm">
      <pds-button>Close</pds-button>
    </pds-box>
  </pds-modal-footer>
</pds-modal>
`;

export const LongContent = LongContentTemplate.bind({});
LongContent.args = {
  scrollable: true
};