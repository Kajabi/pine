import { newSpecPage } from '@stencil/core/testing';
import { SageCheckbox } from '../sage-checkbox';

describe('sage-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageCheckbox],
      html: `<sage-checkbox />`,
    });
    expect(page.root).toEqualHtml(`
      <sage-checkbox>
        <mock:shadow-root>
        <div class="sage-checkbox">
          <input type="checkbox">
          <label></label>
        </div>
        </mock:shadow-root>
      </sage-checkbox>
    `);
  });
});
