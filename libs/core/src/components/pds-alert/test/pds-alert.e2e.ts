import { newE2EPage } from '@stencil/core/testing';

describe('pds-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert></pds-alert>');

    const element = await page.find('pds-alert');
    expect(element).toHaveClass('hydrated');
  });

  it('emits "pdsAlertCloseClick" event when dismiss button is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-alert dismissible="true" description="Test alert with dismiss button"></pds-alert>');

    const closeBtn = await page.find('pds-alert >>> .pds-alert__close');
    const eventSpy = await page.spyOnEvent('pdsAlertCloseClick');
    await closeBtn.click();

    expect(eventSpy).toHaveReceivedEvent();
  });
});
