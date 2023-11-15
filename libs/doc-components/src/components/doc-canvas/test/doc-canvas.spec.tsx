import { newSpecPage } from '@stencil/core/testing';
import { DocCanvas } from '../doc-canvas';

describe('doc-canvas', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DocCanvas],
      html: `<doc-canvas></doc-canvas>`,
    });
    expect(page.root).toEqualHtml(`
      <doc-canvas>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </doc-canvas>
    `);
  });
});
