import { newSpecPage } from '@stencil/core/testing';
import { PdsCopytext } from '../pds-copytext';

describe('pds-copytext', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext class="pds-copytext pds-copytext--bordered">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span></span>
            <pds-icon name="copy" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('renders without border when border prop is false', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext border="false"></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext class="pds-copytext" border="false">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span></span>
            <pds-icon name="copy" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('renders full width when full-width prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext full-width="true"></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext class="pds-copytext pds-copytext--bordered pds-copytext--full-width" full-width="true">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span></span>
            <pds-icon name="copy" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('renders truncated when trucate prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext truncate="true"></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext class="pds-copytext pds-copytext--bordered pds-copytext--truncated" truncate="true">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span></span>
            <pds-icon name="copy" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

  it('renders value text when value prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsCopytext],
      html: `<pds-copytext value="custom value text"></pds-copytext>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-copytext class="pds-copytext pds-copytext--bordered" value="custom value text">
        <mock:shadow-root>
          <pds-button type="button" variant="unstyled">
            <span>custom value text</span>
            <pds-icon name="copy" size="16px"></pds-icon>
          </pds-button>
        </mock:shadow-root>
      </pds-copytext>
    `);
  });

});
