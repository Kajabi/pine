import { newSpecPage } from '@stencil/core/testing';
import { SageDivider } from '../sage-divider';

describe('sage-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageDivider],
      html: `<sage-divider />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-divider>
        <mock:shadow-root>
          <hr class="sage-divider">
        </mock:shadow-root>
      </sage-divider>
    `);
  });
  it('renders vertically when vertical prop is set', async () => {
    const page = await newSpecPage({
      components: [SageDivider],
      html: `<sage-divider vertical="true" />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-divider vertical="true">
        <mock:shadow-root>
          <hr class="sage-divider sage-divider--vertical">
        </mock:shadow-root>
      </sage-divider>
    `)
  })
  it('renders with offset applied when prop is set', async () => {
    const page = await newSpecPage({
      components: [SageDivider],
      html: `<sage-divider offset="lg" />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-divider offset="lg">
        <mock:shadow-root>
          <hr class="sage-divider sage-divider--offset-lg">
        </mock:shadow-root>
      </sage-divider>
    `)
  })
});
