import { newSpecPage } from '@stencil/core/testing';

import { PdsTab } from '../pds-tab';

describe('pds-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTab],
      html: `<pds-tab></pds-tab>`,
    });
    expect(page.root).toEqualHtml(`
    <pds-tab slot="tabs">
      <button aria-controls="undefined__undefined-panel" id="undefined__undefined" aria-selected="false" class="pds-tab" role="tab" tabindex="-1">
        <div class="pds-tab__content"></div>
      </button>
    </pds-tab>
    `);
  });

  it('renders inactive tab with passed selected prop', async () => {
    const page = await newSpecPage({
      components: [PdsTab],
      html: `<pds-tab selected="false" parent-component-id="foo" name="two">Content</pds-tab>`,
    });
    await page.waitForChanges();
    expect(page.root).toEqualHtml(`
      <pds-tab slot="tabs" name="two" parent-component-id="foo" selected="false">
        <button aria-controls="foo__two-panel" id="foo__two" aria-selected="false" class="pds-tab" role="tab" tabindex="-1" id="two">
          <div class="pds-tab__content">Content</div>
        </button>
      </pds-tab>
    `);
  });

  it('renders active tab with passed selected props', async () => {
    const page = await newSpecPage({
      components: [PdsTab],
      html: `<pds-tab selected="true" parent-component-id="foo" name="two">Content</pds-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-tab slot="tabs" name="two" parent-component-id="foo" selected="true">
        <button aria-controls="foo__two-panel" aria-selected="true" class="pds-tab is-active" role="tab" tabindex="0" id="foo__two">
          <div class="pds-tab__content">Content</div>
        </button>
      </pds-tab>
    `);
  });

  it('onclick fires event', async () => {
    const page = await newSpecPage({
      components: [PdsTab],
      html: `<pds-tab active-name="two" parent-component-id="foo" name="two">Content</pds-tab>`,
    });
    const eventSpy = jest.fn();
    document.addEventListener('pdsTabClick', eventSpy);
    const component = page.doc.getElementById("foo__two");
    component?.click();
    expect(eventSpy).toHaveBeenCalled();
  });

  it('renders tab edges when availability variant is passed', async () => {
    const page = await newSpecPage({
      components: [PdsTab],
      html: `<pds-tab variant="availability" selected="true" parent-component-id="foo" name="two">Content</pds-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-tab slot="tabs" variant="availability" name="two" parent-component-id="foo" selected="true">
        <button aria-controls="foo__two-panel" aria-selected="true" class="pds-tab is-active" role="tab" tabindex="0" id="foo__two">
          <span class="pds-tab-edge" role="presentation"></span>
          <span class="pds-tab-edge pds-tab-edge--end" role="presentation"></span>
          <div class="pds-tab__content">Content</div>
        </button>
      </pds-tab>
    `);
  });

  it('renders disabled tab with passed disabled prop', async () => {
    const page = await newSpecPage({
      components: [PdsTab],
      html: `<pds-tab disabled="true" parent-component-id="foo" name="two">Content</pds-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-tab slot="tabs" disabled="true" name="two" parent-component-id="foo">
        <button aria-controls="foo__two-panel" aria-disabled="true" aria-selected="false" class="pds-tab is-disabled" disabled role="tab" tabindex="-1" id="foo__two">
          <div class="pds-tab__content">Content</div>
        </button>
      </pds-tab>
    `);
  });

  it('onclick does not fire event when disabled', async () => {
    const page = await newSpecPage({
      components: [PdsTab],
      html: `<pds-tab disabled="true" parent-component-id="foo" name="two">Content</pds-tab>`,
    });
    const eventSpy = jest.fn();
    document.addEventListener('pdsTabClick', eventSpy);
    const component = page.doc.getElementById("foo__two");
    component?.click();
    expect(eventSpy).not.toHaveBeenCalled();
  });
});
