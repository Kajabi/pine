import { newSpecPage } from '@stencil/core/testing';
import { PdsAvatar } from '../pds-avatar';

import { checkCircleFilled, userFilled } from '@pine-ds/icons/icons';

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
            <pds-icon color="var(--pine-color-brand)" icon="${userFilled}" size="33.53%"></pds-icon>
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
            <pds-icon color="var(--pine-color-brand)" icon="${userFilled}" size="33.53%"></pds-icon>
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
            <pds-icon color="var(--pine-color-brand)" icon="${userFilled}" size="33.53%"></pds-icon>
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
            <pds-icon color="var(--pine-color-brand)" icon="${userFilled}" size="33.53%"></pds-icon>
            <pds-icon class="pds-avatar__badge" color="var(--pine-color-purple-600)" icon="${checkCircleFilled}" size="33.53%"></pds-icon>
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
            <pds-icon color="var(--pine-color-brand)" icon="${userFilled}" size="33.53%"></pds-icon>
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
            <pds-icon class="pds-avatar__badge" color="var(--pine-color-purple-600)" icon="${checkCircleFilled}" size="33.53%"></pds-icon>
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
            <pds-icon color="var(--pine-color-brand)" icon="${userFilled}" size="33.53%"></pds-icon>
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
          <button aria-label="Avatar dropdown trigger" class="pds-avatar__button" type="button">
            <div part="asset-wrapper" style="height: 56px; width: 56px;">
              <pds-icon color="var(--pine-color-brand)" icon="${userFilled}" size="33.53%"></pds-icon>
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
            <pds-icon color="var(--pine-color-brand)" icon="${userFilled}" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders initials when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar initials="KJ"></pds-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar pds-avatar--has-initials" initials="KJ" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <svg class="pds-avatar__initials" viewBox="0 0 32 32">
              <text x="16" y="20">KJ</text>
            </svg>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders image over initials when both are provided', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar image="https://placehold.co/64x64" initials="KJ"></pds-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar pds-avatar--has-image pds-avatar--has-initials" image="https://placehold.co/64x64" initials="KJ" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <img src="https://placehold.co/64x64"/>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders initials with badge when both props are set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar initials="KJ" badge="true"></pds-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar pds-avatar--has-initials" initials="KJ" badge="true" size="lg" variant="customer">
        <mock:shadow-root>
          <div part="asset-wrapper" style="height: 56px; width: 56px;">
            <svg class="pds-avatar__initials" viewBox="0 0 32 32">
              <text x="16" y="20">KJ</text>
            </svg>
            <pds-icon class="pds-avatar__badge" color="var(--pine-color-purple-600)" icon="${checkCircleFilled}" size="33.53%"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

});
