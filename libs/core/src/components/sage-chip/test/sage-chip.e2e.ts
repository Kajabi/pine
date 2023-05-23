import { newE2EPage } from '@stencil/core/testing';

describe('sage-chip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-chip />');

    const element = await page.find('sage-chip');
    expect(element).toHaveClass('hydrated');
  });

  it('emits "sageTagCloseClick" event when close button is clicked in tag variant', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-chip variant="tag" label="Tag Chip" />');

    const closeBtn = await page.find('sage-chip >>> .sage-chip__close');
    const eventSpy = await page.spyOnEvent('sageTagCloseClick');
    await closeBtn.click();

    expect(eventSpy).toHaveReceivedEvent();
  });
});
