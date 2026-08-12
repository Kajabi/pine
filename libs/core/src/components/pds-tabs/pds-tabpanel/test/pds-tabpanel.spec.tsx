import { newSpecPage } from '@stencil/core/testing';
import { PdsTabpanel } from '../pds-tabpanel';

describe('pds-tabpanel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTabpanel],
      html: `<pds-tabpanel></pds-tabpanel>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-tabpanel slot="tabpanels">
        <div class="pds-tabpanel" id="undefined__undefined-panel" role="tabpanel" tabindex="0" aria-labelledby="undefined__undefined"></div>
      </pds-tabpanel>
    `);
  });

  it('renders inactive tabpanel with passed selected prop', async () => {
    const page = await newSpecPage({
      components: [PdsTabpanel],
      html: `<pds-tabpanel selected="false" parent-component-id="foo" name="two">Content</pds-tabpanel>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-tabpanel slot="tabpanels" name="two" parent-component-id="foo" selected="false">
        <div aria-labelledby="foo__two" class="pds-tabpanel" role="tabpanel" id="foo__two-panel" tabindex="0">
          Content
        </div>
      </pds-tabpanel>
    `);
  });

  it('renders active tabpanel with passed selected prop', async () => {
    const page = await newSpecPage({
      components: [PdsTabpanel],
      html: `<pds-tabpanel selected="true" parent-component-id="foo" name="two">Content</pds-tabpanel>`,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pds-tabpanel slot="tabpanels" name="two" parent-component-id="foo" selected="true">
        <div aria-labelledby="foo__two" class="pds-tabpanel is-active" role="tabpanel" id="foo__two-panel" tabindex="0">
          Content
        </div>
      </pds-tabpanel>
    `);
  });

  it('adds the stretch-active class when stretch and selected are both set', async () => {
    const page = await newSpecPage({
      components: [PdsTabpanel],
      html: `<pds-tabpanel stretch="true" selected="true" parent-component-id="foo" name="two">Content</pds-tabpanel>`,
    });
    await page.waitForChanges();
    expect(page.root.classList.contains('pds-tabpanel--stretch-active')).toBe(true);
  });

  it('does not add the stretch-active class when the panel is not selected', async () => {
    const page = await newSpecPage({
      components: [PdsTabpanel],
      html: `<pds-tabpanel stretch="true" parent-component-id="foo" name="two">Content</pds-tabpanel>`,
    });
    await page.waitForChanges();
    expect(page.root.classList.contains('pds-tabpanel--stretch-active')).toBe(false);
  });
});
