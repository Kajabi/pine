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
        <div class="sage-tabpanel" id="undefined__undefined-panel" role="tabpanel" tabindex="0" aria-labelledby="undefined__undefined"></div>
      </sage-tabpanel>
    `);
  });

  it('renders inactive tabpanel with passed selected prop', async () => {
    const page = await newSpecPage({
      components: [SageTabpanel],
      html: `<sage-tabpanel selected="false" parent-component-id="foo" tab="two">Content</sage-tabpanel>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabpanel slot="tabpanels" tab="two" parent-component-id="foo" selected="false">
        <div aria-labelledby="foo__two" class="sage-tabpanel" role="tabpanel" id="foo__two-panel" tabindex="0">
          Content
        </div>
      </sage-tabpanel>
    `);
  });

  it('renders active tabpanel with passed selected prop', async () => {
    const page = await newSpecPage({
      components: [SageTabpanel],
      html: `<sage-tabpanel selected="true" parent-component-id="foo" tab="two">Content</sage-tabpanel>`,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <sage-tabpanel slot="tabpanels" tab="two" parent-component-id="foo" selected="true">
        <div aria-labelledby="foo__two" class="sage-tabpanel is-active" role="tabpanel" id="foo__two-panel" tabindex="0">
          Content
        </div>
      </sage-tabpanel>
    `);
  });
});
