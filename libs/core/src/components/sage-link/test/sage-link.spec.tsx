import { newSpecPage } from '@stencil/core/testing';
import { SageLink } from '../sage-link';

describe('sage-link', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SageLink],
      html: '<sage-link></sage-link>',
    });
    expect(root).toEqualHtml(`
      <sage-link>
        <mock:shadow-root>
          <a class="sage-link sage-link--inline sage-link--lg">
            <slot></slot>
          </a>
        </mock:shadow-root>
      </sage-link>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [SageLink],
      html: `<sage-link href="#"></sage-link>`,
    });
    expect(root).toEqualHtml(`
      <sage-link href="#">
        <mock:shadow-root>
          <a class="sage-link sage-link--inline sage-link--lg" href="#">
            <slot>
              #
            </slot>
          </a>
        </mock:shadow-root>
      </sage-link>
    `);
  });

  it('renders the svg when external is true', async () => {
    const { root } = await newSpecPage({
      components: [SageLink],
      html: `<sage-link href="#" external="true"></sage-link>`,
    });

    const svg = root.shadowRoot.querySelector('svg');
    expect(svg).not.toBeNull();

    const svgPath = svg.querySelector('path');

    const attr = svgPath.attributes.getNamedItem('d').value;
    expect(attr).toEqual(
      'M13.7458 0.75419C13.802 0.810351 13.8443 0.875115 13.8727 0.944239C13.9008 1.01249 13.9155 1.08498 13.9166 1.15765L13.9166 1.16766V5.83334C13.9166 6.1555 13.6555 6.41667 13.3333 6.41667C13.0111 6.41667 12.75 6.1555 12.75 5.83334V2.57496L7.32913 7.99581C7.10132 8.22362 6.73197 8.22362 6.50417 7.99581C6.27636 7.76801 6.27636 7.39866 6.50417 7.17086L11.925 1.75H8.66665C8.34448 1.75 8.08331 1.48884 8.08331 1.16667C8.08331 0.844503 8.34448 0.583336 8.66665 0.583336H13.3332H13.3333C13.4826 0.583336 13.6319 0.640286 13.7458 0.75419ZM1.66665 1.75C1.34448 1.75 1.08331 2.01117 1.08331 2.33333V12.8333C1.08331 13.1555 1.34448 13.4167 1.66665 13.4167H12.1666C12.4888 13.4167 12.75 13.1555 12.75 12.8333V8.75C12.75 8.42783 12.4888 8.16667 12.1666 8.16667C11.8445 8.16667 11.5833 8.42783 11.5833 8.75V12.25H2.24998V2.91666H5.74998C6.07215 2.91666 6.33331 2.6555 6.33331 2.33333C6.33331 2.01117 6.07215 1.75 5.74998 1.75H1.66665Z'
    );
  });

  it('renders class name when size is assigned', async () => {
    const { root } = await newSpecPage({
      components: [SageLink],
      html: `<sage-link href="#" font-size="md" external="true" />`,
    });

    const linkTag = root.shadowRoot.querySelector('a.sage-link--md');
    expect(linkTag).not.toBeNull();
  });

  it('renders "variant" class name when variant property is assigned', async () => {
    const { root } = await newSpecPage({
      components: [SageLink],
      html: `<sage-link href="#" variant="plain" />`,
    });

    const linkTag = root.shadowRoot.querySelector('a.sage-link--plain');
    expect(linkTag).not.toBeNull();
  });
});
