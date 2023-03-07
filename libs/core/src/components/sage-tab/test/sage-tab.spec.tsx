import { newSpecPage } from '@stencil/core/testing';

import { SageTab } from '../sage-tab';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTab],
      html: `<sage-tab></sage-tab>`,
    });
    expect(page.root).toEqualHtml(`
    <sage-tab slot="tabs">
      <button aria-controls="undefined__undefined-panel" id="undefined__undefined" aria-selected="false" class="sage-tab" role="tab" tabindex="-1">
        <div class="sage-tab__content"></div>
      </button>
    </sage-tab>     
    `);
  });

  it('renders inactive tab with passed selected prop', async () => {
    const page = await newSpecPage({
      components: [SageTab],
      html: `<sage-tab selected="false" parent-component-id="foo" tab="two">Content</sage-tab>`,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <sage-tab slot="tabs" tab="two" parent-component-id="foo" selected="false">
        <button aria-controls="foo__two-panel" id="foo__two" aria-selected="false" class="sage-tab" role="tab" tabindex="-1" id="two">
          <div class="sage-tab__content">Content</div>
        </button>
      </sage-tab>
    `);
  });

  it('renders active tab with passed selected props', async () => {
    const page = await newSpecPage({
      components: [SageTab],
      html: `<sage-tab selected="true" parent-component-id="foo" tab="two">Content</sage-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tab slot="tabs" tab="two" parent-component-id="foo" selected="true">
        <button aria-controls="foo__two-panel" aria-selected="true" class="sage-tab is-active" role="tab" tabindex="0" id="foo__two">
          <div class="sage-tab__content">Content</div>
        </button>
      </sage-tab>
    `);
  });

  it('onclick fires event', async () => {
    const page = await newSpecPage({
      components: [SageTab],
      html: `<sage-tab active-tab="two" parent-component-id="foo" tab="two">Content</sage-tab>`,
    });
    const eventSpy = jest.fn(); 
    document.addEventListener('tabClick', eventSpy);
    const component = page.doc.getElementById("foo__two");
    component?.click();
    expect(eventSpy).toHaveBeenCalled();
  });

  it('renders tab edges when availability variant is passed', async () => {
    const page = await newSpecPage({
      components: [SageTab],
      html: `<sage-tab variant="availability" selected="true" parent-component-id="foo" tab="two">Content</sage-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tab slot="tabs" variant="availability" tab="two" parent-component-id="foo" selected="true">
        <button aria-controls="foo__two-panel" aria-selected="true" class="sage-tab is-active" role="tab" tabindex="0" id="foo__two">
          <span class="sage-tab-edge" role="presentation"></span>  
          <span class="sage-tab-edge sage-tab-edge--end" role="presentation"></span>
          <div class="sage-tab__content">Content</div>
        </button>
      </sage-tab>
    `);
  });
});
