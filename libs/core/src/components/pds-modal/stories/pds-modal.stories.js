import { html } from 'lit';

export default {
  component: 'pds-modal',
  title: 'components/Modal',
  args: {
    backdropDismiss: true,
    componentId: 'modal-demo',
    disableTopLayer: false,
    open: false,
    scrollable: true,
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'text',
      description: "A preset ('sm', 'md', 'lg', 'fullscreen') or a CSS length such as '1100px'.",
    },
  },
  parameters: {},
};

const BaseTemplate = (args) => html`
  <div>
    <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true"> Open Modal </pds-button>

    <pds-modal
      id="${args.componentId}"
      component-id="${args.componentId}"
      size="${args.size}"
      ?backdrop-dismiss=${args.backdropDismiss}
      ?disable-top-layer=${args.disableTopLayer}
      scrollable="${args.scrollable}"
      ?open=${args.open}
      key="${args.scrollable ? 'scrollable' : 'non-scrollable'}"
    >
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
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
        <pds-box justify-content="space-between" fit padding="md">
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button variant="secondary" onClick="document.querySelector('#${args.componentId}').open = false"> Cancel </pds-button>
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

// Any CSS length works as a size; it becomes the modal's max-width.
export const CustomSize = BaseTemplate.bind({});
CustomSize.args = {
  componentId: 'custom-size-modal',
  size: '1100px',
  open: false,
};

const DestructiveTemplate = (args) => html`
  <div>
    <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true"> Open Modal </pds-button>

    <pds-modal id="${args.componentId}" component-id="${args.componentId}" size="${args.size}" ?backdrop-dismiss=${args.backdropDismiss} ?open=${args.open}>
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
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
        <pds-box justify-content="space-between" fit padding="md">
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button variant="secondary" onClick="document.querySelector('#${args.componentId}').open = false"> Cancel </pds-button>
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
    <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true"> Open Form Modal </pds-button>

    <pds-modal id="${args.componentId}" size="${args.size}" ?backdrop-dismiss=${args.backdropDismiss} ?open=${args.open}>
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
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
        <pds-box justify-content="space-between" fit padding="md">
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button variant="secondary" onclick="document.querySelector('#${args.componentId}').open = false"> Cancel </pds-button>
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
      <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true"> Open Scrolling Modal </pds-button>

      <pds-modal id="${args.componentId}" size="${args.size}" ?backdrop-dismiss=${args.backdropDismiss} ?open=${args.open}>
        <pds-modal-header>
          <pds-box direction="column" fit padding="md">
            <pds-box align-items="center" fit justify-content="space-between">
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                `,
              )}
          </pds-box>
        </pds-modal-content>

        <pds-modal-footer>
          <pds-box justify-content="space-between" fit padding="md">
            <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
            <pds-box gap="sm" justify-content="end">
              <pds-button variant="secondary" onclick="document.querySelector('#${args.componentId}').open = false"> Cancel </pds-button>
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
    <pds-button variant="primary" onclick="document.querySelector('#${args.componentId}').open = true">Open Modal</pds-button>

    <pds-modal id="${args.componentId}" size=${args.size} ?backdrop-dismiss=${args.backdropDismiss} ?open=${args.open}>
      <pds-modal-header>
        <pds-box direction="column" fit padding="md" padding-block-start="xs" padding-block-end="xs">
          <pds-box align-items="center" fit justify-content="space-between">
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
        <pds-box justify-content="space-between" fit padding="md">
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button variant="secondary" onclick="document.querySelector('#${args.componentId}').open = false"> Cancel </pds-button>
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
    <pds-button id="show-modal" onClick="document.querySelector('#${args.componentId}').open = true"> Open Non-Scrollable Modal </pds-button>

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
          <pds-box align-items="center" fit justify-content="space-between">
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
        <pds-box justify-content="space-between" fit padding="md">
          <pds-button variant="unstyled" onclick="document.querySelector('#${args.componentId}').open = false">Close</pds-button>
          <pds-box gap="sm" justify-content="end">
            <pds-button variant="secondary" onclick="document.querySelector('#${args.componentId}').open = false"> Cancel </pds-button>
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
        <pds-button id="show-modal-none" onClick="document.querySelector('#border-none-modal').open = true"> border="none" </pds-button>
        <pds-button id="show-modal-top" onClick="document.querySelector('#border-top-modal').open = true"> border="top" </pds-button>
        <pds-button id="show-modal-bottom" onClick="document.querySelector('#border-bottom-modal').open = true"> border="bottom" </pds-button>
        <pds-button id="show-modal-both" onClick="document.querySelector('#border-both-modal').open = true"> border="both" </pds-button>
      </pds-box>
    </pds-box>

    <!-- Border None Modal -->
    <pds-modal id="border-none-modal" component-id="border-none-modal" size="sm">
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
            <pds-text tag="h2" size="h3">No Borders</pds-text>
            <pds-button class="pds-modal__close" variant="unstyled" icon-only="true" onclick="document.querySelector('#border-none-modal').open = false" aria-label="Close modal">
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
            <pds-button class="pds-modal__close" variant="unstyled" icon-only="true" onclick="document.querySelector('#border-top-modal').open = false" aria-label="Close modal">
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
            <pds-button class="pds-modal__close" variant="unstyled" icon-only="true" onclick="document.querySelector('#border-bottom-modal').open = false" aria-label="Close modal">
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
            <pds-button class="pds-modal__close" variant="unstyled" icon-only="true" onclick="document.querySelector('#border-both-modal').open = false" aria-label="Close modal">
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

// Demonstrates `disable-top-layer`: the modal opens as a non-modal dialog
// (dialog.show()) so an overlay appended to document.body can display above it.
// With the default top-layer behavior the same overlay would render behind the
// modal and be unreachable.
const DisableTopLayerTemplate = (args) => html`
  <div style="padding: 1rem;">
    <pds-button onClick="document.querySelector('#${args.componentId}').open = true"> Open Modal (disable-top-layer) </pds-button>

    <pds-modal
      id="${args.componentId}"
      component-id="${args.componentId}"
      size="${args.size}"
      ?backdrop-dismiss=${args.backdropDismiss}
      ?disable-top-layer=${args.disableTopLayer}
      ?open=${args.open}
    >
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
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
        </pds-box>
      </pds-modal-header>

      <pds-modal-content>
        <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md" gap="sm">
          <p>This modal uses <code>disable-top-layer</code>, so it renders in the normal stacking context instead of the browser top layer.</p>
          <p>
            An overlay appended to <code>document.body</code> with a higher <code>z-index</code> can therefore display above it &mdash; useful for file pickers, rich-text editor
            menus, and other body-mounted overlays that would otherwise be trapped behind a top-layer dialog.
          </p>
          <pds-button
            variant="secondary"
            onclick="(function(){var o=document.createElement('button');o.type='button';o.textContent='Overlay above the modal — focusable, keyboard-dismissable. Click or press Enter.';o.setAttribute('style','position:fixed;inset:auto 2rem 2rem auto;max-width:20rem;padding:1rem;border:0;text-align:start;border-radius:8px;background:#111;color:#fff;z-index:2147483647;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.4)');var modal=document.querySelector('#${args.componentId}');var remove=function(){o.remove()};o.onclick=remove;o.addEventListener('keydown',function(e){if(e.key==='Escape')remove()});if(modal)modal.addEventListener('pdsModalClose',remove,{once:true});document.body.appendChild(o);o.focus();})()"
          >
            Show overlay above modal
          </pds-button>
        </pds-box>
      </pds-modal-content>

      <pds-modal-footer>
        <pds-box justify-content="end" fit padding="md" gap="sm">
          <pds-button variant="secondary" onclick="document.querySelector('#${args.componentId}').open = false"> Close </pds-button>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>
  </div>
`;

export const DisableTopLayer = DisableTopLayerTemplate.bind({});
DisableTopLayer.args = {
  componentId: 'disable-top-layer-modal',
  disableTopLayer: true,
  size: 'md',
  open: false,
};

const closeButton = (id, label = 'Close modal') => html`
  <pds-button class="pds-modal__close" variant="unstyled" icon-only="true" onclick="document.querySelector('#${id}').open = false" aria-label="${label}">
    <pds-icon slot="start" name="remove" aria-hidden="true"></pds-icon>
  </pds-button>
`;

const NestedGrowTemplate = () => html`
  <div>
    <pds-button onclick="document.querySelector('#grow-outer').open = true">Open outer modal</pds-button>

    <pds-modal id="grow-outer" component-id="grow-outer" size="fullscreen">
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
            <pds-text tag="h2" size="h3" id="grow-outer-heading">Outer modal</pds-text>
            ${closeButton('grow-outer')}
          </pds-box>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content>
        <pds-box fit direction="column" padding="md" padding-block-start="none" gap="md">
          <p>The inner modal grows from whichever button opens it, and shrinks back into it on close (button, Escape, or backdrop).</p>
          <pds-box gap="sm" justify-content="space-between" fit>
            <pds-button variant="secondary" onclick="document.querySelector('#grow-inner').open = true">Edit details</pds-button>
            <pds-button variant="secondary" onclick="document.querySelector('#grow-inner').open = true">Open from here</pds-button>
          </pds-box>
        </pds-box>
      </pds-modal-content>
    </pds-modal>

    <pds-modal id="grow-inner" component-id="grow-inner" transition="grow">
      <pds-modal-header>
        <pds-box direction="column" fit padding="md">
          <pds-box align-items="center" fit justify-content="space-between">
            <pds-text tag="h2" size="h3" id="grow-inner-heading">Inner modal</pds-text>
            ${closeButton('grow-inner')}
          </pds-box>
        </pds-box>
      </pds-modal-header>
      <pds-modal-content>
        <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md">
          <p>Only this modal responds to Escape and backdrop clicks. Closing both lets the panel fade where it is, since the button it came from is gone.</p>
        </pds-box>
      </pds-modal-content>
      <pds-modal-footer>
        <pds-box fit justify-content="end" padding="md" gap="sm">
          <pds-button variant="secondary" onclick="document.querySelector('#grow-inner').open = false">Close inner</pds-button>
          <pds-button onclick="document.querySelector('#grow-outer').open = false; document.querySelector('#grow-inner').open = false">Close both</pds-button>
        </pds-box>
      </pds-modal-footer>
    </pds-modal>
  </div>
`;

export const NestedGrowFromTrigger = NestedGrowTemplate.bind({});
NestedGrowFromTrigger.storyName = 'Nested modals — grow from trigger';
NestedGrowFromTrigger.parameters = { controls: { disable: true } };

// One step of a chain: Continue closes this modal and opens the next in the same handler, which a
// `morph` modal turns into one panel becoming the next; Back does the reverse.
const chainStep = ({ id, size, title, body, back, next, nextLabel = 'Continue' }) => html`
  <pds-modal id="${id}" component-id="${id}" size="${size}" transition="morph">
    <pds-modal-header>
      <pds-box direction="column" fit padding="md">
        <pds-box align-items="center" fit justify-content="space-between" gap="sm">
          <pds-box align-items="center" gap="sm">
            ${back
              ? html`<pds-button
                  variant="unstyled"
                  icon-only="true"
                  aria-label="Back"
                  onclick="document.querySelector('#${id}').open = false; document.querySelector('#${back}').open = true"
                >
                  <pds-icon slot="start" name="arrow-left" aria-hidden="true"></pds-icon>
                </pds-button>`
              : ''}
            <pds-text tag="h2" size="h3" id="${id}-heading">${title}</pds-text>
          </pds-box>
          ${closeButton(id)}
        </pds-box>
      </pds-box>
    </pds-modal-header>
    <pds-modal-content>
      <pds-box fit direction="column" padding-inline-start="md" padding-inline-end="md" gap="sm">${body}</pds-box>
    </pds-modal-content>
    <pds-modal-footer>
      <pds-box fit justify-content="end" padding="md" gap="sm">
        <pds-button variant="secondary" onclick="document.querySelector('#${id}').open = false">Cancel</pds-button>
        ${next
          ? html`<pds-button onclick="document.querySelector('#${id}').open = false; document.querySelector('#${next}').open = true">${nextLabel}</pds-button>`
          : html`<pds-button onclick="document.querySelector('#${id}').open = false">Done</pds-button>`}
      </pds-box>
    </pds-modal-footer>
  </pds-modal>
`;

const chainModals = () => html`
  ${chainStep({
    id: 'chain-1',
    size: 'sm',
    title: 'What do you want to build?',
    body: html`
      <pds-radio-group name="chain-kind" label="Automation type">
        <pds-radio component-id="chain-kind-single" value="single" label="A single action" checked></pds-radio>
        <pds-radio component-id="chain-kind-multi" value="multi" label="A multi-step workflow"></pds-radio>
      </pds-radio-group>
    `,
    next: 'chain-2',
  })}
  ${chainStep({
    id: 'chain-2',
    size: 'lg',
    title: 'New single action',
    body: html`
      <p>The first panel morphed into this larger one. Back reverses it.</p>
      <pds-input component-id="chain-name" label="Name" value="Welcome email"></pds-input>
      <pds-textarea component-id="chain-notes" label="Notes" rows="4"></pds-textarea>
    `,
    back: 'chain-1',
    next: 'chain-3',
    nextLabel: 'Review',
  })}
  ${chainStep({
    id: 'chain-3',
    size: 'md',
    title: 'Review',
    body: html`<p>A third step. Back goes to the form; Done closes the chain.</p>`,
    back: 'chain-2',
  })}
`;

const ChainedMorphTemplate = () => html`
  <div>
    <pds-button onclick="document.querySelector('#chain-1').open = true">Start chain</pds-button>
    ${chainModals()}
  </div>
`;

export const ChainedMorphWithBack = ChainedMorphTemplate.bind({});
ChainedMorphWithBack.storyName = 'Chained modals — morph with back';
ChainedMorphWithBack.parameters = { controls: { disable: true } };

// Morph timing playground: presets and sliders set the internal --pds-modal-morph-* properties on
// <html>, where the view-transition pseudo-elements read them, so options can be compared on the
// same chain. Slow motion plays each morph at a quarter speed.
const MORPH_TIMING = [
  { prop: 'box-duration', label: 'Box resize', max: 800 },
  { prop: 'old-delay', label: 'Old content delay', max: 600 },
  { prop: 'old-duration', label: 'Old content out', max: 600 },
  { prop: 'new-delay', label: 'New content delay', max: 600 },
  { prop: 'new-duration', label: 'New content in', max: 600 },
  { prop: 'slide', label: 'Slide distance', max: 64, unit: 'px' },
];

const MORPH_EASINGS = {
  'in-out': 'var(--pine-motion-easing-in-out)',
  'out': 'var(--pine-motion-easing-out)',
  'in': 'var(--pine-motion-easing-in)',
  'linear': 'linear',
};

const MORPH_PRESETS = {
  'Sequenced (current)': {
    values: { 'box-duration': 300, 'old-delay': 0, 'old-duration': 120, 'new-delay': 120, 'new-duration': 180, 'slide': 32 },
    easing: { box: 'in-out', old: 'in', new: 'out' },
    note: 'Old content leaves, then the new comes in and lands with the box.',
  },
  'kp front door': {
    values: { 'box-duration': 300, 'old-delay': 0, 'old-duration': 120, 'new-delay': 0, 'new-duration': 300, 'slide': 0 },
    easing: { box: 'in-out', old: 'in', new: 'in-out' },
    note: 'As the kp chooser → wizard spike: old out fast, new fades in across the whole resize, no slide.',
  },
  'After the box lands': {
    values: { 'box-duration': 300, 'old-delay': 0, 'old-duration': 120, 'new-delay': 300, 'new-duration': 150, 'slide': 0 },
    easing: { box: 'in-out', old: 'in', new: 'out' },
    note: 'The box finishes resizing empty, then the new content fades in.',
  },
  'Sequenced, fade only': {
    values: { 'box-duration': 300, 'old-delay': 0, 'old-duration': 120, 'new-delay': 120, 'new-duration': 180, 'slide': 0 },
    easing: { box: 'in-out', old: 'in', new: 'out' },
    note: 'The current timing without the direction slide.',
  },
  'Snappy': {
    values: { 'box-duration': 200, 'old-delay': 0, 'old-duration': 80, 'new-delay': 80, 'new-duration': 120, 'slide': 16 },
    easing: { box: 'out', old: 'in', new: 'out' },
    note: 'Everything a third faster, with a shorter slide.',
  },
  'Overlap (first spike)': {
    values: { 'box-duration': 300, 'old-delay': 0, 'old-duration': 120, 'new-delay': 0, 'new-duration': 200, 'slide': 32 },
    easing: { box: 'in-out', old: 'in-out', new: 'in-out' },
    note: 'Where we started: old and new cross-fade and slide past each other.',
  },
};

const setMorphTiming = (values, easing) => {
  const root = document.documentElement.style;
  MORPH_TIMING.forEach(({ prop, unit = 'ms' }) => root.setProperty(`--pds-modal-morph-${prop}`, `${values[prop]}${unit}`));
  Object.entries(easing).forEach(([part, name]) => root.setProperty(`--pds-modal-morph-${part}-easing`, MORPH_EASINGS[name]));
};

const morphPlayground = {
  values: { ...MORPH_PRESETS['Sequenced (current)'].values },
  easing: { ...MORPH_PRESETS['Sequenced (current)'].easing },
  slowMotion: false,
};

// Slow motion: once a morph's animations exist, play them at a quarter speed.
const playMorphSlowly = () => {
  if (morphPlayground.wrapped || typeof document.startViewTransition !== 'function') return;
  const start = document.startViewTransition.bind(document);
  document.startViewTransition = (update) => {
    const transition = start(update);
    transition.ready
      .then(() => {
        if (morphPlayground.slowMotion) document.getAnimations().forEach((animation) => (animation.playbackRate = 0.25));
      })
      .catch(() => {});
    return transition;
  };
  morphPlayground.wrapped = true;
};

const renderMorphReadout = () => {
  const readout = document.querySelector('#morph-playground-readout');
  if (!readout) return;
  const { values, easing } = morphPlayground;
  readout.textContent = [
    ...MORPH_TIMING.map(({ prop, unit = 'ms' }) => `--pds-modal-morph-${prop}: ${values[prop]}${unit};`),
    ...Object.entries(easing).map(([part, name]) => `--pds-modal-morph-${part}-easing: ${MORPH_EASINGS[name]};`),
  ].join('\n');
  MORPH_TIMING.forEach(({ prop, unit = 'ms' }) => {
    const input = document.querySelector(`#morph-${prop}`);
    const output = document.querySelector(`#morph-${prop}-value`);
    if (input) input.value = values[prop];
    if (output) output.textContent = `${values[prop]}${unit}`;
  });
  ['box', 'old', 'new'].forEach((part) => {
    const select = document.querySelector(`#morph-${part}-easing`);
    if (select) select.value = easing[part];
  });
};

const applyMorphPlayground = () => {
  setMorphTiming(morphPlayground.values, morphPlayground.easing);
  renderMorphReadout();
};

const chooseMorphPreset = (name) => {
  const preset = MORPH_PRESETS[name];
  morphPlayground.values = { ...preset.values };
  morphPlayground.easing = { ...preset.easing };
  const note = document.querySelector('#morph-playground-note');
  if (note) note.textContent = `${name}: ${preset.note}`;
  applyMorphPlayground();
};

const MorphPlaygroundTemplate = () => {
  playMorphSlowly();
  requestAnimationFrame(() => chooseMorphPreset('Sequenced (current)'));

  return html`
    <pds-box direction="column" gap="md" max-width="720px">
      <pds-box direction="column" gap="sm">
        <pds-text tag="h2" size="h4">Presets</pds-text>
        <pds-box gap="xs" wrap="true">
          ${Object.keys(MORPH_PRESETS).map((name) => html`<pds-button variant="secondary" @click=${() => chooseMorphPreset(name)}>${name}</pds-button>`)}
        </pds-box>
        <pds-text tag="p" size="sm" color="var(--pine-color-text-muted)" id="morph-playground-note"></pds-text>
      </pds-box>

      <pds-box direction="column" gap="xs">
        <pds-text tag="h2" size="h4">Fine-tune</pds-text>
        ${MORPH_TIMING.map(
          ({ prop, label, max }) => html`
            <pds-box align-items="center" gap="sm">
              <label for="morph-${prop}" style="inline-size: 160px">${label}</label>
              <input
                id="morph-${prop}"
                type="range"
                min="0"
                max=${max}
                step=${prop === 'slide' ? 4 : 10}
                style="flex: 1"
                @input=${(event) => {
                  morphPlayground.values[prop] = Number(event.target.value);
                  applyMorphPlayground();
                }}
              />
              <output id="morph-${prop}-value" style="inline-size: 56px; text-align: end"></output>
            </pds-box>
          `,
        )}
        ${['box', 'old', 'new'].map(
          (part) => html`
            <pds-box align-items="center" gap="sm">
              <label for="morph-${part}-easing" style="inline-size: 160px">${part === 'box' ? 'Box' : `${part[0].toUpperCase()}${part.slice(1)} content`} easing</label>
              <select
                id="morph-${part}-easing"
                @change=${(event) => {
                  morphPlayground.easing[part] = event.target.value;
                  applyMorphPlayground();
                }}
              >
                ${Object.keys(MORPH_EASINGS).map((name) => html`<option value=${name}>${name}</option>`)}
              </select>
            </pds-box>
          `,
        )}
        <label>
          <input
            type="checkbox"
            @change=${(event) => {
              morphPlayground.slowMotion = event.target.checked;
            }}
          />
          Slow motion (¼ speed)
        </label>
      </pds-box>

      <pds-box direction="column" gap="xs">
        <pds-button @click=${() => (document.querySelector('#chain-1').open = true)}>Start chain</pds-button>
        <pds-text tag="p" size="sm" color="var(--pine-color-text-muted)"> Continue and Review go forward; the arrow goes back. Change a preset between runs. </pds-text>
      </pds-box>

      <pds-box direction="column" gap="xs">
        <pds-text tag="h2" size="h4">Values in use</pds-text>
        <pre id="morph-playground-readout" style="margin: 0; font-size: 12px; white-space: pre-wrap"></pre>
      </pds-box>
    </pds-box>
    ${chainModals()}
  `;
};

export const MorphTimingPlayground = MorphPlaygroundTemplate.bind({});
MorphTimingPlayground.storyName = 'Chained modals — morph timing playground';
MorphTimingPlayground.parameters = { controls: { disable: true } };
