import { newSpecPage } from '@stencil/core/testing';
import { PdsChip } from '../pds-chip';

import { downSmall, remove as removeIcon } from '@pine-ds/icons/icons';

describe('pds-chip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip />`,
    });
    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--text">
        <mock:shadow-root>
          <span class="pds-chip__label"><slot></slot></span>
        </mock:shadow-root>
      </pds-chip>
    `);
  });

  it('renders with id when prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip component-id="test" />`,
    });

    expect(page.root).toEqualHtml(`
      <pds-chip class="pds-chip pds-chip--neutral pds-chip--text" component-id="test" id="test">
        <mock:shadow-root>
          <span class="pds-chip__label"><slot></slot></span>
        </mock:shadow-root>
      </pds-chip>
    `);
  });

  it('renders label text when label prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip>Progress</pds-chip>`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--text">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
      </mock:shadow-root>
      Progress
    </pds-chip>
    `);
  });

  it('renders with color when sentiment prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip sentiment="accent" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--accent pds-chip--text" sentiment="accent">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders with a dot when dot prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip dot="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--text" dot="true">
      <mock:shadow-root>
        <span class="pds-chip__label">
          <i class="pds-chip__dot" aria-hidden="true"></i>
          <slot></slot>
        </span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders large size when large prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip large="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--large pds-chip--text" large="true">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders with tag variant when variant prop is set as tag', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--tag" variant="tag">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
        <button class="pds-chip__close" type="button" aria-label="Remove" >
          <pds-icon icon="${removeIcon}" size="12px"></pds-icon>
        </button>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders with dropdown variant when variant prop is set as dropdown', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="dropdown" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--dropdown" variant="dropdown">
      <mock:shadow-root>
        <button class="pds-chip__button" type="button">
          <slot></slot>
          <pds-icon icon="${downSmall}" size="12px" aria-hidden="true"></pds-icon>
        </button>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders with icon when icon prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip icon="archive" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--text" icon="archive">
      <mock:shadow-root>
        <span class="pds-chip__label">
          <pds-icon icon="archive" size="12px" aria-hidden="true"></pds-icon>
          <slot></slot>
        </span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders with icon in dropdown variant when icon prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip icon="archive" variant="dropdown" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--dropdown" icon="archive" variant="dropdown">
      <mock:shadow-root>
        <button class="pds-chip__button" type="button">
          <pds-icon icon="archive" size="12px" aria-hidden="true"></pds-icon>
          <slot></slot>
          <pds-icon icon="${downSmall}" size="12px" aria-hidden="true"></pds-icon>
        </button>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders with large icon when icon and large props are set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip icon="archive" large="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--large pds-chip--text" icon="archive" large="true">
      <mock:shadow-root>
        <span class="pds-chip__label">
          <pds-icon icon="archive" size="14px" aria-hidden="true"></pds-icon>
          <slot></slot>
        </span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders with both icon and dot when both props are set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip icon="archive" dot="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--text" icon="archive" dot="true">
      <mock:shadow-root>
        <span class="pds-chip__label">
          <pds-icon icon="archive" size="12px" aria-hidden="true"></pds-icon>
          <i class="pds-chip__dot" aria-hidden="true"></i>
          <slot></slot>
        </span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders brand sentiment with icon but no dot when icon and dot props are set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip icon="archive" dot="true" sentiment="brand" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--brand pds-chip--text" icon="archive" dot="true" sentiment="brand">
      <mock:shadow-root>
        <span class="pds-chip__label">
          <pds-icon icon="archive" size="12px" aria-hidden="true"></pds-icon>
          <slot></slot>
        </span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders with large icons in tag variant when large prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" large="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--large pds-chip--tag" variant="tag" large="true">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
        <button class="pds-chip__close" type="button" aria-label="Remove" >
          <pds-icon icon="${removeIcon}" size="14px"></pds-icon>
        </button>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders dot within dropdown when variant is dropdown and dot prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="dropdown" dot="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--dropdown" variant="dropdown" dot="true">
      <mock:shadow-root>
        <button class="pds-chip__button" type="button">
          <i class="pds-chip__dot" aria-hidden="true"></i>
          <slot></slot>
          <pds-icon icon="${downSmall}" size="12px" aria-hidden="true"></pds-icon>
        </button>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('emits the pdsTagCloseClick event when close button is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `
        <pds-chip variant="tag">Tag Chip</pds-chip>
      `,
    });

    const chip = page.body.querySelector('pds-chip');
    const eventSpy = jest.fn();
    const closeButton = chip?.shadowRoot?.querySelector('.pds-chip__close') as HTMLElement;

    page.root?.addEventListener('pdsTagCloseClick', eventSpy);
    closeButton?.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
  });
});
