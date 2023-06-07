import { newSpecPage } from '@stencil/core/testing';
import { SageIcon } from '../sage-icon';

describe('sage-icon', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SageIcon],
      html: '<sage-icon></sage-icon>',
    });
    expect(root).toEqualHtml(`
      <sage-icon role="img" size="regular" style="height: 16px; width: 16px;">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </sage-icon>
    `);
  });

  it('renders the correct size when passed', async () => {
    const { root } = await newSpecPage({
      components: [SageIcon],
      html: '<sage-icon size="small"></sage-icon>',
    });
    expect(root).toEqualHtml(`
      <sage-icon role="img" size="small" style="height: 12px; width: 12px;">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </sage-icon>
    `);
  });

  it('allows custom size', async () => {
    const { root } = await newSpecPage({
      components: [SageIcon],
      html: '<sage-icon size="32px"></sage-icon>',
    });
    expect(root).toEqualHtml(`
      <sage-icon role="img" size="32px" style="height: 32px; width: 32px;">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </sage-icon>
    `);
  });

  it('renders icon when found', async () => {
    const { root } = await newSpecPage({
      components: [SageIcon],
      html: '<sage-icon name="archive"></sage-icon>',
    });
    expect(root).toEqualHtml(`
      <sage-icon aria-label="archive" name="archive" role="img" size="regular" style="height: 16px; width: 16px;">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </sage-icon>
    `);
  });

  it('add correct styles when color specified', async () => {
    const { root } = await newSpecPage({
      components: [SageIcon],
      html: '<sage-icon name="archive" color="red"></sage-icon>',
    });
    expect(root).toEqualHtml(`
      <sage-icon aria-label="archive" class="sage-color sage-color-red" color="red" name="archive" role="img" size="regular" style="height: 16px; width: 16px; color: red">
        <mock:shadow-root>
          <div class="icon-inner"></div>
        </mock:shadow-root>
      </sage-icon>
    `);
  });

});
