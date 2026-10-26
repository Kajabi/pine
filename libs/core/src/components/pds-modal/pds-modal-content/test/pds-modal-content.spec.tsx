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

  describe('resize and scroll listeners', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('removes the same resize listener it added when removed from the page', async () => {
      const page = await newSpecPage({ components: [PdsModalContent], html: '' });
      const addSpy = jest.spyOn(window, 'addEventListener');
      const removeSpy = jest.spyOn(window, 'removeEventListener');
      await page.setContent(`<pds-modal-content>Body</pds-modal-content>`);
      const resizeHandler = addSpy.mock.calls.find(([type]) => type === 'resize')?.[1];

      page.root!.remove();

      expect(resizeHandler).toBeDefined();
      expect(removeSpy).toHaveBeenCalledWith('resize', resizeHandler);
    });

    it('stops handling resize and scroll once removed from the page', async () => {
      const page = await newSpecPage({
        components: [PdsModalContent],
        html: `<pds-modal-content>Body</pds-modal-content>`,
      });
      const root = page.root!;
      root.remove();
      const calculateMaxHeight = jest.spyOn(page.rootInstance, 'calculateMaxHeight');
      const updateBorders = jest.spyOn(page.rootInstance, 'updateBorders');

      window.dispatchEvent(new Event('resize'));
      root.dispatchEvent(new Event('scroll'));

      expect(calculateMaxHeight).not.toHaveBeenCalled();
      expect(updateBorders).not.toHaveBeenCalled();
    });

    it('handles resize and scroll once each after being removed and put back', async () => {
      const page = await newSpecPage({
        components: [PdsModalContent],
        html: `<pds-modal-content>Body</pds-modal-content>`,
      });
      const root = page.root!;
      root.remove();
      page.body.appendChild(root);
      await page.waitForChanges();
      const calculateMaxHeight = jest.spyOn(page.rootInstance, 'calculateMaxHeight');
      const updateBorders = jest.spyOn(page.rootInstance, 'updateBorders');

      window.dispatchEvent(new Event('resize'));
      root.dispatchEvent(new Event('scroll'));

      expect(calculateMaxHeight).toHaveBeenCalledTimes(1);
      expect(updateBorders).toHaveBeenCalledTimes(1);
    });
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
