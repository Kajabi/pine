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
  // Enter on the focused button rather than a mouse click: on a cold first page the layout can
  // still shift as the icon loads, and a click landing on the field opens with focus left there.
  await page.$eval('pds-datepicker', (el) =>
    el.shadowRoot?.querySelector<HTMLElement>('.pds-datepicker__trigger')?.focus(),
  );
  await page.keyboard.press('Enter');
  await page.waitForChanges();
  await page.waitForFunction(() => {
    const dialog = document.querySelector('.pds-datepicker-calendar-portal')?.shadowRoot?.querySelector<HTMLElement>('[role="dialog"]');
    return dialog?.style.visibility === 'visible';
  });
}

/** What has focus inside the datepicker: a day's date, or a class name. */
function focused(page: E2EPage): Promise<string | null> {
  return page.evaluate(() => {
    // Focus is in the datepicker's shadow root, or in its portaled calendar's.
    const top = document.activeElement as HTMLElement | null;
    const active = (top?.shadowRoot?.activeElement ?? top) as HTMLElement | null;
    return active?.getAttribute('data-date') ?? active?.className ?? null;
  });
}

/** Chooses an option in the datepicker's nth time select, as a person would, firing `change`. */
async function chooseTime(page: E2EPage, index: number, value: string) {
  await page.$eval(
    '.pds-datepicker-calendar-portal',
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

    const heading = await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__heading');
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
    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
    expect(await focused(page)).toContain('pds-datepicker__trigger');
  });

  it('picks a day with the pointer but not one out of range', async () => {
    const page = await setup();
    const change = await page.spyOnEvent('pdsDatepickerChange');
    await openWithTrigger(page);

    await (await page.find('.pds-datepicker-calendar-portal >>> [data-date="2026-10-04"]')).click();
    await page.waitForChanges();
    expect(change).not.toHaveReceivedEvent();
    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).not.toBeNull();

    await (await page.find('.pds-datepicker-calendar-portal >>> [data-date="2026-10-20"]')).click();
    await page.waitForChanges();
    expect(change).toHaveReceivedEventDetail({ value: '2026-10-20' });
  });

  it('shows the next month without moving focus off the button', async () => {
    const page = await setup(FIELD.replace('max="2026-11-20"', 'max="2027-03-01"'));
    await openWithTrigger(page);

    const next = await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__nav:last-of-type');
    await next.click();
    await page.waitForChanges();

    const heading = await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__heading');
    expect(heading.textContent).toBe('November 2026');
    expect(await focused(page)).toContain('pds-datepicker__nav');
  });

  it('moves focus to the active day when the month button it clicked becomes disabled', async () => {
    const page = await setup();
    await openWithTrigger(page);

    const next = await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__nav:last-of-type');
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

    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
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

    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
  });

  it('opens from the field with Alt+ArrowDown', async () => {
    const page = await setup();
    await (await page.find('pds-datepicker >>> pds-input >>> input')).focus();

    await press(page, 'ArrowDown', 'Alt');
    await page.waitForChanges();

    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).not.toBeNull();
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

    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).not.toBeNull();
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

    const heading = await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__heading');
    expect(heading.textContent).toBe('November 2026');
    expect(await page.find('.pds-datepicker-calendar-portal >>> [data-date="2026-11-05"]')).toEqualAttribute('tabindex', '0');
  });

  it('closes when focus leaves the datepicker', async () => {
    const page = await setup(`${FIELD}<button id="after">After</button>`);
    const input = await page.find('pds-datepicker >>> pds-input >>> input');
    await input.click();
    await page.waitForChanges();

    await page.focus('#after');
    await page.waitForChanges();

    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
  });

  it('jumps with the month and year dropdowns', async () => {
    const page = await setup(
      `<pds-datepicker component-id="born" label="Birthday" show-dropdowns locale="en-US" max="2026-10-13" value="1990-06-15"></pds-datepicker>`,
    );
    await openWithTrigger(page);

    await page.$eval('.pds-datepicker-calendar-portal', (el) => {
      const select = el.shadowRoot?.querySelectorAll<HTMLSelectElement>('.pds-datepicker__dropdowns select')[1];
      if (select) {
        select.value = '1985';
        select.dispatchEvent(new Event('change'));
      }
    });
    await page.waitForChanges();
    expect(await page.find('.pds-datepicker-calendar-portal >>> .visually-hidden[aria-live]')).toEqualText('June 1985');

    await page.$eval('.pds-datepicker-calendar-portal', (el) => {
      const select = el.shadowRoot?.querySelectorAll<HTMLSelectElement>('.pds-datepicker__dropdowns select')[0];
      if (select) {
        select.value = '0';
        select.dispatchEvent(new Event('change'));
      }
    });
    await page.waitForChanges();
    expect(await page.find('.pds-datepicker-calendar-portal >>> .visually-hidden[aria-live]')).toEqualText('January 1985');

    await (await page.find('.pds-datepicker-calendar-portal >>> [data-date="1985-01-15"]')).click();
    await page.waitForChanges();
    expect(await (await page.find('pds-datepicker')).getProperty('value')).toBe('1985-01-15');
  });

  it('picks a date and time and applies them', async () => {
    const page = await setup(
      `<pds-datepicker component-id="when" label="When" time-picker locale="en-US" value="2026-10-13T09:00"></pds-datepicker>`,
    );
    const change = await page.spyOnEvent('pdsDatepickerChange');
    await openWithTrigger(page);

    await (await page.find('.pds-datepicker-calendar-portal >>> [data-date="2026-10-14"]')).click();
    await page.waitForChanges();
    // A date with a time waits for Apply.
    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).not.toBeNull();

    await chooseTime(page, 0, '3');
    await chooseTime(page, 1, '45');
    await chooseTime(page, 2, 'pm');
    await (await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__action--primary')).click();
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
        document.querySelector('.pds-datepicker-calendar-portal')?.shadowRoot?.querySelector('[role="dialog"]')?.getAttribute('aria-modal'),
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
    expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
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

  describe('review fixes', () => {
    /** Records each `ElementInternals.setValidity` call, as the internals aren't reachable from the page. */
    async function setupWithValidity(html: string): Promise<E2EPage> {
      const page = await newE2EPage();
      await page.evaluateOnNewDocument(() => {
        const calls: { flags: ValidityStateFlags; message?: string }[] = [];
        (window as unknown as { validityCalls: typeof calls }).validityCalls = calls;
        const original = ElementInternals.prototype.setValidity;
        ElementInternals.prototype.setValidity = function (flags, message, anchor) {
          calls.push({ flags: { ...flags }, message });
          return original.call(this, flags, message, anchor);
        };
      });
      await page.setContent(html);
      await page.waitForChanges();
      return page;
    }
    const lastValidity = (page: E2EPage) =>
      page.evaluate(() => {
        const calls = (window as unknown as { validityCalls: { flags: ValidityStateFlags; message?: string }[] }).validityCalls;
        return calls[calls.length - 1];
      });
    const typeAndBlur = async (page: E2EPage, text: string) => {
      const input = await page.find('pds-datepicker >>> pds-input >>> input');
      await input.click({ clickCount: 3 });
      await input.type(text);
      await press(page, 'Escape');
      await input.click({ clickCount: 3 });
      await input.type(text);
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
      await page.waitForChanges();
    };

    it('reports each validity flag with its message prop, filling in {date}', async () => {
      const html = (extra: string) =>
        `<form><pds-datepicker component-id="due" name="due" label="Due date" locale="en-US" min="2026-10-05" max="2026-11-20" ${extra}></pds-datepicker></form>`;

      const tooEarly = await setupWithValidity(html('min-date-message="Not before {date}."'));
      await typeAndBlur(tooEarly, '2026-10-01');
      expect(await lastValidity(tooEarly)).toEqual({ flags: { rangeUnderflow: true }, message: 'Not before 2026-10-05.' });

      const tooLate = await setupWithValidity(html('max-date-message="Not after {date}."'));
      await typeAndBlur(tooLate, '2026-12-01');
      expect(await lastValidity(tooLate)).toEqual({ flags: { rangeOverflow: true }, message: 'Not after 2026-11-20.' });

      const notADate = await setupWithValidity(html('invalid-date-message="That isn\'t a date."'));
      await typeAndBlur(notADate, 'soon');
      expect(await lastValidity(notADate)).toEqual({ flags: { badInput: true }, message: "That isn't a date." });

      const missing = await setupWithValidity(html('required'));
      expect((await lastValidity(missing)).flags).toEqual({ valueMissing: true });
    });

    it('opens the calendar at the placement asked for', async () => {
      const page = await setup(
        `<div style="margin-top:500px">${FIELD.replace('locale="en-US"', 'locale="en-US" placement="top-start"')}</div>`,
      );
      await page.setViewport({ width: 1024, height: 1000 });
      await openWithTrigger(page);
      const [calendar, field] = await page.$eval('pds-datepicker', (el) => {
        const dialog = el.shadowRoot?.querySelector('[role="dialog"]')?.getBoundingClientRect();
        // The calendar is placed against the field's box, below the label.
        const box = el.shadowRoot?.querySelector('pds-input')?.shadowRoot?.querySelector('.pds-input__field-wrapper')?.getBoundingClientRect();
        return [dialog?.bottom ?? 0, box?.top ?? 0];
      });
      expect(calendar).toBeLessThanOrEqual(field);
    });

    it('moves focus to the field with setFocus()', async () => {
      const page = await setup();
      await (await page.find('pds-datepicker')).callMethod('setFocus');
      await page.waitForChanges();
      const tag = await page.evaluate(() => {
        const active = document.querySelector('pds-datepicker')?.shadowRoot?.activeElement;
        return active?.shadowRoot?.activeElement?.tagName ?? active?.tagName;
      });
      expect(tag).toBe('INPUT');
    });

    it('puts back the time typed text changed when a day is then picked', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" time-picker locale="fr" value="2026-10-13T09:00"></pds-datepicker>`,
      );
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const input = await page.find('pds-datepicker >>> pds-input >>> input');
      await input.click({ clickCount: 3 });
      await input.type('2026-10-14 16:30');
      await page.waitForChanges();
      await (await page.find('pds-datepicker >>> [data-date="2026-10-15"]')).click();
      await page.waitForChanges();
      await (await page.find('pds-datepicker >>> .pds-datepicker__action:nth-of-type(2)')).click();
      await page.waitForChanges();

      expect(change.events.map((event) => event.detail.value)).toEqual(['2026-10-15T09:00']);
    });

    it('keeps a time chosen in the picker after typing when a day is then picked', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" time-picker locale="fr" value="2026-10-13T09:00"></pds-datepicker>`,
      );
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const input = await page.find('pds-datepicker >>> pds-input >>> input');
      await input.click({ clickCount: 3 });
      await input.type('2026-10-14 16:30');
      await page.waitForChanges();
      await chooseTime(page, 0, '11');
      await (await page.find('pds-datepicker >>> [data-date="2026-10-15"]')).click();
      await page.waitForChanges();
      await (await page.find('pds-datepicker >>> .pds-datepicker__action:nth-of-type(2)')).click();
      await page.waitForChanges();

      expect(change.events.map((event) => event.detail.value)).toEqual(['2026-10-15T11:30']);
    });

    it('commits nothing when a day is picked after typing and the calendar is then dismissed', async () => {
      const page = await setup(
        `<pds-datepicker component-id="period" range label="Period" locale="en-US" value="2026-09-13/2026-10-13"></pds-datepicker><button id="after">After</button>`,
      );
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const input = await page.find('pds-datepicker >>> pds-input >>> input');
      await input.click({ clickCount: 3 });
      await input.type('2026-10-01 – 2026-10-05');
      await page.waitForChanges();
      await (await page.find('pds-datepicker >>> [data-date="2026-10-20"]')).click();
      await page.waitForChanges();
      await page.click('#after');
      await page.waitForChanges();

      expect(change).not.toHaveReceivedEvent();
      expect(await input.getProperty('value')).toBe('2026-09-13 – 2026-10-13');
    });

    it('closes only the calendar on Escape on the calendar button, inside pds-modal', async () => {
      const page = await setup(`<pds-modal component-id="m"><div>${FIELD}</div></pds-modal>`);
      await (await page.find('pds-modal')).callMethod('showModal');
      await page.waitForChanges();
      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      await page.waitForChanges();
      await page.$eval('pds-datepicker', (el) =>
        el.shadowRoot?.querySelector<HTMLElement>('.pds-datepicker__trigger')?.focus(),
      );
      await press(page, 'Escape');

      expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
      expect(await page.evaluate(() => (document.querySelector('pds-modal dialog') as HTMLDialogElement).open)).toBe(true);
    });

    it('doesn\'t report blur for a click on a part of the open calendar that can\'t take focus', async () => {
      const page = await setup();
      const blur = await page.spyOnEvent('pdsBlur');
      await openWithTrigger(page);

      await (await page.find('pds-datepicker >>> .pds-datepicker__heading')).click();
      await page.waitForChanges();

      expect(blur).not.toHaveReceivedEvent();
      expect(await page.find('pds-datepicker >>> [role="dialog"]')).not.toBeNull();
      // Focus goes on to the active day, so the keyboard keeps working in the calendar.
      expect(await focused(page)).toBe('2026-10-13');
      await press(page, 'ArrowRight');
      expect(await focused(page)).toBe('2026-10-14');
    });

    it('keeps a typed date pending on Tab to the calendar button, and a picked time on a click outside', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" time-picker locale="fr" value="2026-10-13T09:00"></pds-datepicker><button id="after">After</button>`,
      );
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      await page.waitForChanges();

      await chooseTime(page, 0, '14');
      await page.evaluate(() => {
        const input = document.querySelector('pds-datepicker')?.shadowRoot?.querySelector('pds-input')?.shadowRoot?.querySelector('input');
        input?.focus();
        input?.select();
      });
      await page.keyboard.type('2026-10-14');
      await press(page, 'Tab');
      expect(change).not.toHaveReceivedEvent();
      expect(await page.find('pds-datepicker >>> [role="dialog"]')).not.toBeNull();

      await page.click('#after');
      await page.waitForChanges();
      expect(change.events.map((event) => event.detail.value)).toEqual(['2026-10-14T14:00']);
    });

    it('applies a time picked in the calendar on Enter in the field, as Apply does', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" time-picker locale="fr" value="2026-10-13T09:00"></pds-datepicker>`,
      );
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      await page.waitForChanges();

      await chooseTime(page, 0, '14');
      await page.evaluate(() =>
        document.querySelector('pds-datepicker')?.shadowRoot?.querySelector('pds-input')?.shadowRoot?.querySelector('input')?.focus(),
      );
      await press(page, 'Enter');

      expect(change.events.map((event) => event.detail.value)).toEqual(['2026-10-13T14:00']);
      expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
    });

    it('keeps a time picked in the calendar when the date is then typed', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" time-picker locale="fr" value="2026-10-13T09:00"></pds-datepicker>`,
      );
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      await page.waitForChanges();

      await chooseTime(page, 0, '14');
      await page.evaluate(() => {
        const input = document.querySelector('pds-datepicker')?.shadowRoot?.querySelector('pds-input')?.shadowRoot?.querySelector('input');
        input?.focus();
        input?.select();
      });
      await page.keyboard.type('2026-10-14 09:00');
      await page.waitForChanges();
      await (await page.find('pds-datepicker >>> .pds-datepicker__action:nth-of-type(2)')).click();
      await page.waitForChanges();

      expect(change.events[change.events.length - 1].detail.value).toBe('2026-10-14T14:00');
    });

    it('reports blur when a click on a blank part of the page takes focus from the field', async () => {
      const page = await setup(`${FIELD}<div id="blank" style="height:200px"></div>`);
      const focus = await page.spyOnEvent('pdsFocus');
      const blur = await page.spyOnEvent('pdsBlur');

      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      await page.keyboard.type('x');
      await page.click('#blank');
      await page.waitForChanges();
      expect(blur).toHaveReceivedEventTimes(1);

      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      await page.waitForChanges();
      expect(focus).toHaveReceivedEventTimes(2);
    });

    it('closes the calendar when disabled or made read-only while open', async () => {
      const page = await setup();
      const datepicker = await page.find('pds-datepicker');
      for (const prop of ['disabled', 'readonly']) {
        await openWithTrigger(page);
        datepicker.setProperty(prop, true);
        await page.waitForChanges();
        expect(await page.find('pds-datepicker >>> [role="dialog"]')).toBeNull();
        datepicker.setProperty(prop, false);
        await page.waitForChanges();
      }
    });

    it('emits nothing on Cancel when the value was set in another accepted form', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" time-picker locale="fr" value="2026-10-05 14:00"></pds-datepicker>`,
      );
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      await (await page.find('pds-datepicker >>> .pds-datepicker__action:nth-of-type(1)')).click();
      await page.waitForChanges();
      expect(change).not.toHaveReceivedEvent();
    });

    it('reports a date before min or after max as out of range, typed or set in code', async () => {
      const page = await setup(`<form>${FIELD.replace('component-id="due"', 'component-id="due" name="due"')}</form>`);
      const validity = () =>
        page.evaluate(() => {
          const internals = document.querySelector('pds-datepicker') as unknown as { internals?: ElementInternals };
          void internals;
          const form = document.querySelector('form') as HTMLFormElement;
          let reported = '';
          form.addEventListener('invalid', (e) => (reported ||= (e.target as Element).tagName), { capture: true, once: true });
          return { valid: form.checkValidity(), reported };
        });
      const input = await page.find('pds-datepicker >>> pds-input >>> input');

      await input.click({ clickCount: 3 });
      await input.type('2026-09-01');
      await input.press('Enter');
      await page.waitForChanges();
      expect(await validity()).toEqual({ valid: false, reported: 'PDS-DATEPICKER' });
      expect(await input.getAttribute('aria-invalid')).toBe('true');

      // Set in code: still out of range, so still invalid, and shown as invalid.
      await page.$eval('pds-datepicker', (el: HTMLPdsDatepickerElement) => (el.value = '2026-12-31'));
      await page.waitForChanges();
      expect((await validity()).valid).toBe(false);
      expect(await input.getAttribute('aria-invalid')).toBe('true');

      await page.$eval('pds-datepicker', (el: HTMLPdsDatepickerElement) => (el.value = '2026-10-20'));
      await page.waitForChanges();
      expect((await validity()).valid).toBe(true);
    });

    it('doesn\'t open the calendar from a click on the label', async () => {
      const page = await setup();

      await (await page.find('pds-datepicker >>> pds-input >>> label')).click();
      await page.waitForChanges();

      expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
    });

    it('shows a typed date as selected, and closes on Enter', async () => {
      const page = await setup();
      const input = await page.find('pds-datepicker >>> pds-input >>> input');
      await input.click({ clickCount: 3 });
      await input.type('2026-10-20');
      await page.waitForChanges();

      expect(await page.find('.pds-datepicker-calendar-portal >>> [data-date="2026-10-20"]')).toHaveClass('pds-datepicker__day--selected');

      await input.press('Enter');
      await page.waitForChanges();
      expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
      expect(await (await page.find('pds-datepicker')).getProperty('value')).toBe('2026-10-20');
    });

    it('keeps a modal open when a press on its backdrop dismisses the calendar', async () => {
      const page = await setup(`<pds-modal component-id="m"><div>${FIELD}</div></pds-modal>`);
      await (await page.find('pds-modal')).callMethod('showModal');
      await page.waitForChanges();
      await openWithTrigger(page);

      // The modal's backdrop is its <dialog>, around the panel; press a corner of the page.
      await page.mouse.click(4, 4);
      await page.waitForChanges();

      expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
      expect(await page.evaluate(() => (document.querySelector('pds-modal dialog') as HTMLDialogElement).open)).toBe(true);
    });

    it('moves between presets with the arrow keys, picking each', async () => {
      const page = await setup(
        `<pds-datepicker component-id="r" range locale="en-US" presets="today,yesterday" value="2026-09-13/2026-10-13"></pds-datepicker>`,
      );
      await page.setViewport({ width: 1280, height: 800 });
      await openWithTrigger(page);

      await (await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__preset')).focus();
      await press(page, 'ArrowDown');

      const checked = await page.evaluate(() =>
        Array.from(document.querySelector('.pds-datepicker-calendar-portal')?.shadowRoot?.querySelectorAll('[role="radio"]') ?? []).map((r) =>
          r.getAttribute('aria-checked'),
        ),
      );
      expect(checked).toEqual(['false', 'true', 'false']);
      expect(await focused(page)).toContain('pds-datepicker__preset');
    });

    it('reloads an open calendar when the value is set in code', async () => {
      const page = await setup();
      await openWithTrigger(page);

      await page.$eval('pds-datepicker', (el: HTMLPdsDatepickerElement) => (el.value = '2026-11-05'));
      await page.waitForChanges();

      expect(await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__heading')).toEqualText('November 2026');
      expect(await page.find('.pds-datepicker-calendar-portal >>> [data-date="2026-11-05"]')).toHaveClass('pds-datepicker__day--selected');
    });
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
        const dialog = document.querySelector('.pds-datepicker-calendar-portal')?.shadowRoot?.querySelector('[role="dialog"]') as HTMLElement;
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
      expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).not.toBeNull();
      await press(page, 'Escape');
      expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
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

  describe('portal', () => {
    const PORTAL = '.pds-datepicker-calendar-portal';
    const portalParent = (page: E2EPage) =>
      page.evaluate((selector) => document.querySelector(selector)?.parentElement?.tagName ?? null, PORTAL);

    it('isn\'t clipped or misplaced by an overflow-hidden, transformed ancestor', async () => {
      const page = await setup(
        `<div id="clip" style="overflow:hidden;height:90px;transform:translateZ(0);margin-top:40px">${FIELD}</div>`,
      );
      await openWithTrigger(page);

      expect(await portalParent(page)).toBe('BODY');
      const placement = await page.evaluate((selector) => {
        const portal = document.querySelector(selector) as HTMLElement;
        const dialog = portal.shadowRoot?.querySelector('[role="dialog"]') as HTMLElement;
        const field = document
          .querySelector('pds-datepicker')
          ?.shadowRoot?.querySelector('pds-input')
          ?.shadowRoot?.querySelector('.pds-input__field-wrapper') as HTMLElement;
        const box = dialog.getBoundingClientRect();
        const clip = (document.getElementById('clip') as HTMLElement).getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.bottom - 10);
        return {
          belowField: Math.round(box.top - field.getBoundingClientRect().bottom),
          extendsPastClip: box.bottom > clip.bottom,
          hitsPortal: hit === portal,
        };
      }, PORTAL);

      expect(placement.belowField).toBe(4);
      expect(placement.extendsPastClip).toBe(true);
      expect(placement.hitsPortal).toBe(true);
    });

    it('mounts in pds-modal\'s dialog, sharing its top layer', async () => {
      const page = await setup(`<pds-modal component-id="m"><div>${FIELD}</div></pds-modal>`);
      await (await page.find('pds-modal')).callMethod('showModal');
      await page.waitForChanges();
      await openWithTrigger(page);

      expect(await portalParent(page)).toBe('DIALOG');
      await press(page, 'ArrowRight');
      expect(await focused(page)).toBe('2026-10-14');
    });

    it('doesn\'t light-dismiss a pds-drawer when a day is picked', async () => {
      const page = await setup(`<pds-drawer component-id="d" open><div>${FIELD}</div></pds-drawer>`);
      const drawerClose = await page.spyOnEvent('pdsDrawerClose');
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      await (await page.find(`${PORTAL} >>> [data-date="2026-10-20"]`)).click();
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2026-10-20' });
      expect(drawerClose).not.toHaveReceivedEvent();
    });

    it('carries the direction, language and a scoped theme over to the portal', async () => {
      const page = await setup(`<div dir="rtl" lang="fr" data-theme="dark">${FIELD.replace(' locale="en-US"', '')}</div>`);
      await openWithTrigger(page);

      const context = await page.evaluate((selector) => {
        const portal = document.querySelector(selector) as HTMLElement;
        return { dir: portal.dir, lang: portal.lang, theme: portal.getAttribute('data-theme') };
      }, PORTAL);
      expect(context).toEqual({ dir: 'rtl', lang: 'fr', theme: 'dark' });
    });

    it('doesn\'t add to the page\'s height when it opens', async () => {
      const page = await setup(`<div style="height:2000px">${FIELD}</div>`);
      const height = () => page.evaluate(() => document.body.scrollHeight);
      const before = await height();

      await openWithTrigger(page);

      expect(await height()).toBe(before);
    });

    it('moves Tab from the button into a calendar a click in the field opened', async () => {
      const page = await setup(`${FIELD}<button id="after">After</button>`);
      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      await page.waitForFunction(
        (selector) =>
          (document.querySelector(selector)?.shadowRoot?.querySelector('[role="dialog"]') as HTMLElement | null)?.style
            .visibility === 'visible',
        {},
        PORTAL,
      );

      // Field, then the calendar button, then into the calendar rather than past it.
      await press(page, 'Tab');
      expect(await focused(page)).toContain('pds-datepicker__trigger');
      await press(page, 'Tab');
      expect(await focused(page)).toBe('2026-10-13');
    });

    it('reuses one portal across opens, and survives open and close in the same frame', async () => {
      const page = await setup();
      await openWithTrigger(page);
      await press(page, 'Escape');
      await openWithTrigger(page);
      expect(await page.evaluate((selector) => document.querySelectorAll(selector).length, PORTAL)).toBe(1);

      await page.$eval('pds-datepicker', async (el: HTMLPdsDatepickerElement) => {
        await el.close();
        await el.open();
        await el.close();
        await el.open();
      });
      await page.waitForChanges();
      expect(await page.evaluate((selector) => document.querySelectorAll(selector).length, PORTAL)).toBe(1);
      expect(await page.find(`${PORTAL} >>> [role="dialog"]`)).not.toBeNull();
    });

    it('opens again after the datepicker is removed and put back', async () => {
      const page = await setup(`<div id="home">${FIELD}</div>`);
      await openWithTrigger(page);
      await page.evaluate(() => {
        const picker = document.querySelector('pds-datepicker') as HTMLElement;
        picker.remove();
        document.getElementById('home')?.appendChild(picker);
      });
      await page.waitForChanges();
      expect(await portalParent(page)).toBeNull();

      await openWithTrigger(page);
      expect(await portalParent(page)).toBe('BODY');
      expect(await page.find(`${PORTAL} >>> [data-date="2026-10-13"]`)).not.toBeNull();
    });

    it('doesn\'t report blur when focus returns from the calendar inside another component\'s shadow root', async () => {
      const page = await newE2EPage();
      await page.setContent('<div id="mount"></div>');
      await page.evaluate((field) => {
        customElements.define(
          'x-wrap',
          class extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open' }).innerHTML = field;
            }
          },
        );
        document.getElementById('mount')?.appendChild(document.createElement('x-wrap'));
      }, FIELD);
      await page.waitForChanges();
      await page.waitForFunction(() => !!document.querySelector('x-wrap')?.shadowRoot?.querySelector('pds-datepicker.hydrated'));
      const blur = await page.spyOnEvent('pdsBlur');
      const change = await page.spyOnEvent('pdsDatepickerChange');

      await page.evaluate(() =>
        (
          document
            .querySelector('x-wrap')
            ?.shadowRoot?.querySelector('pds-datepicker')
            ?.shadowRoot?.querySelector('.pds-datepicker__trigger') as HTMLElement
        ).click(),
      );
      await page.waitForFunction(
        (selector) =>
          document.querySelector(selector)?.shadowRoot?.activeElement?.getAttribute('data-date') === '2026-10-13',
        {},
        PORTAL,
      );

      await press(page, 'ArrowRight');
      await press(page, 'Enter');
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(change).toHaveReceivedEventDetail({ value: '2026-10-14' });
      expect(blur).not.toHaveReceivedEvent();
    });

    it('closes and reports blur when focus moves from the calendar to the page', async () => {
      const page = await setup(`${FIELD}<button id="after">After</button>`);
      const blur = await page.spyOnEvent('pdsBlur');
      await openWithTrigger(page);

      await page.focus('#after');
      await page.waitForChanges();

      expect(await page.find(`${PORTAL} >>> [role="dialog"]`)).toBeNull();
      expect(blur).toHaveReceivedEventTimes(1);
    });

    it('reports blur when a press outside closes the calendar and focuses another control', async () => {
      const page = await setup(`${FIELD}<button id="after">After</button>`);
      const blur = await page.spyOnEvent('pdsBlur');
      await openWithTrigger(page);

      await page.click('#after');
      await page.waitForChanges();

      expect(await page.find(`${PORTAL} >>> [role="dialog"]`)).toBeNull();
      expect(blur).toHaveReceivedEventTimes(1);
    });

    it('lets Tab leave the button while the open calendar is hidden', async () => {
      const page = await setup(`${FIELD}<button id="after">After</button><div style="height:3000px"></div>`);
      await (await page.find('pds-datepicker >>> pds-input >>> input')).click();
      const visibility = (value: string) =>
        page.waitForFunction(
          (selector, expected) =>
            (document.querySelector(selector)?.shadowRoot?.querySelector('[role="dialog"]') as HTMLElement | null)?.style
              .visibility === expected,
          {},
          PORTAL,
          value,
        );
      await visibility('visible');

      // The field scrolls out of view, which hides the calendar beside it.
      await page.evaluate(() => {
        document.querySelector('pds-datepicker')?.shadowRoot?.querySelector<HTMLElement>('.pds-datepicker__trigger')?.focus({ preventScroll: true });
        window.scrollTo(0, 2000);
      });
      await visibility('hidden');

      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('after');
    });

    it('updates the portal\'s language when the locale changes while open', async () => {
      const page = await setup();
      await openWithTrigger(page);

      const datepicker = await page.find('pds-datepicker');
      datepicker.setProperty('locale', 'fr');
      await page.waitForChanges();

      expect(await page.evaluate((selector) => (document.querySelector(selector) as HTMLElement).lang, PORTAL)).toBe('fr');
    });

    it('removes the portal on close and when the datepicker is removed', async () => {
      const page = await setup();
      await openWithTrigger(page);
      await press(page, 'Escape');
      expect(await portalParent(page)).toBeNull();

      await openWithTrigger(page);
      await page.evaluate(() => document.querySelector('pds-datepicker')?.remove());
      await page.waitForChanges();
      expect(await portalParent(page)).toBeNull();
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

    const day = (page: E2EPage, iso: string) => page.find(`.pds-datepicker-calendar-portal >>> [data-date="${iso}"]`);
    const action = (page: E2EPage, index: number) =>
      page.find(`.pds-datepicker-calendar-portal >>> .pds-datepicker__action:nth-of-type(${index})`);
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
      expect(await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__selection')).toEqualText('2026-10-05 –');

      await (await day(page, '2026-10-09')).click();
      await page.waitForChanges();
      expect(change).not.toHaveReceivedEvent();

      await (await action(page, 2)).click();
      await page.waitForChanges();

      expect(change).toHaveReceivedEventDetail({ value: '2026-10-05/2026-10-09', start: '2026-10-05', end: '2026-10-09' });
      expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
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

      const preset = await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__preset');
      await preset.click();
      await page.waitForChanges();

      expect(await preset.getAttribute('aria-checked')).toBe('true');
      const headings = await page.findAll('.pds-datepicker-calendar-portal >>> .pds-datepicker__heading');
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

      const presets = await page.findAll('.pds-datepicker-calendar-portal >>> .pds-datepicker__preset');
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
      expect(await page.find('.pds-datepicker-calendar-portal >>> [role="dialog"]')).toBeNull();
      expect(await focused(page)).toContain('pds-datepicker__trigger');
    });

    it('keeps a value set from outside while open on Cancel', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      const datepicker = await page.find('pds-datepicker');
      datepicker.setProperty('value', '2026-10-01/2026-10-03');
      await page.waitForChanges();
      await (await action(page, 1)).click();
      await page.waitForChanges();

      expect(await datepicker.getProperty('value')).toBe('2026-10-01/2026-10-03');
      expect(change).not.toHaveReceivedEvent();
    });

    it('undoes a range typed in the field on Escape from the calendar', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const before = await fieldValue(page);
      await page.click('pds-datepicker >>> input');
      await page.waitForChanges();

      await page.evaluate(() => {
        const input = document.querySelector('pds-datepicker')?.shadowRoot?.querySelector('pds-input')?.shadowRoot?.querySelector('input');
        if (input) input.select();
      });
      await page.keyboard.type('2026-10-01 – 2026-10-03');
      await press(page, 'ArrowDown', 'Alt');
      await press(page, 'Escape');

      expect(await fieldValue(page)).toBe(before);
      expect(change).not.toHaveReceivedEvent();
    });

    it('applies a range typed in the field with Apply, and commits it when tabbing out instead', async () => {
      const typeRange = async (page: E2EPage) => {
        await page.click('pds-datepicker >>> input');
        await page.waitForChanges();
        await page.evaluate(() => {
          const input = document.querySelector('pds-datepicker')?.shadowRoot?.querySelector('pds-input')?.shadowRoot?.querySelector('input');
          if (input) input.select();
        });
        await page.keyboard.type('2026-10-01 – 2026-10-03');
        await page.waitForChanges();
      };

      const applied = await setup(RANGE);
      const appliedChange = await applied.spyOnEvent('pdsDatepickerChange');
      await typeRange(applied);
      await (await action(applied, 2)).click();
      await applied.waitForChanges();
      expect(appliedChange.events.map((event) => event.detail.value)).toEqual(['2026-10-01/2026-10-03']);

      const tabbed = await setup(`<button id="before">Before</button>${RANGE}`);
      const tabbedChange = await tabbed.spyOnEvent('pdsDatepickerChange');
      await typeRange(tabbed);
      await press(tabbed, 'Tab', 'Shift');
      expect(tabbedChange.events.map((event) => event.detail.value)).toEqual(['2026-10-01/2026-10-03']);
    });

    it('undoes a range typed in the field on Cancel', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const before = await fieldValue(page);
      await page.click('pds-datepicker >>> input');
      await page.waitForChanges();

      await page.evaluate(() => {
        const input = document.querySelector('pds-datepicker')?.shadowRoot?.querySelector('pds-input')?.shadowRoot?.querySelector('input');
        if (input) input.select();
      });
      await page.keyboard.type('2026-10-01 – 2026-10-03');
      await (await action(page, 1)).click();
      await page.waitForChanges();

      expect(await fieldValue(page)).toBe(before);
      // Moving into the calendar left the typed range pending, so nothing is committed or emitted.
      expect(change).not.toHaveReceivedEvent();
    });

    it('discards typed text on Escape, so blur commits nothing', async () => {
      const page = await setup(RANGE);
      const change = await page.spyOnEvent('pdsDatepickerChange');
      const before = await fieldValue(page);
      await page.click('pds-datepicker >>> input');
      await page.waitForChanges();

      await page.keyboard.type('x');
      await page.keyboard.press('Escape');
      await page.waitForChanges();
      expect(await fieldValue(page)).toBe(before);

      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
      await page.waitForChanges();
      expect(change).not.toHaveReceivedEvent();
      expect(await fieldValue(page)).toBe(before);
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

    it('shows both times under the one month a narrow window shows', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" range time-picker locale="fr" value="2026-10-13T09:00/2026-10-14T17:00"></pds-datepicker>`,
      );
      await page.setViewport({ width: 420, height: 800 });
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      expect(await page.findAll('.pds-datepicker-calendar-portal >>> .pds-datepicker__month')).toHaveLength(1);
      expect(await page.findAll('.pds-datepicker-calendar-portal >>> .pds-datepicker__time')).toHaveLength(2);

      await chooseTime(page, 2, '18');
      await (await action(page, 2)).click();
      await page.waitForChanges();
      expect(change.firstEvent.detail.end).toBe('2026-10-14T18:00');
    });

    it('shows the end time Apply saves when it would come before the start on one day', async () => {
      const page = await setup(
        `<pds-datepicker component-id="when" range time-picker locale="fr" value="2026-10-13T09:00/2026-10-13T17:00"></pds-datepicker>`,
      );
      await page.setViewport({ width: 1280, height: 800 });
      const change = await page.spyOnEvent('pdsDatepickerChange');
      await openWithTrigger(page);

      await chooseTime(page, 2, '8');
      const endHour = await page.$eval(
        '.pds-datepicker-calendar-portal',
        (el) => el.shadowRoot?.querySelectorAll<HTMLSelectElement>('.pds-datepicker__time select')[2]?.value,
      );
      expect(endHour).toBe('9');

      await (await action(page, 2)).click();
      await page.waitForChanges();
      expect(change.firstEvent.detail.end).toBe('2026-10-13T09:00');
    });

    it('keeps the presets reachable when the matching preset is disabled', async () => {
      const page = await setup(
        `<pds-datepicker component-id="period" range presets="today" label="Period" locale="en-US" max="2000-01-01"></pds-datepicker>`,
      );
      await page.setViewport({ width: 1280, height: 800 });
      await page.$eval('pds-datepicker', (el: HTMLPdsDatepickerElement) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        const now = new Date();
        const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        el.value = `${today}/${today}`;
      });
      await page.waitForChanges();
      await openWithTrigger(page);

      const stops = await page.$eval('.pds-datepicker-calendar-portal', (el) =>
        Array.from(el.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="radio"][tabindex="0"]') ?? []).map(
          (button) => ({ disabled: button.disabled, text: button.textContent }),
        ),
      );
      expect(stops).toHaveLength(1);
      expect(stops[0].disabled).toBe(false);
    });

    it('moves both months with the month buttons', async () => {
      const page = await setup(RANGE);
      await openWithTrigger(page);

      await (await page.find('.pds-datepicker-calendar-portal >>> .pds-datepicker__nav--next')).click();
      await page.waitForChanges();

      const headings = await page.findAll('.pds-datepicker-calendar-portal >>> .pds-datepicker__heading');
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
