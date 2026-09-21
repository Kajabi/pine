import { newSpecPage } from '@stencil/core/testing';
import { PdsModalHeader } from '../pds-modal-header';

describe('pds-modal-header', () => {
  it('renders the slotted content inside a header wrapper', async () => {
    const page = await newSpecPage({
      components: [PdsModalHeader],
      html: `<pds-modal-header>Title</pds-modal-header>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-modal-header>
        <header class="pds-modal__header">Title</header>
      </pds-modal-header>
    `);
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM, nesting a stale header inside the fresh one.
    it('does not nest a second header', async () => {
      const page = await newSpecPage({
        components: [PdsModalHeader],
        html: `
          <pds-modal-header>
            <header class="pds-modal__header">Title</header>
          </pds-modal-header>
        `,
      });

      expect(page.root?.querySelectorAll('header').length).toBe(1);
      expect(page.root?.querySelector('header')?.textContent?.trim()).toBe('Title');
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const page = await newSpecPage({
        components: [PdsModalHeader],
        html: `<pds-modal-header>Title</pds-modal-header>`,
      });

      expect(page.root?.querySelectorAll('header').length).toBe(1);
      expect(page.root?.querySelector('header')?.textContent?.trim()).toBe('Title');
    });
  });
});
