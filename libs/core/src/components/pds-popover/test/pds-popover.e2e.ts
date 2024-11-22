import { newE2EPage } from '@stencil/core/testing';

describe('pds-popover', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-popover></pds-popover>');

    const element = await page.find('pds-popover');
    expect(element).toHaveClass('hydrated');
  });

  it('should open the popover on Enter key press on trigger', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-popover placement="top">
          <div slot="trigger">
            <button>Popover</button>
          </div>
          <div slot="content">
            <p>This is a Popover</p>
          </div>
        </pds-popover>
      `
    );

    const button = await page.find('pds-popover >>> .pds-popover__trigger');
    await button?.focus();
    await page.waitForChanges();

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    const popover = await page.find('pds-popover >>> .pds-popover');
    expect(popover).toHaveClass('pds-popover--is-open');
  });

  it('should close the popover on Escape key press when open', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-popover placement="top">
          <div slot="trigger">
            <button>Popover</button>
          </div>
          <div slot="content">
            <p>This is a Popover</p>
          </div>
        </pds-popover>
      `
    );

    const button = await page.find('pds-popover >>> .pds-popover__trigger');
    await button?.click();
    await page.waitForChanges();

    const popover = await page.find('pds-popover >>> .pds-popover');
    expect(popover).toHaveClass('pds-popover--is-open');

    await page.keyboard.press('Escape');
    await page.waitForChanges();

    expect(popover).not.toHaveClass('pds-popover--is-open');
  });
});
