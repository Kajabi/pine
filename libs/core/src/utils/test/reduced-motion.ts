/* istanbul ignore file -- page.evaluate runs in the browser; coverage globals are unavailable there */
import type { E2EPage } from '@stencil/core/testing';

/**
 * Reads a target's computed `transition-duration` from within `hostTag`,
 * optionally on a pseudo-element (e.g. `::after`). Works whether `hostTag`
 * renders to a real shadow root (`shadow: true`) or scoped/light DOM
 * (`shadow: false` / `scoped: true`) — Pine components use both.
 *
 * `innerSelector` may be omitted (or `null`) to read the host element itself.
 *
 * Embeds the arguments in a string-evaluated IIFE, the same workaround
 * `runAxe` uses, rather than passing a real function to `page.$eval`: under
 * Jest's coverage instrumentation, a function reference gets serialized with
 * injected `cov_*` counter calls that don't exist in the browser's isolated
 * execution context, throwing a `ReferenceError` there.
 */
async function readTransitionDuration(
  page: E2EPage,
  hostTag: string,
  innerSelector: string | null,
  pseudoElement: string | null,
): Promise<string> {
  const argsJson = JSON.stringify({ hostTag, innerSelector, pseudoElement });
  return page.evaluate(`
    (() => {
      const args = ${argsJson};
      const el = document.querySelector(args.hostTag);
      const root = el.shadowRoot || el;
      const target = args.innerSelector ? root.querySelector(args.innerSelector) : el;
      return getComputedStyle(target, args.pseudoElement || null).transitionDuration;
    })()
  `) as Promise<string>;
}

/**
 * Asserts that an element's `transition-duration` collapses to `0s` once the
 * page emulates `prefers-reduced-motion: reduce`.
 *
 * This is the runtime counterpart to the `pine-design-system/no-hardcoded-motion`
 * Stylelint rule: the rule can only see a component's *source* — that it
 * references `var(--pine-motion-duration-*)` somewhere. It can't see whether
 * that reference actually reaches the declaration that runs at render time
 * (a `var()` could be shadowed, overridden, or simply never wired up right).
 * This closes that gap by reading the real computed style before and after
 * emulating the preference, so a target that *doesn't* zero out fails loudly
 * here even if it fooled the lint rule.
 *
 * Usage:
 *
 * ```ts
 * const page = await newE2EPage();
 * await page.setContent('<pds-switch></pds-switch>');
 * await expectRespectsReducedMotion(page, 'pds-switch', 'input', 'after');
 * ```
 *
 * @param page Stencil E2E page.
 * @param hostTag Custom element tag hosting the shadow root to read from.
 * @param innerSelector Selector for the element within `hostTag`'s shadow
 *   root, or `null`/omitted to read `hostTag` itself.
 * @param pseudoElement Pseudo-element to read from the target (e.g. `'after'`
 *   for `::after`), or `null`/omitted to read the element's own style.
 */
export async function expectRespectsReducedMotion(
  page: E2EPage,
  hostTag: string,
  innerSelector: string | null = null,
  pseudoElement: string | null = null,
): Promise<void> {
  const before = await readTransitionDuration(page, hostTag, innerSelector, pseudoElement);

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.waitForChanges();

  const after = await readTransitionDuration(page, hostTag, innerSelector, pseudoElement);

  // `transitionDuration` can list one value per transitioned property
  // (e.g. "0.2s, 0.2s"); every one of them must have zeroed out.
  const allZero = after.split(',').every((part) => parseFloat(part.trim()) === 0);

  if (!allZero) {
    const target = `${hostTag}${innerSelector ? ` >>> ${innerSelector}` : ''}${
      pseudoElement ? `::${pseudoElement}` : ''
    }`;
    throw new Error(
      `Expected "${target}" to have a zero transition-duration under prefers-reduced-motion, ` +
        `but got "${after}" (was "${before}" before emulating the preference). Its transition ` +
        `is not actually routed through a --pine-motion-duration-* token at render time.`,
    );
  }
}
