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

  // Test all align-items values
  ['start', 'center', 'end', 'baseline', 'stretch'].forEach((value) => {
    it(`renders align-items class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-items="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-items-${value}`);
    });

    it(`renders align-items-xs class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-items-xs="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-items-xs-${value}`);
    });

    it(`renders align-items-sm class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-items-sm="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-items-sm-${value}`);
    });

    it(`renders align-items-md class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-items-md="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-items-md-${value}`);
    });

    it(`renders align-items-lg class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-items-lg="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-items-lg-${value}`);
    });

    it(`renders align-items-xl class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-items-xl="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-items-xl-${value}`);
    });
  });

  it('renders align-self class when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box align-self="center"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-align-self-center');
  });

  // Test all align-self values
  ['start', 'center', 'end', 'baseline', 'stretch'].forEach((value) => {
    it(`renders align-self class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-self="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-self-${value}`);
    });

    it(`renders align-self-xs class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-self-xs="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-self-xs-${value}`);
    });

    it(`renders align-self-sm class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-self-sm="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-self-sm-${value}`);
    });

    it(`renders align-self-md class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-self-md="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-self-md-${value}`);
    });

    it(`renders align-self-lg class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-self-lg="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-self-lg-${value}`);
    });

    it(`renders align-self-xl class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box align-self-xl="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-align-self-xl-${value}`);
    });
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

  it('passes through var(...) for background-color', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box background-color="var(--pine-color-green-400)"></pds-box>`,
    });

    const element = page.root;
    expect(element).toEqualAttribute('style', '--color-background-box: var(--pine-color-green-400);');
  });

  it('omits background-color when whitespace-only is provided', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box background-color="   "></pds-box>`,
    });

    const element = page.root;
    expect(element).not.toHaveAttribute('style');
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

  it('passes through var(...) for border-color', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box border-color="var(--pine-color-green-400)"></pds-box>`,
    });

    const element = page.root;
    expect(element).toEqualAttribute('style', '--color-border-box: var(--pine-color-green-400);');
  });

  it('omits border-color when whitespace-only is provided', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box border-color="   "></pds-box>`,
    });

    const element = page.root;
    expect(element).not.toHaveAttribute('style');
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

  it('renders flex class when prop is set to none', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box flex="none"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box--flex-none');
  });

  it('renders flex class when prop is set to shrink', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box flex="shrink"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box--flex-shrink');
  });

  it('renders custom flex value as inline style when prop is set to "1"', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box flex="1"></pds-box>`,
    });

    const element = page.root;

    expect(element).toEqualAttribute('style', 'flex: 1;');
    expect(element).not.toHaveClass('pds-box--flex-1');
  });

  it('renders custom flex value as inline style when prop is set to "2"', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box flex="2"></pds-box>`,
    });

    const element = page.root;

    expect(element).toEqualAttribute('style', 'flex: 2;');
    expect(element).not.toHaveClass('pds-box--flex-2');
  });

  it('renders custom flex value as inline style when prop is set to "0 1 auto"', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box flex="0 1 auto"></pds-box>`,
    });

    const element = page.root;

    expect(element).toEqualAttribute('style', 'flex: 0 1 auto;');
    expect(element).not.toHaveClass('pds-box--flex-0 1 auto');
  });

  it('renders custom flex value as inline style when prop is set to "0 0 200px"', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box flex="0 0 200px"></pds-box>`,
    });

    const element = page.root;

    expect(element).toEqualAttribute('style', 'flex: 0 0 200px;');
    expect(element).not.toHaveClass('pds-box--flex-0 0 200px');
  });

  it('combines custom flex value with other inline styles', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box flex="1" background-color="#ff0000" min-height="100px"></pds-box>`,
    });

    const element = page.root;

    const styleAttr = element?.getAttribute('style');
    expect(styleAttr).toContain('flex: 1');
    expect(styleAttr).toContain('--color-background-box: #ff0000');
    expect(styleAttr).toContain('--sizing-min-height-box: 100px');
  });

  it('renders justify-content class when prop is set to center', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box justify-content="center"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-justify-content-center');
  });

  // Test all justify-content values
  ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'].forEach((value) => {
    it(`renders justify-content class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box justify-content="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-justify-content-${value}`);
    });

    it(`renders justify-content-xs class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box justify-content-xs="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-justify-content-xs-${value}`);
    });

    it(`renders justify-content-sm class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box justify-content-sm="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-justify-content-sm-${value}`);
    });

    it(`renders justify-content-md class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box justify-content-md="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-justify-content-md-${value}`);
    });

    it(`renders justify-content-lg class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box justify-content-lg="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-justify-content-lg-${value}`);
    });

    it(`renders justify-content-xl class when prop is set to ${value}`, async () => {
      const page = await newSpecPage({
        components: [PdsBox],
        html: `<pds-box justify-content-xl="${value}"></pds-box>`,
      });

      const element = page.root;
      expect(element).toHaveClass(`pds-justify-content-xl-${value}`);
    });
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

  it('normalizes background-color when raw token is provided', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box background-color="--pine-color-green-400"></pds-box>`,
    });

    const element = page.root;
    expect(element).toEqualAttribute('style', '--color-background-box: var(--pine-color-green-400);');
  });

  it('normalizes border-color when raw token is provided', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box border-color="--pine-color-green-400"></pds-box>`,
    });

    const element = page.root;
    expect(element).toEqualAttribute('style', '--color-border-box: var(--pine-color-green-400);');
  });

  it('should normalize raw token values for backgroundColor', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box background-color="--pine-color-green-400"></pds-box>`,
    });
    expect(page.root.style.cssText).toContain('--color-background-box: var(--pine-color-green-400);');
  });

  it('should normalize raw token values for borderColor', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box border-color="--pine-color-blue-400"></pds-box>`,
    });
    expect(page.root.style.cssText).toContain('--color-border-box: var(--pine-color-blue-400);');
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

  it('renders wrap class when prop is set to true', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box wrap="true"></pds-box>`,
    });

    const element = page.root;

    expect(element).toHaveClass('pds-box--wrap');
  });

  it('does not render wrap class when prop is set to false', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box wrap="false"></pds-box>`,
    });

    const element = page.root;

    expect(element).not.toHaveClass('pds-box--wrap');
  });

  it('does not render wrap class when prop is not set', async () => {
    const page = await newSpecPage({
      components: [PdsBox],
      html: `<pds-box></pds-box>`,
    });

    const element = page.root;

    expect(element).not.toHaveClass('pds-box--wrap');
  });
});
