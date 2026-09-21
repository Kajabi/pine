import { newSpecPage } from '@stencil/core/testing';

/**
 * Generic guard against the page-cache (Turbo, browser bfcache) reconnect bug class:
 * a light-DOM (`shadow: false` or `scoped: true`) component that wraps its slotted
 * content in a rendered element is reconnected over its own prior render, nesting
 * (or duplicating, or losing) content.
 *
 * Hydrates `html`, re-parses the resulting markup the way a cache restore reconnects
 * a component over its own output, and asserts no duplicate `id`s and no content
 * loss or duplication survive the second pass.
 */
export async function expectReconnectSafe(
  components: unknown[],
  html: string,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const first = await newSpecPage({ components: components as any, html });
  const hydrated = first.root?.outerHTML ?? '';
  const originalText = normalizeText(first.root?.textContent ?? '');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const second = await newSpecPage({ components: components as any, html: hydrated });
  const reconnectedText = normalizeText(second.root?.textContent ?? '');
  expect(reconnectedText).toBe(originalText);

  const ids = Array.from(second.root?.querySelectorAll('[id]') ?? []).map((el) => el.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  expect(duplicateIds).toEqual([]);
}

// Strips whitespace entirely rather than collapsing it: an outerHTML round-trip through
// re-parsing can introduce or lose insignificant whitespace between elements, which isn't
// the content-loss/duplication bug this guard is checking for.
function normalizeText(text: string): string {
  return text.replace(/\s+/g, '');
}
