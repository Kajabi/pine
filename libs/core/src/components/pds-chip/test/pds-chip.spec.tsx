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

  it('renders large size when size prop is lg', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip size="lg" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--lg pds-chip--neutral pds-chip--text" size="lg">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders large size when deprecated large prop is set (backward compat)', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip large="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--lg pds-chip--neutral pds-chip--text" large="true">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('size prop takes precedence over large prop when both are set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip size="sm" large="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--sm pds-chip--neutral pds-chip--text" size="sm" large="true">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('explicit size="md" takes precedence over large prop', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip size="md" large="true" />`,
    });

    expect(page.root.className).not.toContain('pds-chip--lg');
    expect(page.root.className).not.toContain('pds-chip--sm');
  });

  it('renders small size when size prop is sm', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip size="sm" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--sm pds-chip--neutral pds-chip--text" size="sm">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders small icon when size is sm', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip size="sm" icon="archive" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--sm pds-chip--neutral pds-chip--text" size="sm" icon="archive">
      <mock:shadow-root>
        <span class="pds-chip__label">
          <pds-icon icon="archive" size="10px" aria-hidden="true"></pds-icon>
          <slot></slot>
        </span>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders small tag variant with close icon at 10px', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip size="sm" variant="tag" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--sm pds-chip--neutral pds-chip--tag" size="sm" variant="tag">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
        <button class="pds-chip__close" type="button" aria-label="Remove">
          <pds-icon icon="${removeIcon}" size="10px"></pds-icon>
        </button>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('renders small dropdown variant with icons at 10px', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip size="sm" variant="dropdown" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--sm pds-chip--dropdown pds-chip--neutral" size="sm" variant="dropdown">
      <mock:shadow-root>
        <button class="pds-chip__button" type="button">
          <slot></slot>
          <pds-icon icon="${downSmall}" size="10px" aria-hidden="true"></pds-icon>
        </button>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('does not add a size class when size is md (default)', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip size="md" />`,
    });

    expect(page.root.className).not.toContain('pds-chip--md');
    expect(page.root.className).not.toContain('pds-chip--sm');
    expect(page.root.className).not.toContain('pds-chip--lg');
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

  it('renders with large icon when icon and size lg are set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip icon="archive" size="lg" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--lg pds-chip--neutral pds-chip--text" icon="archive" size="lg">
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

  it('renders with large icons in tag variant when size is lg', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" size="lg" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--lg pds-chip--neutral pds-chip--tag" variant="tag" size="lg">
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

  it('renders close button as link when removeUrl prop is provided', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" remove-url="/filters/remove/1" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--tag" variant="tag" remove-url="/filters/remove/1">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
        <a class="pds-chip__close" href="/filters/remove/1" aria-label="Remove">
          <pds-icon icon="${removeIcon}" size="12px"></pds-icon>
        </a>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('adds data-method and data-turbo-method attributes when removeHttpMethod is provided', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" remove-url="/tags/1" remove-http-method="delete" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--tag" variant="tag" remove-url="/tags/1" remove-http-method="delete">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
        <a class="pds-chip__close" href="/tags/1" aria-label="Remove" data-method="delete" data-turbo-method="delete" rel="nofollow">
          <pds-icon icon="${removeIcon}" size="12px"></pds-icon>
        </a>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('does not add rel="nofollow" for GET method', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" remove-url="/tags/1" remove-http-method="get" />`,
    });

    const chip = page.body.querySelector('pds-chip');
    const closeLink = chip?.shadowRoot?.querySelector('.pds-chip__close') as HTMLAnchorElement;

    expect(closeLink.getAttribute('rel')).toBeNull();
    expect(closeLink.getAttribute('data-method')).toBe('get');
    expect(closeLink.getAttribute('data-turbo-method')).toBe('get');
  });

  it('adds target attribute when removeTarget is provided', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" remove-url="/clear" remove-target="_blank" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--tag" variant="tag" remove-url="/clear" remove-target="_blank">
      <mock:shadow-root>
        <span class="pds-chip__label"><slot></slot></span>
        <a class="pds-chip__close" href="/clear" aria-label="Remove" target="_blank" rel="noopener noreferrer">
          <pds-icon icon="${removeIcon}" size="12px"></pds-icon>
        </a>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('adds rel="noopener noreferrer" when removeTarget is "_blank"', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" remove-url="/clear" remove-target="_blank" />`,
    });

    const chip = page.body.querySelector('pds-chip');
    const closeLink = chip?.shadowRoot?.querySelector('.pds-chip__close') as HTMLAnchorElement;

    expect(closeLink.getAttribute('rel')).toBe('noopener noreferrer');
    expect(closeLink.getAttribute('target')).toBe('_blank');
  });

  it('combines rel tokens when removeTarget="_blank" and removeHttpMethod is non-GET', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" remove-url="/tags/1" remove-target="_blank" remove-http-method="delete" />`,
    });

    const chip = page.body.querySelector('pds-chip');
    const closeLink = chip?.shadowRoot?.querySelector('.pds-chip__close') as HTMLAnchorElement;

    expect(closeLink.getAttribute('rel')).toBe('noopener noreferrer nofollow');
    expect(closeLink.getAttribute('target')).toBe('_blank');
    expect(closeLink.getAttribute('data-method')).toBe('delete');
    expect(closeLink.getAttribute('data-turbo-method')).toBe('delete');
  });

  it('adds only nofollow when removeHttpMethod is non-GET without target="_blank"', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" remove-url="/tags/1" remove-http-method="post" />`,
    });

    const chip = page.body.querySelector('pds-chip');
    const closeLink = chip?.shadowRoot?.querySelector('.pds-chip__close') as HTMLAnchorElement;

    expect(closeLink.getAttribute('rel')).toBe('nofollow');
    expect(closeLink.getAttribute('target')).toBeNull();
  });

  it('emits pdsTagCloseClick event when close link is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip variant="tag" remove-url="/filters/remove/1">Filter</pds-chip>`,
    });

    const chip = page.body.querySelector('pds-chip');
    const eventSpy = jest.fn();
    const closeLink = chip?.shadowRoot?.querySelector('.pds-chip__close') as HTMLElement;

    page.root?.addEventListener('pdsTagCloseClick', eventSpy);
    closeLink?.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
  });

  it('supports all HTTP methods', async () => {
    const methods = ['get', 'post', 'put', 'patch', 'delete'];

    for (const method of methods) {
      const page = await newSpecPage({
        components: [PdsChip],
        html: `<pds-chip variant="tag" remove-url="/action" remove-http-method="${method}" />`,
      });

      const chip = page.body.querySelector('pds-chip');
      const closeLink = chip?.shadowRoot?.querySelector('.pds-chip__close') as HTMLAnchorElement;

      expect(closeLink.getAttribute('data-method')).toBe(method);
      expect(closeLink.getAttribute('data-turbo-method')).toBe(method);
    }
  });
});
