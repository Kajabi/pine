import { newSpecPage } from '@stencil/core/testing';
import { PdsAccordion } from '../pds-accordion';

describe('pds-accordion', () => {
  it('renders the accordion', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion></pds-accordion>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-accordion class="pds-accordion">
        <mock:shadow-root>
            <details>
              <summary>
                <slot name="label">Details</slot>
                <pds-icon icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' class='pdsicon'><path fill-rule='evenodd' d='M3.594 5.594a.889.889 0 0 1 1.257 0L7.778 8.52l2.927-2.927a.889.889 0 0 1 1.257 1.257l-3.556 3.555a.889.889 0 0 1-1.257 0L3.594 6.851a.889.889 0 0 1 0-1.257Z'/></svg>"></pds-icon>
              </summary>
              <div class="pds-accordion__body">
                <slot />
              </div>
            </details>
        </mock:shadow-root>
      </pds-accordion>
    `);
  });

  it('renders the accordion with open attribute when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion open></pds-accordion>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-accordion class="pds-accordion" open>
        <mock:shadow-root>
            <details open>
              <summary>
                <slot name="label">Details</slot>
                <pds-icon icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' class='pdsicon'><path fill-rule='evenodd' d='M7.15 5.594a.889.889 0 0 1 1.256 0l3.556 3.555a.889.889 0 0 1-1.257 1.257L7.778 7.48 4.85 10.406A.889.889 0 1 1 3.594 9.15l3.555-3.555Z'/></svg>"></pds-icon>
              </summary>
              <div class="pds-accordion__body">
                <slot />
              </div>
            </details>
        </mock:shadow-root>
      </pds-accordion>
    `);
  });

  it('renders with id when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion component-id="test"></pds-accordion>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-accordion component-id="test" id="test" class="pds-accordion">
        <mock:shadow-root>
          <details>
            <summary>
              <slot name="label">Details</slot>
              <pds-icon icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' class='pdsicon'><path fill-rule='evenodd' d='M3.594 5.594a.889.889 0 0 1 1.257 0L7.778 8.52l2.927-2.927a.889.889 0 0 1 1.257 1.257l-3.556 3.555a.889.889 0 0 1-1.257 0L3.594 6.851a.889.889 0 0 1 0-1.257Z'/></svg>"></pds-icon>
            </summary>
            <div class="pds-accordion__body">
              <slot />
            </div>
          </details>
        </mock:shadow-root>
      </pds-accordion>
    `)
  });

  it('renders summary slot content when set', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion><span slot="label">Summary</span></pds-accordion>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-accordion class="pds-accordion">
        <mock:shadow-root>
          <details>
            <summary>
              <slot name="label">Details</slot>
              <pds-icon icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' class='pdsicon'><path fill-rule='evenodd' d='M3.594 5.594a.889.889 0 0 1 1.257 0L7.778 8.52l2.927-2.927a.889.889 0 0 1 1.257 1.257l-3.556 3.555a.889.889 0 0 1-1.257 0L3.594 6.851a.889.889 0 0 1 0-1.257Z'/></svg>"></pds-icon>
            </summary>
            <div class="pds-accordion__body">
              <slot />
            </div>
          </details>
        </mock:shadow-root>
        <span slot="label">Summary</span>
      </pds-accordion>
    `);
  });

  it('renders details slot content when set', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion><div>Hello World</div></pds-accordion>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-accordion class="pds-accordion">
        <mock:shadow-root>
          <details>
            <summary>
              <slot name="label">Details</slot>
              <pds-icon icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' class='pdsicon'><path fill-rule='evenodd' d='M3.594 5.594a.889.889 0 0 1 1.257 0L7.778 8.52l2.927-2.927a.889.889 0 0 1 1.257 1.257l-3.556 3.555a.889.889 0 0 1-1.257 0L3.594 6.851a.889.889 0 0 1 0-1.257Z'/></svg>"></pds-icon>
            </summary>
            <div class="pds-accordion__body">
              <slot />
            </div>
          </details>
        </mock:shadow-root>
        <div>Hello World</div>
      </pds-accordion>
    `);
  });

  it('renders summary slot content and details slot content when both are set', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion open><span slot="label">Summary</span><div>Hello World</div></pds-accordion>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-accordion class="pds-accordion" open>
        <mock:shadow-root>
          <details open>
            <summary>
              <slot name="label">Details</slot>
              <pds-icon icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' class='pdsicon'><path fill-rule='evenodd' d='M7.15 5.594a.889.889 0 0 1 1.256 0l3.556 3.555a.889.889 0 0 1-1.257 1.257L7.778 7.48 4.85 10.406A.889.889 0 1 1 3.594 9.15l3.555-3.555Z'/></svg>"></pds-icon>
            </summary>
            <div class="pds-accordion__body">
              <slot />
            </div>
          </details>
        </mock:shadow-root>
        <span slot="label">Summary</span>
        <div>Hello World</div>
      </pds-accordion>
    `);
  });
});
