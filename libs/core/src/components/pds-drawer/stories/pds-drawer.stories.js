import { html } from 'lit';

export default {
  component: 'pds-drawer',
  title: 'components/Drawer',
  args: {
    componentId: 'drawer-demo',
    side: 'end',
    size: 'md',
    scrollable: true,
    lightDismiss: true,
    initialFocus: 'auto',
    open: false,
  },
  parameters: {},
};

const BaseTemplate = (args) => html`
  <div>
    <pds-button id="open-drawer" onClick="document.querySelector('#${args.componentId}').open = true">
      Open Drawer
    </pds-button>

    <pds-drawer
      id="${args.componentId}"
      component-id="${args.componentId}"
      side="${args.side}"
      size="${args.size}"
      scrollable="${args.scrollable}"
      light-dismiss="${args.lightDismiss}"
      initial-focus="${args.initialFocus}"
      ?open=${args.open}
    >
      <pds-drawer-header>
        <pds-box align-items="center" justify-content="space-between" fit>
          <pds-text tag="h2" size="h4">Drawer Title</pds-text>
          <pds-button
            class="pds-drawer__close"
            variant="unstyled"
            icon-only="true"
            onclick="document.querySelector('#${args.componentId}').open = false"
            aria-label="Close drawer"
          >
            <pds-icon slot="start" name="remove" aria-hidden="true"></pds-icon>
          </pds-button>
        </pds-box>
      </pds-drawer-header>

      <pds-drawer-content>
        <pds-text tag="p">Drawer body content goes here.</pds-text>
      </pds-drawer-content>

      <pds-drawer-footer>
        <pds-button
          variant="secondary"
          onclick="document.querySelector('#${args.componentId}').open = false"
        >
          Cancel
        </pds-button>
        <pds-button variant="primary">Save</pds-button>
      </pds-drawer-footer>
    </pds-drawer>
  </div>
`;

export const Default = BaseTemplate.bind({});

export const StartSide = BaseTemplate.bind({});
StartSide.args = { side: 'start' };

export const Small = BaseTemplate.bind({});
Small.args = { size: 'sm' };
