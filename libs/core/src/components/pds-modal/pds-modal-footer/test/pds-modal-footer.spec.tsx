import { newSpecPage } from '@stencil/core/testing';
import { PdsModalFooter } from '../pds-modal-footer';

describe('pds-modal-footer', () => {
  it('renders the slotted content inside a footer wrapper', async () => {
    const page = await newSpecPage({
      components: [PdsModalFooter],
      html: `<pds-modal-footer>Actions</pds-modal-footer>`,
    });

    expect(page.root).toEqualHtml(`
      <pds-modal-footer>
        <footer class="pds-modal__footer">Actions</footer>
      </pds-modal-footer>
    `);
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM, nesting a stale footer inside the fresh one.
    it('does not nest a second footer', async () => {
      const page = await newSpecPage({
        components: [PdsModalFooter],
        html: `
          <pds-modal-footer>
            <footer class="pds-modal__footer">Actions</footer>
          </pds-modal-footer>
        `,
      });

      expect(page.root?.querySelectorAll('footer').length).toBe(1);
      expect(page.root?.querySelector('footer')?.textContent?.trim()).toBe('Actions');
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const page = await newSpecPage({
        components: [PdsModalFooter],
        html: `<pds-modal-footer>Actions</pds-modal-footer>`,
      });

      expect(page.root?.querySelectorAll('footer').length).toBe(1);
      expect(page.root?.querySelector('footer')?.textContent?.trim()).toBe('Actions');
    });
  });
});
