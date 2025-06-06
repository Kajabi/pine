import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  argTypes: extractArgTypes('pds-modal'),
  component: 'pds-modal',
  decorators: [withActions],
  title: 'components/Modal',
  args: {
    backdropDismiss: true,
    componentId: 'modal-demo',
    open: false,
    size: 'md',
  },
  parameters: {
    actions: {
      handles: ['pdsModalOpen', 'pdsModalClose'],
    }
  }
}

const BaseTemplate = (args) => html`
  <div>
    <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true">
      Open Modal
    </pds-button>

    <pds-modal
      id="${args.componentId}"
      component-id="${args.componentId}"
      size="${args.size}"
      ?backdrop-dismiss="${args.backdropDismiss}"
      ?open="${args.open}"
    >
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
          <p>This is the modal content. You can put any content here.</p>
        </pds-box>
      </pds-modal-content>

      <pds-modal-footer>
        <pds-box
          justify-content="space-between"
          fit
          padding="md"
        >
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button variant="secondary" onClick="document.querySelector('#${args.componentId}').open = false">
              Cancel
            </pds-button>
            <pds-button variant="primary">Confirm</pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>
  </div>
`;

export const Default = BaseTemplate.bind();
Default.args = {
  componentId: 'demo-modal',
  size: 'md',
  open: false,
};

const DestructiveTemplate = (args) => html`
  <div>
    <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true">
      Open Modal
    </pds-button>

    <pds-modal
      id="${args.componentId}"
      component-id="${args.componentId}"
      size="${args.size}"
      ?backdrop-dismiss="${args.backdropDismiss}"
      ?open="${args.open}"
    >
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
          <p>This is the modal content. You can put any content here.</p>
        </pds-box>
      </pds-modal-content>
      <pds-modal-footer>
        <pds-box
          justify-content="space-between"
          fit
          padding="md"
        >
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button variant="secondary" onClick="document.querySelector('#${args.componentId}').open = false">
              Cancel
            </pds-button>
            <pds-button variant="destructive">Confirm</pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>
  </div>
`;

export const Destructive = DestructiveTemplate.bind({});
Destructive.args = {
  size: 'md',
};

const CustomContentTemplate = (args) => html`
    <div style="padding: 1rem;">
      <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true">
        Open Form Modal
      </pds-button>

      <pds-modal
        id="${args.componentId}"
        size="${args.size}"
        ?backdrop-dismiss="${args.backdropDismiss}"
        ?open="${args.open}"
      >

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
          <pds-box direction="column" padding-inline-start="md" padding-inline-end="md" fit>
            <form
              id="demo-form"
              @submit=${(e) => {
                e.preventDefault();
                const modal = document.querySelector('#${args.componentId}');
                modal?.close();
              }}
            >
              <div style="display: grid; gap: 1rem;">
                <pds-input label="Full Name" required></pds-input>
                <pds-input label="Email" type="email" required></pds-input>
                <pds-input label="Password" type="password" required></pds-input>
                <pds-checkbox>I agree to the terms and conditions</pds-checkbox>
              </div>
            </form>
          </pds-box>
        </pds-modal-content>

        <pds-modal-footer>
          <pds-box
            justify-content="space-between"
            fit
            padding="md"
        >
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button
              variant="secondary"
              onclick="document.querySelector('#${args.componentId}').open = false"
            >
              Cancel
            </pds-button>
            <pds-button variant="primary" form="demo-form" type="submit">Submit</pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>
  </div>
`;

export const CustomContent = CustomContentTemplate.bind({});
CustomContent.args = {
  componentId: 'custom-modal',
  size: 'md',
  open: false,
};

const ScrollableTemplate = (args) => {
  return html`
    <div style="padding: 1rem;">
      <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true">
        Open Scrolling Modal
      </pds-button>

      <pds-modal
        id="${args.componentId}"
        size="${args.size}"
        ?backdrop-dismiss="${args.backdropDismiss}"
        ?open="${args.open}"
      >
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
          <pds-box direction="column" padding="md">
            ${Array(20)
              .fill(0)
              .map(
                () => html`
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                    ea commodo consequat.
                  </p>
                `
              )}
          </pds-box>
        </pds-modal-content>

        <pds-modal-footer>
          <pds-box
            justify-content="space-between"
            fit
            padding="md"
          >
            <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
            <pds-box gap="sm" justify-content="end">
              <pds-button
                variant="secondary"
                onclick="document.querySelector('#${args.componentId}').open = false"
              >
                Cancel
              </pds-button>
              <pds-button variant="primary">Confirm</pds-button>
            </pds-box>
          </pds-box>
        </pds-modal-footer>
      </pds-modal>
    </div>
  `;
};

export const ScrollableContent = ScrollableTemplate.bind({});
ScrollableContent.args = {
  size: 'md',
  componentId: 'scrollable-modal',
  open: false,
};

const FullscreenTemplate = (args) => html`
  <div style="padding: 1rem;">
    <pds-button
      variant="primary"
      onclick="document.querySelector('#${args.componentId}').open = true"
    >Open Modal</pds-button>

    <pds-modal
      id="${args.componentId}"
      size=${args.size}
      ?backdrop-dismiss=${args.backdropDismiss}
      ?open="${args.open}"
    >
      <pds-modal-header>
        <pds-box
          direction="column"
          fit
          padding="md"
          padding-block-start="xs"
          padding-block-end="xs"
        >
          <pds-box
            align-items="center"
            fit
            justify-content="space-between"
          >
            <pds-box flex="grow">
              <pds-text tag="h2" size="h3">Modal Title</pds-text>
            </pds-box>
            <pds-box flex="shrink">
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
          </pds-box>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content>
        <pds-box direction="column" padding="md">
          <p>This is a sample modal dialog. It demonstrates the basic features of the pds-modal component.</p>
          <p>The modal supports:</p>
          <ul>
            <li>Different sizes (small, medium, large)</li>
            <li>Optional close button</li>
            <li>Backdrop click to close</li>
            <li>Escape key to close</li>
            <li>Focus management</li>
            <li>ARIA attributes for accessibility</li>
          </ul>
        </pds-box>
      </pds-modal-content>
      <pds-modal-footer>
        <pds-box
          justify-content="space-between"
          fit
          padding="md"
        >
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button
              variant="secondary"
              onclick="document.querySelector('#${args.componentId}').open = false"
            >
              Cancel
            </pds-button>
            <pds-button variant="primary">Confirm</pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>
  </div>
`;

export const Fullscreen = FullscreenTemplate.bind({});
Fullscreen.args = {
  size: 'fullscreen',
  componentId: 'fullscreen-modal',
  open: false,
};
