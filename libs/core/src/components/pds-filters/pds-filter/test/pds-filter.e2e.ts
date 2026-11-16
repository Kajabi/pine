import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../../utils/test/axe';
import { expectRespectsReducedMotion } from '../../../../utils/test/reduced-motion';

const FIREFOX_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:155.0) Gecko/20100101 Firefox/155.0';

const TWO_FILTERS = `
  <pds-filters>
    <pds-filter id="first" component-id="first" text="First"><p>First content</p></pds-filter>
    <pds-filter id="second" component-id="second" text="Second"><p>Second content</p></pds-filter>
  </pds-filters>
  <div id="outside">Outside element</div>
`;

// Popover toggle events and the filter's close checks run in later tasks, so let them run before asserting.
const settle = async (page: E2EPage) => {
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50)));
  await page.waitForChanges();
};

const isPopoverVisible = async (page: E2EPage, id: string) =>
  (await page.find(`#${id} >>> .pds-filter__popover`)).isVisible();

describe('pds-filter e2e', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-filter component-id="test" text="Test Filter"></pds-filter>');

    const element = await page.find('pds-filter');
    expect(element).toHaveClass('hydrated');
  });

  it('shows and hides popover on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test Filter">
        <p>Popover content</p>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Initially popover is closed
    let popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.getAttribute('popover')).toBe('auto');
    expect(await popover.isVisible()).toBe(false);

    // Click to open
    await trigger.click();
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(true);

    // Click again to close
    await trigger.click();
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(false);
  });

  it('emits pds-filter-open and pds-filter-close events', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test-filter" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const filter = await page.find('pds-filter');
    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    // Click to open
    await trigger.click();
    expect(openEventSpy).toHaveReceivedEvent();

    // Click to close
    await trigger.click();
    expect(closeEventSpy).toHaveReceivedEvent();
  });

  it('emits pds-filter-clear event when clear variant is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test-filter" variant="clear" text="Clear">
      </pds-filter>
    `);

    const filter = await page.find('pds-filter');
    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    const clearEventSpy = await filter.spyOnEvent('pdsFilterClear');

    // Click clear variant
    await trigger.click();
    expect(clearEventSpy).toHaveReceivedEventDetail({
      componentId: 'test-filter',
      text: 'Clear'
    });
  });

  it('clear variant does not open popover', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test-filter" variant="clear" text="Clear">
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Click clear variant
    await trigger.click();
    await page.waitForChanges();

    // Clear variant should not have popover
    const popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeFalsy();
  });

  it('supports keyboard navigation', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Focus the trigger
    await trigger.focus();

    // Press Enter to open
    await page.keyboard.press('Enter');
    await page.waitForChanges();

    let popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(true);

    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(false);
  });

  it('supports Space key activation', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    await trigger.focus();
    await page.keyboard.press(' ');
    await page.waitForChanges();

    const popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(true);
  });

  it('closes on outside click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div>
        <pds-filter component-id="test" text="Test">
          <p>Content</p>
        </pds-filter>
        <div id="outside">Outside element</div>
      </div>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');
    const outside = await page.find('#outside');

    // Open popover
    await trigger.click();
    await page.waitForChanges();

    let popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(true);

    // Click outside
    await outside.click();
    await page.waitForChanges();

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(false);
  });

  it('opens and closes programmatically', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const filter = await page.find('pds-filter');
    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    // Open programmatically
    await filter.callMethod('showFilter');
    await settle(page);

    let popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(true);
    expect(openEventSpy).toHaveReceivedEventTimes(1);

    // Close programmatically
    await filter.callMethod('hideFilter');
    await settle(page);

    popover = await page.find('pds-filter >>> .pds-filter__popover');
    expect(popover).toBeTruthy();
    expect(await popover.isVisible()).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
  });

  it('shows different variants correctly', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div>
        <pds-filter id="default" component-id="default" variant="default" text="Default">
          <p>Default content</p>
        </pds-filter>
        <pds-filter id="selected" component-id="selected" variant="selected" text="Selected">
          <p>Selected content</p>
        </pds-filter>
        <pds-filter id="more" component-id="more" variant="more" text="More">
          <p>More content</p>
        </pds-filter>
        <pds-filter id="clear" component-id="clear" variant="clear" text="Clear">
          <p>Clear content</p>
        </pds-filter>
      </div>
    `);

    // Check default variant
    const defaultTrigger = await page.find('#default >>> .pds-filter__trigger');
    expect(defaultTrigger).toHaveClass('pds-filter__trigger--default');

    // Check selected variant has dropdown icon
    const selectedTrigger = await page.find('#selected >>> .pds-filter__trigger');
    expect(selectedTrigger).toHaveClass('pds-filter__trigger--selected');
    const dropdownIcon = await page.find('#selected >>> .pds-filter__dropdown-icon');
    expect(dropdownIcon).toBeTruthy();

    // Check more variant
    const moreTrigger = await page.find('#more >>> .pds-filter__trigger');
    expect(moreTrigger).toHaveClass('pds-filter__trigger--more');

    // Check clear variant has trash icon
    const clearTrigger = await page.find('#clear >>> .pds-filter__trigger');
    expect(clearTrigger).toHaveClass('pds-filter__trigger--clear');
    const trashIcon = await page.find('#clear >>> pds-icon');
    expect(trashIcon).toBeTruthy();
  });

  it('only allows one popover open at a time', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filters>
        <pds-filter component-id="filter1" text="Filter 1">
          <p>Content 1</p>
        </pds-filter>
        <pds-filter component-id="filter2" text="Filter 2">
          <p>Content 2</p>
        </pds-filter>
      </pds-filters>
    `);

    const trigger1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__trigger');
    const trigger2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__trigger');

    // Open first popover
    await trigger1.click();
    await page.waitForChanges();

    let popover1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__popover');
    let popover2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__popover');

    expect(popover1).toBeTruthy();
    expect(await popover1.isVisible()).toBe(true);
    expect(popover2).toBeTruthy();
    expect(await popover2.isVisible()).toBe(false);

    // Open second popover - should close first
    await trigger2.click();
    await page.waitForChanges();

    popover1 = await page.find('pds-filter[component-id="filter1"] >>> .pds-filter__popover');
    popover2 = await page.find('pds-filter[component-id="filter2"] >>> .pds-filter__popover');

    expect(popover1).toBeTruthy();
    expect(await popover1.isVisible()).toBe(false);
    expect(popover2).toBeTruthy();
    expect(await popover2.isVisible()).toBe(true);
  });

  it('has proper ARIA attributes', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Content</p>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Check initial ARIA attributes
    expect(await trigger.getAttribute('aria-expanded')).toBe('false');
    expect(await trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(await trigger.getAttribute('aria-controls')).toBe('test-popover');

    // Open and check updated attributes
    await trigger.click();
    await page.waitForChanges();

    expect(await trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('displays slotted content in popover', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <h3>Custom Title</h3>
        <p>Custom content with <strong>formatting</strong></p>
        <button>Custom Button</button>
      </pds-filter>
    `);

    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');

    // Open popover
    await trigger.click();
    await page.waitForChanges();

    // Check that slotted content is present
    const customTitle = await page.find('pds-filter h3');
    const customButton = await page.find('pds-filter button');

    expect(customTitle).toBeTruthy();
    expect(await customTitle.textContent).toBe('Custom Title');
    expect(customButton).toBeTruthy();
    expect(await customButton.textContent).toBe('Custom Button');
  });
});

describe('pds-filter open and close events', () => {
  const settle = async (page: E2EPage) => {
    await page.waitForChanges();
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  const setup = async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filters>
        <pds-filter component-id="first" text="First"><button id="inside">Inside</button></pds-filter>
        <pds-filter component-id="second" text="Second"><p>Second content</p></pds-filter>
      </pds-filters>
      <div id="outside" style="margin-block-start: 400px">Outside</div>
    `);
    const first = await page.find('pds-filter[component-id="first"]');
    const second = await page.find('pds-filter[component-id="second"]');
    return {
      page,
      first,
      firstTrigger: await page.find('pds-filter[component-id="first"] >>> .pds-filter__trigger'),
      secondTrigger: await page.find('pds-filter[component-id="second"] >>> .pds-filter__trigger'),
      firstOpen: await first.spyOnEvent('pdsFilterOpen'),
      firstClose: await first.spyOnEvent('pdsFilterClose'),
      secondOpen: await second.spyOnEvent('pdsFilterOpen'),
    };
  };

  it('emits pdsFilterOpen once when the trigger opens the popover', async () => {
    const { page, firstTrigger, firstOpen, firstClose } = await setup();

    await firstTrigger.click();
    await settle(page);

    expect(firstOpen).toHaveReceivedEventTimes(1);
    expect(firstClose).toHaveReceivedEventTimes(0);
  });

  it('emits pdsFilterOpen once when showFilter() opens the popover', async () => {
    const { page, first, firstOpen } = await setup();

    await first.callMethod('showFilter');
    await settle(page);

    expect(firstOpen).toHaveReceivedEventTimes(1);
  });

  type Filter = Awaited<ReturnType<typeof setup>>;

  it.each([
    ['Escape on the trigger', async ({ page, firstTrigger }: Filter) => {
      await firstTrigger.focus();
      await page.keyboard.press('Escape');
    }],
    ['Escape inside the popover', async ({ page }: Filter) => {
      await page.focus('#inside');
      await page.keyboard.press('Escape');
    }],
    ['a trigger click', async ({ firstTrigger }: Filter) => {
      await firstTrigger.click();
    }],
    ['a click outside', async ({ page }: Filter) => {
      await (await page.find('#outside')).click();
    }],
    ['hideFilter()', async ({ first }: Filter) => {
      await first.callMethod('hideFilter');
    }],
  ])('emits pdsFilterClose once when the popover closes from %s', async (_label, close) => {
    const filter = await setup();
    await filter.firstTrigger.click();
    await settle(filter.page);

    await close(filter);
    await settle(filter.page);

    expect(await filter.page.find('pds-filter[component-id="first"] >>> .pds-filter__popover:popover-open')).toBeNull();
    expect(filter.firstClose).toHaveReceivedEventTimes(1);
  });

  it('emits pdsFilterClose once for a filter that another filter closes by opening', async () => {
    const { page, firstTrigger, secondTrigger, firstClose, secondOpen } = await setup();
    await firstTrigger.click();
    await settle(page);

    await secondTrigger.click();
    await settle(page);

    expect(firstClose).toHaveReceivedEventTimes(1);
    expect(secondOpen).toHaveReceivedEventTimes(1);
  });
});

describe('pds-filter with a Firefox user agent', () => {
  const newFirefoxPage = async () => {
    const page = await newE2EPage();
    await page.setUserAgent(FIREFOX_USER_AGENT);
    await page.setContent(TWO_FILTERS);
    return page;
  };

  it('emits pdsFilterOpen from showFilter() and pdsFilterClose from hideFilter()', async () => {
    const page = await newFirefoxPage();
    const filter = await page.find('#first');
    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    await filter.callMethod('showFilter');
    await settle(page);

    expect(openEventSpy).toHaveReceivedEventTimes(1);
    expect(await (await page.find('#first >>> .pds-filter__trigger')).getAttribute('aria-expanded')).toBe('true');

    await filter.callMethod('hideFilter');
    await settle(page);

    expect(closeEventSpy).toHaveReceivedEventTimes(1);
    expect(await isPopoverVisible(page, 'first')).toBe(false);
  });

  it('hideFilter() closes a popover the trigger opened', async () => {
    const page = await newFirefoxPage();
    const filter = await page.find('#first');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    await (await page.find('#first >>> .pds-filter__trigger')).click();
    await settle(page);
    expect(await isPopoverVisible(page, 'first')).toBe(true);

    await filter.callMethod('hideFilter');
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
  });

  it('emits pdsFilterClose when a click outside closes a popover showFilter() opened', async () => {
    const page = await newFirefoxPage();
    const filter = await page.find('#first');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    await filter.callMethod('showFilter');
    await settle(page);
    await (await page.find('#outside')).click();
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
  });

  it('emits pdsFilterClose when Escape closes a popover showFilter() opened', async () => {
    const page = await newFirefoxPage();
    const filter = await page.find('#first');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    await filter.callMethod('showFilter');
    await settle(page);
    await page.keyboard.press('Escape');
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEvent();
  });

  it('emits pdsFilterClose before the next filter opens', async () => {
    const page = await newFirefoxPage();
    const events = await page.evaluateHandle(() => {
      const log: string[] = [];
      document.addEventListener('pdsFilterOpen', (event: CustomEvent) => log.push(`open:${event.detail.componentId}`));
      document.addEventListener('pdsFilterClose', (event: CustomEvent) => log.push(`close:${event.detail.componentId}`));
      return log;
    });

    await (await page.find('#first')).callMethod('showFilter');
    await settle(page);
    await (await page.find('#second >>> .pds-filter__trigger')).click();
    await settle(page);

    expect(await events.jsonValue()).toEqual(['open:first', 'close:first', 'open:second']);
    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(await isPopoverVisible(page, 'second')).toBe(true);
  });
});

describe('pds-filter without the Popover API', () => {
  const newPageWithoutPopoverApi = async () => {
    const page = await newE2EPage();
    await page.evaluateOnNewDocument(() => {
      delete (HTMLElement.prototype as any).showPopover;
      delete (HTMLElement.prototype as any).hidePopover;
      delete (HTMLElement.prototype as any).togglePopover;
    });
    await page.setContent(TWO_FILTERS);
    return page;
  };

  it('opens and closes from the trigger, emitting each event once', async () => {
    const page = await newPageWithoutPopoverApi();
    const filter = await page.find('#first');
    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');
    const trigger = await page.find('#first >>> .pds-filter__trigger');

    await trigger.click();
    await settle(page);
    expect(await isPopoverVisible(page, 'first')).toBe(true);
    expect(openEventSpy).toHaveReceivedEventTimes(1);

    await trigger.click();
    await settle(page);
    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
  });

  it('closes on a click outside, emitting pdsFilterClose once', async () => {
    const page = await newPageWithoutPopoverApi();
    const filter = await page.find('#first');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    await (await page.find('#first >>> .pds-filter__trigger')).click();
    await settle(page);
    await (await page.find('#outside')).click();
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
  });
});

describe('pds-filter reduced motion', () => {
  it('zeroes out the trigger transition under prefers-reduced-motion', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-filter component-id="test" text="Test Filter"></pds-filter>');
    await expectRespectsReducedMotion(page, 'pds-filter', '.pds-filter__trigger');
  });
});

describe('pds-filter popover width', () => {
  it('renders at its width, padding included', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">
        <p>Long content that wraps across the panel so it reaches its widest width, and keeps going past the edge of the panel to be sure.</p>
      </pds-filter>
    `);

    await (await page.find('pds-filter')).callMethod('showFilter');
    await page.waitForChanges();

    const width = await page.evaluate(
      () => document.querySelector('pds-filter')!.shadowRoot!.querySelector('.pds-filter__popover')!.getBoundingClientRect().width,
    );
    expect(Math.round(width)).toBe(244);
  });
});

describe('pds-filter truncation', () => {
  const LONG_TEXT = 'Published between January and December of last year';

  const clippedFilter = async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-filter component-id="clipped" text="${LONG_TEXT}"></pds-filter>`);
    return page;
  };

  const tooltips = (page: E2EPage) =>
    page.$$eval('.pds-truncation-tooltip', (els) => els.map((el) => el.textContent.trim()));

  it('clips the button text, not the content box around it', async () => {
    const page = await clippedFilter();

    expect(
      await page.$eval('pds-filter', (el) => {
        const clips = (selector: string) => {
          const part = el.shadowRoot.querySelector(selector);
          return part.scrollWidth > part.clientWidth;
        };
        return { text: clips('.pds-filter__button-text'), content: clips('.pds-filter__button-content') };
      }),
    ).toEqual({ text: true, content: false });
  });

  it('reveals the full text on hover', async () => {
    const page = await clippedFilter();

    await (await page.find('pds-filter >>> button')).hover();
    await page.waitForSelector('.pds-truncation-tooltip--visible');

    expect(await tooltips(page)).toEqual([LONG_TEXT]);
  });

  // The trigger button is the tab stop; a second one on the text inside it would be nameless.
  it('reveals the full text when the trigger takes keyboard focus, adding no tab stop of its own', async () => {
    const page = await clippedFilter();

    // Focus the way a key press does, not with one: every worker's page shares one browser, and a page
    // another worker just opened takes window focus, so a Tab here can land nowhere.
    await page.$eval('pds-filter', (el) =>
      el.shadowRoot.querySelector('button').focus({ focusVisible: true } as FocusOptions),
    );
    await page.waitForSelector('.pds-truncation-tooltip--visible');

    expect(await tooltips(page)).toEqual([LONG_TEXT]);
    expect(
      await page.$eval('pds-filter', (el) => el.shadowRoot.querySelector('.pds-filter__button-text').getAttribute('tabindex')),
    ).toBeNull();
  });

  it('keeps the tooltip bound while opening the popover re-renders the trigger', async () => {
    const page = await clippedFilter();

    await (await page.find('pds-filter >>> button')).click();
    await page.waitForChanges();

    await (await page.find('pds-filter >>> button')).hover();
    await page.waitForSelector('.pds-truncation-tooltip--visible');

    expect(await tooltips(page)).toEqual([LONG_TEXT]);
  });

  it('shows no tooltip while the pointer is in the open popover, a child of the same host', async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<pds-filter component-id="clipped" text="${LONG_TEXT}"><p style="block-size: 80px;">Options</p></pds-filter>`,
    );

    await (await page.find('pds-filter >>> button')).click();
    await page.waitForChanges();
    await (await page.find('pds-filter p')).hover();
    await page.waitForChanges();

    expect(await tooltips(page)).toEqual([]);
  });

  it('shows no tooltip for text that fits', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-filter component-id="short" text="Date"></pds-filter>');

    await (await page.find('pds-filter >>> button')).hover();
    await page.waitForChanges();

    expect(await tooltips(page)).toEqual([]);
  });

  it('has no axe violations while the text is clipped', async () => {
    const page = await clippedFilter();

    expect(formatViolations(await runAxe(page))).toBe('');
  });
});
