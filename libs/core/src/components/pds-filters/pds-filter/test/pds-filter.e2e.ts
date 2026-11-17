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

// The trigger fades in on hydration, and focus() or a click on it does nothing until it's visible.
const waitForTriggerVisible = (page: E2EPage, filter = 'pds-filter') =>
  page.waitForFunction(
    (selector: string) => {
      const trigger = document.querySelector(selector)?.shadowRoot?.querySelector('.pds-filter__trigger');
      return trigger != null && getComputedStyle(trigger).visibility === 'visible';
    },
    { timeout: 5000 },
    filter,
  );

const waitForPopoverOpen = (page: E2EPage, filter = 'pds-filter') =>
  page.waitForFunction(
    (selector: string) =>
      document.querySelector(selector)?.shadowRoot?.querySelector('.pds-filter__popover')?.matches(':popover-open') === true,
    { timeout: 5000 },
    filter,
  );

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
    await waitForTriggerVisible(page, 'pds-filter[component-id="first"]');
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
    await waitForPopoverOpen(filter.page, 'pds-filter[component-id="first"]');
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

  it('emits pdsFilterClose once when Escape closes a popover showFilter() opened', async () => {
    const page = await newFirefoxPage();
    const filter = await page.find('#first');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    await filter.callMethod('showFilter');
    await waitForPopoverOpen(page, '#first');
    await settle(page);
    await page.keyboard.press('Escape');
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
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

  it('emits pdsFilterOpen from showFilter, then closes on Escape, emitting pdsFilterClose once', async () => {
    const page = await newPageWithoutPopoverApi();
    const filter = await page.find('#first');
    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    await filter.callMethod('showFilter');
    await settle(page);
    expect(await isPopoverVisible(page, 'first')).toBe(true);
    expect(openEventSpy).toHaveReceivedEventTimes(1);

    await page.keyboard.press('Escape');
    await settle(page);
    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
  });

  it('emits pdsFilterClose once from hideFilter and sets aria-expanded to false', async () => {
    const page = await newPageWithoutPopoverApi();
    await waitForTriggerVisible(page, '#first');
    const filter = await page.find('#first');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');

    await (await page.find('#first >>> .pds-filter__trigger')).click();
    await settle(page);
    await filter.callMethod('hideFilter');
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
    expect(await (await page.find('#first >>> .pds-filter__trigger')).getAttribute('aria-expanded')).toBe('false');
  });

  it('opens from the trigger after an open filter moves', async () => {
    const page = await newPageWithoutPopoverApi();
    await waitForTriggerVisible(page, '#first');
    await (await page.find('#first >>> .pds-filter__trigger')).click();
    await settle(page);
    await page.evaluate(() => document.body.appendChild(document.getElementById('first')));
    await settle(page);

    const filter = await page.find('#first');
    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');
    await (await page.find('#first >>> .pds-filter__trigger')).click();
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(true);
    expect(openEventSpy).toHaveReceivedEventTimes(1);
    expect(closeEventSpy).toHaveReceivedEventTimes(0);
  });
});

describe('pds-filter moved in the page', () => {
  const newPageWithMovedFilter = async (openBeforeMove: boolean) => {
    const page = await newE2EPage();
    await page.setContent(TWO_FILTERS);
    if (openBeforeMove) {
      await waitForTriggerVisible(page, '#first');
      await (await page.find('#first >>> .pds-filter__trigger')).click();
      await waitForPopoverOpen(page, '#first');
      await settle(page);
    }
    await page.evaluate(() => document.body.appendChild(document.getElementById('first')));
    await settle(page);
    return page;
  };

  const ariaExpanded = async (page: E2EPage) =>
    (await page.find('#first >>> .pds-filter__trigger')).getAttribute('aria-expanded');

  it('emits no event when an open filter and a closed filter move', async () => {
    const page = await newE2EPage();
    await page.setContent(TWO_FILTERS);
    await (await page.find('#first >>> .pds-filter__trigger')).click();
    await settle(page);

    const first = await page.find('#first');
    const second = await page.find('#second');
    const eventSpies = [
      await first.spyOnEvent('pdsFilterOpen'),
      await first.spyOnEvent('pdsFilterClose'),
      await second.spyOnEvent('pdsFilterOpen'),
      await second.spyOnEvent('pdsFilterClose'),
    ];

    await page.evaluate(() => {
      document.body.appendChild(document.getElementById('first'));
      document.body.appendChild(document.getElementById('second'));
    });
    await settle(page);

    eventSpies.forEach((eventSpy) => expect(eventSpy).toHaveReceivedEventTimes(0));
  });

  it.each(['Escape', 'click outside'])(
    'sets aria-expanded to false when an open filter moves, and emits no pdsFilterClose on a later %s',
    async (dismiss) => {
      const page = await newPageWithMovedFilter(true);
      const closeEventSpy = await (await page.find('#first')).spyOnEvent('pdsFilterClose');

      expect(await isPopoverVisible(page, 'first')).toBe(false);
      expect(await ariaExpanded(page)).toBe('false');

      if (dismiss === 'Escape') {
        await page.keyboard.press('Escape');
      } else {
        await (await page.find('#outside')).click();
      }
      await settle(page);

      expect(closeEventSpy).toHaveReceivedEventTimes(0);
    },
  );

  it('emits pdsFilterOpen when a filter moved while closed opens', async () => {
    const page = await newPageWithMovedFilter(false);
    const filter = await page.find('#first');
    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');

    await (await page.find('#first >>> .pds-filter__trigger')).click();
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(true);
    expect(openEventSpy).toHaveReceivedEventTimes(1);
    expect(await ariaExpanded(page)).toBe('true');
  });

  it('emits pdsFilterOpen and pdsFilterClose when a filter moved while open reopens and closes', async () => {
    const page = await newPageWithMovedFilter(true);
    const filter = await page.find('#first');
    const openEventSpy = await filter.spyOnEvent('pdsFilterOpen');
    const closeEventSpy = await filter.spyOnEvent('pdsFilterClose');
    const trigger = await page.find('#first >>> .pds-filter__trigger');

    await trigger.click();
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(true);
    expect(openEventSpy).toHaveReceivedEventTimes(1);
    expect(await ariaExpanded(page)).toBe('true');

    await trigger.click();
    await settle(page);

    expect(await isPopoverVisible(page, 'first')).toBe(false);
    expect(closeEventSpy).toHaveReceivedEventTimes(1);
    expect(await ariaExpanded(page)).toBe('false');
  });
});

describe('pds-filter focus after Escape', () => {
  const setup = async (content: string) => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-filter component-id="test" text="Test">${content}</pds-filter>
      <div style="margin-top: 400px"><input id="outside" aria-label="Outside" /></div>
    `);

    await waitForTriggerVisible(page);
    const trigger = await page.find('pds-filter >>> .pds-filter__trigger');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await waitForPopoverOpen(page);
    await page.waitForChanges();

    return page;
  };

  const focusedElement = (page: E2EPage) =>
    page.evaluate(() => {
      let el = document.activeElement;
      while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
      return el?.matches('.pds-filter__trigger') ? 'trigger' : el?.id || el?.localName;
    });

  const isPopoverVisible = async (page: E2EPage) => (await page.find('pds-filter >>> .pds-filter__popover')).isVisible();

  const pressEscape = async (page: E2EPage) => {
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 20)));
  };

  it('returns focus to the trigger when Escape is pressed on a control inside the popover', async () => {
    const page = await setup('<input id="inside" aria-label="Inside" />');
    await page.keyboard.press('Tab');
    expect(await focusedElement(page)).toBe('inside');

    await pressEscape(page);

    expect(await isPopoverVisible(page)).toBe(false);
    expect(await focusedElement(page)).toBe('trigger');
  });

  it('returns focus to the trigger from a control with its own shadow root, such as pds-checkbox', async () => {
    const page = await setup('<pds-checkbox component-id="inside-checkbox" label="Inside"></pds-checkbox>');
    await page.keyboard.press('Tab');
    expect(await focusedElement(page)).toBe('inside-checkbox');

    await pressEscape(page);

    expect(await isPopoverVisible(page)).toBe(false);
    expect(await focusedElement(page)).toBe('trigger');
  });

  it('keeps focus on the trigger when Escape is pressed on it', async () => {
    const page = await setup('<input id="inside" aria-label="Inside" />');

    await pressEscape(page);

    expect(await isPopoverVisible(page)).toBe(false);
    expect(await focusedElement(page)).toBe('trigger');
  });

  it('leaves focus where a click outside the popover puts it', async () => {
    const page = await setup('<input id="inside" aria-label="Inside" />');
    await page.keyboard.press('Tab');

    await (await page.find('#outside')).click();
    await page.waitForChanges();
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 20)));

    expect(await isPopoverVisible(page)).toBe(false);
    expect(await focusedElement(page)).toBe('outside');
  });

  it('leaves the popover open and focus in place when a control inside cancels Escape', async () => {
    const page = await setup('<input id="inside" aria-label="Inside" />');
    await page.keyboard.press('Tab');
    await page.$eval('#inside', (el) =>
      el.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') event.preventDefault();
      }),
    );

    await pressEscape(page);

    expect(await isPopoverVisible(page)).toBe(true);
    expect(await focusedElement(page)).toBe('inside');
  });

  it.each(['open', 'closed'] as const)(
    'returns focus to the trigger when the filter sits in another component\'s %s shadow root',
    async (mode) => {
      type HostWindow = Window & { filterHostRoot: ShadowRoot };
      const page = await newE2EPage();
      await page.setContent('<x-filter-host></x-filter-host>');
      await page.evaluate((rootMode) => {
        customElements.define(
          'x-filter-host',
          class extends HTMLElement {
            constructor() {
              super();
              const root = this.attachShadow({ mode: rootMode });
              root.innerHTML =
                '<pds-filter component-id="test" text="Test"><input id="inside" aria-label="Inside" /></pds-filter>';
              (window as HostWindow).filterHostRoot = root;
            }
          },
        );
      }, mode);
      await page.waitForFunction(() => {
        const trigger = (window as HostWindow).filterHostRoot
          ?.querySelector('pds-filter')
          ?.shadowRoot?.querySelector('.pds-filter__trigger');
        return trigger != null && getComputedStyle(trigger).visibility === 'visible';
      });
      await page.evaluate(() =>
        (window as HostWindow).filterHostRoot
          .querySelector('pds-filter')!
          .shadowRoot!.querySelector<HTMLElement>('.pds-filter__trigger')!
          .focus(),
      );
      await page.keyboard.press('Enter');
      await page.waitForFunction(
        () =>
          (window as HostWindow).filterHostRoot
            .querySelector('pds-filter')!
            .shadowRoot!.querySelector('.pds-filter__popover')!
            .matches(':popover-open'),
        { timeout: 5000 },
      );
      await page.waitForChanges();
      await page.keyboard.press('Tab');

      const focusedInHost = () =>
        page.evaluate(() => {
          const root = (window as HostWindow).filterHostRoot;
          const filter = root.querySelector('pds-filter')!;
          if (root.activeElement === filter) {
            return filter.shadowRoot!.activeElement?.matches('.pds-filter__trigger') ? 'trigger' : 'filter';
          }
          return root.activeElement?.id ?? document.activeElement?.localName;
        });
      expect(await focusedInHost()).toBe('inside');

      await pressEscape(page);

      expect(await focusedInHost()).toBe('trigger');
    },
  );

  it('leaves focus where a pdsFilterClose listener moves it', async () => {
    const page = await setup('<input id="inside" aria-label="Inside" />');
    await page.keyboard.press('Tab');
    await page.evaluate(() =>
      document.addEventListener('pdsFilterClose', () => document.getElementById('outside')!.focus()),
    );

    await pressEscape(page);

    expect(await focusedElement(page)).toBe('outside');
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

describe('pds-filter trigger ARIA', () => {
  const BAR = `
    <pds-filter component-id="status" variant="default" text="Status"><button>Published</button></pds-filter>
    <pds-filter component-id="product" variant="selected" text="Product: Course"><button>Course</button></pds-filter>
    <pds-filter component-id="more" variant="more" text="More filters"><button>Archived</button></pds-filter>
    <pds-filter component-id="clear" variant="clear" text="Clear filters"></pds-filter>
    <button id="outside">Outside</button>
  `;

  const triggerSelector = (componentId: string) => `pds-filter[component-id="${componentId}"] >>> .pds-filter__trigger`;

  const triggerAxNode = async (page: E2EPage, componentId: string) => {
    const trigger = await page.evaluateHandle(
      (id) => document.querySelector(`pds-filter[component-id="${id}"]`)?.shadowRoot?.querySelector('button') as HTMLElement,
      componentId,
    );
    return page.accessibility.snapshot({ root: trigger, interestingOnly: false });
  };

  const popoverState = (page: E2EPage, componentId: string) =>
    page.$eval(`pds-filter[component-id="${componentId}"]`, (host) => ({
      expanded: host.shadowRoot.querySelector('button').getAttribute('aria-expanded'),
      open: host.shadowRoot.querySelector('.pds-filter__popover').matches(':popover-open'),
    }));

  it.each(['status', 'product', 'more'])('announces the %s trigger as a collapsed or expanded button, not a menu', async (componentId) => {
    const page = await newE2EPage();
    await page.setContent(BAR);

    const closed = await triggerAxNode(page, componentId);
    expect(closed?.role).toBe('button');
    expect(closed?.expanded).toBe(false);
    expect(closed?.haspopup).toBeUndefined();

    await (await page.find(triggerSelector(componentId))).click();
    await page.waitForChanges();

    const open = await triggerAxNode(page, componentId);
    expect(open?.expanded).toBe(true);
    expect(open?.haspopup).toBeUndefined();
  });

  it('announces the clear trigger as a plain button, before and after a click', async () => {
    const page = await newE2EPage();
    await page.setContent(BAR);

    const before = await triggerAxNode(page, 'clear');
    expect(before?.role).toBe('button');
    expect(before?.name).toBe('Clear filters');
    expect(before?.expanded).toBeUndefined();
    expect(before?.haspopup).toBeUndefined();

    await (await page.find(triggerSelector('clear'))).click();
    await page.waitForChanges();

    const after = await triggerAxNode(page, 'clear');
    expect(after?.expanded).toBeUndefined();
    expect(after?.haspopup).toBeUndefined();
  });

  it('keeps aria-expanded in step with the popover on every open and close path', async () => {
    const page = await newE2EPage();
    await page.setContent(BAR);
    const status = await page.find('pds-filter[component-id="status"]');
    const statusTrigger = await page.find(triggerSelector('status'));

    await statusTrigger.click();
    await page.waitForChanges();
    expect(await popoverState(page, 'status')).toEqual({ expanded: 'true', open: true });

    await statusTrigger.click();
    await page.waitForChanges();
    expect(await popoverState(page, 'status')).toEqual({ expanded: 'false', open: false });

    await statusTrigger.click();
    await page.waitForChanges();
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect(await popoverState(page, 'status')).toEqual({ expanded: 'false', open: false });

    await statusTrigger.click();
    await page.waitForChanges();
    await page.click('#outside');
    await page.waitForChanges();
    expect(await popoverState(page, 'status')).toEqual({ expanded: 'false', open: false });

    await status.callMethod('showFilter');
    await page.waitForChanges();
    expect(await popoverState(page, 'status')).toEqual({ expanded: 'true', open: true });

    await status.callMethod('hideFilter');
    await page.waitForChanges();
    expect(await popoverState(page, 'status')).toEqual({ expanded: 'false', open: false });

    await statusTrigger.click();
    await page.waitForChanges();
    await (await page.find(triggerSelector('product'))).click();
    await page.waitForChanges();
    expect(await popoverState(page, 'status')).toEqual({ expanded: 'false', open: false });
    expect(await popoverState(page, 'product')).toEqual({ expanded: 'true', open: true });
  });

  it('has no axe violations with every variant, while a popover is open', async () => {
    const page = await newE2EPage();
    await page.setContent(BAR);

    await (await page.find(triggerSelector('more'))).click();
    await page.waitForChanges();

    expect(formatViolations(await runAxe(page))).toBe('');
  });
});
