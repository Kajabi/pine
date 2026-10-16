import { isStencilClass, keepPineHydrated } from '../keep-hydrated';

const OBSERVER = Symbol.for('@pine-ds/core/keepPineHydrated');

// Captures what keepPineHydrated hands its observer, so the tests can feed it records directly.
class FakeObserver {
  static instances: FakeObserver[] = [];
  observed: [Node, MutationObserverInit][] = [];
  constructor(public callback: MutationCallback) {
    FakeObserver.instances.push(this);
  }
  observe(target: Node, options: MutationObserverInit) {
    this.observed.push([target, options]);
  }
  disconnect() {}
}

const record = (target: Element, oldValue: string | null) =>
  ({ target, oldValue, attributeName: 'class' }) as unknown as MutationRecord;

describe('keepPineHydrated()', () => {
  const original = globalThis.MutationObserver;

  beforeEach(() => {
    FakeObserver.instances = [];
    delete (globalThis as Record<symbol, unknown>)[OBSERVER];
    globalThis.MutationObserver = FakeObserver as unknown as typeof MutationObserver;
  });

  afterEach(() => {
    globalThis.MutationObserver = original;
    delete (globalThis as Record<symbol, unknown>)[OBSERVER];
  });

  const restore = (el: Element, oldValue: string | null) =>
    FakeObserver.instances[0].callback([record(el, oldValue)], FakeObserver.instances[0] as unknown as MutationObserver);

  it('does nothing without MutationObserver, as when rendering on the server', () => {
    globalThis.MutationObserver = undefined;

    expect(() => keepPineHydrated()).not.toThrow();
    expect((globalThis as Record<symbol, unknown>)[OBSERVER]).toBeUndefined();
  });

  it('watches class changes across the whole document, once however often it is called', () => {
    keepPineHydrated();
    keepPineHydrated();

    expect(FakeObserver.instances).toHaveLength(1);
    expect(FakeObserver.instances[0].observed).toEqual([
      [document, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true }],
    ]);
  });

  it("puts back the Stencil classes a Pine component had, and nothing else", () => {
    keepPineHydrated();
    const el = document.createElement('pds-radio');
    el.className = 'consumer';

    restore(el, 'consumer hydrated sc-pds-radio sc-pds-radio-h extra sc-other');

    expect(el.className.split(' ').sort()).toEqual(['consumer', 'hydrated', 'sc-pds-radio', 'sc-pds-radio-h']);
  });

  it("doesn't add a class the component never had, so it never runs ahead of Stencil", () => {
    keepPineHydrated();
    const el = document.createElement('pds-button');

    restore(el, 'consumer');

    expect(el.classList.contains('hydrated')).toBe(false);
  });

  it('leaves elements other than Pine components alone, and records with no old value', () => {
    keepPineHydrated();
    const div = document.createElement('div');
    const button = document.createElement('pds-button');

    restore(div, 'hydrated');
    restore(button, null);

    expect(div.classList.contains('hydrated')).toBe(false);
    expect(button.classList.contains('hydrated')).toBe(false);
  });

  it('gives up on a component another script keeps stripping, warns once, and still restores the rest', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    keepPineHydrated();
    const fought = document.createElement('pds-button');
    const other = document.createElement('pds-input');

    // The other script strips it again after every restore, all before the next task.
    for (let round = 0; round < 8; round += 1) {
      fought.className = '';
      restore(fought, 'hydrated');
    }
    restore(other, 'hydrated');

    expect(fought.classList.contains('hydrated')).toBe(false);
    expect(other.classList.contains('hydrated')).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('pds-button: stopped putting back its hydrated class, as another script keeps removing it.', fought);
    warn.mockRestore();
  });
});

describe('isStencilClass()', () => {
  it("matches hydrated and the element's own scope classes only", () => {
    const el = document.createElement('pds-radio');

    expect(['hydrated', 'sc-pds-radio', 'sc-pds-radio-h', 'sc-pds-radio-s'].every((name) => isStencilClass(el, name))).toBe(true);
    expect(['sc-pds-box', 'sc-bdVaJa', 'pds-radio'].some((name) => isStencilClass(el, name))).toBe(false);
  });
});
