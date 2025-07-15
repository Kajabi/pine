import { newE2EPage } from '@stencil/core/testing';

describe('pds-textarea', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea name="foo"></pds-textarea>');
    await page.waitForChanges();
    const element = await page.find('pds-textarea');

    expect(element).toHaveClass('hydrated');
  });

  it('renders a value and updates', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea name="foo" required="true"></pds-textarea> <button>test</button>');
    const textarea = await page.find('pds-textarea >>> textarea');
    const button = await page.find('button');

    let value = await textarea.getProperty('value');
    expect(value).toBe('');

    await textarea.focus();
    await page.waitForChanges();

    const event = await page.spyOnEvent('pdsTextareaChange');
    await page.keyboard.type('Hello');
    await page.waitForChanges();
    await button.focus();
    await page.waitForChanges();

    value = await textarea.getProperty('value');

    expect(value).toBe('Hello');
    expect(event).toHaveReceivedEvent();
  });

  it('renders action slot content when provided', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-textarea label="Description">
          <span slot="action">0/500</span>
        </pds-textarea>
      `);

    const actionSlot = await page.find('pds-textarea >>> .pds-textarea__action');
    expect(actionSlot).not.toBeNull();

    const slotContent = await page.find('pds-textarea span[slot="action"]');
    expect(await slotContent.innerText).toBe('0/500');
  });

  it('does not render action wrapper when no action content is provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<pds-textarea label="Description"></pds-textarea>');

    const actionSlot = await page.find('pds-textarea >>> .pds-textarea__action');
    expect(actionSlot).toBeNull();
  });

  it('sets has-action attribute when action slot has content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <pds-textarea label="Comments">
          <a slot="action" href="#">View guidelines</a>
        </pds-textarea>
      `);

    const component = await page.find('pds-textarea');
    expect(component).toHaveAttribute('has-action');
    expect(await component.getAttribute('has-action')).toBe('true');
  });
});
