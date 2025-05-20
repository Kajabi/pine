import { newE2EPage } from '@stencil/core/testing';

describe('pds-banner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-banner></pds-banner>');

    const element = await page.find('pds-banner');
    expect(element).toHaveClass('hydrated');
  });

  it('renders a dismissable banner when the dismissable prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-banner dismissable></pds-banner>');

    const closeButton = await page.find('pds-banner >>> .pds-banner__close');
    expect(closeButton).toBeTruthy();
  });

  it('dismisses a banner when the close button is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-banner active dismissable></pds-banner>');

    const banner = await page.find('pds-banner');

    expect(banner).toHaveClass('pds-banner--active');

    const closeButton = await page.find('pds-banner >>> .pds-banner__close');
    await closeButton.click();

    await page.waitForChanges();

    expect(banner).not.toHaveClass('pds-banner--active');
  });

  it('emits a pdsDismiss event when the close button is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-banner active dismissable></pds-banner>');

    const eventSpy = await page.spyOnEvent('pdsDismiss');

    const closeButton = await page.find('pds-banner >>> .pds-banner__close');
    await closeButton.click();

    expect(eventSpy).toHaveReceivedEvent();
  });

  it('emits a pdsBannerActivated event when the banner is activated', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-banner></pds-banner>');

    const eventSpy = await page.spyOnEvent('pdsBannerActivated');

    const banner = await page.find('pds-banner');
    banner.setAttribute('active', true);

    await page.waitForChanges();

    expect(eventSpy).toHaveReceivedEvent();
  });

  it('dismisses a banner when another banner is activated', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-banner component-id="banner-1" active></pds-banner><pds-banner component-id="banner-2"></pds-banner>');

    const eventSpy = await page.spyOnEvent('pdsBannerActivated');

    const banner1 = await page.find('#banner-1');
    expect(banner1).toHaveClass('pds-banner--active');
    const banner2 = await page.find('#banner-2');
    banner2.setAttribute('active', true);

    await page.waitForChanges();

    expect(eventSpy).toHaveReceivedEvent();
    expect(banner1).not.toHaveClass('pds-banner--active');
    expect(banner2).toHaveClass('pds-banner--active');
  });
});
