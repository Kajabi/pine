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

  it('renders close button as link when remove-url is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" remove-url="/filters/remove/1">Filter</pds-chip>');

    const closeLink = await page.find('pds-chip >>> .pds-chip__close');
    expect(closeLink.tagName).toBe('A');
    expect(await closeLink.getAttribute('href')).toBe('/filters/remove/1');
  });

  it('adds data-method attributes when remove-http-method is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" remove-url="/tags/1" remove-http-method="delete">Tag</pds-chip>');

    const closeLink = await page.find('pds-chip >>> .pds-chip__close');
    expect(await closeLink.getAttribute('data-method')).toBe('delete');
    expect(await closeLink.getAttribute('data-turbo-method')).toBe('delete');
    expect(await closeLink.getAttribute('rel')).toBe('nofollow');
  });

  it('adds target attribute when remove-target is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" remove-url="/clear" remove-target="_blank">Clear</pds-chip>');

    const closeLink = await page.find('pds-chip >>> .pds-chip__close');
    expect(await closeLink.getAttribute('target')).toBe('_blank');
  });

  it('emits "pdsTagCloseClick" event when close link is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-chip variant="tag" remove-url="/filters/remove/1">Filter</pds-chip>');

    const closeLink = await page.find('pds-chip >>> .pds-chip__close');
    const eventSpy = await page.spyOnEvent('pdsTagCloseClick');
    await closeLink.click();

    expect(eventSpy).toHaveReceivedEvent();
  });
});
