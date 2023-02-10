import { newE2EPage } from '@stencil/core/testing';
// Import puppeteer
import puppeteer from 'puppeteer';

describe('sage-tabs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <sage-tabs active-tab="two" tablist-label="test label">
        <sage-tab slot="tabs" tab="one">Test</sage-tab>
        <sage-tab slot="tabs" tab="two">Test</sage-tab>
        <sage-tab slot="tabs" tab="three">Test</sage-tab>
        <sage-tab-panel slot="tabpanels" tab="one">Content 1</sage-tab-panel>
        <sage-tab-panel slot="tabpanels" tab="two">Content 2</sage-tab-panel>
        <sage-tab-panel slot="tabpanels" tab="three">Content 3</sage-tab-panel>
      </sage-tabs>
  `);
    const element = await page.find(`sage-tabs`);
    expect(element).toHaveClass('hydrated');
  });

  // it('renders tabs to tablist slot', async () => {
  //   const browser = await puppeteer.launch({
  //     headless: false,
  //     // slow down by 250ms
  //     slowMo: 250,
  //     devtools: true,
  //   });
  //   const page = await browser.newPage();
  //   await page.setContent(`
  //     <sage-tabs active-tab="two" tablist-label="test label">
  //       <sage-tab slot="tabs" tab="one">Test One</sage-tab>
  //       <sage-tab slot="tabs" tab="two">Test</sage-tab>
  //       <sage-tab slot="tabs" tab="three">Test</sage-tab>
  //       <sage-tab-panel slot="tabpanels" tab="one">Content 1</sage-tab-panel>
  //       <sage-tab-panel slot="tabpanels" tab="two">Content 2</sage-tab-panel>
  //       <sage-tab-panel slot="tabpanels" tab="three">Content 3</sage-tab-panel>
  //     </sage-tabs>
  // `);
  // });

});