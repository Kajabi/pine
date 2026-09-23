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

  it('renders with id when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsDivider],
      html: `<pds-divider component-id="test" />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-divider component-id="test" id="test">
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

  it('renders a labeled separator when label prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsDivider],
      html: `<pds-divider label="Today" />`,
    });
    expect(page.root).toEqualHtml(`
      <pds-divider label="Today">
        <mock:shadow-root>
          <div class="pds-divider pds-divider--labeled" role="separator" aria-label="Today">
            <span class="pds-divider__label" part="label">Today</span>
          </div>
        </mock:shadow-root>
      </pds-divider>
    `);
  });

  it('renders a labeled separator with offset applied', async () => {
    const page = await newSpecPage({
      components: [PdsDivider],
      html: `<pds-divider label="Today" offset="lg" />`,
    });
    const separator = page.root.shadowRoot.querySelector('[role="separator"]');
    expect(separator).toHaveClass('pds-divider--labeled');
    expect(separator).toHaveClass('pds-divider--offset-lg');
  });

  it('ignores the label when vertical', async () => {
    const page = await newSpecPage({
      components: [PdsDivider],
      html: `<pds-divider label="Today" vertical="true" />`,
    });
    expect(page.root).toEqualHtml(`
      <pds-divider label="Today" vertical="true">
        <mock:shadow-root>
          <hr class="pds-divider pds-divider--vertical">
        </mock:shadow-root>
      </pds-divider>
    `);
  });

  it('renders a plain divider when label is empty', async () => {
    const page = await newSpecPage({
      components: [PdsDivider],
      html: `<pds-divider label="" />`,
    });
    expect(page.root.shadowRoot.querySelector('hr')).not.toBeNull();
    expect(page.root.shadowRoot.querySelector('[role="separator"]')).toBeNull();
  });
});
