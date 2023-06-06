import { newSpecPage } from '@stencil/core/testing';
import { SageChip } from '../sage-chip';

describe('sage-chip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip />`,
    });
    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--neutral sage-chip--text">
        <mock:shadow-root>
          <span class="sage-chip__label"></span>
        </mock:shadow-root>
      </sage-chip>
    `);
  });

  it('renders label text when label prop is set', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip label="Progress" />`,
    });

    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--neutral sage-chip--text" label="Progress">
      <mock:shadow-root>
        <span class="sage-chip__label">Progress</span>
      </mock:shadow-root>
    </sage-chip>
    `);
  });

  it('renders with color when sentiment prop is set', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip sentiment="accent" />`,
    });

    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--accent sage-chip--text" sentiment="accent">
      <mock:shadow-root>
        <span class="sage-chip__label"></span>
      </mock:shadow-root>
    </sage-chip>
    `);
  });

  it('renders with a dot when dot prop is set', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip dot="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--neutral sage-chip--text" dot="true">
      <mock:shadow-root>
        <span class="sage-chip__label">
        <i class="sage-chip__dot" aria-hidden="true"></i>
        </span>
      </mock:shadow-root>
    </sage-chip>
    `);
  });

  it('renders large size when large prop is set', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip large="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--neutral sage-chip--large sage-chip--text" large="true">
      <mock:shadow-root>
        <span class="sage-chip__label"></span>
      </mock:shadow-root>
    </sage-chip>
    `);
  });

  it('renders with tag variant when variant prop is set as tag', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip variant="tag" />`,
    });

    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--neutral sage-chip--tag" variant="tag">
      <mock:shadow-root>
        <span class="sage-chip__label"></span>
        <button class="sage-chip__close" type="button" aria-label="Remove" >
          <pds-icon name="remove" size="12px"></pds-icon>
        </button>
      </mock:shadow-root>
    </sage-chip>
    `);
  });

  it('renders with dropdown variant when variant prop is set as dropdown', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip variant="dropdown" />`,
    });

    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--neutral sage-chip--dropdown" variant="dropdown">
      <mock:shadow-root>
        <button class="sage-chip__button" type="button">
          <pds-icon name="down-small" size="12px" aria-hidden="true"></pds-icon>
        </button>
      </mock:shadow-root>
    </sage-chip>
    `);
  });

  it('renders dot within dropdown when variant is dropdown and dot prop is set', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `<sage-chip variant="dropdown" dot="true" />`,
    });

    expect(page.root).toEqualHtml(`
    <sage-chip class="sage-chip sage-chip--neutral sage-chip--dropdown" variant="dropdown" dot="true">
      <mock:shadow-root>
        <button class="sage-chip__button" type="button">
          <i class="sage-chip__dot" aria-hidden="true"></i>
          <pds-icon name="down-small" size="12px" aria-hidden="true"></pds-icon>
        </button>
      </mock:shadow-root>
    </sage-chip>
    `);
  });

  it('emits the sageTagCloseClick event when close button is clicked', async () => {
    const page = await newSpecPage({
      components: [SageChip],
      html: `
        <sage-chip variant="tag" label="Tag Chip" />
      `,
    });

    const chip = page.body.querySelector('sage-chip');
    const eventSpy = jest.fn();
    const closeButton = chip?.shadowRoot?.querySelector('.sage-chip__close') as HTMLElement;

    page.root?.addEventListener('sageTagCloseClick', eventSpy);
    closeButton?.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
  });
});
