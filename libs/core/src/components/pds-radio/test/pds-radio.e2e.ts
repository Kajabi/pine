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
    expect(card.offset).toBeGreaterThanOrEqual(2);
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

describe('pds-radio accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-radio component-id="opt-1" label="Option one"></pds-radio>');
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
