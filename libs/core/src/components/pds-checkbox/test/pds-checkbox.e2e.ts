import { newE2EPage } from '@stencil/core/testing';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-checkbox', () => {
  it('toggles checked and unchecked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default" label="Label text" />');

    const component = await page.find('pds-checkbox');
    expect(component).toHaveClass('hydrated');

    const checkbox = await page.find('pds-checkbox >>> input');
    await checkbox.click();
    expect(await checkbox.getProperty('checked')).toBeTruthy();

    await checkbox.click();
    expect(await checkbox.getProperty('checked')).toBeFalsy();
  });

  it('toggles input disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default" label="Label text" />');
    const component = await page.find('pds-checkbox');
    expect(component).toHaveClass('hydrated');

    const checkbox = await page.find('pds-checkbox >>> input');
    component.setProperty('disabled', false);
    await page.waitForChanges();
    expect(await checkbox.getProperty('disabled')).toBe(false);

    component.setProperty('disabled', true);
    await page.waitForChanges();
    expect(await checkbox.getProperty('disabled')).toBe(true);
  });

  it('emits "pdsCheckboxChange" event when checkbox is changed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default" label="Label text" />');

    const checkbox = await page.find('pds-checkbox >>> input');
    const eventSpy = await page.spyOnEvent('pdsCheckboxChange');
    await checkbox.press('Space');

    expect(eventSpy).toHaveReceivedEvent();
  });

  it('does not emit "pdsCheckboxChange" event when checkbox is changed and disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default" label="Label text" disabled />');

    const checkbox = await page.find('pds-checkbox >>> input');
    const eventSpy = await page.spyOnEvent('pdsCheckboxChange');

    await checkbox.press('Space');
    expect(eventSpy).not.toHaveReceivedEvent();
  });

  it('toggles when slotted label content is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default"><pds-chip slot="label">Spring Launch</pds-chip></pds-checkbox>');

    const input = await page.find('pds-checkbox >>> input');
    const eventSpy = await page.spyOnEvent('pdsCheckboxChange');
    await (await page.find('pds-chip')).click();
    await page.waitForChanges();

    expect(await input.getProperty('checked')).toBe(true);
    expect(eventSpy).toHaveReceivedEventTimes(1);
  });

  it('takes its accessible name from slotted label content, or the label prop without it', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-checkbox component-id="slotted" label="Fallback"><pds-chip slot="label">Spring Launch</pds-chip></pds-checkbox>
      <pds-checkbox component-id="prop" label="Label text"></pds-checkbox>
    `);

    const tree = await page.accessibility.snapshot();
    const findInputs = (node) => [node.role === 'checkbox' ? node.name : null, ...(node.children ?? []).flatMap(findInputs)].filter(Boolean);

    expect(findInputs(tree)).toEqual(['Spring Launch', 'Label text']);
  });

  it('centers the control on slotted label content', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="default"><pds-chip slot="label" dot>Spring Launch</pds-chip></pds-checkbox>');

    const offset = await page.evaluate(() => {
      const middle = (rect: DOMRect) => rect.top + rect.height / 2;
      const host = document.querySelector('pds-checkbox');
      const input = host.shadowRoot.querySelector('input').getBoundingClientRect();
      const chip = host.querySelector('pds-chip').getBoundingClientRect();
      return Math.abs(middle(input) - middle(chip));
    });

    expect(offset).toBeLessThan(1);
  });

  it('shrinks slotted label content to fit a narrow container', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 200px">
        <pds-checkbox component-id="default"><pds-chip slot="label" max-width="100%">A very long label that would otherwise overflow the checkbox</pds-chip></pds-checkbox>
      </div>
    `);

    const overflow = await page.evaluate(() => {
      const host = document.querySelector('pds-checkbox');
      return host.querySelector('pds-chip').getBoundingClientRect().right - host.getBoundingClientRect().right;
    });

    expect(overflow).toBeLessThanOrEqual(0);
  });
});

describe('pds-checkbox checkmark color', () => {
  const markColor = (page, selector: string) =>
    page.$eval(selector, (el) => {
      const input = (el.shadowRoot || el).querySelector('input');
      return getComputedStyle(input, '::after').borderRightColor;
    });

  it('flips the checkmark with the theme on the accent fill', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-checkbox id="light" component-id="light" label="Light" checked></pds-checkbox>
      <div data-theme="dark">
        <pds-checkbox id="dark" component-id="dark" label="Dark" checked></pds-checkbox>
      </div>
    `);

    expect(await markColor(page, '#light')).toBe('rgb(255, 255, 255)');
    expect(await markColor(page, '#dark')).toBe('rgb(0, 0, 0)');
  });

  it('keeps the checkmark white on the invalid fill in dark mode', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div data-theme="dark">
        <pds-checkbox component-id="invalid" label="Invalid" checked invalid></pds-checkbox>
      </div>
    `);

    expect(await markColor(page, 'pds-checkbox')).toBe('rgb(255, 255, 255)');
  });
});

describe('pds-checkbox accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="terms" label="Accept the terms"></pds-checkbox>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with an error message', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="terms" label="Accept the terms" invalid error-message="Accept the terms to continue"></pds-checkbox>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with slotted label content', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox component-id="tag"><pds-chip slot="label" sentiment="neutral">Spring Launch</pds-chip></pds-checkbox>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

// A DOM morph makes the host match the server's HTML, which has none of the classes and styles
// pds-checkbox wrote, including the ones its CSS selects on.
describe('pds-checkbox after its host classes and styles are stripped', () => {
  it('keeps its styling', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-checkbox class="consumer" component-id="check" label="Check" invalid indeterminate></pds-checkbox>');

    await expectStylingSurvivesStrip(page, 'pds-checkbox');
  });
});

describe('pds-checkbox in a disabled fieldset', () => {
  it('is disabled while the fieldset is, and comes back when it is enabled', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form>
        <fieldset disabled>
          <pds-checkbox component-id="in-fieldset" name="agree" label="Agree"></pds-checkbox>
        </fieldset>
      </form>
    `);
    await page.waitForChanges();
    const disabled = () =>
      page.evaluate(() => (document.querySelector('pds-checkbox') as HTMLElement & { disabled: boolean }).disabled);

    expect(await disabled()).toBe(true);

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');

    await page.evaluate(() => document.querySelector('fieldset')!.removeAttribute('disabled'));
    await page.waitForChanges();
    expect(await disabled()).toBe(false);
  });
});

describe('pds-checkbox pill variant', () => {
  const pillStyle = (page, selector: string) =>
    page.$eval(selector, (el) => {
      const label = el.shadowRoot.querySelector('label');
      const style = getComputedStyle(label);
      const rect = label.getBoundingClientRect();
      return {
        boxShadow: style.boxShadow,
        borderColor: style.borderTopColor,
        outlineStyle: style.outlineStyle,
        width: rect.width,
        height: rect.height,
      };
    });

  const pills = `
    <form>
      <pds-checkbox id="email" component-id="email" name="channels" value="email" label="Email" variant="pill"></pds-checkbox>
      <pds-checkbox id="sms" component-id="sms" name="channels" value="sms" label="SMS" variant="pill"></pds-checkbox>
    </form>
  `;

  it('toggles when the pill is clicked, without resizing it or showing a focus ring', async () => {
    const page = await newE2EPage();
    await page.setContent(pills);

    const before = await pillStyle(page, '#email');
    const label = await page.find('#email >>> label');
    await label.click();
    await page.waitForChanges();
    const after = await pillStyle(page, '#email');

    expect(await page.$eval('#email', (el: HTMLPdsCheckboxElement) => el.checked)).toBe(true);
    expect(after.boxShadow).not.toBe('none');
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
    expect(after.outlineStyle).toBe('none');
  });

  it('toggles with Space and shows the focus ring from the keyboard', async () => {
    const page = await newE2EPage();
    await page.setContent(`<button>before</button>${pills}`);

    await page.focus('button');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();

    expect(await page.$eval('#email', (el: HTMLPdsCheckboxElement) => el.checked)).toBe(true);
    expect((await pillStyle(page, '#email')).outlineStyle).toBe('solid');

    await page.keyboard.press('Space');
    await page.waitForChanges();
    expect(await page.$eval('#email', (el: HTMLPdsCheckboxElement) => el.checked)).toBe(false);
  });

  it('submits checked values with the form', async () => {
    const page = await newE2EPage();
    await page.setContent(pills);

    await (await page.find('#email >>> label')).click();
    await (await page.find('#sms >>> label')).click();
    await page.waitForChanges();

    const values = await page.$eval('form', (form: HTMLFormElement) => new FormData(form).getAll('channels'));
    expect(values).toEqual(['email', 'sms']);
  });

  it('follows the theme in dark mode', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-checkbox id="light" component-id="light" label="Light" variant="pill" checked></pds-checkbox>
      <div data-theme="dark">
        <pds-checkbox id="dark" component-id="dark" label="Dark" variant="pill" checked></pds-checkbox>
      </div>
    `);

    const light = await pillStyle(page, '#light');
    const dark = await pillStyle(page, '#dark');
    expect(dark.borderColor).not.toBe(light.borderColor);
  });

  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-checkbox component-id="a" label="Email" variant="pill" checked></pds-checkbox>
      <pds-checkbox component-id="b" label="SMS" variant="pill" invalid error-message="Pick a channel"></pds-checkbox>
    `);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
