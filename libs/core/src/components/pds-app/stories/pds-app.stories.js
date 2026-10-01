import { html } from 'lit';

export default {
  component: 'pds-app',
  parameters: {},
  title: 'components/App frame (proposal)',
};

export const Default = () => html`
<pds-app style="height: 480px; border-radius: 8px; overflow: hidden; border: 1px solid var(--pine-color-border);">
  <pds-topbar slot="header" logo-src="https://pine-design-system.netlify.app/favicon.svg" logo-alt="Pine" logo-href="/">
    <pds-button size="small" variant="tertiary">Sign out</pds-button>
  </pds-topbar>
  <div style="padding: 24px;">
    <h1>Main stage</h1>
    <p>This region scrolls independently and owns the content max-width via the same size scale as pds-container.</p>
  </div>
</pds-app>`;

export const WithNav = () => html`
<pds-app style="height: 480px; border-radius: 8px; overflow: hidden; border: 1px solid var(--pine-color-border);">
  <pds-topbar
    slot="header"
    menu-button
    menu-button-controls="story-nav"
    logo-src="https://pine-design-system.netlify.app/favicon.svg"
    logo-alt="Pine"
    logo-href="/"
  >
    <pds-avatar initials="QJ"></pds-avatar>
  </pds-topbar>
  <nav id="story-nav" slot="nav" style="inline-size: 200px; padding: 16px; border-inline-end: 1px solid var(--pine-color-border);">
    Side nav
  </nav>
  <div style="padding: 24px;">
    <h1>Main stage</h1>
    <p>The nav slot only renders once something is assigned to it — otherwise it collapses to zero width.</p>
  </div>
</pds-app>`;
