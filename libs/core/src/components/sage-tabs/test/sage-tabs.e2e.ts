import { newE2EPage } from '@stencil/core/testing';

const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
        const page = await browser.newPage();
        await page.goto('https://example.com');

    } catch (err) {
        console.log(err);
    }
})();
