import { newSpecPage } from '@stencil/core/testing';
import { PdsListItem } from '../pds-list-item';

describe('pds-list-item', () => {
  it('renders a list item with the title, and hides empty slots', async () => {
    const page = await newSpecPage({
      components: [PdsListItem],
      html: `<pds-list><pds-list-item component-id="item-1">Onboarding worksheet</pds-list-item></pds-list>`,
    });
    expect(page.body.querySelector('pds-list-item')).toEqualHtml(`
      <pds-list-item component-id="item-1" id="item-1" role="listitem">
        <mock:shadow-root>
          <div class="pds-list-item" part="item">
            <div class="pds-list-item__leading" hidden>
              <slot name="leading"></slot>
            </div>
            <div class="pds-list-item__content">
              <span class="pds-list-item__title">
                <slot></slot>
              </span>
              <div class="pds-list-item__description" hidden>
                <slot name="description"></slot>
              </div>
            </div>
            <div class="pds-list-item__trailing" hidden>
              <slot name="trailing"></slot>
            </div>
          </div>
        </mock:shadow-root>
        Onboarding worksheet
      </pds-list-item>
    `);
  });

  it('shows the leading, description and trailing areas when they have content', async () => {
    const page = await newSpecPage({
      components: [PdsListItem],
      html: `
        <pds-list-item>
          <pds-icon slot="leading" name="file"></pds-icon>
          Onboarding worksheet
          <span slot="description">PDF · 1.2 MB</span>
          <pds-button slot="trailing">Download</pds-button>
        </pds-list-item>`,
    });
    const shadow = page.root.shadowRoot;
    expect(shadow.querySelector('.pds-list-item__leading')).not.toHaveAttribute('hidden');
    expect(shadow.querySelector('.pds-list-item__description')).not.toHaveAttribute('hidden');
    expect(shadow.querySelector('.pds-list-item__trailing')).not.toHaveAttribute('hidden');
  });

  it('renders the title as a link when href is set', async () => {
    const page = await newSpecPage({
      components: [PdsListItem],
      html: `<pds-list-item href="/pages/about">About</pds-list-item>`,
    });
    const link = page.root.shadowRoot.querySelector('a.pds-list-item__link');
    expect(link).toHaveAttribute('href');
    expect(link.getAttribute('href')).toBe('/pages/about');
    expect(link.getAttribute('part')).toBe('link');
    expect(link).not.toHaveAttribute('rel');
    expect(page.root.shadowRoot.querySelector('.pds-list-item')).toHaveClass('pds-list-item--interactive');
  });

  it('adds rel="noopener noreferrer" when the link opens in a new tab', async () => {
    const page = await newSpecPage({
      components: [PdsListItem],
      html: `<pds-list-item href="https://example.com" target="_blank">Guide</pds-list-item>`,
    });
    const link = page.root.shadowRoot.querySelector('a.pds-list-item__link');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('shows a slot area once content is added to it', async () => {
    const page = await newSpecPage({
      components: [PdsListItem],
      html: `<pds-list-item>Onboarding worksheet</pds-list-item>`,
    });
    const trailing = page.root.shadowRoot.querySelector('.pds-list-item__trailing');
    expect(trailing).toHaveAttribute('hidden');

    const button = page.doc.createElement('pds-button');
    button.setAttribute('slot', 'trailing');
    page.root.appendChild(button);
    trailing.querySelector('slot').dispatchEvent(new Event('slotchange'));
    await page.waitForChanges();

    expect(trailing).not.toHaveAttribute('hidden');
  });

  it('is a list item only inside a pds-list', async () => {
    const page = await newSpecPage({
      components: [PdsListItem],
      html: `<pds-sortable-item><pds-list-item>Lesson 1: Welcome</pds-list-item></pds-sortable-item>`,
    });
    expect(page.body.querySelector('pds-list-item')).not.toHaveAttribute('role');
  });
});
