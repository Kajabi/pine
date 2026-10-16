import { html } from 'lit';

export default {
  component: 'pds-topbar',
  parameters: {},
  title: 'components/Topbar (proposal)',
};

export const Default = () => html`
<pds-topbar logo-src="https://pine-design-system.netlify.app/favicon.svg" logo-alt="Pine" logo-href="/">
  <pds-button size="small" variant="tertiary">Sign out</pds-button>
</pds-topbar>`;

export const WithMenuButton = () => html`
<pds-topbar
  menu-button
  menu-button-controls="app-nav-region"
  logo-src="https://pine-design-system.netlify.app/favicon.svg"
  logo-alt="Pine"
  logo-href="/"
>
  <pds-avatar initials="QJ"></pds-avatar>
</pds-topbar>`;

export const CustomLogoSlot = () => html`
<pds-topbar>
  <span slot="logo" style="font-weight: 700; letter-spacing: 0.02em;">ACME</span>
  <pds-button size="small" variant="tertiary">Help</pds-button>
</pds-topbar>`;
