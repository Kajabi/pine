import { newSpecPage } from '@stencil/core/testing';
import { PdsAvatar } from '../pds-avatar';

describe('pds-avatar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar></pds-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });
});
