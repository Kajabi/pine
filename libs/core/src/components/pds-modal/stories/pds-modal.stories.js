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
    scrollable: true,
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
      ?backdrop-dismiss=${args.backdropDismiss}
      scrollable="${args.scrollable}"
      ?open=${args.open}
      key="${args.scrollable ? 'scrollable' : 'non-scrollable'}"
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
      ?backdrop-dismiss=${args.backdropDismiss}
      ?open=${args.open}
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
        ?backdrop-dismiss=${args.backdropDismiss}
        ?open=${args.open}
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
        ?backdrop-dismiss=${args.backdropDismiss}
        ?open=${args.open}
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
      ?open=${args.open}
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

const NonScrollableTemplate = (args) => html`
  <div style="padding: 1rem;">
    <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true">
      Open Non-Scrollable Modal
    </pds-button>

    <pds-modal
      id="${args.componentId}"
      component-id="${args.componentId}"
      size="${args.size}"
      ?backdrop-dismiss=${args.backdropDismiss}
      scrollable="${args.scrollable}"
      ?open=${args.open}
      key="${args.scrollable ? 'scrollable' : 'non-scrollable'}"
    >
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box
            align-items="center"
            fit
            justify-content="space-between"
          >
            <pds-text tag="h2" size="h3">Non-Scrollable Modal</pds-text>
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
            <pds-text tag="p" size="md">Content overflow is handled naturally</pds-text>
          </pds-box>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content>
        <pds-box direction="column" padding-inline-start="md" padding-inline-end="md">
          <p>This modal has scrollable=false, so content will overflow naturally.</p>
          <p>Use this when you want to control overflow behavior differently.</p>
          <p>This is ideal for modals with fixed-height content or custom overflow handling.</p>
          <p>This modal has scrollable=false, so content will overflow naturally.</p>
          <p>Use this when you want to control overflow behavior differently.</p>
          <p>This is ideal for modals with fixed-height content or custom overflow handling.</p>
          <p>This modal has scrollable=false, so content will overflow naturally.</p>
          <p>Use this when you want to control overflow behavior differently.</p>
          <p>This modal has scrollable=false, so content will overflow naturally.</p>
          <p>Use this when you want to control overflow behavior differently.</p>
          <p>This is ideal for modals with fixed-height content or custom overflow handling.</p>
          <p>This modal has scrollable=false, so content will overflow naturally.</p>
          <p>Use this when you want to control overflow behavior differently.</p>
          <p>This is ideal for modals with fixed-height content or custom overflow handling.</p>
          <p>This modal has scrollable=false, so content will overflow naturally.</p>
          <p>Use this when you want to control overflow behavior differently.</p>
          <p>This is ideal for modals with fixed-height content or custom overflow handling.</p>
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

export const NonScrollable = NonScrollableTemplate.bind({});
NonScrollable.args = {
  size: 'md',
  componentId: 'non-scrollable-modal',
  scrollable: false,
  open: false,
};

const CustomBordersTemplate = () => html`
  <div style="padding: 1rem;">
    <pds-box gap="sm" direction="column">
      <pds-text tag="h3" size="h4">Border Examples</pds-text>
      <pds-box gap="sm" wrap>
        <pds-button id="show-modal-none" onClick="document.querySelector('#border-none-modal').open = true">
          border="none"
        </pds-button>
        <pds-button id="show-modal-top" onClick="document.querySelector('#border-top-modal').open = true">
          border="top"
        </pds-button>
        <pds-button id="show-modal-bottom" onClick="document.querySelector('#border-bottom-modal').open = true">
          border="bottom"
        </pds-button>
        <pds-button id="show-modal-both" onClick="document.querySelector('#border-both-modal').open = true">
          border="both"
        </pds-button>
      </pds-box>
    </pds-box>

    <!-- Border None Modal -->
    <pds-modal id="border-none-modal" component-id="border-none-modal" size="sm">
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
            <pds-text tag="h2" size="h3">No Borders</pds-text>
            <pds-button
              class="pds-modal__close"
              variant="unstyled"
              icon-only="true"
              onclick="document.querySelector('#border-none-modal').open = false"
              aria-label="Close modal"
            >
              <pds-icon slot="start" name="remove" aria-hidden="true"></pds-icon>
            </pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content border="none">
        <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
          <p>This modal content has <code>border="none"</code></p>
          <p>No borders will be shown regardless of content length or scroll position.</p>
        </pds-box>
      </pds-modal-content>
      <pds-modal-footer>
        <pds-box fit justify-content="end" padding="md" gap="sm">
          <pds-button onclick="document.querySelector('#border-none-modal').open = false">Close</pds-button>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>

    <!-- Border Top Modal -->
    <pds-modal id="border-top-modal" component-id="border-top-modal" size="sm">
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
            <pds-text tag="h2" size="h3">Top Border Only</pds-text>
            <pds-button
              class="pds-modal__close"
              variant="unstyled"
              icon-only="true"
              onclick="document.querySelector('#border-top-modal').open = false"
              aria-label="Close modal"
            >
              <pds-icon slot="start" name="remove" aria-hidden="true"></pds-icon>
            </pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content border="top">
        <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
          <p>This modal content has <code>border="top"</code></p>
          <p>Only the top border is visible, indicating there's content above.</p>
        </pds-box>
      </pds-modal-content>
      <pds-modal-footer>
        <pds-box fit justify-content="end" padding="md" gap="sm">
          <pds-button onclick="document.querySelector('#border-top-modal').open = false">Close</pds-button>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>

    <!-- Border Bottom Modal -->
    <pds-modal id="border-bottom-modal" component-id="border-bottom-modal" size="sm">
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
            <pds-text tag="h2" size="h3">Bottom Border Only</pds-text>
            <pds-button
              class="pds-modal__close"
              variant="unstyled"
              icon-only="true"
              onclick="document.querySelector('#border-bottom-modal').open = false"
              aria-label="Close modal"
            >
              <pds-icon slot="start" name="remove" aria-hidden="true"></pds-icon>
            </pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content border="bottom">
        <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
          <p>This modal content has <code>border="bottom"</code></p>
          <p>Only the bottom border is visible, indicating there's content below.</p>
        </pds-box>
      </pds-modal-content>
      <pds-modal-footer>
        <pds-box fit justify-content="end" padding="md" gap="sm">
          <pds-button onclick="document.querySelector('#border-bottom-modal').open = false">Close</pds-button>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>

    <!-- Border Both Modal -->
    <pds-modal id="border-both-modal" component-id="border-both-modal" size="sm">
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
            <pds-text tag="h2" size="h3">Both Borders</pds-text>
            <pds-button
              class="pds-modal__close"
              variant="unstyled"
              icon-only="true"
              onclick="document.querySelector('#border-both-modal').open = false"
              aria-label="Close modal"
            >
              <pds-icon slot="start" name="remove" aria-hidden="true"></pds-icon>
            </pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content border="both">
        <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
          <p>This modal content has <code>border="both"</code></p>
          <p>Both top and bottom borders are visible, indicating content above and below.</p>
        </pds-box>
      </pds-modal-content>
      <pds-modal-footer>
        <pds-box fit justify-content="end" padding="md" gap="sm">
          <pds-button onclick="document.querySelector('#border-both-modal').open = false">Close</pds-button>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>
  </div>
`;

export const CustomBorders = CustomBordersTemplate.bind({});
CustomBorders.args = {
  componentId: 'custom-borders-modal',
};
