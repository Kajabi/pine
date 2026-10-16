import { newE2EPage } from '@stencil/core/testing';
import { expectStylingSurvivesStrip } from '../../../utils/test/host-strip';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-progress', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-progress></pds-progress>');

    const element = await page.find('pds-progress');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with a custom percent values', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-progress percent="25"></pds-progress>');

    const element = await page.find('pds-progress >>> progress');
    expect(element.getAttribute('value')).toBe('25');
  });

  it('updates the percent value properly', async () => {
    const page = await newE2EPage();
    await page.setContent(`<pds-progress percent="50"></pds-progress>`);

    const element = await page.find('pds-progress');
    expect(await element.getProperty('percent')).toBe(50);

    element.setProperty('percent', 75);
    await page.waitForChanges();

    expect(await element.getProperty('percent')).toBe(75);
  });

  it('renders with a custom label', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-progress label="custom label test"></pds-progress>');

    const element = await page.find('pds-progress >>> label');
    expect(element.textContent).toBe('custom label test');
  });

  it('renders with visible percent text', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-progress show-percent="true" percent="23"></pds-progress>');

    const element = await page.find('pds-progress >>> .pds-progress__percentage');
    expect(element.textContent).toBe('23%');
  });
});

describe('pds-progress accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-progress component-id="upload" label="Upload progress" percent="25"></pds-progress>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

// A DOM morph makes the host match the server's HTML, which has none of the classes and styles
// pds-progress wrote, including the ones its CSS selects on.
describe('pds-progress after its host classes and styles are stripped', () => {
  it('keeps its styling', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-progress class="consumer" component-id="progress" label="Progress" percent="50" animated></pds-progress>');

    await expectStylingSurvivesStrip(page, 'pds-progress');
  });
});
