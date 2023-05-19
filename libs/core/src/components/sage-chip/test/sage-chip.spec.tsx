import { newSpecPage } from '@stencil/core/testing';
import { SageChip } from '../sage-chip';

describe('sage-chip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip />`,
    });
    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--neutral sage-chip--text">
        <mock:shadow-root>
          <span class="sage-chip__text"></span>
        </mock:shadow-root>
      </sage-chip>
    `);
  });
});
