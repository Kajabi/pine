import { newSpecPage } from '@stencil/core/testing';
import { SageInput } from '../sage-input';

describe('sage-input', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SageInput],
      html: '<sage-input></sage-input>'
    })
  });
});
