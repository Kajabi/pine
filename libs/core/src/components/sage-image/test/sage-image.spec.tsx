import { newSpecPage } from '@stencil/core/testing';
import { SageImage } from '../sage-image';

describe('sage-image', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageImage],
      html: `<sage-image class="sage-image"></sage-image>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-image class="sage-image">
        <mock:shadow-root>
          <img alt="" loading="eager" />
        </mock:shadow-root>
      </sage-image>
    `);
  });
});
