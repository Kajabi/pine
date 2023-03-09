import { newSpecPage } from '@stencil/core/testing';
import { SageTabs } from '../sage-tabs';
import { SageTab } from '../sage-tab/sage-tab';
import { SageTabpanel } from '../sage-tabpanel/sage-tabpanel';

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
      html: `<sage-tabs active-tab-name="two" component-id="test" variant="availability"></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs active-tab-name="two" class="sage-tabs sage-tabs--availability" component-id="test" id="test" variant="availability">
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
      html: `<sage-tabs active-tab-name="two" tablist-label="test label" component-id="test"></sage-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-tabs active-tab-name="two" class="sage-tabs" component-id="test" id="test" tablist-label="test label">
        <mock:shadow-root>
          <div class="sage-tabs__tablist" role="tablist" aria-label="test label">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </sage-tabs>
    `);
  });

  it('sage-tabs catches `tabClick` event', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab, SageTabpanel],
      html: `
        <sage-tabs active-tab-name="two" tablist-label="test label" component-id="test" variant="primary">
          <sage-tab name="one">One</sage-tab>
          <sage-tab name="two">Two</sage-tab>
          <sage-tabpanel name="one">One</sage-tabpanel>
          <sage-tabpanel name="two">Two</sage-tabpanel>
        </sage-tabs>`,
    });
    
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': [0, 'test']}));
    await page.waitForChanges();
    const tabs = page.body.querySelector('sage-tabs[active-tab-name="one"]');
    expect(tabs).toBeTruthy();
  });

  it('sets new active tab when ArrowLeft is pressed', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab-name="three" tablist-label="test label" component-id="test" variant="primary">
          <sage-tab name="one">One</sage-tab>
          <sage-tab name="two">Two</sage-tab>
          <sage-tab name="three">Three</sage-tab>
        </sage-tabs>`,
    });

    // Move focus to tab by clicking on second activeTabIndex (1)
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': [1, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('sage-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).not.toHaveClass('is-active');
    
    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
    window.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('sage-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).not.toHaveClass('is-active');
  });

  it('loops new active tab to end when ArrowLeft is pressed on first tab', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab-name="three" tablist-label="test label" component-id="test" variant="primary">
          <sage-tab name="one">One</sage-tab>
          <sage-tab name="two">Two</sage-tab>
          <sage-tab name="three">Three</sage-tab>
        </sage-tabs>`,
    });

    // Move focus to tab by clicking on first activeTabIndex (0)
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': [0, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('sage-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).not.toHaveClass('is-active');
    
    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
    window.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('sage-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).toHaveClass('is-active');
  });

  it('sets new active tab when ArrowRight is pressed', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab-name="one" tablist-label="test label" component-id="test" variant="primary">
          <sage-tab name="one">One</sage-tab>
          <sage-tab name="two">Two</sage-tab>
          <sage-tab name="three">Three</sage-tab>
        </sage-tabs>`,
    });

    // Move focus to tab by clicking on second activeTabIndex (1)
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': [1, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('sage-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).not.toHaveClass('is-active');
    
    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'ArrowRight'});
    window.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('sage-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).toHaveClass('is-active');
  });

  it('loops new active tab to end when ArrowRight is pressed on last tab', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab-name="two" tablist-label="test label" component-id="test" variant="primary">
          <sage-tab name="one">One</sage-tab>
          <sage-tab name="two">Two</sage-tab>
          <sage-tab name="three">Three</sage-tab>
        </sage-tabs>`,
    });

    // Move focus to tab by clicking on last activeTabIndex (2)
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': [2, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('sage-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).toHaveClass('is-active');
    
    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'ArrowRight'});
    window.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('sage-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).not.toHaveClass('is-active');
  });

  it('moves active tab to first tab when Home is pressed', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab-name="three" tablist-label="test label" component-id="test" variant="primary">
          <sage-tab name="one">One</sage-tab>
          <sage-tab name="two">Two</sage-tab>
          <sage-tab name="three">Three</sage-tab>
        </sage-tabs>`,
    });

    // Move focus to tab by clicking on last activeTabIndex (2)
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': [1, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('sage-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).not.toHaveClass('is-active');
    
    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'Home'});
    window.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('sage-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).not.toHaveClass('is-active');
  });

  it('moves active tab to first tab when End is pressed', async () => {
    const page = await newSpecPage({
      components: [SageTabs, SageTab],
      html: `
        <sage-tabs active-tab-name="one" tablist-label="test label" component-id="test" variant="primary">
          <sage-tab name="one">One</sage-tab>
          <sage-tab name="two">Two</sage-tab>
          <sage-tab name="three">Three</sage-tab>
        </sage-tabs>`,
    });

    // Move focus to tab by clicking on last activeTabIndex (2)
    page.body.dispatchEvent(new CustomEvent('tabClick', {'detail': [1, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('sage-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).not.toHaveClass('is-active');
    
    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'End'});
    window.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('sage-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('sage-tab[name="three"] > button')).toHaveClass('is-active');
  });
});
