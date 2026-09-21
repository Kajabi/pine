import { newE2EPage } from '@stencil/core/testing';

describe('pds-tab', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-tab></pds-tab>');

    const element = await page.find('pds-tab');
    expect(element).toHaveClass('hydrated');
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // Re-parses an already-hydrated tab's outerHTML, the way a Turbo/bfcache restore reconnects it.
    it('does not nest a second anchor around an already-hydrated nav tab', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-tabs nav component-id="reconnect-test" tablist-label="Tabs">
          <pds-tab slot="tabs" href="/a" name="a" active="true">A</pds-tab>
        </pds-tabs>
      `);

      const hydratedHtml = await page.evaluate(
        () => document.querySelector('pds-tab').outerHTML
      );
      await page.evaluate((html: string) => {
        document.querySelector('pds-tabs').innerHTML = html;
      }, hydratedHtml);
      await page.waitForChanges();

      const anchors = await page.findAll('pds-tab a');
      expect(anchors.length).toBe(1);
      const content = await page.find('pds-tab .pds-tab__content');
      expect(content.textContent.trim()).toBe('A');
    });
  });
});
