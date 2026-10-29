import { newE2EPage } from '@stencil/core/testing';
import { formatViolations, runAxe } from '../../../utils/test/axe';

describe('pds-avatar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar></pds-avatar>');

    const element = await page.find('pds-avatar');
    expect(element).toHaveClass('hydrated');
  });

  it('renders admin variant with correct class', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar variant="admin"></pds-avatar>');

    const component = await page.find('pds-avatar');
    expect(component).toHaveClass('pds-avatar--admin');
  });

  it('renders avatar with size prop and correct corresponding style', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar size="xl"></pds-avatar>');

    const div = (await page.find('pds-avatar')).shadowRoot.querySelector('div');
    expect(div).toEqualAttribute('style', 'height: 64px; width: 64px;');
  });

  it('should render image when prop is set and not render default icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar image="https://placehold.co/64x64"></pds-avatar>');

    const image = await page.find('pds-avatar >>> img');

    await page.waitForChanges();
    expect(image).not.toBeNull();

    const avatar = await page.find('pds-avatar');
    expect(avatar.shadowRoot.querySelector('pds-icon')).toBeNull();
  });

  it('restores the default size and variant when those attributes are removed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar size="xs" variant="admin"></pds-avatar>');
    const element = await page.find('pds-avatar');

    element.removeAttribute('size');
    element.removeAttribute('variant');
    await page.waitForChanges();

    expect(element).toEqualAttribute('size', 'lg');
    expect(element).toEqualAttribute('variant', 'customer');
  });

  it('takes a new size and variant after the default attributes are removed', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar></pds-avatar>');
    const element = await page.find('pds-avatar');

    // The attributes hold Pine's reflected defaults, the case a Turbo morph hits.
    element.removeAttribute('size');
    element.removeAttribute('variant');
    await page.waitForChanges();

    expect(element).toEqualAttribute('size', 'lg');
    expect(element).toEqualAttribute('variant', 'customer');

    element.setProperty('size', 'xs');
    element.setProperty('variant', 'admin');
    await page.waitForChanges();

    expect(await element.getProperty('size')).toBe('xs');
    expect(await element.getProperty('variant')).toBe('admin');
    expect(element).toEqualAttribute('size', 'xs');
    expect(element).toEqualAttribute('variant', 'admin');
  });

  // A null write strips the reflected attribute; it mustn't make the next write fall back too.
  it('resets size and variant set to null, and takes the next value', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar size="xs" variant="admin"></pds-avatar>');
    const element = await page.find('pds-avatar');

    element.setProperty('size', null);
    element.setProperty('variant', null);
    await page.waitForChanges();

    expect(await element.getProperty('size')).toBe('lg');
    expect(await element.getProperty('variant')).toBe('customer');
    expect(element).toEqualAttribute('size', 'lg');
    expect(element).toEqualAttribute('variant', 'customer');

    element.setProperty('size', 'sm');
    element.setProperty('variant', 'admin');
    await page.waitForChanges();

    expect(await element.getProperty('size')).toBe('sm');
    expect(await element.getProperty('variant')).toBe('admin');
  });
});

describe('pds-avatar accessibility', () => {
  it('has no axe violations', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar image="/avatar.jpg" alt="Jane Doe"></pds-avatar>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations without an image', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar></pds-avatar><pds-avatar dropdown></pds-avatar>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});

describe('pds-avatar badge label', () => {
  it('gives the badge an accessible name', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar badge="true"></pds-avatar>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });

  it('has no axe violations with initials and a badge', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-avatar badge="true" initials="QJ"></pds-avatar>');
    const violations = await runAxe(page);
    expect(formatViolations(violations)).toBe('');
  });
});
