import { newSpecPage } from '@stencil/core/testing';
import { PdsChip } from '../pds-chip';

describe('pds-chip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip />`,
    });
    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--text">
        <mock:shadow-root>
          <span class="pds-chip__label"></span>
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
          <span class="pds-chip__label"></span>
        </mock:shadow-root>
      </pds-chip>
    `);
  });

  it('renders label text when label prop is set', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `<pds-chip label="Progress" />`,
    });

    expect(page.root).toEqualHtml(`
    <pds-chip class="pds-chip pds-chip--neutral pds-chip--text" label="Progress">
      <mock:shadow-root>
        <span class="pds-chip__label">Progress</span>
      </mock:shadow-root>
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
        <span class="pds-chip__label"></span>
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
        <span class="pds-chip__label"></span>
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
        <span class="pds-chip__label"></span>
        <button class="pds-chip__close" type="button" aria-label="Remove" >
          <pds-icon name="remove" size="12px"></pds-icon>
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
          <pds-icon name="down-small" size="12px" aria-hidden="true"></pds-icon>
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
          <pds-icon name="down-small" size="12px" aria-hidden="true"></pds-icon>
        </button>
      </mock:shadow-root>
    </pds-chip>
    `);
  });

  it('emits the pdsTagCloseClick event when close button is clicked', async () => {
    const page = await newSpecPage({
      components: [PdsChip],
      html: `
        <pds-chip variant="tag" label="Tag Chip" />
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
