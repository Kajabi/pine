import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link></pds-link>');
    const element = await page.find('pds-link');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the href', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link href="#some-bookmark-link"></pds-link>');
    const component = await page.find('pds-link');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-link >>> a');
    expect(element.textContent).toEqual(`#some-bookmark-link`);

    component.setProperty('href', '#my-new-bookmark');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`#my-new-bookmark`);
  });

  it('renders the slot when used', async () => {
    const page = await newE2EPage();

    await page.setContent('<pds-link href="#some-bookmark-link">This is slot content</pds-link>');
    const component = await page.find('pds-link');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('pds-link');
    expect(element.textContent).toEqual(`This is slot content`);
  });
});

describe('pds-link accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-link href="#section">Read more</pds-link>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-link external label', () => {
  const linkNames = (node) => [node.role === 'link' ? node.name : null, ...(node.children ?? []).flatMap(linkNames)].filter(Boolean);

  it('tells screen reader users an external link opens in a new tab', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-link href="https://example.com" external>Docs</pds-link>');

    const tree = await page.accessibility.snapshot();
    expect(linkNames(tree)).toEqual(['Docs (opens in a new tab)']);
  });

  it('has no axe violations on an external link', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-link href="https://example.com" external>Docs</pds-link>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
