import { newSpecPage } from '@stencil/core/testing';
import { PdsDatepicker } from '../pds-datepicker';
import { PdsInput } from '../../pds-input/pds-input';

const trigger = (root: HTMLElement) => root.shadowRoot?.querySelector('.pds-datepicker__trigger') as HTMLButtonElement;

describe('pds-datepicker', () => {
  it('passes its field props to the inner pds-input', async () => {
    const { root } = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" label="Due date" helper-message="Pick a day" value="2026-10-13" required></pds-datepicker>`,
    });

    const input = root?.shadowRoot?.querySelector('pds-input') as HTMLPdsInputElement;
    expect(input.componentId).toBe('due');
    expect(input.label).toBe('Due date');
    expect(input.helperMessage).toBe('Pick a day');
    expect(input.placeholder).toBe('YYYY-MM-DD');
    expect(input.value).toBe('2026-10-13');
    expect(input.required).toBe(true);
  });

  it('labels the trigger with the selected date', async () => {
    const { root } = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" locale="en-US" value="2026-10-13"></pds-datepicker>`,
    });

    const button = trigger(root as HTMLElement);
    expect(button.getAttribute('aria-label')).toBe('Choose date, Tuesday, October 13, 2026');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('uses the trigger label alone when no date is selected', async () => {
    const { root } = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" trigger-label="Pick a due date"></pds-datepicker>`,
    });

    expect(trigger(root as HTMLElement).getAttribute('aria-label')).toBe('Pick a due date');
  });

  it.each(['disabled', 'readonly'])('disables the trigger when %s', async (attr) => {
    const { root } = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" ${attr}></pds-datepicker>`,
    });

    expect(trigger(root as HTMLElement).hasAttribute('disabled')).toBe(true);
  });

  it('renders the calendar for the selected month when opened', async () => {
    const page = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" locale="en-US" value="2026-10-13" min="2026-10-05"></pds-datepicker>`,
    });

    await (page.root as HTMLPdsDatepickerElement).open();
    await page.waitForChanges();

    const shadow = page.root?.shadowRoot as ShadowRoot;
    expect(shadow.querySelector('[role="dialog"]')).not.toBeNull();
    expect(shadow.querySelector('.pds-datepicker__heading')?.textContent).toBe('October 2026');
    expect(trigger(page.root as HTMLElement).getAttribute('aria-expanded')).toBe('true');
    expect(trigger(page.root as HTMLElement).getAttribute('aria-controls')).toBe('due-calendar');

    const selected = shadow.querySelector('[data-date="2026-10-13"]');
    expect(selected?.getAttribute('aria-selected')).toBe('true');
    expect(selected?.getAttribute('tabindex')).toBe('0');
    expect(selected?.getAttribute('aria-label')).toBe('Tuesday, October 13, 2026');

    expect(shadow.querySelector('[data-date="2026-10-04"]')?.getAttribute('aria-disabled')).toBe('true');
    expect(shadow.querySelectorAll('[data-date][tabindex="0"]')).toHaveLength(1);
    // The month before the minimum can't be shown.
    expect(shadow.querySelector('.pds-datepicker__nav')?.hasAttribute('disabled')).toBe(true);
  });

  it('starts the week on the first-day-of-week prop', async () => {
    const page = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" locale="en-US" first-day-of-week="1" value="2026-10-13"></pds-datepicker>`,
    });

    await (page.root as HTMLPdsDatepickerElement).open();
    await page.waitForChanges();

    const weekdays = Array.from(page.root?.shadowRoot?.querySelectorAll('.pds-datepicker__weekday .visually-hidden') ?? []);
    expect(weekdays.map((el) => el.textContent)).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });

  it('names the month and days in the locale', async () => {
    const page = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" locale="fr" first-day-of-week="1" value="2026-10-13"></pds-datepicker>`,
    });

    await (page.root as HTMLPdsDatepickerElement).open();
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.pds-datepicker__heading')?.textContent).toBe('octobre 2026');
  });

  it('writes the day numbers in the locale digits', async () => {
    const page = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" locale="ar-EG" value="2026-10-13"></pds-datepicker>`,
    });

    await (page.root as HTMLPdsDatepickerElement).open();
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('[data-date="2026-10-13"]')?.textContent).toBe('١٣');
  });

  it('opens on today, clamped into range, when there is no value', async () => {
    const page = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" min="2999-01-10"></pds-datepicker>`,
    });

    await (page.root as HTMLPdsDatepickerElement).open();
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('[tabindex="0"]')?.getAttribute('data-date')).toBe('2999-01-10');
  });

  it('does not open when disabled', async () => {
    const page = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due" disabled></pds-datepicker>`,
    });

    await (page.root as HTMLPdsDatepickerElement).open();
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('[role="dialog"]')).toBeNull();
  });

  it('closes the calendar', async () => {
    const page = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due"></pds-datepicker>`,
    });
    const root = page.root as HTMLPdsDatepickerElement;

    await root.open();
    await page.waitForChanges();
    await root.close();
    await page.waitForChanges();

    expect(root.shadowRoot?.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows a programmatic value in the field without emitting a change', async () => {
    const page = await newSpecPage({
      components: [PdsDatepicker, PdsInput],
      html: `<pds-datepicker component-id="due"></pds-datepicker>`,
    });
    const changes = jest.fn();
    page.root?.addEventListener('pdsDatepickerChange', changes);

    (page.root as HTMLPdsDatepickerElement).value = '2026-12-25';
    await page.waitForChanges();

    expect((page.root?.shadowRoot?.querySelector('pds-input') as HTMLPdsInputElement).value).toBe('2026-12-25');
    expect(changes).not.toHaveBeenCalled();
  });

  describe('range mode', () => {
    const field = (root: HTMLElement) => root.shadowRoot?.querySelector('pds-input') as HTMLPdsInputElement;

    it('shows the range in the same field as a single date', async () => {
      const { root } = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="period" range label="Period" locale="en-US" value="2026-09-13/2026-10-13"></pds-datepicker>`,
      });

      expect(field(root as HTMLElement).value).toBe('2026-09-13 – 2026-10-13');
      expect(field(root as HTMLElement).label).toBe('Period');
      expect(field(root as HTMLElement).placeholder).toBe('YYYY-MM-DD – YYYY-MM-DD');
      expect(trigger(root as HTMLElement).getAttribute('aria-label')).toBe(
        'Choose date, Sunday, September 13, 2026 – Tuesday, October 13, 2026',
      );
    });

    it('leaves the field empty for a value that is not a range', async () => {
      const { root } = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="period" range value="2026-10-13/2026-09-13"></pds-datepicker>`,
      });

      expect(field(root as HTMLElement).value).toBe('');
    });

    it('opens two months ending on the range end, with the range marked', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="period" range label="Period" locale="en-US" value="2026-09-13/2026-10-13"></pds-datepicker>`,
      });

      await (page.root as HTMLPdsDatepickerElement).open();
      await page.waitForChanges();

      const shadow = page.root?.shadowRoot as ShadowRoot;
      expect(shadow.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Period');
      expect(Array.from(shadow.querySelectorAll('.pds-datepicker__heading')).map((h) => h.textContent)).toEqual([
        'September 2026',
        'October 2026',
      ]);
      expect(shadow.querySelectorAll('[role="grid"][aria-multiselectable="true"]')).toHaveLength(2);
      // Previous on the first month, next on the last.
      expect(shadow.querySelectorAll('.pds-datepicker__nav')).toHaveLength(2);
      expect(shadow.querySelector('.pds-datepicker__selection')?.textContent).toBe('2026-09-13 – 2026-10-13');

      const cell = (iso: string) => shadow.querySelector(`[data-date="${iso}"]`) as HTMLElement;
      expect(cell('2026-09-13').classList.contains('pds-datepicker__day--selected')).toBe(true);
      expect(cell('2026-09-20').classList.contains('pds-datepicker__day--in-range')).toBe(true);
      expect(cell('2026-09-20').classList.contains('pds-datepicker__day--row-start')).toBe(true);
      expect(cell('2026-09-26').classList.contains('pds-datepicker__day--row-end')).toBe(true);
      expect(cell('2026-10-13').getAttribute('aria-selected')).toBe('true');
      expect(cell('2026-10-14').getAttribute('aria-selected')).toBeNull();
      expect(cell('2026-10-13').getAttribute('tabindex')).toBe('0');
    });

    it('lists the presets and Custom range, marking the one the range matches', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="period" range></pds-datepicker>`,
      });
      const root = page.root as HTMLPdsDatepickerElement;
      root.presets = [
        { key: 'launch', label: 'Launch week', start: '2026-03-02', end: '2026-03-08' },
        { key: 'old', label: 'Old', start: '2020-01-01', end: '2020-01-02' },
      ];
      root.value = '2026-03-02/2026-03-08';
      root.min = '2021-01-01';
      await page.waitForChanges();
      await root.open();
      await page.waitForChanges();

      const buttons = Array.from(root.shadowRoot?.querySelectorAll('.pds-datepicker__preset') ?? []);
      expect(buttons.map((b) => b.textContent)).toEqual(['Launch week', 'Old', 'Custom range']);
      // Presets toggle the range; Custom range only points to the calendar, so it isn't a toggle.
      expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false', null]);
      expect(buttons[1].hasAttribute('disabled')).toBe(true);
    });

    it('marks Custom range when the range matches no preset', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="period" range presets="today" custom-range-label="Autre" value="2020-01-01/2020-01-05"></pds-datepicker>`,
      });

      await (page.root as HTMLPdsDatepickerElement).open();
      await page.waitForChanges();

      const custom = page.root?.shadowRoot?.querySelector('.pds-datepicker__preset--selected');
      expect(custom?.textContent).toBe('Autre');
    });

    it('labels the footer buttons and disables Apply until a start is picked', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="period" range apply-label="Appliquer" cancel-label="Annuler"></pds-datepicker>`,
      });

      await (page.root as HTMLPdsDatepickerElement).open();
      await page.waitForChanges();

      const [cancel, apply] = Array.from(page.root?.shadowRoot?.querySelectorAll('.pds-datepicker__action') ?? []);
      expect(cancel.textContent).toBe('Annuler');
      expect(apply.textContent).toBe('Appliquer');
      expect(apply.hasAttribute('disabled')).toBe(true);
    });

    it('shows Clear in place of Cancel when clearable', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="period" range clearable></pds-datepicker>`,
      });

      await (page.root as HTMLPdsDatepickerElement).open();
      await page.waitForChanges();

      expect(page.root?.shadowRoot?.querySelector('.pds-datepicker__action')?.textContent).toBe('Clear');
    });
  });

  describe('time picker', () => {
    it('shows the date and time in the field', async () => {
      const { root } = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="when" time-picker value="2026-10-13T14:30"></pds-datepicker>`,
      });

      const input = root?.shadowRoot?.querySelector('pds-input') as HTMLPdsInputElement;
      expect(input.value).toBe('2026-10-13 14:30');
      expect(input.placeholder).toBe('YYYY-MM-DD HH:mm');
    });

    it('drops a time from the field without the time picker', async () => {
      const { root } = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="when" value="2026-10-13T14:30"></pds-datepicker>`,
      });

      expect((root?.shadowRoot?.querySelector('pds-input') as HTMLPdsInputElement).value).toBe('2026-10-13');
    });

    it('shows hour, minute and AM/PM pickers on a 12-hour clock', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="when" time-picker minute-increment="15" locale="en-US" value="2026-10-13T14:30"></pds-datepicker>`,
      });

      await (page.root as HTMLPdsDatepickerElement).open();
      await page.waitForChanges();

      const group = page.root?.shadowRoot?.querySelector('.pds-datepicker__time') as HTMLElement;
      expect(group.getAttribute('role')).toBe('group');
      expect(group.getAttribute('aria-label')).toBe('Time');
      const selects = Array.from(group.querySelectorAll('select'));
      expect(selects.map((select) => select.getAttribute('aria-label'))).toEqual(['Hour', 'Minute', 'AM or PM']);

      const selectedText = (select: Element) => select.querySelector('option[selected]')?.textContent;
      expect(selects.map(selectedText)).toEqual(['2', '30', 'PM']);
      expect(Array.from(selects[1].querySelectorAll('option')).map((o) => o.textContent)).toEqual(['00', '15', '30', '45']);
      // A date with a time waits for Apply.
      expect(page.root?.shadowRoot?.querySelector('.pds-datepicker__footer')).not.toBeNull();
    });

    it('uses a 24-hour clock where the locale does', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="when" time-picker locale="fr" value="2026-10-13T14:30"></pds-datepicker>`,
      });

      await (page.root as HTMLPdsDatepickerElement).open();
      await page.waitForChanges();

      const selects = page.root?.shadowRoot?.querySelectorAll('.pds-datepicker__time select');
      expect(selects).toHaveLength(2);
      expect(selects?.[0].querySelector('option[selected]')?.textContent).toBe('14');
    });

    it('labels the start and end times in range mode', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="when" range time-picker value="2026-10-13T09:00/2026-10-14T17:00"></pds-datepicker>`,
      });

      await (page.root as HTMLPdsDatepickerElement).open();
      await page.waitForChanges();

      const groups = Array.from(page.root?.shadowRoot?.querySelectorAll('.pds-datepicker__time') ?? []);
      expect(groups.map((g) => g.getAttribute('aria-label'))).toEqual(['Start time', 'End time']);
    });
  });

  describe('month and year dropdowns', () => {
    it('replaces the heading with month and year dropdowns, bounded by min and max', async () => {
      const page = await newSpecPage({
        components: [PdsDatepicker, PdsInput],
        html: `<pds-datepicker component-id="born" show-dropdowns locale="en-US" min="1990-03-10" max="2026-10-13" value="1990-06-15"></pds-datepicker>`,
      });

      await (page.root as HTMLPdsDatepickerElement).open();
      await page.waitForChanges();

      const shadow = page.root?.shadowRoot as ShadowRoot;
      const [month, year] = Array.from(shadow.querySelectorAll('.pds-datepicker__dropdowns select'));
      expect(month.getAttribute('aria-label')).toBe('Month');
      expect(year.getAttribute('aria-label')).toBe('Year');
      expect(month.querySelector('option[selected]')?.textContent).toBe('Jun');
      // January and February 1990 are before the minimum.
      expect(month.querySelector('option[value="1"]')?.hasAttribute('disabled')).toBe(true);
      expect(month.querySelector('option[value="2"]')?.hasAttribute('disabled')).toBe(false);
      const years = Array.from(year.querySelectorAll('option')).map((o) => o.textContent);
      expect(years[0]).toBe('1990');
      expect(years[years.length - 1]).toBe('2026');
      // The grid stays labelled by the month, now visually hidden.
      expect(shadow.querySelector('[role="grid"]')?.getAttribute('aria-labelledby')).toBe('born-calendar-heading-0');
      expect(shadow.querySelector('#born-calendar-heading-0')?.textContent).toBe('June 1990');
    });
  });
});
