import { newSpecPage } from '@stencil/core/testing';
import { PdsApp } from '../pds-app';
import { PdsContainer } from '../../pds-container/pds-container';

describe('pds-app', () => {
  it('renders header, nav, and main regions', async () => {
    const page = await newSpecPage({
      components: [PdsApp, PdsContainer],
      html: `<pds-app></pds-app>`,
    });

    const root = page.root.shadowRoot;
    expect(root.querySelector('.pds-app__header')).not.toBeNull();
    expect(root.querySelector('.pds-app__nav')).not.toBeNull();
    expect(root.querySelector('.pds-app__main')).not.toBeNull();
    expect(root.querySelector('.pds-app__main').tagName.toLowerCase()).toBe('pds-container');
  });

  it('passes mainSize through to the inner pds-container as size', async () => {
    const page = await newSpecPage({
      components: [PdsApp, PdsContainer],
      html: `<pds-app main-size="lg"></pds-app>`,
    });

    // pds-container's `size` prop isn't reflected to an attribute — it's set
    // as a DOM property when passed via JSX from a parent component.
    const container = page.root.shadowRoot.querySelector('.pds-app__main') as HTMLPdsContainerElement;
    expect(container.size).toBe('lg');
  });

  it('renders slotted header/nav/main content', async () => {
    const page = await newSpecPage({
      components: [PdsApp, PdsContainer],
      html: `
        <pds-app>
          <div slot="header">Top bar</div>
          <div slot="nav">Nav</div>
          <div>Main content</div>
        </pds-app>
      `,
    });

    expect(page.root.textContent).toContain('Top bar');
    expect(page.root.textContent).toContain('Nav');
    expect(page.root.textContent).toContain('Main content');
  });
});
