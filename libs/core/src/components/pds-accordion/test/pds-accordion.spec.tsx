import { newSpecPage } from '@stencil/core/testing';
import { PdsAccordion } from '../pds-accordion';
import { downSmall } from '@pine-ds/icons/icons';

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
                <pds-icon icon="${downSmall}"></pds-icon>
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
                <pds-icon icon="${downSmall}"></pds-icon>
              </summary>
              <div class="open pds-accordion__body">
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
              <pds-icon icon="${downSmall}"></pds-icon>
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
              <pds-icon icon="${downSmall}"></pds-icon>
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
              <pds-icon icon="${downSmall}"></pds-icon>
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
              <pds-icon icon="${downSmall}"></pds-icon>
            </summary>
            <div class="open pds-accordion__body">
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
