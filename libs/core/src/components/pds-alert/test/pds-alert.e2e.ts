import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert></pds-alert>');

    const element = await page.find('pds-alert');
    expect(element).toHaveClass('hydrated');
  });

  it('emits "pdsAlertDismissClick" event when dismiss button is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert dismissible="true">Test alert with dismiss button</pds-alert>');

    const closeBtn = await page.find('pds-alert >>> .pds-alert__dismiss');
    const eventSpy = await page.spyOnEvent('pdsAlertDismissClick');
    await closeBtn.click();

    expect(eventSpy).toHaveReceivedEvent();
  });
});

describe('pds-alert accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert>This is an important message.</pds-alert>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-alert severity', () => {
  const text = (node) => [node.name, ...(node.children ?? []).flatMap(text)].filter(Boolean).join(' ');

  it('announces its severity before the message, and not the icon name', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert variant="danger">Payment failed</pds-alert>');

    const spoken = text(await page.accessibility.snapshot());
    expect(spoken).toMatch(/Error.*Payment failed/);
    expect(spoken).not.toMatch(/warning filled/);
  });

  it('announces severity when the icon is hidden', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert variant="warning" hide-icon>Storage almost full</pds-alert>');

    expect(text(await page.accessibility.snapshot())).toMatch(/Warning.*Storage almost full/);
  });
});

describe('pds-alert truncation', () => {
  const LONG_MESSAGE = 'A payment message far too long to fit inside a narrow small alert';

  const narrowSmallAlert = async () => {
    const page = await newE2EPage();
    await page.setContent(`<div style="width: 220px;"><pds-alert small>${LONG_MESSAGE}</pds-alert></div>`);
    return page;
  };

  const tooltips = (page: E2EPage) =>
    page.$$eval('.pds-truncation-tooltip', (els) => els.map((el) => el.textContent.trim()));

  // The message reaches `pds-text` through this component's own slot, so the text it
  // clips is not its own `textContent`.
  it('reveals the full message on hover when the small variant clips it', async () => {
    const page = await narrowSmallAlert();

    await (await page.find('pds-alert >>> pds-text')).hover();
    await page.waitForSelector('.pds-truncation-tooltip--visible');

    expect(await tooltips(page)).toEqual([LONG_MESSAGE]);
  });

  it('reveals the full message on keyboard focus', async () => {
    const page = await narrowSmallAlert();

    // Focus the tab stop the clipped text takes the way a key press does, not with one: every worker's page
    // shares one browser, and a page another worker just opened takes window focus, so a Tab here can land nowhere.
    await page.$eval('pds-alert', (el) =>
      el.shadowRoot
        .querySelector('pds-text')
        .shadowRoot.querySelector<HTMLElement>('[tabindex="0"]')
        .focus({ focusVisible: true } as FocusOptions),
    );
    await page.waitForSelector('.pds-truncation-tooltip--visible');

    expect(await tooltips(page)).toEqual([LONG_MESSAGE]);
  });

  // `pds-text` clips its own paragraph, so this component clipping its host as well
  // would only measure as "fits" and hide the message with no way to read it.
  it('leaves the clipping to pds-text, so one tooltip shows for one clipped message', async () => {
    const page = await narrowSmallAlert();

    const layout = await page.evaluate(() => {
      const text = document.querySelector('pds-alert').shadowRoot.querySelector('pds-text') as HTMLElement;
      const paragraph = text.shadowRoot.querySelector('[part="content"]') as HTMLElement;
      return {
        hostClipsText: text.scrollWidth > text.clientWidth,
        paragraphClipsText: paragraph.scrollWidth > paragraph.clientWidth,
        fitsItsAlert: text.getBoundingClientRect().width <= document.querySelector('div').clientWidth,
      };
    });

    expect(layout).toEqual({ hostClipsText: false, paragraphClipsText: true, fitsItsAlert: true });

    await (await page.find('pds-alert >>> pds-text')).hover();
    await page.waitForSelector('.pds-truncation-tooltip--visible');

    expect(await tooltips(page)).toHaveLength(1);
  });

  it('has no axe violations while the message is clipped', async () => {
    const page = await narrowSmallAlert();

    expect(formatViolations(await runAxe(page))).toBe('');
  });
});
