import { newE2EPage } from '@stencil/core/testing';

describe('sage-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card></sage-card>');

    const element = await page.find('sage-card');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with custom background color', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card bg-color="#ff0000"></sage-card>');

    const element = await page.find('sage-card');
    const elementStyle = await element.getComputedStyle();
    const backgroundColor = elementStyle.getPropertyValue('background-color');

    expect(backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('renders without border', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card border="false"></sage-card>');

    const element = await page.find('sage-card');
    expect(element).not.toHaveClass('has-border');
  });

  it('renders with small padding', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card padding="sm"></sage-card>');

    const element = await page.find('sage-card');
    expect(element).toHaveClass('sage-card--padding-sm');
  });

  it('renders with medium padding', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card></sage-card>');

    const element = await page.find('sage-card');
    expect(element).toHaveClass('sage-card--padding-md');
  });

  it('renders without padding', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card padding="none"></sage-card>');

    const element = await page.find('sage-card');
    expect(element).not.toHaveClass('sage-card--padding-sm');
    expect(element).not.toHaveClass('sage-card--padding-md');
  });

  it('renders with small shadow', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card shadow="sm"></sage-card>');

    const element = await page.find('sage-card');
    expect(element).toHaveClass('sage-card--shadow-sm');
  });

  it('renders with medium shadow', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card shadow="md"></sage-card>');

    const element = await page.find('sage-card');
    expect(element).toHaveClass('sage-card--shadow-md');
  });

  it('renders with large shadow', async () => {
    const page = await newE2EPage();
    await page.setContent('<sage-card shadow="lg"></sage-card>');

    const element = await page.find('sage-card');
    expect(element).toHaveClass('sage-card--shadow-lg');
  });
});
