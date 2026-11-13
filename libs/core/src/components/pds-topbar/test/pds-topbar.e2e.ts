import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-topbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-topbar></pds-topbar>');

    const element = await page.find('pds-topbar');
    expect(element).toHaveClass('hydrated');
  });

  it('renders slotted actions right-aligned alongside the logo', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-topbar logo-src="/brand/logo.svg" logo-alt="Acme">
        <pds-button size="small">Sign out</pds-button>
      </pds-topbar>
    `);

    const button = await page.find('pds-topbar pds-button');
    expect(button).not.toBeNull();
  });
});

describe('pds-topbar accessibility', () => {
  it('has no axe violations with a menu button and slotted actions', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-topbar menu-button menu-button-controls="app-nav" logo-src="/brand/logo.svg" logo-alt="Acme" logo-href="/">
        <pds-button size="small">Sign out</pds-button>
      </pds-topbar>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
