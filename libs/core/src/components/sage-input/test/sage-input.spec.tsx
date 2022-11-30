import { newSpecPage } from '@stencil/core/testing';
import { SageInput } from '../sage-input';

describe('sage-input', () => {
  it('renders a value when prop is set', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: '<sage-input label="Name" value="Frank Dux"></sage-input>'
    });
    expect(root).toEqualHtml(`
    <sage-input>
      <mock:shadow-root>=
        <div class="sage-input">
          <label htmlFor={this.id}>Name</label>
          <input class="sage-input__field" type="text" value="Frank Dux" />
        </div>
      </mock:shadow-root>
    </sage-input>
    `);
  });
});
