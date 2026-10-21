import { newE2EPage } from '@stencil/core/testing';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';
import { formatViolations, runAxe } from '../../../utils/test/axe';
import { expectRespectsReducedMotion } from '../../../utils/test/reduced-motion';

describe('pds-radio', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio />');

    const element = await page.find('pds-radio');
    expect(element).toHaveClass('hydrated');
  });

  it('is checked when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');

    const component = await page.find('pds-radio');
    expect(component).toHaveClass('hydrated');

    const radio = await page.find('pds-radio input');
    await radio.click();
    expect(await radio.getProperty('checked')).toBeTruthy();
  });

  it('toggles input disabled state', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');
    const component = await page.find('pds-radio');
    expect(component).toHaveClass('hydrated');

    const radio = await page.find('pds-radio input');
    component.setProperty('disabled', false);
    await page.waitForChanges();
    expect(await radio.getProperty('disabled')).toBe(false);

    component.setProperty('disabled', true);
    await page.waitForChanges();
    expect(await radio.getProperty('disabled')).toBe(true);
  });

  it('emits "pdsRadioChange" event when radio is checked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');

    const radio = await page.find('pds-radio input');
    const eventSpy = await page.spyOnEvent('pdsRadioChange');
    await radio.press('Space');

    expect(eventSpy).toHaveReceivedEvent();
  });

  it('does not emit "pdsRadioChange" event when radio is clicked and disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" disabled />');

    const radio = await page.find('pds-radio input');
    const eventSpy = await page.spyOnEvent('pdsRadioChange');

    await radio.press('Space');
    expect(eventSpy).not.toHaveReceivedEvent();
  });

  it('applies has-border class when hasBorder prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" has-border />');

    const component = await page.find('pds-radio');
    expect(component).toHaveClass('has-border');
  });

  it('does not apply has-border class when hasBorder prop is not set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');

    const component = await page.find('pds-radio');
    expect(component).not.toHaveClass('has-border');
  });

  it('toggles has-border class when hasBorder property is changed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" />');

    const component = await page.find('pds-radio');
    expect(component).not.toHaveClass('has-border');

    component.setProperty('hasBorder', true);
    await page.waitForChanges();
    expect(component).toHaveClass('has-border');

    component.setProperty('hasBorder', false);
    await page.waitForChanges();
    expect(component).not.toHaveClass('has-border');
  });

  it('maintains functionality when hasBorder is enabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" has-border />');

    const component = await page.find('pds-radio');
    const radio = await page.find('pds-radio input');
    const eventSpy = await page.spyOnEvent('pdsRadioChange');

    expect(component).toHaveClass('has-border');

    await radio.click();
    expect(await radio.getProperty('checked')).toBeTruthy();
    expect(eventSpy).toHaveReceivedEvent();
  });

  it('shows a not-allowed cursor on the bordered card overlay when disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" has-border />');

    const overlayCursor = () =>
      page.evaluate(() => {
        const label = document.querySelector('pds-radio label');
        return label ? getComputedStyle(label, '::after').cursor : '';
      });

    expect(await overlayCursor()).toBe('pointer');

    const component = await page.find('pds-radio');
    component.setProperty('disabled', true);
    await page.waitForChanges();

    expect(await overlayCursor()).toBe('not-allowed');
  });

  it('shows a not-allowed cursor on the image card overlay when disabled', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<pds-radio component-id="default" label="Label text"><span slot="image"></span></pds-radio>'
    );

    const component = await page.find('pds-radio');
    expect(component).toHaveClass('has-image');

    const overlayCursor = () =>
      page.evaluate(() => {
        const label = document.querySelector('pds-radio label');
        return label ? getComputedStyle(label, '::after').cursor : '';
      });

    expect(await overlayCursor()).toBe('pointer');

    component.setProperty('disabled', true);
    await page.waitForChanges();

    expect(await overlayCursor()).toBe('not-allowed');
  });

  it('combines has-border with other state classes', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="default" label="Label text" has-border invalid disabled />');

    const component = await page.find('pds-radio');
    expect(component).toHaveClass('has-border');
    expect(component).toHaveClass('is-invalid');
    expect(component).toHaveClass('is-disabled');
  });
});

// The image card hides its input, so the input's own focus ring can't show: the card carries it.
describe('pds-radio image card focus', () => {
  const imageGroup = `
    <button id="before">Before</button>
    <pds-radio-group component-id="plans" name="plans" label="Plan">
      <pds-radio component-id="plan-a" name="plans" value="a" label="Plan A"><span slot="image">A</span></pds-radio>
      <pds-radio component-id="plan-b" name="plans" value="b" label="Plan B"><span slot="image">B</span></pds-radio>
    </pds-radio-group>
  `;

  const cardOutline = (page: Awaited<ReturnType<typeof newE2EPage>>, id: string) =>
    page.evaluate((componentId) => {
      const host = document.querySelector(`pds-radio[component-id="${componentId}"]`);
      return host ? getComputedStyle(host).outlineStyle : '';
    }, id);

  it('rings the image card when the keyboard focuses its radio', async () => {
    const page = await newE2EPage();
    await page.setContent(imageGroup);

    expect(await cardOutline(page, 'plan-a')).toBe('none');

    await page.focus('#before');
    await page.keyboard.press('Tab');
    await page.waitForChanges();

    expect(await page.evaluate(() => document.activeElement?.id)).toBe('plan-a');
    expect(await cardOutline(page, 'plan-a')).not.toBe('none');
    expect(await cardOutline(page, 'plan-b')).toBe('none');

    // Tabbing back out of the group takes the ring away.
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    await page.waitForChanges();

    expect(await cardOutline(page, 'plan-a')).toBe('none');
  });

  it('keeps the focus ring clear of the checked ring', async () => {
    const page = await newE2EPage();
    await page.setContent(imageGroup);

    await page.focus('#before');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();

    const card = await page.evaluate(() => {
      const style = getComputedStyle(document.querySelector('pds-radio[component-id="plan-a"]')!);
      return { outline: style.outlineStyle, offset: parseFloat(style.outlineOffset), shadow: style.boxShadow };
    });
    expect(card.outline).not.toBe('none');
    expect(card.shadow).not.toBe('none');
    // The checked ring is a 2px box-shadow outside the border; the outline starts past it.
    expect(card.offset).toBeGreaterThan(2);
  });

  it('has no axe violations with an image card focused', async () => {
    const page = await newE2EPage();
    await page.setContent(imageGroup);
    await page.focus('#before');
    await page.keyboard.press('Tab');
    await page.waitForChanges();

    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

// The image card is a row: the label and message sit beside the image, however long they are,
// and has-border doesn't change that.
describe('pds-radio image card layout', () => {
  const longMessage = 'Several actions that run in order, with waits and different paths.';

  const imageCard = (attrs = '') => `
    <div style="width: 320px;">
      <pds-radio component-id="card" label="A multi-step workflow" helper-message="${longMessage}" ${attrs}>
        <span slot="image" style="display: block; width: 32px; height: 32px;"></span>
      </pds-radio>
    </div>
  `;

  const layout = (page: Awaited<ReturnType<typeof newE2EPage>>) =>
    page.evaluate(() => {
      const host = document.querySelector('pds-radio')!;
      const image = host.querySelector('.pds-radio__image-container')!.getBoundingClientRect();
      const text = host.querySelector('.pds-radio__content-wrapper')!.getBoundingClientRect();
      return {
        direction: getComputedStyle(host).flexDirection,
        textBesideImage: text.left >= image.right && text.top < image.bottom,
        imageLeft: Math.round(image.left),
        textLeft: Math.round(text.left),
      };
    });

  it('keeps a long message beside the image, wrapping there', async () => {
    const page = await newE2EPage();
    await page.setContent(imageCard());

    const result = await layout(page);
    expect(result.direction).toBe('row');
    expect(result.textBesideImage).toBe(true);
  });

  it('lays an image card out the same with has-border', async () => {
    const plainPage = await newE2EPage();
    await plainPage.setContent(imageCard());
    const plain = await layout(plainPage);

    const borderedPage = await newE2EPage();
    await borderedPage.setContent(imageCard('has-border'));
    expect(await borderedPage.find('pds-radio')).toHaveClass('has-border');
    const bordered = await layout(borderedPage);

    expect(bordered).toEqual(plain);
    expect(bordered.textBesideImage).toBe(true);
  });

  it('has no axe violations with a long message', async () => {
    const page = await newE2EPage();
    await page.setContent(imageCard('has-border'));
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  // min-width: 0 lets the column shrink below an unbroken string's width; overflow-wrap keeps
  // that string from then running past the card's edge.
  it('breaks a message with no spaces instead of overflowing the card', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <div style="width: 320px;">
        <pds-radio
          component-id="card"
          label="A multi-step workflow"
          helper-message="https://example.com/workflows/onboarding-sequence"
        >
          <span slot="image" style="display: block; width: 32px; height: 32px;"></span>
        </pds-radio>
      </div>
    `);

    // getBoundingClientRect on the message element reflects its own box, not an unbroken word
    // overflowing it with the default visible overflow — scrollWidth catches that overflow instead.
    const overflows = await page.evaluate(() => {
      const message = document.querySelector('pds-radio .pds-radio__message')!;
      return message.scrollWidth > message.clientWidth;
    });

    expect(overflows).toBe(false);
  });
});

describe('pds-radio accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="opt-1" label="Option one"></pds-radio>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with an error message', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="opt-1" label="Option one" invalid error-message="Choose an option"></pds-radio>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-radio reduced motion', () => {
  it('zeroes out the image-container transition under prefers-reduced-motion', async () => {
    const page = await newE2EPage();
    // .pds-radio__image-container only renders when an [slot="image"] is present.
    await page.setContent(
      '<pds-radio component-id="opt-1" label="Option one"><span slot="image"></span></pds-radio>',
    );
    await expectRespectsReducedMotion(page, 'pds-radio', '.pds-radio__image-container');
  });
});

// A DOM morph makes the host match the server's HTML, which has none of the classes and styles
// pds-radio wrote, including the ones its CSS selects on.
describe('pds-radio after its host classes and styles are stripped', () => {
  it('keeps its styling', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio class="consumer" component-id="radio" label="Radio" invalid has-border></pds-radio>');

    await expectStylingSurvivesStrip(page, 'pds-radio');
  });

  // Only its own scope classes come back: another `sc-` class may be a consumer's, such as a
  // styled-components id, and removing it on purpose has to stick.
  it("leaves a consumer's sc- class removed", async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio class="sc-abc123" component-id="radio" label="Radio"></pds-radio>');

    await page.$eval('pds-radio', (el) => el.setAttribute('class', ''));
    await page.waitForChanges();

    const classes = await page.$eval('pds-radio', (el) => Array.from(el.classList));
    expect(classes).not.toContain('sc-abc123');
    expect(classes).toEqual(expect.arrayContaining(['hydrated', 'sc-pds-radio-h']));
  });
});

describe('pds-radio pill variant', () => {
  const pillStyle = (page, selector: string) =>
    page.$eval(selector, (el) => {
      const label = el.querySelector('label');
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

  const group = `
    <pds-radio-group name="plan" group-label="Plan" direction="row">
      <pds-radio component-id="free" value="free" label="Free" variant="pill"></pds-radio>
      <pds-radio component-id="pro" value="pro" label="Pro" variant="pill"></pds-radio>
      <pds-radio component-id="team" value="team" label="Team" variant="pill"></pds-radio>
    </pds-radio-group>
  `;

  it('checks the radio when the pill is clicked, without resizing it', async () => {
    const page = await newE2EPage();
    await page.setContent(group);
    // Measure after the web font settles, so a late font swap doesn't read as a resize.
    await page.evaluate(() => document.fonts.ready);

    const before = await pillStyle(page, 'pds-radio:first-of-type');
    await page.click('pds-radio:first-of-type label');
    await page.waitForChanges();
    const after = await pillStyle(page, 'pds-radio:first-of-type');

    expect(await page.$eval('#free', (el: HTMLInputElement) => el.checked)).toBe(true);
    expect(after.boxShadow).not.toBe('none');
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
  });

  it('shows no focus ring on a mouse click', async () => {
    const page = await newE2EPage();
    await page.setContent(group);

    await page.click('pds-radio:first-of-type label');
    await page.waitForChanges();

    expect((await pillStyle(page, 'pds-radio:first-of-type')).outlineStyle).toBe('none');
  });

  it('moves the checked radio with arrow keys and shows the focus ring', async () => {
    const page = await newE2EPage();
    await page.setContent(`<button>before</button>${group}`);

    await page.focus('button');
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await page.waitForChanges();

    expect(await page.$eval('#pro', (el: HTMLInputElement) => el.checked)).toBe(true);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('pro');
    expect((await pillStyle(page, 'pds-radio:nth-of-type(2)')).outlineStyle).toBe('solid');
  });

  it('submits the checked value with the form', async () => {
    const page = await newE2EPage();
    await page.setContent(`<form>${group}</form>`);

    await page.click('pds-radio:nth-of-type(3) label');
    await page.waitForChanges();

    const value = await page.$eval('form', (form: HTMLFormElement) => new FormData(form).get('plan'));
    expect(value).toBe('team');
  });

  it('follows the theme in dark mode', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio id="light" component-id="light" label="Light" variant="pill" checked></pds-radio>
      <div data-theme="dark">
        <pds-radio id="dark" component-id="dark" label="Dark" variant="pill" checked></pds-radio>
      </div>
    `);

    const light = await pillStyle(page, '#light');
    const dark = await pillStyle(page, '#dark');
    expect(dark.borderColor).not.toBe(light.borderColor);
  });

  it('has no axe violations in a group', async () => {
    const page = await newE2EPage();
    await page.setContent(group);
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('looks disabled and ignores clicks', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio id="free" component-id="free" value="free" label="Free" variant="pill"></pds-radio>
      <pds-radio id="pro" component-id="pro" value="pro" label="Pro" variant="pill" disabled></pds-radio>
    `);

    const enabled = await pillStyle(page, '#free');
    const disabled = await pillStyle(page, '#pro');
    expect(disabled.borderColor).not.toBe(enabled.borderColor);

    await page.click('#pro label');
    await page.waitForChanges();
    expect(await page.$eval('#pro', (el: HTMLInputElement) => el.checked)).toBe(false);
  });

  // Unlike the checkbox pill, an invalid radio pill has no border rule: it shows only the
  // error message, as pds-radio.mdx documents.
  it('shows only the error message when invalid, with no border change', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <pds-radio id="free" component-id="free" value="free" label="Free" variant="pill"></pds-radio>
      <pds-radio
        id="pro"
        component-id="pro"
        value="pro"
        label="Pro"
        variant="pill"
        invalid
        error-message="Pick a plan"
      ></pds-radio>
    `);

    const valid = await pillStyle(page, '#free');
    const invalid = await pillStyle(page, '#pro');
    expect(invalid.borderColor).toBe(valid.borderColor);

    const message = await page.find('#pro .pds-radio__message--error');
    expect(message.textContent).toContain('Pick a plan');
  });

  // The CDP forced-colors emulation below only takes effect on content rendered after it's set;
  // setting it after setContent() leaves a pill showing its normal, unremapped colors, so every
  // forced-colors test here sets it up first.
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
    await page.setContent(`<button>before</button>${group}`);
    await page.waitForChanges();

    await page.click('pds-radio:first-of-type label');
    await page.waitForChanges();
    const checkedOnly = await pillStyle(page, 'pds-radio:first-of-type');

    await page.focus('button');
    await page.keyboard.press('Tab');
    await page.waitForChanges();
    const checkedAndFocused = await pillStyle(page, 'pds-radio:first-of-type');

    expect(checkedOnly.outlineStyle).toBe('none');
    expect(checkedAndFocused.outlineStyle).toBe('solid');
  });

  it('distinguishes checked, disabled and disabled-checked pills by color and border width in forced-colors mode', async () => {
    const page = await forcedColorsPage();
    await page.setContent(`
      <pds-radio id="checked" component-id="checked" value="checked" label="Checked" variant="pill" checked></pds-radio>
      <pds-radio id="disabled" component-id="disabled" value="disabled" label="Disabled" variant="pill" disabled></pds-radio>
      <pds-radio id="disabled-checked" component-id="disabled-checked" value="disabled-checked" label="Disabled checked" variant="pill" disabled checked></pds-radio>
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

  // Regression: the thicker forced-colors checked border grew the pill, since its label has no
  // explicit width for box-sizing: border-box to hold steady — the same resize this pill design
  // avoids outside forced-colors with an inset ring instead of a border change.
  it('does not resize a pill when its thicker forced-colors checked border appears', async () => {
    const page = await forcedColorsPage();
    await page.setContent(group);
    await page.evaluate(() => document.fonts.ready);

    const before = await pillStyle(page, 'pds-radio:first-of-type');
    await page.click('pds-radio:first-of-type label');
    await page.waitForChanges();
    const after = await pillStyle(page, 'pds-radio:first-of-type');

    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
  });
});
