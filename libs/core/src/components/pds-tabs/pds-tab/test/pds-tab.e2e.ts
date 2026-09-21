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

    // Guards against a follow-on concern: clearing the content div in componentDidRender
    // could detach whatever Stencil uses to relocate content on a later reconnect.
    it('survives a second reconnect after the first cleanup already ran', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-tabs nav component-id="reconnect-test-2" tablist-label="Tabs">
          <pds-tab slot="tabs" href="/a" name="a" active="true">A</pds-tab>
        </pds-tabs>
      `);

      for (let i = 0; i < 2; i++) {
        const html = await page.evaluate(() => document.querySelector('pds-tab').outerHTML);
        await page.evaluate((h: string) => {
          document.querySelector('pds-tabs').innerHTML = h;
        }, html);
        await page.waitForChanges();
      }

      const anchors = await page.findAll('pds-tab a');
      expect(anchors.length).toBe(1);
      const content = await page.find('pds-tab .pds-tab__content');
      expect(content.textContent.trim()).toBe('A');
    });

    // Native bfcache restores the same element instance rather than reparsing new
    // markup (unlike Turbo's cache), so this exercises a genuine disconnectedCallback/
    // connectedCallback cycle on the same object, twice in a row.
    it('survives the same instance being disconnected and reconnected twice', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <pds-tabs nav component-id="reconnect-test-3" tablist-label="Tabs">
          <pds-tab slot="tabs" href="/a" name="a" active="true">A</pds-tab>
        </pds-tabs>
      `);

      for (let i = 0; i < 2; i++) {
        await page.evaluate(() => {
          const tabs = document.querySelector('pds-tabs');
          const tab = document.querySelector('pds-tab');
          tabs.removeChild(tab);
          tabs.appendChild(tab);
        });
        await page.waitForChanges();
      }

      const anchors = await page.findAll('pds-tab a');
      expect(anchors.length).toBe(1);
      const content = await page.find('pds-tab .pds-tab__content');
      expect(content.textContent.trim()).toBe('A');
    });
  });
});
