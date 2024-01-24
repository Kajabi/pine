import { newSpecPage } from '@stencil/core/testing';
import { PdsPopover } from '../pds-popover';

describe('pds-popover', () => {
  it('should show arrow when has-arrow is true', async () => {
    const page = await newSpecPage({
      components: [PdsPopover],
      html: `
      <pds-popover has-arrow="true">
        <pds-button variant="secondary">Secondary</pds-button>
       </pds-popover>`
    });

    const element = page.root?.shadowRoot;

    expect(element?.querySelector('.pds-popover--no-arrow')).toBeNull();
  });

  it('should toggle popover visibility', async () => {
    const page = await newSpecPage({ 
      components: [PdsPopover],
      html: `
      <pds-popover placement="bottom-start" hoisted="true" html-content="true">
        <div slot="content">
          <p><strong>This is a popover</strong></p>
        </div>
        <pds-button variant="secondary">Click</pds-button>
      </pds-popover>`
    });
    const element = page.root;

    expect(element?.opened).toBe(false);

    await element?.togglePdsPopover();
    await element?.togglePdsPopover();

    expect(element?.opened).toBe(false);

    await element?.togglePdsPopover();

    expect(element?.opened).toBe(true);
  });

  it('should show popover', async () => {
    const page = await newSpecPage({ 
      components: [PdsPopover],
      html: `
      <pds-popover placement="bottom-start" hoisted="true" html-content="true">
        <div slot="content">
          <p><strong>This is a popover</strong></p>
        </div>
        <pds-button variant="secondary">Click</pds-button>
      </pds-popover>`
    });

    const element = page.root;

    expect(element?.opened).toBe(false);

    await element?.showPdsPopover();

    expect(element?.opened).toBe(true);
  });

  it('should hide popover', async () => {
    const page = await newSpecPage({ 
      components: [PdsPopover],
      html: `
      <pds-popover placement="bottom-start" hoisted="true" html-content="true">
        <div slot="content">
          <p><strong>This is a popover</strong></p>
        </div>
        <pds-button variant="secondary">Click</pds-button>
      </pds-popover>`
    });

    const element = page.root;

    element.opened = true;

    expect(element?.opened).toBe(true);

    await element?.hidePdsPopover();

    expect(element?.opened).toBe(false);
  });
});