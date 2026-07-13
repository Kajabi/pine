# 0007. Slots for content, props for configuration

- **Status:** Accepted (retrospective)
- **Date:** 2026-07-13
- **Maintainers:** @Kajabi/dss-devs

## Context

Every component needs two different kinds of input: **configuration** (variant, size, disabled, type) and **content** (labels, icons, arbitrary markup). Deciding case-by-case which goes where produces inconsistent APIs and, worse, caps flexibility when content is modeled as a fixed prop.

## Decision

**Props configure; slots carry content.** Behavior and appearance are props; anything that is or could be arbitrary markup is exposed as a named slot (`start`/`end`, `prefix`/`suffix`/`append`/`prepend`, etc.) rather than a string or icon-name prop.

This is a pervasive pattern, not an aspiration — 25 components expose `<slot>`s. Where a content prop predated the convention, it's being deprecated toward a slot: `pds-button`'s `icon` prop is `@deprecated` in favor of the `start` slot.

## Consequences

**Positive**

- Consumers can place *any* content — including other `pds-*` components — where a prop would have allowed only a string.
- A consistent mental model across the library: "config on the tag, content in the slots."
- New components inherit the convention instead of re-deciding it each time.

**Negative / accepted costs**

- Slotted content is the **consumer's** markup, so responsibility for its safety shifts to the component when it must read that markup as HTML — see ADR-0009 (DOMPurify sanitization in `pds-combobox`).
- For trivial cases a slot feels heavier than a prop would.
- Migrating legacy content props (like `icon`) to slots is a deprecation cycle, not a free change.

## Alternatives considered

- **Model content as props** (`icon="settings"`, `label="Save"`) — rejected: caps flexibility (no rich/composed content) and is exactly what drove the `icon`-prop deprecation.
- **Freeform single default slot everywhere** — rejected: named slots give components control over placement (start/end, prefix/suffix) that a single slot can't.

## References

- `pds-button` `icon` prop `@deprecated` → `start` slot
- `<slot>` usage across 25 components (`libs/core/src/components/`)
- ADR-0009 (sanitizing consumer-supplied slotted/rich content)
