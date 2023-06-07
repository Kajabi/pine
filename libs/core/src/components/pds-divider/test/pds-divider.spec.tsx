import { newSpecPage } from '@stencil/core/testing';
import { PdsDivider } from '../pds-divider';

describe('pds-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsDivider],
      html: `<pds-divider />`,
    });
    expect(page.root).toEqualHtml(`
      <pds-divider>
        <mock:shadow-root>
          <hr class="pds-divider">
        </mock:shadow-root>
      </pds-divider>
    `);
  });
  it('renders vertically when vertical prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsDivider],
      html: `<pds-divider vertical="true" />`,
    });
    expect(page.root).toEqualHtml(`
      <pds-divider vertical="true">
        <mock:shadow-root>
          <hr class="pds-divider pds-divider--vertical">
        </mock:shadow-root>
      </pds-divider>
    `)
  })
  it('renders with offset applied when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsDivider],
      html: `<pds-divider offset="lg" />`,
    });
    expect(page.root).toEqualHtml(`
      <pds-divider offset="lg">
        <mock:shadow-root>
          <hr class="pds-divider pds-divider--offset-lg">
        </mock:shadow-root>
      </pds-divider>
    `)
  })
});
