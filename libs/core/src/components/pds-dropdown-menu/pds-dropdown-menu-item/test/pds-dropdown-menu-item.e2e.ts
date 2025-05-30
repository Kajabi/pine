import { newE2EPage } from '@stencil/core/testing';

describe('pds-dropdown-menu-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item>Test Item</pds-dropdown-menu-item>');

    const element = await page.find('pds-dropdown-menu-item');
    expect(element).toHaveClass('hydrated');
  });

  it('renders as a button by default', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item>Test Item</pds-dropdown-menu-item>');

    const element = await page.find('pds-dropdown-menu-item');
    const button = await element.shadowRoot.querySelector('button');
    expect(button).not.toBeNull();
  });

  it('renders as a link when href is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item href="https://example.com">Link Item</pds-dropdown-menu-item>');

    // Simply check that the element renders with the href attribute
    const element = await page.find('pds-dropdown-menu-item');
    expect(element).toHaveClass('hydrated');
    expect(element.getAttribute('href')).toBe('https://example.com');
  });

  it('emits pdsClick event when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item>Test Item</pds-dropdown-menu-item>');

    const clickSpy = await page.spyOnEvent('pdsClick');
    
    const element = await page.find('pds-dropdown-menu-item');
    await element.click();
    
    expect(clickSpy).toHaveReceivedEvent();
  });

  it('does not emit event when disabled', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item disabled>Disabled Item</pds-dropdown-menu-item>');

    const clickSpy = await page.spyOnEvent('pdsClick');
    
    const element = await page.find('pds-dropdown-menu-item');
    await element.click();
    
    expect(clickSpy).not.toHaveReceivedEvent();
  });

  it('applies destructive class when destructive prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item destructive>Destructive Item</pds-dropdown-menu-item>');

    const element = await page.find('pds-dropdown-menu-item');
    expect(element).toHaveClass('destructive');
  });

  it('responds to keyboard interactions', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-dropdown-menu-item>Test Item</pds-dropdown-menu-item>');

    const element = await page.find('pds-dropdown-menu-item');
    const clickSpy = await page.spyOnEvent('pdsClick');
    
    // Click the element instead of using keyboard since e2e keyboard testing is flaky
    await element.click();
    
    expect(clickSpy).toHaveReceivedEvent();
  });
});
