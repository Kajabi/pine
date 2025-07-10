import { newSpecPage } from '@stencil/core/testing';
import { PdsText } from '../pds-text';

describe('pds-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1">
        <mock:shadow-root>
          <h1 class="pds-text" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `);
  });

  it('renders with align class when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" align="center"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" align="center">
        <mock:shadow-root>
          <h1 class="pds-text pds-text--align-center" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `);
  })

  it('renders with predefined color style when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" color="accent"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" color="accent">
        <mock:shadow-root>
          <h1 class="pds-text" style="--color: var(--pine-color-text-accent);" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `)
  });

  it('renders with custom color style when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" color="var(--pine-color-green-400)"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" color="var(--pine-color-green-400)">
        <mock:shadow-root>
          <h1 class="pds-text" style="--color: var(--pine-color-green-400);" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `)
  })

  it('renders with size class when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" size="xl"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" size="xl">
        <mock:shadow-root>
          <h1 class="pds-text pds-text--size-xl" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `)
  });

  it('renders with weight class when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="h1" weight="bold"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="h1" weight="bold">
        <mock:shadow-root>
          <h1 class="pds-text pds-text--weight-bold" part="content"><slot></slot></h1>
        </mock:shadow-root>
      </pds-text>
    `)
  });

  it('renders with decoration class when prop is set', async ()=> {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p" decoration="underline-dotted"></pds-text>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-text tag="p" decoration="underline-dotted">
        <mock:shadow-root>
          <p class="pds-text pds-text--decoration-underline-dotted" part="content"><slot></slot></p>
        </mock:shadow-root>
      </pds-text>
    `)
  });

  it('renders with part attribute for external CSS targeting', async () => {
    const page = await newSpecPage({
      components: [PdsText],
      html: `<pds-text tag="p">Test content</pds-text>`,
    });
    
    expect(page.root).toBeTruthy();
    expect(page.root!.shadowRoot).toBeTruthy();
    
    const shadowRoot = page.root!.shadowRoot!;
    const contentElement = shadowRoot.querySelector('[part="content"]');
    
    expect(contentElement).toBeTruthy();
    expect(contentElement!.getAttribute('part')).toBe('content');
    expect(contentElement!.tagName.toLowerCase()).toBe('p');
  });
});
