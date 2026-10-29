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
        borderWidth: style.borderTopWidth,
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
    // Measure after the web font settles, so a late font swap doesn't read as a resize.
    await page.evaluate(() => document.fonts.ready);

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

  it('looks disabled and ignores clicks', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-checkbox id="email" component-id="email" label="Email" variant="pill"></pds-checkbox>
      <pds-checkbox id="sms" component-id="sms" label="SMS" variant="pill" disabled></pds-checkbox>
    `);

    const enabled = await pillStyle(page, '#email');
    const disabled = await pillStyle(page, '#sms');
    expect(disabled.borderColor).not.toBe(enabled.borderColor);

    await (await page.find('#sms >>> label')).click();
    await page.waitForChanges();
    expect(await page.$eval('#sms', (el: HTMLPdsCheckboxElement) => el.checked)).toBe(false);
  });

  it('turns the border red when invalid', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-checkbox id="email" component-id="email" label="Email" variant="pill"></pds-checkbox>
      <pds-checkbox id="sms" component-id="sms" label="SMS" variant="pill" invalid error-message="Pick a channel"></pds-checkbox>
    `);

    const valid = await pillStyle(page, '#email');
    const invalid = await pillStyle(page, '#sms');
    expect(invalid.borderColor).not.toBe(valid.borderColor);
  });

  // The CDP forced-colors emulation below only takes effect on content rendered after it's set;
  // setting it after setContent() leaves a pill's shadow DOM showing its normal, unremapped
  // colors, so every forced-colors test below sets it up first.
  async function forcedColorsPage() {
    const page = await newE2EPage();
    const client = await page.createCDPSession();
    // emulateMediaFeatures only allows prefers-color-scheme/prefers-reduced-motion/color-gamut;
    // forced-colors needs the raw CDP call.
    await client.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'forced-colors', value: 'active' }],
    });
    return page;
  }

  // Regression: the checked state's forced-colors outline used to win over the focus-visible
  // outline (same specificity, later in the stylesheet), so a checked, keyboard-focused pill
  // was indistinguishable from a checked, unfocused one.
  it('keeps a visible focus ring on a checked pill in forced-colors mode', async () => {
    const page = await forcedColorsPage();
    await page.setContent(`<button>before</button>${pills}`);
    await page.waitForChanges();

    await (await page.find('#email >>> label')).click();
    await page.waitForChanges();
    const checkedOnly = await pillStyle(page, '#email');

    await page.focus('button');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    const checkedAndFocused = await pillStyle(page, '#email');

    expect(checkedOnly.outlineStyle).toBe('none');
    expect(checkedAndFocused.outlineStyle).toBe('solid');
  });

  it('distinguishes checked, disabled and disabled-checked pills by color and border width in forced-colors mode', async () => {
    const page = await forcedColorsPage();
    await page.setContent(`
      <pds-checkbox id="checked" component-id="checked" label="Checked" variant="pill" checked></pds-checkbox>
      <pds-checkbox id="disabled" component-id="disabled" label="Disabled" variant="pill" disabled></pds-checkbox>
      <pds-checkbox id="disabled-checked" component-id="disabled-checked" label="Disabled checked" variant="pill" disabled checked></pds-checkbox>
    `);
    await page.waitForChanges();

    const checked = await pillStyle(page, '#checked');
    const disabled = await pillStyle(page, '#disabled');
    const disabledChecked = await pillStyle(page, '#disabled-checked');

    // Highlight vs GrayText: checked (enabled) and disabled don't share a color.
    expect(checked.borderColor).not.toBe(disabled.borderColor);
    // Both disabled states share GrayText; only the checked one is distinguishable by width.
    expect(disabledChecked.borderColor).toBe(disabled.borderColor);
    expect(disabledChecked.borderWidth).not.toBe(disabled.borderWidth);
    expect(checked.borderWidth).toBe(disabledChecked.borderWidth);
  });

  it('distinguishes an invalid checked pill from an invalid unchecked one in forced-colors mode', async () => {
    const page = await forcedColorsPage();
    await page.setContent(`
      <pds-checkbox id="checked" component-id="checked" label="Checked" variant="pill" invalid="true" checked></pds-checkbox>
      <pds-checkbox id="unchecked" component-id="unchecked" label="Unchecked" variant="pill" invalid="true"></pds-checkbox>
    `);
    await page.waitForChanges();

    const checked = await pillStyle(page, '#checked');
    const unchecked = await pillStyle(page, '#unchecked');

    expect(checked.borderColor).not.toBe(unchecked.borderColor);
    expect(checked.borderWidth).not.toBe(unchecked.borderWidth);
  });

  // Regression: the thicker forced-colors checked border grew the pill, since its label has no
  // explicit width for box-sizing: border-box to hold steady — the same resize this pill design
  // avoids outside forced-colors with an inset ring instead of a border change.
  it('does not resize a pill when its thicker forced-colors checked border appears', async () => {
    const page = await forcedColorsPage();
    await page.setContent(pills);
    await page.evaluate(() => document.fonts.ready);

    const before = await pillStyle(page, '#email');
    await (await page.find('#email >>> label')).click();
    await page.waitForChanges();
    const after = await pillStyle(page, '#email');

    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
  });
});
