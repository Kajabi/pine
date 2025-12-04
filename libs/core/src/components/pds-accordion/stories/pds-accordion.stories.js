import { html } from 'lit';

export default {
  args: {
    componentId: '',
    isOpen: false,
  },
  component: 'pds-accordion',
  title: 'components/Accordion',
}

const BaseTemplate = (args) => html`
	<pds-accordion component-id="${args.componentId}" ?open=${args.isOpen}>
    <pds-box align-items="center" slot="label">
      <pds-icon name="product"></pds-icon>
      <span style="display: inline-block; margin-left: 8px;">Products</span>
    </pds-box>
    <pds-box direction="column" gap="xs" padding="xs">
      <pds-link variant="plain" href="#">All products</pds-link>
      <pds-link variant="plain" href="#">Courses</pds-link>
      <pds-link variant="plain" href="#">Coaching</pds-link>
      <pds-link variant="plain" href="#">Community</pds-link>
      <pds-link variant="plain" href="#">Podcasts</pds-link>
    </pds-box>
  </pds-accordion>
`;

export const Default = BaseTemplate.bind({});
