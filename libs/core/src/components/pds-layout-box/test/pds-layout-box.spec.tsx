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

    expect(element).toEqualAttribute('style', '--box-border-color: #dedede;');
  });
  
  it('renders a min-height when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box min-height="175px"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', '--box-min-height: 175px;');
  });

  it('renders a min-width when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box min-width="300px"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', '--box-min-width: 300px;');
  });

  it('renders align-items class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box align-items="center"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-align-items-center');
  });

  it('renders auto class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box auto="true"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-layout-box--auto');
  });

  it('renders background-color class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box background-color="#dedede"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', '--box-background-color: #dedede;');
  });

  it('renders bordered class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box bordered="true"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-layout-box--bordered');
  });
  
  it('renders border-color class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box border-color="#dedede"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toEqualAttribute('style', '--box-border-color: #dedede;');
  });

  it('renders border-radius class when prop is set to none', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box border-radius="none"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-border-radius-none');
  });

  it('renders direction class when prop is set to column', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box direction="column"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-direction-column');
  });

  it('renders display class when prop is set to inline-block', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box display="inline-block"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-layout-box--display-inline-block');
  });

  it('renders fit class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box fit="true"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-layout-box--fit');
  });

  it('renders gap class when prop is set to xs', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box gap="xs"></pds-layout-box>`,
    });
    
    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-gap-xs');
  });

  it('renders flex class when prop is set to grow', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box flex="grow"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box--flex-grow');
  });

  it('renders justify-content class when prop is set to center', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box justify-content="center"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-justify-content-center');
  });

  it('renders offset class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box offset="2"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-offset-2');
  });

  it('renders offset-xs class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box offset-xs="2"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-offset-xs-2');
  });

  it('renders offset-sm class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box offset-sm="2"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-offset-sm-2');
  });

  it('renders offset-md class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box offset-md="2"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-offset-md-2');
  });

  it('renders offset-lg class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box offset-lg="2"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-offset-lg-2');
  });

  it('renders offset-xl class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box offset-xl="2"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-offset-xl-2');
  });

  it('renders padding class when prop is set to sm', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box padding="sm"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-padding-sm');
  });

  it('renders shadow class when prop is set to xs', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box shadow="xs"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-shadow-xs');
  });

  it('renders size class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box size="6"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClasses(['pds-layout-box', 'pds-layout-box-6']);
  });

  it('renders size-xs class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box size-xs="6"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-xs-6');
  });

  it('renders size-sm class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box size-sm="6"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-sm-6');
  });

  it('renders size-md class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box size-md="6"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-md-6');
  });

  it('renders size-lg class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box size-lg="6"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-lg-6');
  });

  it('renders size-lg class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box size-lg="6"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-lg-6');
  });

  it('renders size-xl class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box size-xl="6"></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box-xl-6');
  });

  it('renders layout-box class when no size prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsLayoutBox],
      html: `<pds-layout-box></pds-layout-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-layout-box');
  });
});
