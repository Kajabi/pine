import { newSpecPage } from '@stencil/core/testing';
import { PdsIcon } from '../pds-icon';

describe('pds-icon', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [PdsIcon],
      html: '<pds-icon></pds-icon>',
    });
    expect(root).toEqualHtml(`
      <pds-icon role="img" size="regular" style="height: 16px; width: 16px;">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </pds-icon>
    `);
  });

  it('renders the correct size when passed', async () => {
    const { root } = await newSpecPage({
      components: [PdsIcon],
      html: '<pds-icon size="small"></pds-icon>',
    });
    expect(root).toEqualHtml(`
      <pds-icon role="img" size="small" style="height: 12px; width: 12px;">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </pds-icon>
    `);
  });

  it('allows custom size', async () => {
    const { root } = await newSpecPage({
      components: [PdsIcon],
      html: '<pds-icon size="32px"></pds-icon>',
    });
    expect(root).toEqualHtml(`
      <pds-icon role="img" size="32px" style="height: 32px; width: 32px;">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </pds-icon>
    `);
  });

  it('renders icon when found', async () => {
    const { root } = await newSpecPage({
      components: [PdsIcon],
      html: '<pds-icon name="archive"></pds-icon>',
    });
    expect(root).toEqualHtml(`
      <pds-icon aria-label="archive" name="archive" role="img" size="regular" style="height: 16px; width: 16px;">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </pds-icon>
    `);
  });

  it('add correct styles when color specified', async () => {
    const { root } = await newSpecPage({
      components: [PdsIcon],
      html: '<pds-icon name="archive" color="red"></pds-icon>',
    });
    expect(root).toEqualHtml(`
      <pds-icon aria-label="archive" class="pds-color pds-color-red" color="red" name="archive" role="img" size="regular" style="height: 16px; width: 16px; color: red">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </pds-icon>
    `);
  });

});
