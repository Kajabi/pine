# Pine Design System Color Linting Rules

This directory contains Stylelint plugins that enforce proper usage of Pine semantic color tokens in SCSS files.

## Overview

To ensure consistent theming and dark mode support, Pine components should use **semantic** color tokens instead of hardcoded hex values or core tokens.

| Rule | Purpose |
|------|---------|
| `pine-design-system/no-hardcoded-colors` | Blocks hex colors, suggests closest Pine token |
| `pine-design-system/prefer-semantic-tokens` | Blocks core tokens (grey-*, white, black), suggests semantic alternatives |

### Why Semantic Tokens?

Core tokens like `--pine-color-grey-900` have fixed values that don't adapt to dark mode. Semantic tokens like `--pine-color-text` automatically switch values based on the theme:

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--pine-color-text` | grey-900 | grey-100 |
| `--pine-color-background-container` | white | black |
| `--pine-color-border` | grey-300 | grey-600 |

## What's Blocked

### 1. Hardcoded Hex Colors

```scss
// ❌ BLOCKED
.pds-component {
  background-color: #ffffff;
  color: #343332;
}
```

### 2. Core Pine Tokens

```scss
// ❌ BLOCKED - Use semantic tokens instead
.pds-component {
  color: var(--pine-color-grey-900);           // Use --pine-color-text
  background-color: var(--pine-color-white);   // Use --pine-color-background-container
  border-color: var(--pine-color-grey-300);    // Use --pine-color-border
}
```

## What's Allowed

```scss
// ✅ ALLOWED - Semantic tokens
.pds-component {
  background-color: var(--pine-color-background-container);
  color: var(--pine-color-text);
  border-color: var(--pine-color-border);
}
```

## Token Mapping Reference

### Text Colors

| Core Token | Semantic Token | Use Case |
|------------|----------------|----------|
| `grey-950` | `text-strong` | Strong/emphasized text |
| `grey-900` | `text` | Default body text |
| `grey-800` | `text-secondary` | Secondary text |
| `grey-700` | `text-muted` | Muted text |
| `grey-600` | `text-tertiary` | Tertiary text |
| `grey-500` | `text-subtle` | Subtle text |
| `black` | `text-emphasis` | Maximum emphasis |

### Background Colors

| Core Token | Semantic Token | Use Case |
|------------|----------------|----------|
| `white` | `background-container` | Card/panel backgrounds |
| `grey-050` | `background-container-hover` | Hover states |
| `grey-100` | `background-subtle` / `background-app` | Subtle backgrounds |
| `grey-150` | `background-muted` | Muted backgrounds |
| `grey-200` | `background-inset` | Inset/recessed areas |

### Border Colors

| Core Token | Semantic Token | Use Case |
|------------|----------------|----------|
| `grey-200` | `border-disabled` / `border-subtle` | Subtle/disabled borders |
| `grey-300` | `border` | Default borders |
| `grey-400` | `border-hover` | Hover state borders |

### Inverse Tokens (for dark backgrounds)

| Core Token | Inverse Semantic Token |
|------------|------------------------|
| `grey-100` | `text-inverse` |
| `grey-150` | `text-inverse-secondary` |
| `grey-300` | `text-inverse-tertiary` |
| `white` | `text-inverse-emphasis` |

## Handling Inverse Context

If you're intentionally using a core token for inverse context (e.g., text on a dark background), disable the rule with a comment explaining why:

```scss
/* stylelint-disable-next-line pine-design-system/prefer-semantic-tokens -- inverse context: tooltip text */
.pds-tooltip__text {
  color: var(--pine-color-grey-100);
}
```

**Best practice**: Use semantic inverse tokens when available:

```scss
// ✅ BETTER - Use semantic inverse token
.pds-tooltip__text {
  color: var(--pine-color-text-inverse);
}
```

## Running the Linter

```bash
# Run stylelint
npm run lint.styles

# Run with auto-fix
npm run lint.styles -- --fix
```

## Auto-fix

The rules support auto-fix when the property context is clear:

- `color` → text tokens
- `background-color` → background tokens
- `border-color` → border tokens
- `box-shadow` → border tokens

## Token Mappings Source

Token mappings are loaded from `@kajabi-ui/styles/lint-mappings`. This JSON file is generated from the core and semantic token definitions in [ds-tokens](https://github.com/Kajabi/ds-tokens).

## Files

| File | Description |
|------|-------------|
| `pine-color-utils.cjs` | Color distance algorithm for hex-to-token matching |
| `stylelint-plugin-pine-colors.cjs` | Catches hardcoded hex colors |
| `stylelint-plugin-pine-semantic-tokens.cjs` | Catches core tokens, suggests semantic alternatives |
| `eslint-plugin-pine-colors.cjs` | ESLint version (not currently enabled) |

## Related Documentation

- [Pine Semantic Colors](https://pine-design-system.netlify.app/?path=/docs/design-tokens-semantic-color--docs)
- [ds-tokens Repository](https://github.com/Kajabi/ds-tokens)

