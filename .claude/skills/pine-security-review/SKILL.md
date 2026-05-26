---
name: pine-security-review
description: Security review criteria for Pine components. Pine ships pds-* web components that consume user content via slots and props. Reviewer focuses on XSS via innerHTML, slot sanitization, URL-prop validation, event handler injection, and secret leakage.
---

# Security Review (Pine)

Review Pine component changes for security issues. Pine is a Stencil web
component library — it has no backend, no auth boundary, and no
session state. Security concerns are scoped to:

1. **XSS** — rendering user-controllable strings via `innerHTML` or
   `dangerouslySetInnerHTML`.
2. **Slot escape hatches** — content distributed via `<slot>` arrives
   from consumers; reviewer checks any time a slot's content is
   programmatically read (`querySelector`, `assignedNodes()`, etc.) and
   reflected somewhere unsafe.
3. **URL-prop validation** — props that accept arbitrary URLs
   (`href`, `removeUrl`, `imageUrl`, `videoSrc`, …) need
   `javascript:` / `data:` / null-byte guards.
4. **Event handler injection** — accepting an event handler as a string
   prop and assigning it via `setAttribute('onclick', value)` is a
   no-go.
5. **Secret leakage** — no API keys, tokens, or internal URLs in
   committed source, story args, or test fixtures.

This is intentionally lighter than the kp security review (no auth, no
data scoping concerns), but it's a real check and runs as part of the
gauntlet.

## When to Use

- After any component code change that touches `innerHTML`,
  `dangerouslySetInnerHTML`, slot content reading, or URL-typed props
- As part of the gauntlet
- When a new component or prop is added

## Security Architecture Context

- **Output:** Stencil compiles to native web components. Pine renders
  via JSX in `render()`; Stencil escapes interpolated text by default.
  `innerHTML` / `dangerouslySetInnerHTML` bypass escaping.
- **Slots:** Consumer-provided content. Pine never sanitizes slot
  content; consumers are expected to do that. The reviewer's job is to
  catch any place Pine *introspects* slot content and reflects it
  elsewhere.
- **No server-side rendering issues here** — Pine compiles to native
  custom elements; SSR concerns live in the consuming application.

## Security Review Checklist

### BLOCKER Severity

- **`element.innerHTML = userInput`** — Any direct assignment of a
  prop or slot-derived string to `.innerHTML`, `.outerHTML`, or
  `insertAdjacentHTML`. Use `textContent` for string content, or render
  via JSX with normal interpolation.
- **`dangerouslySetInnerHTML` in JSX** — Same risk. Allowed only if
  there's an explicit allow-list of HTML the prop accepts AND the prop
  name is unambiguous (e.g. `unsafeHTML`) AND it's documented.
- **Reflecting slot content into an HTML attribute or event handler
  without sanitization** — e.g. reading
  `el.querySelector('.something')?.textContent` and feeding it into
  `setAttribute('data-foo', value)` with no length / character check.
- **URL prop that doesn't reject `javascript:` / `data:` / `vbscript:`
  schemes** — Any prop typed as a URL and rendered into an `href`,
  `src`, or `formaction` must filter or refuse these schemes. The
  existing pattern in `pds-chip`'s `removeUrl` validation is the
  reference.
- **Hardcoded credentials or internal URLs** — API keys, tokens,
  internal admin URLs, or staging URLs in source, story args, or
  fixtures.
- **`eval` / `new Function` / `setTimeout(string, …)` /
  `setInterval(string, …)`** — String-as-code is forbidden.

### SHOULD FIX Severity

- **Event handler accepted as a prop and assigned via
  `setAttribute('onclick', …)`** — Wire it via JSX `onClick` instead so
  Stencil binds it as a function, not an inline-script attribute.
- **URL prop without target / rel validation** — When the prop accepts
  `target="_blank"`, ensure the rendered link gets
  `rel="noopener noreferrer"` (the existing chip pattern in
  `pds-chip.tsx`'s `renderCloseButton()` is the model).
- **String concatenation into a `style` attribute** — Prefer object-form
  `style={{ ... }}` so values are escaped; raw concatenation lets a
  CSS-injection payload through.
- **Logging full prop bag or full payload in event emitters** —
  `console.log({...this})` in a public method can surface anything a
  consumer passed in. Pine ships to public NPM; default `console`
  noise leaks consumer-side data.

### CONSIDER Severity

- **Permissive URL prop type** — Typing as `string` when only a known
  set of schemes (`http:`, `https:`, `mailto:`, relative) is expected.
  A union type or runtime validator tightens the contract.
- **Slot length expectations** — Some consumer slots expect a single
  text child; documenting and softly enforcing that prevents abuse.
- **Story args that look like real data** — Stories should use obvious
  placeholders (`"Lorem ipsum"`, `"jane@example.com"`), not anything
  resembling production identifiers.

## Common Pine patterns to verify

### URL-prop validation (pds-chip pattern)

```tsx
// Good — validated rel + target wiring
const linkAttrs = { href: this.removeUrl, ... };
if (this.removeTarget === '_blank') {
  relValues.push('noopener', 'noreferrer');
}
```

### Slot rendering

```tsx
// Good — slot is rendered by the browser; no programmatic reflection
<span class="pds-chip__label">
  <slot></slot>
</span>

// Suspect — reading slot content then re-emitting somewhere
// (only safe if the read value is escaped before reuse)
```

### Decorative HTML

```tsx
// Good — text via interpolation, escaped by Stencil
<span>{this.label}</span>

// Bad — bypass
<span innerHTML={this.label}></span>
```

## Output Format

**Number items sequentially across all sections — do not restart
numbering in each section.** Section headers still show per-section
counts.

```
## Pine Security Review

**Files Reviewed:** [list]
**Surfaces Checked:** [innerHTML usage, slot reads, URL props, …]
**Overall:** APPROVED | NEEDS CHANGES | BLOCKER

### BLOCKERS ([count])
1. [innerHTML on user input, javascript: URL, hardcoded secret]

### SHOULD FIX ([count])
2. [Missing rel on _blank, style concatenation, prop-bag logging]

### CONSIDER ([count])
3. [Permissive URL type, slot length contract, story args]

### Surfaces Cleared
- [Components reviewed with no findings]
```

## Anti-Patterns in Reviewing

- Do NOT block on hypothetical XSS in slot content — slots are the
  consumer's responsibility unless Pine programmatically reads them.
- Do NOT flag Stencil-default escaped interpolation as risky.
- Do NOT require sanitization libraries in component code; Pine has
  no DOMPurify dependency by design.
- Do NOT review `dist/` or generated React wrappers.
