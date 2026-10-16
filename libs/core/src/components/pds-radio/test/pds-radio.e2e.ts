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
});
