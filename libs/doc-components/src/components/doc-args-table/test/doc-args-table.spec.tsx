import { newSpecPage } from '@stencil/core/testing';
import { DocArgsTable } from '../doc-args-table';

describe('doc-args-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DocArgsTable],
      html: `<doc-args-table></doc-args-table>`,
    });
    expect(page.root).toEqualHtml(`
      <doc-args-table>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </doc-args-table>
    `);
  });
});
