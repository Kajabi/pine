import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-app', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-app></pds-app>');

    const element = await page.find('pds-app');
    expect(element).toHaveClass('hydrated');
  });

  it('collapses the nav region to zero width when the nav slot is empty', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-app style="height: 400px;">
        <div>Main content</div>
      </pds-app>
    `);

    const navDisplay = await page.$eval('pds-app', (el) => {
      const nav = el.shadowRoot.querySelector('.pds-app__nav');
      return getComputedStyle(nav).display;
    });

    expect(navDisplay).toBe('none');
  });

  it('keeps the nav region visible once something is slotted into it', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-app style="height: 400px;">
        <div slot="nav">Nav</div>
        <div>Main content</div>
      </pds-app>
    `);

    const navDisplay = await page.$eval('pds-app', (el) => {
      const nav = el.shadowRoot.querySelector('.pds-app__nav');
      return getComputedStyle(nav).display;
    });

    expect(navDisplay).not.toBe('none');
  });
});

describe('pds-app accessibility', () => {
  it('has no axe violations with a full header/nav/main layout', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-app style="height: 400px;">
        <pds-topbar slot="header" logo-src="/brand/logo.svg" logo-alt="Acme"></pds-topbar>
        <nav slot="nav">Nav</nav>
        <p>Main content</p>
      </pds-app>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
