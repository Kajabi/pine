import { newSpecPage } from '@stencil/core/testing';
import { PdsAvatar } from '../pds-avatar';

describe('pds-avatar', () => {
  it('renders a default avatar', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar></pds-avatar>`,
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar" variant="customer">
        <mock:shadow-root>
          <div>
            <pds-icon name="user-filled" size="normal"></pds-icon>
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
      <pds-avatar class="pds-avatar pds-avatar--admin" variant="admin">
        <mock:shadow-root>
          <div>
            <pds-icon name="user-filled" size="normal"></pds-icon>
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
      <pds-avatar class="pds-avatar" badge="true" variant="customer">
        <mock:shadow-root>
          <div>
            <pds-icon name="user-filled" size="normal"></pds-icon>
            <pds-icon class="pds-avatar__badge" name="check-circle-filled" size="normal"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders avatar with a custom size when CSS custom prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar style="--size: 128px"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
      <pds-avatar class="pds-avatar" style="--size: 128px" variant="customer">
        <mock:shadow-root>
          <div>
            <pds-icon name="user-filled" size="normal"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders an image when image prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar image="https://placehold.co/64x64"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
    <pds-avatar class="pds-avatar pds-avatar--has-image" image="https://placehold.co/64x64" variant="customer">
        <mock:shadow-root>
          <div>
            <img src="https://placehold.co/64x64"/>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders image alt when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar alt="Customer Profile" image="https://placehold.co/64x64"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
    <pds-avatar class="pds-avatar pds-avatar--has-image" alt="Customer Profile" image="https://placehold.co/64x64" variant="customer">
        <mock:shadow-root>
          <div>
            <img alt="Customer Profile" src="https://placehold.co/64x64"/>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });

  it('renders both an image and badge when props are set', async () => {
    const page = await newSpecPage({
      components: [PdsAvatar],
      html: `<pds-avatar badge="true" alt="Customer Profile" image="https://placehold.co/64x64"></pds-avatar>`
    });
    expect(page.root).toEqualHtml(`
    <pds-avatar class="pds-avatar pds-avatar--has-image" badge="true" alt="Customer Profile" image="https://placehold.co/64x64" variant="customer">
        <mock:shadow-root>
          <div>
            <img alt="Customer Profile" src="https://placehold.co/64x64"/>
            <pds-icon class="pds-avatar__badge" name="check-circle-filled" size="normal"></pds-icon>
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
      <pds-avatar class="pds-avatar pds-avatar--xl" size="xl" variant="customer">
        <mock:shadow-root>
          <div>
            <pds-icon name="user-filled" size="normal"></pds-icon>
          </div>
        </mock:shadow-root>
      </pds-avatar>
    `);
  });
});
