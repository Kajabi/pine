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

    expect(element).toEqualAttribute('style', '--color-border-box: #dedede;');
  });

  it('renders a min-height when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box min-height="175px"></pds-box>`,
    });

    const element = page.root;

    expect(element).toEqualAttribute('style', '--sizing-min-height-box: 175px;');
  });

  it('renders a min-width when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box min-width="300px"></pds-box>`,
    });

    const element = page.root;

    expect(element).toEqualAttribute('style', '--sizing-min-width-box: 300px;');
  });

  it('renders align-items class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box align-items="center"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-align-items-center');
  });

  it('renders align-self class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box align-self="center"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-align-self-center');
  });

  it('renders auto class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box auto="true"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box--auto');
  });

  it('renders background-color class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box background-color="#dedede"></pds-box>`,
    });

    const element = page.root;

    expect(element).toEqualAttribute('style', '--color-background-box: #dedede;');
  });

  it('renders border class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box border="true"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box--border');
  });

  it('renders border-color class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box border-color="#dedede"></pds-box>`,
    });

    const element = page.root;

    expect(element).toEqualAttribute('style', '--color-border-box: #dedede;');
  });

  it('renders border-radius class when prop is set to none', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box border-radius="none"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-border-radius-none');
  });

  it('renders direction class when prop is set to column', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box direction="column"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-direction-column');
  });

  it('renders display class when prop is set to inline-block', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box display="inline-block"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box--display-inline-block');
  });

  it('renders fit class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box fit="true"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box--fit');
  });

  it('renders gap class when prop is set to xs', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box gap="xs"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-gap-xs');
  });

  it('renders flex class when prop is set to grow', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box flex="grow"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box--flex-grow');
  });

  it('renders justify-content class when prop is set to center', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box justify-content="center"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-justify-content-center');
  });

  it('renders offset class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box offset="2"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-offset-2');
  });

  it('renders offset-xs class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box offset-xs="2"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-offset-xs-2');
  });

  it('renders offset-sm class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box offset-sm="2"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-offset-sm-2');
  });

  it('renders offset-md class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box offset-md="2"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-offset-md-2');
  });

  it('renders offset-lg class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box offset-lg="2"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-offset-lg-2');
  });

  it('renders offset-xl class when prop is set to 2', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box offset-xl="2"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-offset-xl-2');
  });

  [  'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' ].forEach((size) => {
    it(`renders margin-block-start class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box margin-block-start="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-margin-block-start-${size}`);
    });

    it(`renders margin-inline-start class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box margin-inline-start="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-margin-inline-start-${size}`);
    });

    it(`renders margin-inline-end class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box margin-inline-end="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-margin-inline-end-${size}`);
    });

    it(`renders margin-block-end class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box margin-block-end="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-margin-block-end-${size}`);
    });

    it(`renders padding class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box padding="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-padding-${size}`);
    });

    it(`renders padding-block-start class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box padding-block-start="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-padding-block-start-${size}`);
    });

    it(`renders padding-block-end class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box padding-block-end="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-padding-block-end-${size}`);
    });

    it(`renders padding-inline-start class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box padding-inline-start="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-padding-inline-start-${size}`);
    });

    it(`renders padding-inline-end class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box padding-inline-end="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-padding-inline-end-${size}`);
    });

    it(`renders gap class when prop is set to ${size}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box gap="${size}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-box-gap-${size}`);
    });
  });


  it('renders shadow class when prop is set to xs', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box shadow="xs"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-shadow-xs');
  });

  it('renders size class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box size="6"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClasses(['pds-box', 'pds-box-6']);
  });

  it('renders size-xs class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box size-xs="6"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-xs-6');
  });

  it('renders size-sm class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box size-sm="6"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-sm-6');
  });

  it('renders size-md class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box size-md="6"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-md-6');
  });

  it('renders size-lg class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box size-lg="6"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-lg-6');
  });

  it('renders size-lg class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box size-lg="6"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-lg-6');
  });

  it('renders size-xl class when prop is set to 6', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box size-xl="6"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box-xl-6');
  });

  it('renders layout-box class when no size prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box');
  });
});
