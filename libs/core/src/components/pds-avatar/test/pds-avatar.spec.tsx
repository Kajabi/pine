import { newSpecPage } from '@stencil/core/testing';
import { PdsAvatar } from '../pds-avatar';

describe('pds-avatar', () => {
  it('renders a default avatar', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar></pds-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <pds-icon color="var(--pine-color-primary-400)" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 17' class='pdsicon'><path fill-rule='evenodd' d='M11.667 3.697C11.667 5.687 10.067 8 8 8 5.933 8 4.333 5.687 4.333 3.697a3.667 3.667 0 1 1 7.334 0Zm-8.77 7.2c1-1 2.356-1.562 3.77-1.564h2.666a5.34 5.34 0 0 1 5.334 5.334.667.667 0 0 1-.464.635A22.19 22.19 0 0 1 8 16a22.19 22.19 0 0 1-6.203-.698.667.667 0 0 1-.464-.635 5.34 5.34 0 0 1 1.564-3.77Z'/></svg>" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders with id when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar component-id="test"></pds-avatar>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-avatar component-id="test" id="test" class="pds-avatar" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <pds-icon color="var(--pine-color-primary-400)" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 17' class='pdsicon'><path fill-rule='evenodd' d='M11.667 3.697C11.667 5.687 10.067 8 8 8 5.933 8 4.333 5.687 4.333 3.697a3.667 3.667 0 1 1 7.334 0Zm-8.77 7.2c1-1 2.356-1.562 3.77-1.564h2.666a5.34 5.34 0 0 1 5.334 5.334.667.667 0 0 1-.464.635A22.19 22.19 0 0 1 8 16a22.19 22.19 0 0 1-6.203-.698.667.667 0 0 1-.464-.635 5.34 5.34 0 0 1 1.564-3.77Z'/></svg>" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders the admin variant of avatar when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar variant="admin"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar pds-avatar--admin" size="lg" variant="admin">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px">
            <pds-icon color="var(--pine-color-primary-400)" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 17' class='pdsicon'><path fill-rule='evenodd' d='M11.667 3.697C11.667 5.687 10.067 8 8 8 5.933 8 4.333 5.687 4.333 3.697a3.667 3.667 0 1 1 7.334 0Zm-8.77 7.2c1-1 2.356-1.562 3.77-1.564h2.666a5.34 5.34 0 0 1 5.334 5.334.667.667 0 0 1-.464.635A22.19 22.19 0 0 1 8 16a22.19 22.19 0 0 1-6.203-.698.667.667 0 0 1-.464-.635 5.34 5.34 0 0 1 1.564-3.77Z'/></svg>" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders badge when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar badge="true"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar" badge="true" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <pds-icon color="var(--pine-color-primary-400)"icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 17' class='pdsicon'><path fill-rule='evenodd' d='M11.667 3.697C11.667 5.687 10.067 8 8 8 5.933 8 4.333 5.687 4.333 3.697a3.667 3.667 0 1 1 7.334 0Zm-8.77 7.2c1-1 2.356-1.562 3.77-1.564h2.666a5.34 5.34 0 0 1 5.334 5.334.667.667 0 0 1-.464.635A22.19 22.19 0 0 1 8 16a22.19 22.19 0 0 1-6.203-.698.667.667 0 0 1-.464-.635 5.34 5.34 0 0 1 1.564-3.77Z'/></svg>" size="33.53%"></pds-icon>
            <pds-icon class="pds-avatar__badge" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' class='pdsicon'><path d='M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8Zm4.473 5.807L7.14 11.14c-.26.26-.68.26-.94 0L3.533 8.473a.664.664 0 1 1 .94-.94l2.194 2.194 4.86-4.86c.26-.26.68-.26.94 0 .266.253.266.68.006.94Z'/></svg>" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders avatar with a custom size when CSS custom prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar size="128px"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar" size="128px" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 128px; width: 128px">
            <pds-icon color="var(--pine-color-primary-400)" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 17' class='pdsicon'><path fill-rule='evenodd' d='M11.667 3.697C11.667 5.687 10.067 8 8 8 5.933 8 4.333 5.687 4.333 3.697a3.667 3.667 0 1 1 7.334 0Zm-8.77 7.2c1-1 2.356-1.562 3.77-1.564h2.666a5.34 5.34 0 0 1 5.334 5.334.667.667 0 0 1-.464.635A22.19 22.19 0 0 1 8 16a22.19 22.19 0 0 1-6.203-.698.667.667 0 0 1-.464-.635 5.34 5.34 0 0 1 1.564-3.77Z'/></svg>" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders an image when image prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar image="https://placehold.co/64x64" size="lg"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar pds-avatar--has-image" image="https://placehold.co/64x64" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <img src="https://placehold.co/64x64"/>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders image alt when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar alt="Customer Profile" image="https://placehold.co/64x64" size="lg"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar pds-avatar--has-image" alt="Customer Profile" image="https://placehold.co/64x64" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <img alt="Customer Profile" src="https://placehold.co/64x64"/>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders both an image and badge when props are set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar badge="true" alt="Customer Profile" image="https://placehold.co/64x64" size="lg"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar pds-avatar--has-image" badge="true" alt="Customer Profile" image="https://placehold.co/64x64" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px">
            <img alt="Customer Profile" src="https://placehold.co/64x64"/>
            <pds-icon class="pds-avatar__badge" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' class='pdsicon'><path d='M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8Zm4.473 5.807L7.14 11.14c-.26.26-.68.26-.94 0L3.533 8.473a.664.664 0 1 1 .94-.94l2.194 2.194 4.86-4.86c.26-.26.68-.26.94 0 .266.253.266.68.006.94Z'/></svg>" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders avatar with a preset size when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar size="xl"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar" size="xl" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 64px; width: 64px;">
            <pds-icon color="var(--pine-color-primary-400)" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 17' class='pdsicon'><path fill-rule='evenodd' d='M11.667 3.697C11.667 5.687 10.067 8 8 8 5.933 8 4.333 5.687 4.333 3.697a3.667 3.667 0 1 1 7.334 0Zm-8.77 7.2c1-1 2.356-1.562 3.77-1.564h2.666a5.34 5.34 0 0 1 5.334 5.334.667.667 0 0 1-.464.635A22.19 22.19 0 0 1 8 16a22.19 22.19 0 0 1-6.203-.698.667.667 0 0 1-.464-.635 5.34 5.34 0 0 1 1.564-3.77Z'/></svg>" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders avatar as a button when dropdown prop is true', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar dropdown="true"></pds-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar" dropdown="true" size="lg" variant="customer">
        <mock:shadow-root>
          <button class="pds-avatar__button" type="button">
            <div part="asset-wrapper" style="height: 56px; width: 56px;">
              <pds-icon color="var(--pine-color-primary-400)" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 17' class='pdsicon'><path fill-rule='evenodd' d='M11.667 3.697C11.667 5.687 10.067 8 8 8 5.933 8 4.333 5.687 4.333 3.697a3.667 3.667 0 1 1 7.334 0Zm-8.77 7.2c1-1 2.356-1.562 3.77-1.564h2.666a5.34 5.34 0 0 1 5.334 5.334.667.667 0 0 1-.464.635A22.19 22.19 0 0 1 8 16a22.19 22.19 0 0 1-6.203-.698.667.667 0 0 1-.464-.635 5.34 5.34 0 0 1 1.564-3.77Z'/></svg>" size="33.53%"></pds-icon>
            </div>
          </button>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders avatar without button when dropdown prop is false', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar dropdown="false"></pds-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar" dropdown="false" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <pds-icon color="var(--pine-color-primary-400)" icon="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 17' class='pdsicon'><path fill-rule='evenodd' d='M11.667 3.697C11.667 5.687 10.067 8 8 8 5.933 8 4.333 5.687 4.333 3.697a3.667 3.667 0 1 1 7.334 0Zm-8.77 7.2c1-1 2.356-1.562 3.77-1.564h2.666a5.34 5.34 0 0 1 5.334 5.334.667.667 0 0 1-.464.635A22.19 22.19 0 0 1 8 16a22.19 22.19 0 0 1-6.203-.698.667.667 0 0 1-.464-.635 5.34 5.34 0 0 1 1.564-3.77Z'/></svg>" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

});
