import { newE2EPage } from '@stencil/core/testing';

describe('pds-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card></pds-card>');

    const element = await page.find('pds-card');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with custom background color', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card bg-color="#ff0000"></pds-card>');

    const element = await page.find('pds-card');
    const elementStyle = await element.getComputedStyle();
    const backgroundColor = elementStyle.getPropertyValue('background-color');

    expect(backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('renders without border', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card border="false"></pds-card>');

    const element = await page.find('pds-card');
    expect(element).not.toHaveClass('has-border');
  });

  it('renders with small padding', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card padding="sm"></pds-card>');

    const element = await page.find('pds-card');
    expect(element).toHaveClass('pds-card--padding-sm');
  });

  it('renders with medium padding', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card></pds-card>');

    const element = await page.find('pds-card');
    expect(element).toHaveClass('pds-card--padding-md');
  });

  it('renders without padding', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card padding="none"></pds-card>');

    const element = await page.find('pds-card');
    expect(element).not.toHaveClass('pds-card--padding-sm');
    expect(element).not.toHaveClass('pds-card--padding-md');
  });

  it('renders with small shadow', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card shadow="sm"></pds-card>');

    const element = await page.find('pds-card');
    expect(element).toHaveClass('pds-card--shadow-sm');
  });

  it('renders with medium shadow', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card shadow="md"></pds-card>');

    const element = await page.find('pds-card');
    expect(element).toHaveClass('pds-card--shadow-md');
  });

  it('renders with large shadow', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-card shadow="lg"></pds-card>');

    const element = await page.find('pds-card');
    expect(element).toHaveClass('pds-card--shadow-lg');
  });
});
