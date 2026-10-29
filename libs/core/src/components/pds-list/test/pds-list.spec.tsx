import { newSpecPage } from '@stencil/core/testing';
import { PdsList } from '../pds-list';

describe('pds-list', () => {
  it('renders a list around its items', async () => {
    const page = await newSpecPage({
      components: [PdsList],
      html: `<pds-list component-id="files"><pds-list-item>One</pds-list-item></pds-list>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-list component-id="files" id="files" role="list">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <pds-list-item>One</pds-list-item>
      </pds-list>
    `);
  });

  it('reflects border, compact and dividers so items can read them', async () => {
    const page = await newSpecPage({
      components: [PdsList],
      html: `<pds-list border compact dividers></pds-list>`,
    });
    expect(page.root).toHaveAttribute('border');
    expect(page.root).toHaveAttribute('compact');
    expect(page.root).toHaveAttribute('dividers');
  });

  it('leaves border, compact and dividers off by default', async () => {
    const page = await newSpecPage({
      components: [PdsList],
      html: `<pds-list></pds-list>`,
    });
    expect(page.root).not.toHaveAttribute('border');
    expect(page.root).not.toHaveAttribute('compact');
    expect(page.root).not.toHaveAttribute('dividers');
  });
});
