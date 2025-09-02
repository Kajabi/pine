import figma, { html } from '@figma/code-connect/html';

// Page Heading - Composite Pattern (not a standalone component)
figma.connect('<FIGMA_PAGE_HEADING>', {
  props: {
    actions: figma.boolean('Buttons', {
      true: html`
      <!--Actions-->
      <pds-box align-items="center" gap="sm">
        <pds-button icon-only variant="secondary">
          <pds-icon name="dot-menu-horizontal" slot="start"></pds-icon>
          More options
        </pds-button>
        <pds-button icon-only variant="secondary">
          <pds-icon name="preview-on" slot="start"></pds-icon>
          Preview
        </pds-button>
        <pds-button variant="primary">Button</pds-button>
      </pds-box>
      `,
    }),
    description: figma.boolean('Description', {
      true: html`<pds-text tag="p" size="lg">Description</pds-text>`,
    }),
    tabs: figma.boolean('Tabs', {
      true: html`<pds-tabs variant="page" active-tab-name="overview" tablist-label="Offers navigation" component-id="offers-tabs">
      <pds-tab name="overview" slot="tabs">Overview</pds-tab>
      <pds-tab name="transactions" slot="tabs">Transactions</pds-tab>
      <pds-tab name="payouts" slot="tabs">Payouts</pds-tab>
    </pds-tabs>`,
    }),
    thumbnail: figma.boolean('Thumbnail', {
      true: html`<!--Thumbnail-->
  <pds-box flex="shrink">
    <pds-image src="Image URL" alt="Image alt text" />
  </pds-box>`,
    }),
  },
  example: (props) => html`\
  <!--Container-->
  <pds-box gap="xl" fit>
    ${props.thumbnail}
    <!--Content-->
    <pds-box flex="grow" direction="column" gap="sm">
      <pds-text tag="h1" weight="semibold" size="3xl">Page heading title</pds-text>
      ${props.description}
      ${props.tabs}
    </pds-box>
    ${props.actions}
  </pds-box>
  `,
});
