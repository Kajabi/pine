import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

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

const BaseTemplate = (args) => html`<pds-link color=${args.color} ?external=${args.external} external-label=${ifDefined(args.externalLabel)} font-size=${args.fontSize} href=${args.href} component-id=${args.componentId} variant=${args.variant}></pds-link>`;
const BaseTemplateWithSlot = (args) => html` <pds-link color=${args.color} ?external=${args.external} external-label=${ifDefined(args.externalLabel)} font-size=${args.fontSize} href=${args.href} component-id=${args.componentId} variant=${args.variant}>${args.slot}</pds-link>`;

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

// A whole row that is one link. The click area is the link part's ::after stretched over
// the positioned row, so the row activates the link without nesting anything inside it.
// Trailing controls sit above that box so they stay separately clickable, and the focus
// ring is drawn on the stretched box rather than on the text.
export const WholeRowLink = {
  render: () => html`
    <style>
      .pds-link-row {
        align-items: center;
        border: var(--pine-border);
        border-radius: var(--pine-border-radius-md);
        display: flex;
        gap: var(--pine-dimension-xs);
        max-width: 28rem;
        padding: var(--pine-dimension-sm);
        position: relative;
      }

      .pds-link-row:hover {
        background-color: var(--pine-color-background-muted);
      }

      .pds-link-row pds-link::part(link)::after {
        content: "";
        inset: 0;
        position: absolute;
      }

      .pds-link-row pds-link::part(link):focus-visible::after {
        outline: var(--pine-outline-focus);
        outline-offset: var(--pine-border-width-thick);
      }

      .pds-link-row__trailing {
        margin-inline-start: auto;
        position: relative;
        z-index: 1;
      }
    </style>
    <div class="pds-link-row">
      <pds-icon name="document" aria-hidden="true"></pds-icon>
      <pds-link href="#row-target" variant="plain">Quarterly report</pds-link>
      <span class="pds-link-row__trailing">
        <pds-button variant="secondary" size="sm">Download</pds-button>
      </span>
    </div>
  `,
};
