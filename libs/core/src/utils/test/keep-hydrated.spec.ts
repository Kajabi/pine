import { isStencilClass, keepPineHydrated, limitRestores } from '../keep-hydrated';

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

  it('gives up on a component another script keeps stripping, warns once, and still restores the rest', async () => {
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
    expect(warn).toHaveBeenCalledWith('%s', 'pds-button: stopped putting back its hydrated and scope classes, as another script keeps removing them.', fought);

    // The next task, a later class change brings it back, though its old value no longer has
    // `hydrated` (the script's last strip took it), and giving up again stays quiet.
    await new Promise((resolve) => setTimeout(resolve, 10));
    fought.className = 'consumer';
    restore(fought, '');
    expect(fought.classList.contains('hydrated')).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
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

describe('limitRestores()', () => {
  // The count resets on a MessageChannel message, which runs after a zero timer is queued behind it.
  const nextTask = () => new Promise((resolve) => setTimeout(resolve, 10));

  it('stops after five writes before the next task, warns once with the element, and writes again after it', async () => {
    const restore = jest.fn(() => true);
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const el = document.createElement('pds-box');
    const limited = limitRestores(restore, 'pds-box: stopped restoring', el);

    for (let i = 0; i < 20; i += 1) limited();
    expect(restore).toHaveBeenCalledTimes(5);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('%s', 'pds-box: stopped restoring', el);

    await nextTask();
    limited();
    expect(restore).toHaveBeenCalledTimes(6);
    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockRestore();
  });

  // Callbacks that find nothing to put back (the observer seeing its own write, Stencil's renders,
  // unrelated attribute changes) mustn't use up the budget a real strip needs.
  it("doesn't count calls that wrote nothing", () => {
    const restore = jest.fn(() => false);
    const limited = limitRestores(restore, 'pds-box: stopped restoring');

    for (let i = 0; i < 20; i += 1) limited();

    expect(restore).toHaveBeenCalledTimes(20);
  });

  it('warns once per element for each kind of restore that gives up', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const el = document.createElement('pds-button');
    const host = limitRestores(() => true, 'pds-button: stopped restoring its host', el, 'host');
    const classes = limitRestores(() => true, 'pds-button: stopped putting back its classes', el, 'host');
    const aria = limitRestores(() => true, 'pds-popover: stopped restoring its trigger ARIA', el);

    for (let round = 0; round < 7; round += 1) {
      host();
      classes();
      aria();
    }

    expect(warn.mock.calls.map(([, text]) => text)).toEqual([
      'pds-button: stopped restoring its host',
      'pds-popover: stopped restoring its trigger ARIA',
    ]);
    warn.mockRestore();
  });

  it('passes its arguments through', () => {
    const restore = jest.fn(() => false);
    limitRestores(restore, 'pds-row: stopped restoring')('a', 1);
    expect(restore).toHaveBeenCalledWith('a', 1);
  });
});
