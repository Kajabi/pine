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
        <div class="sage-tabpanel" id="undefined-panel" role="tabpanel"></div>
      </sage-tabpanel>
    `);
  });

  it('renders inactive tabpanel with passed props', async () => {
    const page = await newSpecPage({
      components: [SageTabpanel],
      html: `<sage-tabpanel active-tab="one" parent-id="foo" tab="two">Content</sage-tabpanel>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabpanel slot="tabpanels" tab="two" parent-id="foo" active-tab="one">
        <div aria-labelledby="two" class="sage-tabpanel" role="tabpanel" id="two-panel">
          Content
        </div>
      </sage-tabpanel>
    `);
  });

  it('renders active tabpanel with passed props', async () => {
    const page = await newSpecPage({
      components: [SageTabpanel],
      html: `<sage-tabpanel active-tab="two" parent-id="foo" tab="two">Content</sage-tabpanel>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabpanel slot="tabpanels" tab="two" parent-id="foo" active-tab="two">
        <div aria-labelledby="two" class="sage-tabpanel is-active" role="tabpanel" id="two-panel">
          Content
        </div>
      </sage-tabpanel>
    `);
  });

  // it('listen decorator working as expected', async () => {
  //   const page = await newSpecPage({
  //     components: [SageTabpanel],
  //     html: `<sage-tabpanel active-tab="one" parent-id="foo" tab="two">Content</sage-tabpanel>`,
  //   });
  //   document.dispatchEvent(new MouseEvent("two", {
  //     bubbles: true,
  //     cancelable: true
  //   }));
  //   expect(page.root).toEqualHtml(`
  //     <sage-tabpanel slot="tabpanels" tab="two" parent-id="foo" active-tab="two">
  //       <div aria-labelledby="two" class="sage-tabpanel is-active" role="tabpanel" id="two-panel">
  //         Content
  //       </div>
  //     </sage-tabpanel>
  //   `);
  // });
});
