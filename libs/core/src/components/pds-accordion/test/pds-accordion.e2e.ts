import { newE2EPage } from '@stencil/core/testing';

describe('pds-accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-accordion></pds-accordion>');

    const element = await page.find('pds-accordion');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with open attribute when prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-accordion open></pds-accordion>');

    const hostEl = await page.find('pds-accordion');
    const details = await page.find('pds-accordion >>> details');

    expect(hostEl).toHaveAttribute('open');
    expect(details).toHaveAttribute('open');
  });

  it('should toggle open attribute when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-accordion></pds-accordion>');

    const hostEl = await page.find('pds-accordion');
    const details = await page.find('pds-accordion >>> details');

    expect(hostEl).not.toHaveAttribute('open');
    expect(details).not.toHaveAttribute('open');

    await details.click();

    expect(hostEl).toHaveAttribute('open');
    expect(details).toHaveAttribute('open');

    await details.click();

    expect(hostEl).not.toHaveAttribute('open');
    expect(details).not.toHaveAttribute('open');
  });

  it('updates isOpen property when value is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-accordion></pds-accordion>');

    const el = (await page.find('pds-accordion'));
    expect(el).not.toHaveProperty('isOpen');

    el.setProperty('isOpen', true);
    await page.waitForChanges();

    expect(el.getProperty('isOpen')).toBeTruthy();
    expect(el).toHaveAttribute('open');
  });
  
  it('emits PdsAccordionToggle event when accordion is toggled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-accordion></pds-accordion>');

    const el = await page.find('pds-accordion');
    const toggleEvent = await el.spyOnEvent('pdsAccordionToggle');

    await el.click();
    await page.waitForChanges();

    expect(toggleEvent).toHaveReceivedEventDetail({ open: true });

    await el.click();
    await page.waitForChanges();

    expect(toggleEvent).toHaveReceivedEventDetail({ open: false });
  });
});
