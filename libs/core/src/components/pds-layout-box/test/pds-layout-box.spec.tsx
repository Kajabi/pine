import { newSpecPage } from '@stencil/core/testing';
import { PdsLayoutBox } from '../pds-layout-box';

describe('pds-layout-box', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box></pds-layout-box>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('renders a border-color when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box border-color="#dedede"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', 'border-color: #dedede;');
  });
  
  it('renders a min-height when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box min-height="175px"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', 'min-height: 175px;');
  });

  it('renders a min-width when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box min-width="300px"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', 'min-width: 300px;');
  });

  it('renders align-items class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box align-items="center"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-align-items-center');
  });

  // FINISH REST OF TESTS FOR CLASS EXISTENCE
});
