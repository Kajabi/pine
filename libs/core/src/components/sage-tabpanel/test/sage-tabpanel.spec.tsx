import { newSpecPage } from '@stencil/core/testing';
import { SageTabpanel } from '../sage-tabpanel';

describe('sage-tabpanel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTabpanel],
      html: `<sage-tabpanel></sage-tabpanel>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabpanel slot="tabpanels">
        <div class="sage-tabpanel" id="undefined-panel" role="tabpanel" tabindex="0"></div>
      </sage-tabpanel>
    `);
  });

  it('renders inactive tabpanel with passed selected prop', async () => {
    const page = await newSpecPage({
      components: [SageTabpanel],
      html: `<sage-tabpanel selected="false" parent-id="foo" tab="two">Content</sage-tabpanel>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabpanel slot="tabpanels" tab="two" parent-id="foo" selected="false">
        <div aria-labelledby="two" class="sage-tabpanel" role="tabpanel" id="two-panel" tabindex="0">
          Content
        </div>
      </sage-tabpanel>
    `);
  });

  it('renders active tabpanel with passed selected prop', async () => {
    const page = await newSpecPage({
      components: [SageTabpanel],
      html: `<sage-tabpanel selected="true" parent-id="foo" tab="two">Content</sage-tabpanel>`,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <sage-tabpanel slot="tabpanels" tab="two" parent-id="foo" selected="true">
        <div aria-labelledby="two" class="sage-tabpanel is-active" role="tabpanel" id="two-panel" tabindex="0">
          Content
        </div>
      </sage-tabpanel>
    `);
  });
});
