import { newSpecPage } from '@stencil/core/testing';
import { SageDivider } from '../sage-divider';

describe('sage-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageDivider],
      html: `<sage-divider></sage-divider>`,
    });
    expect(page.root).toEqualHtml(`
      <sage-divider>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sage-divider>
    `);
  });
});
