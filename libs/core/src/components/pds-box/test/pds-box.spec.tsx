import { newSpecPage } from '@stencil/core/testing';
import { PdsBox } from '../pds-box';

describe('pds-box', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box></pds-box>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('renders a border-color when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box border-color="#dedede"></pds-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', 'border-color: #dedede;');
  });
  
  it('renders a min-height when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box min-height="175px"></pds-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', 'min-height: 175px;');
  });

  it('renders a min-width when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box min-width="300px"></pds-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', 'min-width: 300px;');
  });

  it('renders align-items class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box align-items="center"></pds-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-align-items-center');
  });

  // FINISH REST OF TESTS FOR CLASS EXISTENCE
});
