/**
 * Opt-in view transitions for pds-modal (its `transition` prop). Each modal hands its open or close
 * here as an op; ops queued in the same task run together in one same-document view transition, so
 * one modal closing while the next opens (a chain) morphs one panel into the other.
 *
 * The browser holds rendering while the update runs, so nothing in it waits on a frame: the dialog
 * opens and closes synchronously, and the stylesheet keys the panel's visibility to `dialog[open]`
 * while `ROOT_CLASS` is on <html>, not to the `open` class pds-modal renders on a frame.
 */

import type { ModalTransition } from './types';

export interface ModalTransitionOp {
  modal: Element;
  kind: ModalTransition;
  opening: boolean;
  /** The modal's panel, named for the transition. */
  panel: HTMLElement | null;
  /** grow: the element the panel grows from and shrinks back into. */
  origin?: Element | null;
  /** Opens or closes the dialog, as the modal would without a transition. */
  run: () => void;
}

interface Batch {
  ops: ModalTransitionOp[];
  /** The update callback has started: later ops run at once instead of waiting for it. */
  running: boolean;
  /** The update callback has finished: a later op starts a new transition. */
  settled: boolean;
  named: HTMLElement[];
  done: Promise<void>;
  /** Runs an op unless it already ran: the update callback and the skipped-transition path both can. */
  runOnce: (op: ModalTransitionOp) => void;
}

/** On <html> while a modal transition runs. */
export const ROOT_CLASS = 'pds-modal-vt';
const ROOT_CLASSES = ['', '--forward', '--back', '--morph', '--grow-open', '--grow-close'].map(suffix => ROOT_CLASS + suffix);
export const GROW_NAME = 'pds-modal-grow';
export const MORPH_NAME = 'pds-modal-morph';
// A chain's next modal can open a beat after the last one closes (a framework committing in a
// microtask, a second handler); past this, the close plays on its own.
const PARTNER_WAIT_MS = 50;

let batch: Batch | null = null;
/** Modals a morph has moved away from, latest last, so opening one again plays backward. */
let morphHistory: Element[] = [];

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
};
type StartViewTransition = (update: () => Promise<void> | void) => ViewTransitionLike;

function startViewTransitionFn(): StartViewTransition | null {
  if (typeof document === 'undefined') return null;
  const start = (document as Document & { startViewTransition?: StartViewTransition }).startViewTransition;
  return typeof start === 'function' ? start.bind(document) : null;
}

/** Whether a modal transition can play: the View Transitions API is there and motion isn't reduced. */
export function canTransitionModal(): boolean {
  if (!startViewTransitionFn()) return false;
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function setName(el: Element | null | undefined, name: string, named: HTMLElement[]) {
  if (!(el instanceof HTMLElement)) return;
  el.style.setProperty('view-transition-name', name);
  named.push(el);
}

function clearNames(named: HTMLElement[]) {
  for (const el of named.splice(0)) el.style.removeProperty('view-transition-name');
}

/** Whether `el` is on screen: connected, visible, and not inside a dialog that's closed. */
export function isShowing(el: Element | null | undefined): el is HTMLElement {
  if (!(el instanceof HTMLElement) || !el.isConnected) return false;
  if (typeof el.checkVisibility === 'function' && !el.checkVisibility({ checkVisibilityCSS: true })) return false;
  for (let node: Node | null = el; node; node = node instanceof ShadowRoot ? node.host : node.parentNode) {
    if (node.nodeName === 'DIALOG' && !(node as HTMLDialogElement).open) return false;
  }
  return true;
}

/** Names what the old state shows for an op: the trigger a panel grows from, or a panel leaving. */
function nameOld(op: ModalTransitionOp, named: HTMLElement[]) {
  if (op.kind === 'grow') {
    if (op.opening) {
      if (isShowing(op.origin)) setName(op.origin, GROW_NAME, named);
    } else setName(op.panel, GROW_NAME, named);
  } else if (!op.opening) setName(op.panel, MORPH_NAME, named);
}

/** Names what the new state shows: the panel arriving, or the trigger a panel shrinks back into. */
function nameNew(op: ModalTransitionOp, named: HTMLElement[]) {
  if (op.kind === 'grow') {
    if (op.opening) setName(op.panel, GROW_NAME, named);
    else if (isShowing(op.origin)) setName(op.origin, GROW_NAME, named);
  } else if (op.opening) setName(op.panel, MORPH_NAME, named);
}

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/** Back when the modal opening is the one the chain last moved away from; forward otherwise. */
function morphDirection(ops: ModalTransitionOp[]): 'forward' | 'back' | null {
  const closing = ops.find(op => op.kind === 'morph' && !op.opening);
  const opening = ops.find(op => op.kind === 'morph' && op.opening);
  if (!opening || !closing) {
    // A chain closed (or opened) on its own: nothing to morph between, and nothing to go back to.
    morphHistory = [];
    return null;
  }
  if (morphHistory[morphHistory.length - 1] === opening.modal) {
    morphHistory.pop();
    return 'back';
  }
  morphHistory.push(closing.modal);
  return 'forward';
}

/**
 * Runs `op` inside a view transition, together with any other modal op queued in the same task.
 * Without the API, or with reduced motion, it runs at once, exactly as it would with no transition.
 * Resolves once the op has run. Never rejects: a transition the browser skips (another one started,
 * a duplicate name, the update timing out) still runs every op, and only loses the animation.
 */
export function runModalTransition(op: ModalTransitionOp): Promise<void> {
  const start = startViewTransitionFn();
  if (!start || !canTransitionModal()) {
    op.run();
    return Promise.resolve();
  }

  if (batch && !batch.settled) {
    const current = batch;
    // The same modal twice (opened and closed again before the frame) can't hold the name twice.
    const repeat = current.ops.some(queued => queued.modal === op.modal);
    current.ops.push(op);
    if (current.running) {
      current.runOnce(op);
      if (!repeat) nameNew(op, current.named);
    } else if (!repeat) nameOld(op, current.named);
    return current.done;
  }

  const root = document.documentElement;
  const named: HTMLElement[] = [];
  const ran = new WeakSet<ModalTransitionOp>();
  const runOnce = (queued: ModalTransitionOp) => {
    if (ran.has(queued)) return;
    ran.add(queued);
    queued.run();
  };
  const next: Batch = { ops: [op], running: false, settled: false, named, done: Promise.resolve(), runOnce };
  batch = next;
  root.classList.add(ROOT_CLASS);
  nameOld(op, named);

  const update = async () => {
    next.running = true;
    clearNames(named);
    try {
      for (const queued of [...next.ops]) runOnce(queued);
      // A chain's close waits briefly for the next modal so the two morph as one.
      const hasMorphClose = () => next.ops.some(queued => queued.kind === 'morph' && !queued.opening);
      const hasMorphOpen = () => next.ops.some(queued => queued.kind === 'morph' && queued.opening);
      if (hasMorphClose() && !hasMorphOpen()) {
        const started = performance.now();
        while (!hasMorphOpen() && performance.now() - started < PARTNER_WAIT_MS) await wait(10);
      }
      const seen = new Set<Element>();
      for (const queued of next.ops) {
        if (seen.has(queued.modal)) continue;
        seen.add(queued.modal);
        nameNew(queued, named);
      }
      const direction = morphDirection(next.ops);
      // Only a swap holds the backdrop still; a morph modal opening or closing on its own fades it.
      if (direction) root.classList.add(`${ROOT_CLASS}--${direction}`, `${ROOT_CLASS}--morph`);
      const grow = next.ops.find(queued => queued.kind === 'grow');
      if (grow) root.classList.add(`${ROOT_CLASS}--${grow.opening ? 'grow-open' : 'grow-close'}`);
    } finally {
      next.settled = true;
      if (batch === next) batch = null;
    }
  };

  const cleanUp = () => {
    clearNames(named);
    // A newer transition owns the root class now; leave it.
    if (batch === null || batch === next) {
      root.classList.remove(...ROOT_CLASSES);
    }
  };

  let transition: ViewTransitionLike;
  try {
    transition = start(update);
  } catch {
    // An engine that throws on start: run the ops plainly.
    next.ops.forEach(runOnce);
    next.settled = true;
    if (batch === next) batch = null;
    cleanUp();
    return Promise.resolve();
  }

  transition.ready.catch(() => undefined);
  transition.finished.catch(() => undefined).finally(cleanUp);
  next.done = transition.updateCallbackDone.catch(() => {
    // The update threw or was skipped before running: make sure nothing is left half open.
    next.ops.forEach(runOnce);
  });
  return next.done;
}

/** For tests: forgets the batch and the morph history between cases. */
export function resetModalTransitions() {
  batch = null;
  morphHistory = [];
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove(...ROOT_CLASSES);
  }
}
