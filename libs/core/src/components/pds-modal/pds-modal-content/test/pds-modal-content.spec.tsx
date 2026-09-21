import { newSpecPage } from '@stencil/core/testing';
import { PdsModalContent } from '../pds-modal-content';
import { expectReconnectSafe } from '../../../../utils/test/reconnect-safety';

describe('pds-modal-content', () => {
  it('renders the slotted content inside a content wrapper', async () => {
    const page = await newSpecPage({
      components: [PdsModalContent],
      html: `<pds-modal-content>Body</pds-modal-content>`,
    });

    expect(page.root?.querySelector('.pds-modal-content')?.textContent?.trim()).toBe('Body');
  });

  describe('reconnecting over an already-hydrated snapshot', () => {
    // A page-cache restore (Turbo, bfcache) can reconnect this element with its own
    // prior render already in its light DOM, nesting a stale .pds-modal-content inside
    // the fresh one.
    it('does not nest a second .pds-modal-content', async () => {
      const page = await newSpecPage({
        components: [PdsModalContent],
        html: `
          <pds-modal-content>
            <div class="pds-modal-content pds-modal-content--border-none" tabindex="-1">Body</div>
          </pds-modal-content>
        `,
      });

      expect(page.root?.querySelectorAll('.pds-modal-content').length).toBe(1);
      expect(page.root?.querySelector('.pds-modal-content')?.textContent?.trim()).toBe('Body');
    });

    it('leaves pristine (never-hydrated) content alone', async () => {
      const page = await newSpecPage({
        components: [PdsModalContent],
        html: `<pds-modal-content>Body</pds-modal-content>`,
      });

      expect(page.root?.querySelectorAll('.pds-modal-content').length).toBe(1);
      expect(page.root?.querySelector('.pds-modal-content')?.textContent?.trim()).toBe('Body');
    });

    it('is reconnect-safe (generic guard)', async () => {
      await expectReconnectSafe([PdsModalContent], `<pds-modal-content>Body</pds-modal-content>`);
    });
  });
});
