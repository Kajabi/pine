import { html } from 'lit';

export default {
  args: { href: '#some-anchor' },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['inline', 'plain'],
    },
  },
  component: 'pds-link',
  title: 'components/Link'
}

const BaseTemplate = (args) => html`<pds-link color=${args.color} ?external=${args.external} font-size=${args.fontSize} href=${args.href} component-id=${args.componentId} variant=${args.variant}></pds-link>`;
const BaseTemplateWithSlot = (args) => html` <pds-link color=${args.color} ?external=${args.external} font-size=${args.fontSize} href=${args.href} component-id=${args.componentId} variant=${args.variant}>${args.slot}</pds-link>`;

export const Colors = BaseTemplate.bind();
Colors.args = {
  color: 'danger',
  external: false,
  fontSize: 'lg',
};

export const External = BaseTemplate.bind();
External.args = {
  external: true,
  fontSize: 'lg',
  variant: 'inline'
};

export const Inline = BaseTemplate.bind();
Inline.args = {
  external: false,
  fontSize: 'lg',
  href: 'https://www.google.com',
  variant: 'inline'
};

export const Plain = BaseTemplate.bind();
Plain.args = {
  external: false,
  fontSize: 'lg',
  variant: 'plain'
};

export const WithCustomText = BaseTemplateWithSlot.bind();
WithCustomText.args = {
  external: false,
  fontSize: 'lg',
  slot: 'Overrides default use of href',
  variant: 'inline'
};

export const WithoutCustomTextInSlot = BaseTemplateWithSlot.bind();
WithoutCustomTextInSlot.args = {
  external: false,
  fontSize: 'lg',
  variant: 'inline'
};

// A per-URL tab strip built from links (pds-tabs is an in-page panel switcher,
// not navigation). `active` marks the current destination — persistent underline
// + strong text, and `aria-current="page"`, which is the correct ARIA token for
// links that navigate to distinct pages.
export const NavTabs = {
  render: () => html`
    <nav aria-label="Club sections" style="display: flex; gap: var(--pine-dimension-md);">
      <pds-link href="/clubs/1/chat" font-size="md" ?active=${true}>Chat</pds-link>
      <pds-link href="/clubs/1/resources" font-size="md" variant="plain">Resources</pds-link>
      <pds-link href="/clubs/1/members" font-size="md" variant="plain">Members</pds-link>
    </nav>
  `,
};
