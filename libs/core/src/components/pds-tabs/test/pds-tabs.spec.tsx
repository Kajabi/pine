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

  describe('navigation mode (nav)', () => {
    it('renders the tab strip as a <nav> of links when `nav` is set', async () => {
      const page = await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="clubs" tablist-label="Club sections" variant="primary" nav>
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
      // Parent drives the children: every tab renders as a link, not a role=tab button.
      expect(page.body.querySelectorAll('pds-tab a').length).toBe(2);
      expect(page.body.querySelector('pds-tab button')).toBeNull();
    });

    it('keeps the role=tablist and buttons in panel mode (no `nav`)', async () => {
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

    it('keeps a tab a panel button even if it has an href, when `nav` is not set', async () => {
      // Structural guarantee: the parent is authoritative, so a stray href can't
      // turn a single child into a link inside a role=tablist.
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const page = await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="panels" tablist-label="Foo" variant="primary" active-tab-name="one">
            <pds-tab name="one" href="/one">One</pds-tab>
            <pds-tab name="two">Two</pds-tab>
          </pds-tabs>
        `,
      });
      await page.waitForChanges();

      expect(page.root?.shadowRoot?.querySelector('div.pds-tabs__tablist[role="tablist"]')).not.toBeNull();
      expect(page.body.querySelector('pds-tab[name="one"] a')).toBeNull();
      expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toBeNull();
      warnSpy.mockRestore();
    });

    it('defaults to the first tab in panel mode when activeTabName is omitted', async () => {
      const page = await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="panels" tablist-label="Foo" variant="primary">
            <pds-tab name="one">One</pds-tab>
            <pds-tab name="two">Two</pds-tab>
          </pds-tabs>
        `,
      });
      await page.waitForChanges();

      // Panel mode must stay keyboard-reachable, so the first tab is selected/tabbable.
      expect(page.root?.shadowRoot?.querySelector('div.pds-tabs__tablist[role="tablist"]')).not.toBeNull();
      expect(page.body.querySelector('pds-tab[name="one"] > button')).toHaveClass('is-active');
      expect(page.body.querySelector('pds-tab[name="one"] > button')?.getAttribute('tabindex')).toBe('0');
      expect(page.body.querySelector('pds-tab[name="two"] > button')).not.toHaveClass('is-active');
    });

    it('defaults to the first ENABLED tab when the first tab is disabled', async () => {
      const page = await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="panels" tablist-label="Foo" variant="primary">
            <pds-tab name="one" disabled>One</pds-tab>
            <pds-tab name="two">Two</pds-tab>
          </pds-tabs>
        `,
      });
      await page.waitForChanges();

      // Selecting the disabled first tab would leave every button at tabindex="-1"
      // (a trap); the first enabled tab must be selected/tabbable instead.
      expect(page.body.querySelector('pds-tab[name="one"] > button')).not.toHaveClass('is-active');
      expect(page.body.querySelector('pds-tab[name="two"] > button')).toHaveClass('is-active');
      expect(page.body.querySelector('pds-tab[name="two"] > button')?.getAttribute('tabindex')).toBe('0');
    });

    it('warns when `nav` is set but a tab has only an empty href', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="nav-empty" tablist-label="Foo" variant="primary" nav>
            <pds-tab href="/clubs/1/chat" name="chat">Chat</pds-tab>
            <pds-tab href="" name="two">Two</pds-tab>
          </pds-tabs>
        `,
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('every pds-tab needs an `href`'));
      warnSpy.mockRestore();
    });

    it('ignores arrow-key roving in nav mode', async () => {
      const page = await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="clubs" tablist-label="Foo" variant="primary" nav>
            <pds-tab href="/a" name="a" active="true">A</pds-tab>
            <pds-tab href="/b" name="b">B</pds-tab>
          </pds-tabs>
        `,
      });
      await page.waitForChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      page.body.querySelector('pds-tab[name="a"] a')?.dispatchEvent(event);
      await page.waitForChanges();

      // Nav mode uses native link focus; roving is disabled, so the current link is unchanged.
      expect(page.body.querySelector('pds-tab[name="a"] a')?.getAttribute('aria-current')).toBe('page');
      expect(page.body.querySelector('pds-tab[name="a"] a')).toHaveClass('is-active');
      expect(page.body.querySelector('pds-tab[name="b"] a')?.hasAttribute('aria-current')).toBe(false);
    });

    it('warns when `nav` is set but a tab is missing an href', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="nav-missing" tablist-label="Foo" variant="primary" nav>
            <pds-tab href="/clubs/1/chat" name="chat">Chat</pds-tab>
            <pds-tab name="two">Two</pds-tab>
          </pds-tabs>
        `,
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('every pds-tab needs an `href`'));
      warnSpy.mockRestore();
    });

    it('warns when a tab has an href but `nav` is not set', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="href-no-nav" tablist-label="Foo" variant="primary" active-tab-name="chat">
            <pds-tab href="/clubs/1/chat" name="chat">Chat</pds-tab>
            <pds-tab name="two">Two</pds-tab>
          </pds-tabs>
        `,
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('`nav` is not set'));
      warnSpy.mockRestore();
    });

    it('does not warn when `nav` is set and every tab has an href', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await newSpecPage({
        components: [PdsTabs, PdsTab],
        html: `
          <pds-tabs component-id="all-nav" tablist-label="Foo" variant="primary" nav>
            <pds-tab href="/clubs/1/chat" name="chat">Chat</pds-tab>
            <pds-tab href="/clubs/1/members" name="members">Members</pds-tab>
          </pds-tabs>
        `,
      });

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
