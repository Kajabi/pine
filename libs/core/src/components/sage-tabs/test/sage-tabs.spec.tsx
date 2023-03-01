import { newSpecPage } from '@stencil/core/testing';
import { SageTabs } from '../sage-tabs';
import { SageTab } from '../../sage-tab/sage-tab';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageTabs],
      html: `<sage-tabs></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs class="sage-tabs">
        <mock:shadow-root>
          <div class="sage-tabs__tablist" role="tablist">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });

it('renders variant prop', async () => {
    const page = await newSpecPage({
      components: [SageTabs],
      html: `<sage-tabs active-tab="two" component-id="test" variant="availability"></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs active-tab="two" class="sage-tabs sage-tabs--availability" component-id="test" variant="availability">
        <mock:shadow-root>
          <div class="sage-tabs__tablist" role="tablist">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });

  it('renders tablist-label props', async () => {
    const page = await newSpecPage({
      components: [SageTabs],
      html: `<sage-tabs active-tab="two" tablist-label="test label" component-id="test"></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs active-tab="two" class="sage-tabs" component-id="test" tablist-label="test label">
        <mock:shadow-root>
          <div class="sage-tabs__tablist" role="tablist" aria-label="test label">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });

  it('matched tab method returns expected true and false values', async () => {
    const sageTabs = new SageTabs();
    expect(sageTabs.matchActiveTab("two", "two")).toBeTruthy();
    expect(sageTabs.matchActiveTab("two", "one")).toBeFalsy();
  });

  it('sage-tabs catches `tabClick` event', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab="two" tablist-label="test label" component-id="test">
          <sage-tab tab="one" id="test-one">One</sage-tab>
          <sage-tab tab="two" id="test-two">Two</sage-tab>
        </sage-tabs>`,
    });
    
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': ['one', 'test']}));
    await page.waitForChanges();
    const tabs = page.body.querySelector('sage-tabs[active-tab="one"]');
    expect(tabs).toBeTruthy();
  });

  it('sets new active tab when ArrowLeft is pressed', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab="two" tablist-label="test label" component-id="test">
          <sage-tab tab="one" id="test-one">One</sage-tab>
          <sage-tab tab="two" id="test-two">Two</sage-tab>
        </sage-tabs>`,
    });    
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': ['one', 'test']}));
    await page.waitForChanges();
    let tabs = page.body.querySelector('sage-tabs');
    const activeTab = page.body.querySelector('sage-tab[tab="two"]');
    const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
    if (!activeTab) {
      throw new Error("activeTab is null");
    }
    activeTab.dispatchEvent(event);
    await page.waitForChanges();
    tabs = page.body.querySelector('sage-tabs[active-tab="one"]');
    expect(tabs).toBeTruthy();
  });

  it('sets new active tab when ArrowRight is pressed', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab="one" tablist-label="test label" component-id="test">
          <sage-tab tab="one" id="test-one">One</sage-tab>
          <sage-tab tab="two" id="test-two">Two</sage-tab>
        </sage-tabs>`,
    });
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': ['two', 'test']}));
    await page.waitForChanges();
    let tabs = page.body.querySelector('sage-tabs');
    const activeTab = page.body.querySelector('sage-tab[tab="one"]');
    const event = new KeyboardEvent('keydown', {'key': 'ArrowRight'});
    if (!activeTab) {
      throw new Error("activeTab is null");
    }
    activeTab.dispatchEvent(event);
    await page.waitForChanges();
    tabs = page.body.querySelector('sage-tabs[active-tab="two"]');
    expect(tabs).toBeTruthy();
  });

  it('sets new active tab when Home is pressed', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab="two" tablist-label="test label" component-id="test">
          <sage-tab tab="one" id="test-one">One</sage-tab>
          <sage-tab tab="two" id="test-two">Two</sage-tab>
        </sage-tabs>`,
    });    
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': ['one', 'test']}));
    await page.waitForChanges();
    let tabs = page.body.querySelector('sage-tabs');
    const activeTab = page.body.querySelector('sage-tab[tab="two"]');
    await page.waitForChanges();
    const event = new KeyboardEvent('keydown', {'key': 'Home', bubbles: true, composed: true});
    if (!activeTab) {throw new Error("activeTab is null");}
    activeTab.dispatchEvent(event);
    await page.waitForChanges();
    tabs = page.body.querySelector('sage-tabs[active-tab="one"]');
    expect(tabs).toBeTruthy();
  });

  it('sets new active tab when End is pressed', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab="one" tablist-label="test label" component-id="test">
          <sage-tab tab="one" id="test-one">One</sage-tab>
          <sage-tab tab="two" id="test-two">Two</sage-tab>
        </sage-tabs>`,
    });
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': ['two', 'test']}));
    await page.waitForChanges();
    let tabs = page.body.querySelector('sage-tabs');
    const activeTab = page.body.querySelector('sage-tab[tab="one"]');
    const event = new KeyboardEvent('keydown', {'key': 'End'});
    if (!activeTab) {throw new Error("activeTab is null");}
    activeTab.dispatchEvent(event);
    await page.waitForChanges();
    tabs = page.body.querySelector('sage-tabs[active-tab="two"]');
    expect(tabs).toBeTruthy();
  });
});
