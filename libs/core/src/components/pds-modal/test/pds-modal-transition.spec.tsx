import { newSpecPage } from '@stencil/core/testing';
import { PdsModal } from '../pds-modal';
import { GROW_NAME, MORPH_NAME, ROOT_CLASS, resetModalTransitions } from '../../../utils/modal-view-transition';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Deferred = { promise: Promise<void>; resolve: () => void; reject: (e: unknown) => void };
const deferred = (): Deferred => {
  let resolve!: () => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

interface FakeTransition {
  update: () => Promise<void> | void;
  /** View-transition names on the page when the transition started (the old state). */
  oldNames: Record<string, string>;
  /** Names once the update ran (the new state). */
  newNames: Record<string, string>;
  /** <html> classes once the update ran. */
  rootClasses: string[];
  finished: Deferred;
  /** Runs the update, as the browser does once it has captured the old state. */
  capture: () => Promise<void>;
  updateCallbackDone: Promise<void>;
}

/**
 * A stand-in for document.startViewTransition: it records the transition and runs the update only
 * when the test calls `capture()`, so a test can act between the start and the update.
 */
function mockStartViewTransition(doc: Document) {
  const transitions: FakeTransition[] = [];
  const names = () => {
    const found: Record<string, string> = {};
    doc.querySelectorAll('*').forEach((el: Element) => {
      const name = (el as HTMLElement).style?.getPropertyValue('view-transition-name');
      if (name) found[name] = el.id || el.className || el.tagName.toLowerCase();
    });
    return found;
  };
  const start = jest.fn((update: () => Promise<void> | void) => {
    const done = deferred();
    const t: FakeTransition = {
      update,
      oldNames: names(),
      newNames: {},
      rootClasses: [],
      finished: deferred(),
      updateCallbackDone: done.promise,
      capture: async () => {
        try {
          await update();
          t.newNames = names();
          t.rootClasses = doc.documentElement.className.split(/\s+/);
          done.resolve();
        } catch (e) {
          done.reject(e);
        }
      },
    };
    transitions.push(t);
    return { ready: done.promise, finished: t.finished.promise, updateCallbackDone: done.promise };
  });
  (doc as any).startViewTransition = start;
  (globalThis as any).document.startViewTransition = start;
  return { start, transitions };
}

/** A <dialog> stand-in the modal can open and close: mock-doc doesn't implement the dialog API. */
function stubDialog(instance: PdsModal) {
  const dialog = (instance as any).el.querySelector('dialog');
  const showModal = jest.fn(() => (dialog.open = true));
  const close = jest.fn(() => (dialog.open = false));
  dialog.showModal = showModal;
  dialog.show = jest.fn(() => (dialog.open = true));
  dialog.close = close;
  dialog.open = false;
  (instance as any).modalRef = dialog;
  (instance as any).updateFocusableElements = jest.fn();
  (instance as any).setInitialFocus = jest.fn();
  return { dialog, showModal, close };
}

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('pds-modal transition', () => {
  afterEach(() => {
    resetModalTransitions();
    delete (globalThis as any).document.startViewTransition;
    delete (globalThis as any).window.matchMedia;
  });

  const growPage = async (attrs = 'transition="grow"') =>
    newSpecPage({
      components: [PdsModal],
      html: `<button id="trigger">Open</button><pds-modal id="inner" ${attrs}></pds-modal>`,
    });

  it('opens at once without the View Transitions API', async () => {
    const page = await growPage();
    const { showModal } = stubDialog(page.rootInstance);

    await page.rootInstance.showModal();

    expect(showModal).toHaveBeenCalled();
    expect(page.rootInstance.open).toBe(true);
    expect(page.doc.documentElement.classList.contains(ROOT_CLASS)).toBe(false);
  });

  it('opens at once without a transition prop, even with the API', async () => {
    const page = await growPage('');
    const { start } = mockStartViewTransition(page.doc);
    const { showModal } = stubDialog(page.rootInstance);

    await page.rootInstance.showModal();

    expect(start).not.toHaveBeenCalled();
    expect(showModal).toHaveBeenCalled();
  });

  it('opens at once under prefers-reduced-motion', async () => {
    const page = await growPage();
    const { start } = mockStartViewTransition(page.doc);
    (globalThis as any).window.matchMedia = jest.fn(() => ({ matches: true }));
    const { showModal } = stubDialog(page.rootInstance);

    await page.rootInstance.showModal();

    expect(start).not.toHaveBeenCalled();
    expect(showModal).toHaveBeenCalled();
  });

  it('grows from the trigger: the dialog opens inside the transition, the trigger then the panel named', async () => {
    const page = await growPage('transition="grow" transition-origin="trigger"');
    const { start, transitions } = mockStartViewTransition(page.doc);
    const { showModal } = stubDialog(page.rootInstance);

    const opened = page.rootInstance.showModal();
    expect(start).toHaveBeenCalledTimes(1);
    expect(showModal).not.toHaveBeenCalled();
    expect(transitions[0].oldNames).toEqual({ [GROW_NAME]: 'trigger' });
    expect(page.doc.documentElement.classList.contains(ROOT_CLASS)).toBe(true);

    await transitions[0].capture();
    await opened;

    expect(showModal).toHaveBeenCalled();
    expect(page.rootInstance.open).toBe(true);
    expect(transitions[0].newNames).toEqual({ [GROW_NAME]: 'pds-modal pds-modal--md pds-modal--scrollable' });

    transitions[0].finished.resolve();
    await flush();
    expect(page.doc.documentElement.classList.contains(ROOT_CLASS)).toBe(false);
    expect(page.doc.querySelector('.pds-modal')?.getAttribute('style') ?? '').not.toContain('view-transition-name');
  });

  it('shrinks back into the trigger on close: the panel then the trigger named', async () => {
    const page = await growPage('transition="grow" transition-origin="trigger"');
    const { transitions } = mockStartViewTransition(page.doc);
    const { close } = stubDialog(page.rootInstance);

    const opened = page.rootInstance.showModal();
    await transitions[0].capture();
    await opened;
    transitions[0].finished.resolve();
    await flush();

    const closed = page.rootInstance.hideModal();
    expect(close).not.toHaveBeenCalled();
    expect(transitions[1].oldNames).toEqual({ [GROW_NAME]: 'pds-modal pds-modal--md pds-modal--scrollable' });

    await transitions[1].capture();
    await closed;

    expect(close).toHaveBeenCalled();
    expect(page.rootInstance.open).toBe(false);
    expect(transitions[1].newNames).toEqual({ [GROW_NAME]: 'trigger' });
  });

  it('closes on its own when hideModal is called twice before the transition runs', async () => {
    const page = await growPage();
    const { start, transitions } = mockStartViewTransition(page.doc);
    const { dialog, close } = stubDialog(page.rootInstance);
    dialog.open = true;
    page.rootInstance.open = true;

    const first = page.rootInstance.hideModal();
    const second = page.rootInstance.hideModal();
    await transitions[0].capture();
    await Promise.all([first, second]);

    expect(start).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalled();
  });

  it('opens nothing when closed again before the transition runs', async () => {
    const page = await growPage();
    const { transitions } = mockStartViewTransition(page.doc);
    const { showModal, close } = stubDialog(page.rootInstance);

    const opened = page.rootInstance.showModal();
    await page.rootInstance.hideModal();
    await transitions[0].capture();
    await opened;

    expect(showModal).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
    expect(page.rootInstance.open).toBe(false);
  });

  it('still opens when the browser skips the transition before its update', async () => {
    const page = await growPage();
    const start = jest.fn(() => {
      const skipped = Promise.reject(new DOMException('Skipped', 'AbortError'));
      return { ready: skipped, finished: skipped, updateCallbackDone: skipped };
    });
    (globalThis as any).document.startViewTransition = start;
    const { showModal } = stubDialog(page.rootInstance);

    await page.rootInstance.showModal();
    await flush();

    expect(start).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalled();
    expect(page.doc.documentElement.classList.contains(ROOT_CLASS)).toBe(false);
  });

  it('still opens when startViewTransition throws', async () => {
    const page = await growPage();
    (globalThis as any).document.startViewTransition = jest.fn(() => {
      throw new Error('nope');
    });
    const { showModal } = stubDialog(page.rootInstance);

    await page.rootInstance.showModal();

    expect(showModal).toHaveBeenCalled();
    expect(page.doc.documentElement.classList.contains(ROOT_CLASS)).toBe(false);
  });

  it('leaves the root class to a second transition that starts while the first finishes', async () => {
    const page = await growPage();
    const { start, transitions } = mockStartViewTransition(page.doc);
    stubDialog(page.rootInstance);

    const opened = page.rootInstance.showModal();
    await transitions[0].capture();
    await opened;
    // The first one is still animating when the modal closes: a new transition starts, and the
    // browser skips the first, rejecting its finished promise.
    const closed = page.rootInstance.hideModal();
    expect(start).toHaveBeenCalledTimes(2);
    transitions[0].finished.reject(new DOMException('Skipped', 'AbortError'));
    await flush();
    expect(page.doc.documentElement.classList.contains(ROOT_CLASS)).toBe(true);

    await transitions[1].capture();
    await closed;
    transitions[1].finished.resolve();
    await flush();
    expect(page.doc.documentElement.classList.contains(ROOT_CLASS)).toBe(false);
    expect(page.rootInstance.open).toBe(false);
  });

  describe('morph', () => {
    const chainPage = () =>
      newSpecPage({
        components: [PdsModal],
        html: `<pds-modal id="one" transition="morph"></pds-modal><pds-modal id="two" transition="morph"></pds-modal>`,
      });

    it('swaps two modals in one transition, forward and then back', async () => {
      const page = await chainPage();
      const { start, transitions } = mockStartViewTransition(page.doc);
      const [one, two] = Array.from(page.doc.querySelectorAll('pds-modal')) as any[];
      const stubEl = (modal: any) => {
        const dialog = modal.querySelector('dialog');
        dialog.showModal = jest.fn(() => (dialog.open = true));
        dialog.close = jest.fn(() => (dialog.open = false));
        dialog.open = false;
        return dialog;
      };
      const oneDialog = stubEl(one);
      const twoDialog = stubEl(two);
      // The first open runs in a transition of its own; let it finish.
      const firstOpen = one.showModal();
      await flush();
      await transitions[0].capture();
      await firstOpen;
      expect(oneDialog.open).toBe(true);
      transitions[0].finished.resolve();
      await flush();
      transitions.length = 0;
      start.mockClear();

      // Forward: one closes as two opens, in the same task.
      const forward = Promise.all([one.hideModal(), two.showModal()]);
      await flush();
      expect(start).toHaveBeenCalledTimes(1);
      expect(Object.keys(transitions[0].oldNames)).toEqual([MORPH_NAME]);
      await transitions[0].capture();
      await forward;
      expect(oneDialog.open).toBe(false);
      expect(twoDialog.open).toBe(true);
      expect(transitions[0].rootClasses).toEqual(expect.arrayContaining([`${ROOT_CLASS}--forward`, `${ROOT_CLASS}--morph`]));
      transitions[0].finished.resolve();
      await flush();

      // Back: two closes as one opens again.
      const back = Promise.all([two.hideModal(), one.showModal()]);
      await flush();
      await transitions[1].capture();
      await back;
      expect(oneDialog.open).toBe(true);
      expect(twoDialog.open).toBe(false);
      expect(transitions[1].rootClasses).toContain(`${ROOT_CLASS}--back`);
    });
  });
});
