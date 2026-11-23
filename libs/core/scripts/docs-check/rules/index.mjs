import brokenAnchor from './broken-anchor.mjs';
import brokenDocsLink from './broken-docs-link.mjs';
import invalidValue from './invalid-value.mjs';
import missingDescription from './missing-description.mjs';
import oversizeSection from './oversize-section.mjs';
import undocumentedPart from './undocumented-part.mjs';
import undocumentedSlot from './undocumented-slot.mjs';
import unknownAttribute from './unknown-attribute.mjs';
import unknownComponent from './unknown-component.mjs';
import unknownIcon from './unknown-icon.mjs';
import wrongDefault from './wrong-default.mjs';

/**
 * Each rule is `{ id, scope, check(target, context) }`. `scope` says what `check` gets: a parsed example `snippet`
 * (its rule also lists the snippet `languages` it runs on), a `component` with its docs.json entry and source, or a
 * docs `page` with its links and sections. `check` returns `{ line, message, hint }` findings, with `line` relative
 * to the snippet or null for a snippet, and the file's own line otherwise. Findings sort in this order when they
 * share a line.
 */
export const RULES = [
  unknownComponent,
  unknownIcon,
  unknownAttribute,
  invalidValue,
  missingDescription,
  undocumentedSlot,
  undocumentedPart,
  wrongDefault,
  brokenAnchor,
  brokenDocsLink,
  oversizeSection,
];
