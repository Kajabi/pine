import { newE2EPage } from '@stencil/core/testing';

describe('sage-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-link></sage-link>');
    const element = await page.find('sage-link');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<sage-link></sage-link>');
    const component = await page.find('sage-link');
    const element = await page.find('sage-link >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
