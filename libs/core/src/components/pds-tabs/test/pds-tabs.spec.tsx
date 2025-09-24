import { newSpecPage } from '@stencil/core/testing';
import { PdsTabs } from '../pds-tabs';
import { PdsTab } from '../pds-tab/pds-tab';
import { PdsTabpanel } from '../pds-tabpanel/pds-tabpanel';

describe('pds-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsTabs],
      html: `<pds-tabs></pds-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-tabs class="pds-tabs">
        <mock:shadow-root>
          <div class="pds-tabs__tablist" part="tab-list" role="tablist">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </pds-tabs>
    `);
  });

it('renders variant prop', async () => {
    const page = await newSpecPage({
      components: [PdsTabs],
      html: `<pds-tabs active-tab-name="two" component-id="test" variant="availability"></pds-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-tabs active-tab-name="two" class="pds-tabs pds-tabs--availability" component-id="test" id="test" variant="availability">
        <mock:shadow-root>
          <div class="pds-tabs__tablist" part="tab-list" role="tablist">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </pds-tabs>
    `);
  });

  it('renders tablist-label props', async () => {
    const page = await newSpecPage({
      components: [PdsTabs],
      html: `<pds-tabs active-tab-name="two" tablist-label="test label" component-id="test"></pds-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-tabs active-tab-name="two" class="pds-tabs" component-id="test" id="test" tablist-label="test label">
        <mock:shadow-root>
          <div class="pds-tabs__tablist" part="tab-list" role="tablist" aria-label="test label">
            <slot name="tabs"></slot>
          </div>
          <slot name="tabpanels"></slot>
        </mock:shadow-root>
      </pds-tabs>
    `);
  });

  it('pds-tabs catches `pdsTabClick` event', async () => {
    const page = await newSpecPage({
      components: [PdsTabs, PdsTab, PdsTabpanel],
      html: `
        <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test" variant="primary">
          <pds-tab name="one">One</pds-tab>
          <pds-tab name="two">Two</pds-tab>
          <pds-tabpanel name="one">One</pds-tabpanel>
          <pds-tabpanel name="two">Two</pds-tabpanel>
        </pds-tabs>`,
    });

    page.body.dispatchEvent(new CustomEvent('pdsTabClick', {'detail': [0, 'test']}));
    await page.waitForChanges();
    const tabs = page.body.querySelector('pds-tabs[active-tab-name="one"]');
    expect(tabs).toBeTruthy();
  });

  it('sets new active tab when ArrowLeft is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsTabs, PdsTab],
      html: `
        <pds-tabs active-tab-name="three" tablist-label="test label" component-id="test" variant="primary">
          <pds-tab name="one">One</pds-tab>
          <pds-tab name="two">Two</pds-tab>
          <pds-tab name="three">Three</pds-tab>
        </pds-tabs>`,
    });

    // Move focus to tab by clicking on second activeTabIndex (1)
    page.body.dispatchEvent(new CustomEvent('pdsTabClick', {'detail': [1, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).not.toHaveClass('is-active');

    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
    const tabs = page.body.querySelector('pds-tabs');
    tabs?.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('pds-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).not.toHaveClass('is-active');
  });

  it('loops new active tab to end when ArrowLeft is pressed on first tab', async () => {
    const page = await newSpecPage({
      components: [PdsTabs, PdsTab],
      html: `
        <pds-tabs active-tab-name="three" tablist-label="test label" component-id="test" variant="primary">
          <pds-tab name="one">One</pds-tab>
          <pds-tab name="two">Two</pds-tab>
          <pds-tab name="three">Three</pds-tab>
        </pds-tabs>`,
    });

    // Move focus to tab by clicking on first activeTabIndex (0)
    page.body.dispatchEvent(new CustomEvent('pdsTabClick', {'detail': [0, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('pds-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).not.toHaveClass('is-active');

    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft'});
    const tabs = page.body.querySelector('pds-tabs');
    tabs?.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).toHaveClass('is-active');
  });

  it('sets new active tab when ArrowRight is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsTabs, PdsTab],
      html: `
        <pds-tabs active-tab-name="one" tablist-label="test label" component-id="test" variant="primary">
          <pds-tab name="one">One</pds-tab>
          <pds-tab name="two">Two</pds-tab>
          <pds-tab name="three">Three</pds-tab>
        </pds-tabs>`,
    });

    // Move focus to tab by clicking on second activeTabIndex (1)
    page.body.dispatchEvent(new CustomEvent('pdsTabClick', {'detail': [1, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).not.toHaveClass('is-active');

    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'ArrowRight'});
    const tabs = page.body.querySelector('pds-tabs');
    tabs?.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).toHaveClass('is-active');
  });

  it('loops new active tab to end when ArrowRight is pressed on last tab', async () => {
    const page = await newSpecPage({
      components: [PdsTabs, PdsTab],
      html: `
        <pds-tabs active-tab-name="two" tablist-label="test label" component-id="test" variant="primary">
          <pds-tab name="one">One</pds-tab>
          <pds-tab name="two">Two</pds-tab>
          <pds-tab name="three">Three</pds-tab>
        </pds-tabs>`,
    });

    // Move focus to tab by clicking on last activeTabIndex (2)
    page.body.dispatchEvent(new CustomEvent('pdsTabClick', {'detail': [2, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).toHaveClass('is-active');

    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'ArrowRight'});
    const tabs = page.body.querySelector('pds-tabs');
    tabs?.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('pds-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).not.toHaveClass('is-active');
  });

  it('moves active tab to first tab when Home is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsTabs, PdsTab],
      html: `
        <pds-tabs active-tab-name="three" tablist-label="test label" component-id="test" variant="primary">
          <pds-tab name="one">One</pds-tab>
          <pds-tab name="two">Two</pds-tab>
          <pds-tab name="three">Three</pds-tab>
        </pds-tabs>`,
    });

    // Move focus to tab by clicking on last activeTabIndex (2)
    page.body.dispatchEvent(new CustomEvent('pdsTabClick', {'detail': [1, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).not.toHaveClass('is-active');

    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'Home'});
    const tabs = page.body.querySelector('pds-tabs');
    tabs?.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('pds-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).not.toHaveClass('is-active');
  });

  it('moves active tab to first tab when End is pressed', async () => {
    const page = await newSpecPage({
      components: [PdsTabs, PdsTab],
      html: `
        <pds-tabs active-tab-name="one" tablist-label="test label" component-id="test" variant="primary">
          <pds-tab name="one">One</pds-tab>
          <pds-tab name="two">Two</pds-tab>
          <pds-tab name="three">Three</pds-tab>
        </pds-tabs>`,
    });

    // Move focus to tab by clicking on last activeTabIndex (2)
    page.body.dispatchEvent(new CustomEvent('pdsTabClick', {'detail': [1, 'test']}));
    await page.waitForChanges();
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).not.toHaveClass('is-active');

    // Create and dispatch `ArrowLeft` keydown
    const event = new KeyboardEvent('keydown', {'key': 'End'});
    const tabs = page.body.querySelector('pds-tabs');
    tabs?.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).toHaveClass('is-active');
  });
});
