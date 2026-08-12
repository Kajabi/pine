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

    // Create and dispatch `ArrowLeft` keydown on the active tab button
    const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft', bubbles: true});
    const activeTabButton = page.body.querySelector('pds-tab[name="two"] > button');
    activeTabButton?.dispatchEvent(event);
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

    // Create and dispatch `ArrowLeft` keydown on the active tab button
    const event = new KeyboardEvent('keydown', {'key': 'ArrowLeft', bubbles: true});
    const activeTabButton = page.body.querySelector('pds-tab[name="one"] > button');
    activeTabButton?.dispatchEvent(event);
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

    // Create and dispatch `ArrowRight` keydown on the active tab button
    const event = new KeyboardEvent('keydown', {'key': 'ArrowRight', bubbles: true});
    const activeTabButton = page.body.querySelector('pds-tab[name="two"] > button');
    activeTabButton?.dispatchEvent(event);
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

    // Create and dispatch `ArrowRight` keydown on the active tab button
    const event = new KeyboardEvent('keydown', {'key': 'ArrowRight', bubbles: true});
    const activeTabButton = page.body.querySelector('pds-tab[name="three"] > button');
    activeTabButton?.dispatchEvent(event);
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

    // Create and dispatch `Home` keydown on the active tab button
    const event = new KeyboardEvent('keydown', {'key': 'Home', bubbles: true});
    const activeTabButton = page.body.querySelector('pds-tab[name="two"] > button');
    activeTabButton?.dispatchEvent(event);
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

    // Create and dispatch `End` keydown on the active tab button
    const event = new KeyboardEvent('keydown', {'key': 'End', bubbles: true});
    const activeTabButton = page.body.querySelector('pds-tab[name="two"] > button');
    activeTabButton?.dispatchEvent(event);
    await page.waitForChanges();

    // Expect active tab to have shifted
    expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="three"] > button')).toHaveClass('is-active');
  });

  it('ignores keyboard events from panel content', async () => {
    const page = await newSpecPage({
      components: [PdsTabs, PdsTab, PdsTabpanel],
      html: `
        <pds-tabs active-tab-name="one" tablist-label="test label" component-id="test" variant="primary">
          <pds-tab name="one">One</pds-tab>
          <pds-tab name="two">Two</pds-tab>
          <pds-tabpanel name="one">
            <input type="text" id="test-input" />
          </pds-tabpanel>
          <pds-tabpanel name="two">Two</pds-tabpanel>
        </pds-tabs>`,
    });

    await page.waitForChanges();

    // Verify initial state
    expect(page.body.querySelector('pds-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');

    // Dispatch ArrowRight from input (should NOT trigger navigation)
    const event = new KeyboardEvent('keydown', {'key': 'ArrowRight', bubbles: true});
    const input = page.body.querySelector('#test-input');
    input?.dispatchEvent(event);
    await page.waitForChanges();

    // Active tab should remain unchanged
    expect(page.body.querySelector('pds-tab[name="one"] > button')).toHaveClass('is-active');
    expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
  });

  it('adds the divider class when the divider prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTabs],
      html: `<pds-tabs component-id="test" divider="true"></pds-tabs>`,
    });
    expect(page.root.classList.contains('pds-tabs--divider')).toBe(true);
  });

  it('adds the stretch class when the stretch prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsTabs],
      html: `<pds-tabs component-id="test" stretch="true"></pds-tabs>`,
    });
    expect(page.root.classList.contains('pds-tabs--stretch')).toBe(true);
  });

  describe('navigation mode (tabs with href)', () => {
    it('renders the tab strip as a <nav>, not a role=tablist, when its tabs are links', async () => {
      const page = await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="clubs" tablist-label="Club sections" variant="primary">
            <pds-tab href="/clubs/1/chat" active="true" name="chat">Chat</pds-tab>
            <pds-tab href="/clubs/1/members" name="members">Members</pds-tab>
          </pds-tabs>
        `,
      });
      await page.waitForChanges();

      const shadow = page.root?.shadowRoot;
      expect(shadow?.querySelector('nav.pds-tabs__tablist')).not.toBeNull();
      expect(shadow?.querySelector('nav')?.getAttribute('aria-label')).toBe('Club sections');
      // No panel-switcher tablist in nav mode.
      expect(shadow?.querySelector('[role="tablist"]')).toBeNull();
    });

    it('keeps the role=tablist for panel-mode tabs (no href)', async () => {
      const page = await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="panels" tablist-label="Foo" variant="primary" active-tab-name="one">
            <pds-tab name="one">One</pds-tab>
            <pds-tab name="two">Two</pds-tab>
          </pds-tabs>
        `,
      });
      await page.waitForChanges();

      const shadow = page.root?.shadowRoot;
      expect(shadow?.querySelector('div.pds-tabs__tablist[role="tablist"]')).not.toBeNull();
      expect(shadow?.querySelector('nav')).toBeNull();
    });
  });
});
