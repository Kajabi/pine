import { html } from 'lit';
import { extractArgTypes } from '@pxtrn/storybook-addon-docs-stencil';

export default {
  argTypes: extractArgTypes('pds-modal'),
  component: 'pds-modal',
  title: 'components/Modal',
  args: {
    closeOnBackdropClick: true,
    componentId: 'demo-modal',
    open: false,
    scrollable: false,
    size: 'md',
  },
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
      ?close-on-backdrop-click="${args.closeOnBackdropClick}"
      ?open="${args.open}"
      ?scrollable="${args.scrollable}"
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
      ?close-on-backdrop-click="${args.closeOnBackdropClick}"
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
      <pds-button id="show-modal" onClick="document.querySelector('#custom-modal').open = true">
        Open Form Modal
      </pds-button>

      <pds-modal id="custom-modal" size="md" ?close-on-backdrop-click="${args.closeOnBackdropClick}">

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
                onclick="document.querySelector('#custom-modal').open = false"
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
                const modal = document.querySelector('#custom-modal');
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
          <pds-button variant="unstyled" onclick="document.querySelector('#custom-modal').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button
              variant="secondary"
              onclick="document.querySelector('#custom-modal').open = false"
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
  size: 'md',
};

const ScrollableTemplate = (args) => {
  return html`
    <div style="padding: 1rem;">
      <pds-button id="show-modal" onClick="document.querySelector('#scroll-modal').open = true">
        Open Scrolling Modal
      </pds-button>

      <pds-modal id="scroll-modal" size="md" ?scrollable="${args.scrollable}">
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
                onclick="document.querySelector('#scroll-modal').open = false"
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
            <pds-button variant="unstyled" onclick="document.querySelector('#scroll-modal').open = false">Close</pds-button>
            <pds-box gap="sm" justify-content="end">
              <pds-button
                variant="secondary"
                onclick="document.querySelector('#scroll-modal').open = false"
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

export const Scrollable = ScrollableTemplate.bind({});
Scrollable.args = {
  size: 'md',
  scrollable: true,
};

const FullscreenTemplate = (args) => html`
    <div style="padding: 1rem;">
      <pds-button
        variant="primary"
        onclick="document.querySelector('#demo-modal').open = true"
      >Open Modal</pds-button>

      <pds-modal
        id="demo-modal"
        size=${args.size}
        ?close-on-backdrop-click=${args.closeOnBackdropClick}
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
                  onclick="document.querySelector('#demo-modal').open = false"
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
            <pds-button variant="unstyled" onclick="document.querySelector('#demo-modal').open = false">Close</pds-button>
            <pds-box gap="sm" justify-content="end">
              <pds-button
                variant="secondary"
                onclick="document.querySelector('#demo-modal').open = false"
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
  };
