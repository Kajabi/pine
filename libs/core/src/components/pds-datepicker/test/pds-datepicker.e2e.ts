import { newE2EPage, E2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

const FIELD = `<pds-datepicker component-id="due" label="Due date" locale="en-US" value="2026-10-13" min="2026-10-05" max="2026-11-20"></pds-datepicker>`;

async function setup(html = FIELD): Promise<E2EPage> {
  const page = await newE2EPage();
  await page.setContent(html);
  await page.waitForChanges();
  return page;
}

async function openWithTrigger(page: E2EPage) {
  const trigger = await page.find('pds-datepicker >>> .pds-datepicker__trigger');
  await trigger.click();
  await page.waitForChanges();
  await page.waitForFunction(() => {
    const dialog = document.querySelector('pds-datepicker')?.shadowRoot?.querySelector<HTMLElement>('[role="dialog"]');
    return dialog?.style.visibility === 'visible';
  });
}

/** What has focus inside the datepicker: a day's date, or a class name. */
function focused(page: E2EPage): Promise<string | null> {
  return page.evaluate(() => {
    const active = document.querySelector('pds-datepicker')?.shadowRoot?.activeElement as HTMLElement | null;
    return active?.getAttribute('data-date') ?? active?.className ?? null;
  });
}

/** Chooses an option in the datepicker's nth time select, as a person would, firing `change`. */
async function chooseTime(page: E2EPage, index: number, value: string) {
  await page.$eval(
    'pds-datepicker',
    (el, i: number, v: string) => {
      const select = el.shadowRoot?.querySelectorAll<HTMLSelectElement>('.pds-datepicker__time select')[i];
      if (!select) throw new Error(`No time select ${i}`);
      select.value = v;
      select.dispatchEvent(new Event('change'));
    },
    index,
    value,
  );
  await page.waitForChanges();
}

async function press(page: E2EPage, key: string, modifier?: string) {
  if (modifier) await page.keyboard.down(modifier);
  await page.keyboard.press(key as Parameters<E2EPage['keyboard']['press']>[0]);
  if (modifier) await page.keyboard.up(modifier);
  await page.waitForChanges();
}

describe('pds-datepicker', () => {
  it('opens on the selected day and moves by day, week and month', async () => {
    const page = await setup();
    await openWithTrigger(page);
    expect(await focused(page)).toBe('2026-10-13');

    await press(page, 'ArrowRight');
    expect(await focused(page)).toBe('2026-10-14');
    await press(page, 'ArrowDown');
    expect(await focused(page)).toBe('2026-10-21');
    await press(page, 'Home');
    expect(await focused(page)).toBe('2026-10-18');
    await press(page, 'End');
    expect(await focused(page)).toBe('2026-10-24');
    await press(page, 'PageDown');
    expect(await focused(page)).toBe('2026-11-20');

    const heading = await page.find('pds-datepicker >>> .pds-datepicker__heading');
    expect(heading.textContent).toBe('November 2026');
  });

  it('keeps the keyboard within min and max', async () => {
    const page = await setup();
    await openWithTrigger(page);

    await press(page, 'ArrowUp');
    expect(await focused(page)).toBe('2026-10-06');
    await press(page, 'ArrowUp');
    expect(await focused(page)).toBe('2026-10-05');
    await press(page, 'PageUp', 'Shift');
    expect(await focused(page)).toBe('2026-10-05');
  });

  it('picks a day with Enter, emits the change and returns focus to the trigger', async () => {
    const page = await setup();
    const change = await page.spyOnEvent('pdsDatepickerChange');
    await openWithTrigger(page);

    await press(page, 'ArrowRight');
    await press(page, 'Enter');

    expect(change).toHaveReceivedEventDetail({ value: '2026-10-14' });
    const root = await page.find('pds-datepicker');
    expect(await root.getProperty('value')).toBe('2026-10-14');
    expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
    expect(await focused(page)).toContain('pds-datepicker__trigger');
  });

  it('picks a day with the pointer but not one out of range', async () => {
    const page = await setup();
    const change = await page.spyOnEvent('pdsDatepickerChange');
    await openWithTrigger(page);

    await (await page.find('pds-datepicker >>> [data-date="2026-10-04"]')).click();
    await page.waitForChanges();
    expect(change).not.toHaveReceivedEvent();
    expect(await page.find('pds-datepicker >>> [role="dialog"]')).not.toBeNull();

    await (await page.find('pds-datepicker >>> [data-date="2026-10-20"]')).click();
    await page.waitForChanges();
    expect(change).toHaveReceivedEventDetail({ value: '2026-10-20' });
  });

  it('shows the next month without moving focus off the button', async () => {
    const page = await setup(FIELD.replace('max="2026-11-20"', 'max="2027-03-01"'));
    await openWithTrigger(page);

    const next = await page.find('pds-datepicker >>> .pds-datepicker__nav:last-of-type');
    await next.click();
    await page.waitForChanges();

    const heading = await page.find('pds-datepicker >>> .pds-datepicker__heading');
    expect(heading.textContent).toBe('November 2026');
    expect(await focused(page)).toContain('pds-datepicker__nav');
  });

  it('moves focus to the active day when the month button it clicked becomes disabled', async () => {
    const page = await setup();
    await openWithTrigger(page);

    const next = await page.find('pds-datepicker >>> .pds-datepicker__nav:last-of-type');
    await next.click();
    await page.waitForChanges();

    expect(await next.getProperty('disabled')).toBe(true);
    expect(await focused(page)).toBe('2026-11-13');
  });

  it('closes on Escape and returns focus to the trigger without changing the value', async () => {
    const page = await setup();
    const change = await page.spyOnEvent('pdsDatepickerChange');
    await openWithTrigger(page);

    await press(page, 'ArrowRight');
    await press(page, 'Escape');

    expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
    expect(await focused(page)).toContain('pds-datepicker__trigger');
    expect(change).not.toHaveReceivedEvent();
  });

  it('keeps Tab within the open calendar', async () => {
    const page = await setup();
    await openWithTrigger(page);

    // Previous month is disabled at the minimum, so Tab cycles next month and the active day.
    await press(page, 'Tab');
    expect(await focused(page)).toContain('pds-datepicker__nav');
    await press(page, 'Tab');
    expect(await focused(page)).toBe('2026-10-13');
    await press(page, 'Tab', 'Shift');
    expect(await focused(page)).toContain('pds-datepicker__nav');
  });

  it('closes when the pointer goes down outside', async () => {
    const page = await setup(`${FIELD}<button id="outside" style="position:fixed;right:8px;bottom:8px">Outside</button>`);
    await openWithTrigger(page);

    await page.click('#outside');
    await page.waitForChanges();

    expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
  });

  it('opens from the field with Alt+ArrowDown', async () => {
    const page = await setup();
    await (await page.find('pds-datepicker >>> pds-input >>> input')).focus();

    await press(page, 'ArrowDown', 'Alt');
    await page.waitForChanges();

    expect(await page.find('pds-datepicker >>> [role="dialog"]')).not.toBeNull();
  });

  it('commits a typed date and reports only its own change event', async () => {
    const page = await setup();
    const change = await page.spyOnEvent('pdsDatepickerChange');
    const innerChange = await page.spyOnEvent('pdsChange');
    const input = await page.find('pds-datepicker >>> pds-input >>> input');

    await input.click({ clickCount: 3 });
    await input.type('2026-11-02');
    await input.press('Enter');
    await page.waitForChanges();

    expect(change).toHaveReceivedEventDetail({ value: '2026-11-02' });
    expect(innerChange).not.toHaveReceivedEvent();
  });

  it.each([
    ['not a real date', '2026-02-30'],
    ['before the minimum', '2026-10-01'],
  ])('marks a typed date %s invalid and keeps the value', async (_, typed) => {
    const page = await setup();
    const change = await page.spyOnEvent('pdsDatepickerChange');
    const input = await page.find('pds-datepicker >>> pds-input >>> input');

    await input.click({ clickCount: 3 });
    await input.type(typed);
    await input.press('Enter');
    await page.waitForChanges();

    expect(change).not.toHaveReceivedEvent();
    expect(await (await page.find('pds-datepicker')).getProperty('value')).toBe('2026-10-13');
    expect(await input.getAttribute('aria-invalid')).toBe('true');
  });

  it('clears the value when the field is emptied', async () => {
    const page = await setup();
    const change = await page.spyOnEvent('pdsDatepickerChange');
    const input = await page.find('pds-datepicker >>> pds-input >>> input');

    await input.click({ clickCount: 3 });
    await input.press('Backspace');
    await input.press('Enter');
    await page.waitForChanges();

    expect(change).toHaveReceivedEventDetail({ value: '' });
  });

  it('submits the date with its form', async () => {
    const page = await setup(`<form>${FIELD.replace('component-id="due"', 'component-id="due" name="due"')}</form>`);

    const submitted = await page.evaluate(() => new FormData(document.querySelector('form') as HTMLFormElement).get('due'));
    expect(submitted).toBe('2026-10-13');
  });

  it('has no axe violations with the calendar open', async () => {
    const page = await setup();
    await openWithTrigger(page);

    const violations = await runAxe(page);
    if (violations.length) throw new Error(formatViolations(violations));
    expect(violations).toHaveLength(0);
  });

  it('opens beside the field on a click and keeps focus there for typing', async () => {
    const page = await setup();
    const input = await page.find('pds-datepicker >>> pds-input >>> input');

    await input.click();
    await page.waitForChanges();

    expect(await page.find('pds-datepicker >>> [role="dialog"]')).not.toBeNull();
    const activeTag = await page.evaluate(
      () => document.querySelector('pds-datepicker')?.shadowRoot?.activeElement?.tagName,
    );
    expect(activeTag).toBe('PDS-INPUT');
  });

  it('moves the open calendar to a typed date', async () => {
    const page = await setup();
    const input = await page.find('pds-datepicker >>> pds-input >>> input');

    await input.click({ clickCount: 3 });
    await input.type('2026-11-05');
    await page.waitForChanges();

    const heading = await page.find('pds-datepicker >>> .pds-datepicker__heading');
    expect(heading.textContent).toBe('November 2026');
    expect(await page.find('pds-datepicker >>> [data-date="2026-11-05"]')).toEqualAttribute('tabindex', '0');
  });

  it('closes when focus leaves the datepicker', async () => {
    const page = await setup(`${FIELD}<button id="after">After</button>`);
    const input = await page.find('pds-datepicker >>> pds-input >>> input');
    await input.click();
    await page.waitForChanges();

    await page.focus('#after');
    await page.waitForChanges();

    expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
  });

  it('jumps with the month and year dropdowns', async () => {
    const page = await setup(
      `<pds-datepicker component-id="born" label="Birthday" show-dropdowns locale="en-US" max="2026-10-13" value="1990-06-15"></pds-datepicker>`,
    );
    await openWithTrigger(page);

    await page.$eval('pds-datepicker', (el) => {
      const select = el.shadowRoot?.querySelectorAll<HTMLSelectElement>('.pds-datepicker__dropdowns select')[1];
      if (select) {
        select.value = '1985';
        select.dispatchEvent(new Event('change'));
      }
    });
    await page.waitForChanges();
    expect(await page.find('pds-datepicker >>> .visually-hidden[aria-live]')).toEqualText('June 1985');

    await page.$eval('pds-datepicker', (el) => {
      const select = el.shadowRoot?.querySelectorAll<HTMLSelectElement>('.pds-datepicker__dropdowns select')[0];
      if (select) {
        select.value = '0';
        select.dispatchEvent(new Event('change'));
      }
    });
    await page.waitForChanges();
    expect(await page.find('pds-datepicker >>> .visually-hidden[aria-live]')).toEqualText('January 1985');

    await (await page.find('pds-datepicker >>> [data-date="1985-01-15"]')).click();
    await page.waitForChanges();
    expect(await (await page.find('pds-datepicker')).getProperty('value')).toBe('1985-01-15');
  });

  it('picks a date and time and applies them', async () => {
    const page = await setup(
      `<pds-datepicker component-id="when" label="When" time-picker locale="en-US" value="2026-10-13T09:00"></pds-datepicker>`,
    );
    const change = await page.spyOnEvent('pdsDatepickerChange');
    await openWithTrigger(page);

    await (await page.find('pds-datepicker >>> [data-date="2026-10-14"]')).click();
    await page.waitForChanges();
    // A date with a time waits for Apply.
    expect(await page.find('pds-datepicker >>> [role="dialog"]')).not.toBeNull();

    await chooseTime(page, 0, '3');
    await chooseTime(page, 1, '45');
    await chooseTime(page, 2, 'pm');
    await (await page.find('pds-datepicker >>> .pds-datepicker__action--primary')).click();
    await page.waitForChanges();

    expect(change).toHaveReceivedEventDetail({ value: '2026-10-14T15:45' });
    const input = await page.find('pds-datepicker >>> pds-input >>> input');
    // The field follows the time picker's 12-hour clock.
    expect(await input.getProperty('value')).toBe('2026-10-14 3:45 PM');
  });

  it('is a modal dialog only while focus is in the calendar', async () => {
    const page = await setup();
    const dialogModal = () =>
      page.evaluate(() =>
        document.querySelector('pds-datepicker')?.shadowRoot?.querySelector('[role="dialog"]')?.getAttribute('aria-modal'),
      );

    await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
    await page.waitForChanges();
    expect(await dialogModal()).toBeNull();

    await press(page, 'ArrowDown', 'Alt');
    await page.waitForChanges();
    expect(await focused(page)).toBe('2026-10-13');
    expect(await dialogModal()).toBe('true');
  });

  it('blocks form submission when required and empty, or when the typed text is not a date', async () => {
    const page = await setup(`<form><pds-datepicker component-id="due" name="due" label="Due" required></pds-datepicker></form>`);
    const valid = () => page.evaluate(() => (document.querySelector('form') as HTMLFormElement).checkValidity());

    expect(await valid()).toBe(false);

    const input = await page.find('pds-datepicker >>> pds-input >>> input');
    await input.click();
    await input.type('2026-10-13');
    await input.press('Enter');
    await page.waitForChanges();
    expect(await valid()).toBe(true);

    await input.click({ clickCount: 3 });
    await input.type('soon');
    await input.press('Enter');
    await page.waitForChanges();
    expect(await valid()).toBe(false);
    // The form reports the datepicker as the invalid control.
    const invalidControl = await page.evaluate(() => {
      let first = '';
      document.querySelector('form')?.addEventListener('invalid', (e) => (first ||= (e.target as Element).tagName), true);
      (document.querySelector('form') as HTMLFormElement).checkValidity();
      return first;
    });
    expect(invalidControl).toBe('PDS-DATEPICKER');
  });

  it('lets the form submit again once a typo is fixed back to the same date', async () => {
    const page = await setup(`<form>${FIELD.replace('component-id="due"', 'component-id="due" name="due"')}</form>`);
    const valid = () => page.evaluate(() => (document.querySelector('form') as HTMLFormElement).checkValidity());
    const input = await page.find('pds-datepicker >>> pds-input >>> input');

    await input.click({ clickCount: 3 });
    await input.type('garbage');
    await input.press('Enter');
    await page.waitForChanges();
    expect(await valid()).toBe(false);

    await input.click({ clickCount: 3 });
    await input.type('2026-10-13');
    await input.press('Enter');
    await page.waitForChanges();
    expect(await valid()).toBe(true);
  });

  it('clears typed text and the error on form reset, even with no value', async () => {
    const page = await setup(`<form><pds-datepicker component-id="due" name="due" label="Due"></pds-datepicker></form>`);
    const input = await page.find('pds-datepicker >>> pds-input >>> input');

    await input.click();
    await input.type('soon');
    await input.press('Enter');
    await page.waitForChanges();
    expect(await input.getAttribute('aria-invalid')).toBe('true');

    await page.evaluate(() => (document.querySelector('form') as HTMLFormElement).reset());
    await page.waitForChanges();

    expect(await input.getProperty('value')).toBe('');
    expect(await input.getAttribute('aria-invalid')).toBeNull();
    expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
  });

  it('emits pdsFocus and pdsBlur only when focus enters and leaves the datepicker', async () => {
    const page = await setup(`${FIELD}<button id="after">After</button>`);
    const focus = await page.spyOnEvent('pdsFocus');
    const blur = await page.spyOnEvent('pdsBlur');

    await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
    await press(page, 'ArrowDown', 'Alt');
    await press(page, 'ArrowRight');
    expect(focus).toHaveReceivedEventTimes(1);
    expect(blur).not.toHaveReceivedEvent();

    await press(page, 'Escape');
    await page.focus('#after');
    await page.waitForChanges();
    expect(blur).toHaveReceivedEventTimes(1);
  });

  describe('small and short windows', () => {
    async function openAt(width: number, height: number, attrs: string) {
      const page = await newE2EPage();
      await page.setViewport({ width, height });
      await page.setContent(
        `<div style="padding:16px;margin-top:${Math.round(height / 2) - 40}px"><pds-datepicker component-id="d" label="When" locale="en-US" ${attrs}></pds-datepicker></div>`,
      );
      await page.waitForChanges();
      await openWithTrigger(page);
      return page;
    }

    const fit = (page: E2EPage) =>
      page.evaluate(() => {
        const dialog = document.querySelector('pds-datepicker')?.shadowRoot?.querySelector('[role="dialog"]') as HTMLElement;
        const box = dialog.getBoundingClientRect();
        const apply = dialog.querySelector('.pds-datepicker__action--primary') as HTMLElement | null;
        const a = apply?.getBoundingClientRect();
        return {
          onScreen: box.top >= 0 && box.bottom <= innerHeight && box.left >= 0 && box.right <= innerWidth,
          applyReachable: a
            ? (dialog.getRootNode() as ShadowRoot).elementFromPoint(a.left + a.width / 2, a.top + a.height / 2) === apply
            : null,
          months: dialog.querySelectorAll('[role="grid"]').length,
        };
      });

    it.each([
      ['a phone, range with presets', 360, 640, 'range presets="today,last-7-days" value="2026-09-13/2026-10-13"', 1],
      ['a phone, date and time with dropdowns', 360, 640, 'time-picker show-dropdowns value="2026-10-13T09:00"', 1],
      ['a short window, range and times', 1280, 640, 'range time-picker value="2026-09-13T09:00/2026-10-13T17:00"', 2],
    ])('keeps the calendar on screen with Apply in reach on %s', async (_, width, height, attrs, months) => {
      const page = await openAt(width, height, attrs);

      expect(await fit(page)).toEqual({ onScreen: true, applyReachable: true, months });
    });
  });

  describe('inside other overlays', () => {
    async function clickFieldThenEscape(page: E2EPage) {
      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      await page.waitForChanges();
      expect(await page.find('pds-datepicker >>> [role="dialog"]')).not.toBeNull();
      await press(page, 'Escape');
      expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
    }

    it('closes only the calendar on Escape in the field, inside pds-modal', async () => {
      const page = await setup(`<pds-modal component-id="m"><div>${FIELD}</div></pds-modal>`);
      await (await page.find('pds-modal')).callMethod('showModal');
      await page.waitForChanges();

      await clickFieldThenEscape(page);

      expect(await page.evaluate(() => (document.querySelector('pds-modal dialog') as HTMLDialogElement).open)).toBe(true);
    });

    it('closes only the calendar on Escape in the field, inside pds-popover', async () => {
      const page = await setup(
        `<pds-popover component-id="p" popover-target-action="toggle"><button slot="trigger">Open</button><div>${FIELD}</div></pds-popover>`,
      );
      const popoverClose = await page.spyOnEvent('pdsPopoverClose');
      await (await page.find('pds-popover')).callMethod('show');
      await page.waitForChanges();

      await clickFieldThenEscape(page);

      expect(popoverClose).not.toHaveReceivedEvent();
    });

    it('closes only the calendar on Escape in the field, inside pds-filter', async () => {
      const page = await setup(`<pds-filter component-id="f" text="Due">${FIELD}</pds-filter>`);
      const filterClose = await page.spyOnEvent('pdsFilterClose');
      await (await page.find('pds-filter')).callMethod('showFilter');
      await page.waitForChanges();

      await clickFieldThenEscape(page);

      expect(filterClose).not.toHaveReceivedEvent();
    });
  });

  describe('format', () => {
    const US = `<pds-datepicker component-id="due" label="Due" locale="en-US" format="MM/DD/YYYY" value="2026-10-13"></pds-datepicker>`;

    it('shows and reads the field in the format, keeping the value ISO', async () => {
      const page = await setup(US);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const input = await page.find('pds-datepicker >>> pds-input >>> input');
      expect(await input.getProperty('value')).toBe('10/13/2026');
      expect(await input.getProperty('placeholder')).toBe('MM/DD/YYYY');

      await input.click({ clickCount: 3 });
      await input.type('1/5/2027');
      await input.press('Enter');
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2027-01-05' });
      expect(await input.getProperty('value')).toBe('01/05/2027');
    });

    it('still reads a typed ISO date', async () => {
      const page = await setup(US);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const input = await page.find('pds-datepicker >>> pds-input >>> input');

      await input.click({ clickCount: 3 });
      await input.type('2027-02-03');
      await input.press('Enter');
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2027-02-03' });
      expect(await input.getProperty('value')).toBe('02/03/2027');
    });

    it('reads a range typed in a slash format', async () => {
      const page = await setup(
        `<pds-datepicker component-id="period" range label="Period" locale="en-US" format="M/D/YYYY" value="2026-09-13/2026-10-13"></pds-datepicker>`,
      );
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const input = await page.find('pds-datepicker >>> pds-input >>> input');
      expect(await input.getProperty('value')).toBe('9/13/2026 – 10/13/2026');

      await input.click({ clickCount: 3 });
      await input.type('11/2/2026 - 11/6/2026');
      await input.press('Enter');
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2026-11-02/2026-11-06', start: '2026-11-02', end: '2026-11-06' });
    });
  });

  describe('range mode', () => {
    const RANGE = `<pds-datepicker component-id="period" range label="Period" locale="en-US" value="2026-09-13/2026-10-13"></pds-datepicker>`;

    const day = (page: E2EPage, iso: string) => page.find(`pds-datepicker >>> [data-date="${iso}"]`);
    const action = (page: E2EPage, index: number) =>
      page.find(`pds-datepicker >>> .pds-datepicker__action:nth-of-type(${index})`);
    const fieldValue = async (page: E2EPage) =>
      (await page.find('pds-datepicker >>> pds-input >>> input')).getProperty('value');

    it('picks a start and an end, previews the range on hover and applies it', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      await (await day(page, '2026-10-05')).click();
      await (await day(page, '2026-10-09')).hover();
      await page.waitForChanges();
      expect(await day(page, '2026-10-07')).toHaveClass('pds-datepicker__day--in-range');
      expect(await page.find('pds-datepicker >>> .pds-datepicker__selection')).toEqualText('2026-10-05 –');

      await (await day(page, '2026-10-09')).click();
      await page.waitForChanges();
      expect(change).not.toHaveReceivedEvent();

      await (await action(page, 2)).click();
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2026-10-05/2026-10-09', start: '2026-10-05', end: '2026-10-09' });
      expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
      expect(await focused(page)).toContain('pds-datepicker__trigger');
      expect(await fieldValue(page)).toBe('2026-10-05 – 2026-10-09');
    });

    it('moves the start when a day before it is picked', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      await (await day(page, '2026-10-05')).click();
      await (await day(page, '2026-10-02')).click();
      await (await day(page, '2026-10-06')).click();
      await (await action(page, 2)).click();
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2026-10-02/2026-10-06', start: '2026-10-02', end: '2026-10-06' });
    });

    it('applies a one-day range when only a start is picked', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      await (await day(page, '2026-10-05')).click();
      await (await action(page, 2)).click();
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2026-10-05/2026-10-05', start: '2026-10-05', end: '2026-10-05' });
    });

    it('picks a range from the keyboard', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);
      expect(await focused(page)).toBe('2026-10-13');

      await press(page, 'Enter');
      await press(page, 'ArrowDown');
      expect(await day(page, '2026-10-16')).toHaveClass('pds-datepicker__day--in-range');
      await press(page, 'Enter');
      // From a day in the second month: Cancel, then Apply.
      await press(page, 'Tab');
      await press(page, 'Tab');
      expect(await focused(page)).toContain('pds-datepicker__action--primary');
      await press(page, 'Enter');

      expect(change).toHaveReceivedEventDetail({ value: '2026-10-13/2026-10-20', start: '2026-10-13', end: '2026-10-20' });
    });

    it('commits a typed range, and moves the open calendar to it while typing', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const input = await page.find('pds-datepicker >>> pds-input >>> input');

      await input.click({ clickCount: 3 });
      await input.type('2026-11-02 to 2026-11-06');
      await page.waitForChanges();
      expect(await day(page, '2026-11-04')).toHaveClass('pds-datepicker__day--in-range');

      await input.press('Enter');
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2026-11-02/2026-11-06', start: '2026-11-02', end: '2026-11-06' });
      expect(await fieldValue(page)).toBe('2026-11-02 – 2026-11-06');
    });

    it('marks a typed range that ends before it starts invalid', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const input = await page.find('pds-datepicker >>> pds-input >>> input');

      await input.click({ clickCount: 3 });
      await input.type('2026-11-06 – 2026-11-02');
      await input.press('Enter');
      await page.waitForChanges();

      expect(change).not.toHaveReceivedEvent();
      expect(await input.getAttribute('aria-invalid')).toBe('true');
    });

    it('applies a preset with its key', async () => {
      const page = await setup(RANGE);
      // Wide enough for the presets beside both months.
      await page.setViewport({ width: 1280, height: 800 });
      await page.$eval('pds-datepicker', (el: HTMLPdsDatepickerElement) => {
        el.presets = [{ key: 'launch', label: 'Launch week', start: '2026-03-02', end: '2026-03-08' }];
      });
      await page.waitForChanges();
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      const preset = await page.find('pds-datepicker >>> .pds-datepicker__preset');
      await preset.click();
      await page.waitForChanges();

      expect(await preset.getAttribute('aria-pressed')).toBe('true');
      const headings = await page.findAll('pds-datepicker >>> .pds-datepicker__heading');
      expect(headings.map((h) => h.textContent)).toEqual(['February 2026', 'March 2026']);
      expect(await focused(page)).toContain('pds-datepicker__preset');

      await (await action(page, 2)).click();
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({
        value: '2026-03-02/2026-03-08',
        start: '2026-03-02',
        end: '2026-03-08',
        preset: 'launch',
      });
      expect(await fieldValue(page)).toBe('2026-03-02 – 2026-03-08');
    });

    it('moves focus to the calendar from Custom range', async () => {
      const page = await setup(RANGE.replace('range', 'range presets="today"'));
      await page.setViewport({ width: 1280, height: 800 });
      await openWithTrigger(page);

      const presets = await page.findAll('pds-datepicker >>> .pds-datepicker__preset');
      await presets[presets.length - 1].click();
      await page.waitForChanges();

      expect(await focused(page)).toBe('2026-10-13');
    });

    it('discards the picked range on Cancel', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      await (await day(page, '2026-10-05')).click();
      await (await action(page, 1)).click();
      await page.waitForChanges();

      expect(change).not.toHaveReceivedEvent();
      expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
      expect(await focused(page)).toContain('pds-datepicker__trigger');
    });

    it('empties the field with Clear', async () => {
      const page = await setup(RANGE.replace('range', 'range clearable'));
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      await (await action(page, 1)).click();
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '' });
      expect(await fieldValue(page)).toBe('');
    });

    it('applies a range with times', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" range time-picker locale="fr" value="2026-10-13T09:00/2026-10-14T17:00"></pds-datepicker>`,
      );
      await page.setViewport({ width: 1280, height: 800 });
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      // French uses a 24-hour clock: hour and minute for each end.
      await chooseTime(page, 0, '8');
      await chooseTime(page, 2, '18');
      await (await action(page, 2)).click();
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({
        value: '2026-10-13T08:00/2026-10-14T18:00',
        start: '2026-10-13T08:00',
        end: '2026-10-14T18:00',
      });
      expect(await fieldValue(page)).toBe('2026-10-13 08:00 – 2026-10-14 18:00');
    });

    it('moves both months with the month buttons', async () => {
      const page = await setup(RANGE);
      await openWithTrigger(page);

      await (await page.find('pds-datepicker >>> .pds-datepicker__nav--next')).click();
      await page.waitForChanges();

      const headings = await page.findAll('pds-datepicker >>> .pds-datepicker__heading');
      expect(headings.map((h) => h.textContent)).toEqual(['October 2026', 'November 2026']);
    });

    it('submits the range with its form', async () => {
      const page = await setup(`<form>${RANGE.replace('range', 'range name="period"')}</form>`);

      const submitted = await page.evaluate(() => new FormData(document.querySelector('form') as HTMLFormElement).get('period'));
      expect(submitted).toBe('2026-09-13/2026-10-13');
    });

    it('has no axe violations with the calendar open', async () => {
      const page = await setup(RANGE.replace('range', 'range time-picker show-dropdowns presets="today,last-7-days,last-30-days"'));
      await page.setViewport({ width: 1280, height: 800 });
      await openWithTrigger(page);

      const violations = await runAxe(page);
      if (violations.length) throw new Error(formatViolations(violations));
      expect(violations).toHaveLength(0);
    });
  });
});
