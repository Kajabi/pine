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
              <summary part="accordion-button">
                <slot name="label">Details</slot>
                <pds-icon icon="${downSmall}"></pds-icon>
              </summary>
              <div part="accordion-body" class="pds-accordion__body">
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
              <summary part="accordion-button">
                <slot name="label">Details</slot>
                <pds-icon icon="${downSmall}"></pds-icon>
              </summary>
              <div part="accordion-body" class="pds-accordion__body">
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
            <summary part="accordion-button">
              <slot name="label">Details</slot>
              <pds-icon icon="${downSmall}"></pds-icon>
            </summary>
            <div part="accordion-body" class="pds-accordion__body">
              <slot />
            </div>
          </details>
        </mock:shadow-root>
      </pds-accordion>
    `);
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
            <summary part="accordion-button">
              <slot name="label">Details</slot>
              <pds-icon icon="${downSmall}"></pds-icon>
            </summary>
            <div part="accordion-body" class="pds-accordion__body">
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
            <summary part="accordion-button">
              <slot name="label">Details</slot>
              <pds-icon icon="${downSmall}"></pds-icon>
            </summary>
            <div part="accordion-body" class="pds-accordion__body">
              <slot />
            </div>
          </details>
        </mock:shadow-root>
        <div>Hello World</div>
      </pds-accordion>
    `);
  });

  it('emits pdsAccordionToggle with true when details is opened', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion></pds-accordion>`,
    });

    const accordion = page.root as HTMLPdsAccordionElement;
    const toggleSpy = jest.fn();
    accordion.addEventListener('pdsAccordionToggle', toggleSpy);

    // Simulate the native details toggle firing with open = true
    const details = page.root.shadowRoot.querySelector('details') as HTMLDetailsElement;
    details.open = true;
    details.dispatchEvent(new Event('toggle'));
    await page.waitForChanges();

    expect(toggleSpy).toHaveBeenCalledTimes(1);
    expect((toggleSpy.mock.calls[0][0] as CustomEvent).detail).toBe(true);
  });

  it('emits pdsAccordionToggle with false when details is closed', async () => {
    const page = await newSpecPage({
      components: [PdsAccordion],
      html: `<pds-accordion open></pds-accordion>`,
    });

    const accordion = page.root as HTMLPdsAccordionElement;
    const toggleSpy = jest.fn();
    accordion.addEventListener('pdsAccordionToggle', toggleSpy);

    const details = page.root.shadowRoot.querySelector('details') as HTMLDetailsElement;
    details.open = false;
    details.dispatchEvent(new Event('toggle'));
    await page.waitForChanges();

    expect(toggleSpy).toHaveBeenCalledTimes(1);
    expect((toggleSpy.mock.calls[0][0] as CustomEvent).detail).toBe(false);
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
            <summary part="accordion-button">
              <slot name="label">Details</slot>
              <pds-icon icon="${downSmall}"></pds-icon>
            </summary>
            <div part="accordion-body" class="pds-accordion__body">
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
