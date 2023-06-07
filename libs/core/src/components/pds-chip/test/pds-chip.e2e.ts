import { newE2EPage } from '@stencil/core/testing';

describe('pds-chip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip />');

    const element = await page.find('pds-chip');
    expect(element).toHaveClass('hydrated');
  });

  it('emits "pdsTagCloseClick" event when close button is clicked in tag variant', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" label="Tag Chip" />');

    const closeBtn = await page.find('pds-chip >>> .pds-chip__close');
    const eventSpy = await page.spyOnEvent('pdsTagCloseClick');
    await closeBtn.click();

    expect(eventSpy).toHaveReceivedEvent();
  });
});
