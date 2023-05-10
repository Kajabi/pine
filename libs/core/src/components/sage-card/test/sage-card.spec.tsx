import { newSpecPage } from '@stencil/core/testing';
import { SageCard } from '../sage-card';

describe('sage-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageCard],
      html: `<sage-card></sage-card>`,
    });

    expect(page.root).toEqualHtml(`
    <sage-card class="sage-card has-border sage-card--padding-md sage-card--shadow-none">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sage-card>
    `);
  });
});
