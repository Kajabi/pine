import invalidValue from './invalid-value.mjs';
import unknownAttribute from './unknown-attribute.mjs';
import unknownComponent from './unknown-component.mjs';
import unknownIcon from './unknown-icon.mjs';

/**
 * Each rule is `{ id, languages, check(snippet, context) }`: `languages` lists the snippet languages it runs on,
 * and `check` returns `{ line, message, hint }` findings, with `line` relative to the snippet or null.
 * Findings sort in this order when they share a line.
 */
export const RULES = [unknownComponent, unknownIcon, unknownAttribute, invalidValue];
