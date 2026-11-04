import { newSpecPage } from '@stencil/core/testing';
import { PdsTopbar } from '../pds-topbar';

describe('pds-topbar', () => {
  it('renders with role banner', async () => {
    const page = await newSpecPage({
      components: [PdsTopbar],
      html: `<pds-topbar></pds-topbar>`,
    });

    expect(page.root.getAttribute('role')).toBe('banner');
  });

  it('does not render a menu button by default', async () => {
    const page = await newSpecPage({
      components: [PdsTopbar],
      html: `<pds-topbar></pds-topbar>`,
    });

    expect(page.root.shadowRoot.querySelector('.pds-topbar__menu-button')).toBeNull();
  });

  it('renders a menu button with aria-controls and aria-expanded when menu-button is set', async () => {
    const page = await newSpecPage({
      components: [PdsTopbar],
      html: `<pds-topbar menu-button menu-button-controls="app-nav"></pds-topbar>`,
    });

    const button = page.root.shadowRoot.querySelector('.pds-topbar__menu-button');
    expect(button.getAttribute('aria-controls')).toBe('app-nav');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-label')).toBe('Toggle navigation');
  });

  it('uses a translated menu-button-label', async () => {
    const page = await newSpecPage({
      components: [PdsTopbar],
      html: `<pds-topbar menu-button menu-button-label="Basculer la navigation"></pds-topbar>`,
    });

    const button = page.root.shadowRoot.querySelector('.pds-topbar__menu-button');
    expect(button.getAttribute('aria-label')).toBe('Basculer la navigation');
  });

  it('toggles menu-expanded and emits pdsMenuToggle when the menu button is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsTopbar],
      html: `<pds-topbar menu-button></pds-topbar>`,
    });

    const eventSpy = jest.fn();
    page.root.addEventListener('pdsMenuToggle', eventSpy);

    const button = page.root.shadowRoot.querySelector('.pds-topbar__menu-button') as HTMLElement;
    button.click();
    await page.waitForChanges();

    expect(page.root.menuExpanded).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ detail: { expanded: true } }));

    button.click();
    await page.waitForChanges();

    expect(page.root.menuExpanded).toBe(false);
    expect(eventSpy).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { expanded: false } }));
  });

  it('renders a logo image from logoSrc when the logo slot is empty', async () => {
    const page = await newSpecPage({
      components: [PdsTopbar],
      html: `<pds-topbar logo-src="/brand/logo.svg" logo-alt="Acme"></pds-topbar>`,
    });

    const img = page.root.shadowRoot.querySelector('.pds-topbar__logo-image');
    expect(img.getAttribute('src')).toBe('/brand/logo.svg');
    expect(img.getAttribute('alt')).toBe('Acme');
  });

  it('wraps the logo in a link and moves alt text to aria-label when logoHref is set', async () => {
    const page = await newSpecPage({
      components: [PdsTopbar],
      html: `<pds-topbar logo-src="/brand/logo.svg" logo-alt="Acme" logo-href="/"></pds-topbar>`,
    });

    const link = page.root.shadowRoot.querySelector('a.pds-topbar__logo');
    expect(link.getAttribute('href')).toBe('/');
    expect(link.getAttribute('aria-label')).toBe('Acme');

    const img = link.querySelector('.pds-topbar__logo-image');
    expect(img.getAttribute('alt')).toBe('');
  });
});
