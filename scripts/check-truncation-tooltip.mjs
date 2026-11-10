#!/usr/bin/env node
// A component that clips its text with an ellipsis owes the reader a way to see the rest of it.
// `setupTruncationTooltip` in libs/core/src/utils/truncation-tooltip.ts is that way, so this
// compares the selectors whose styles truncate against the components that call it.
//
// Both are read from the source rather than listed here, so a new truncating selector is caught in
// the PR that adds it: this runs in the lint workflow and on pre-push. The lists below are the
// whole allowlist, each entry with its reason, and this fails when an entry stops matching the
// source -- an allowlist nobody rechecks is how a rule quietly stops applying.
//
// The unit is a component's own directory (pds-table/pds-table-cell, not pds-table) and each
// truncating selector in it, so new truncation can't hide behind a sibling that already reveals
// its text, or behind an entry written for a different element.

import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';

// Reads the working tree by default, which is what CI wants: the checkout under test. Pass
// --ref <rev> (or --ref=<rev>) to read a revision instead, so a branch can be measured without
// checking it out.
const refFlag = process.argv.findIndex(
  (arg) => arg === '--ref' || arg.startsWith('--ref=')
);
const REF =
  refFlag === -1
    ? null
    : process.argv[refFlag].startsWith('--ref=')
    ? process.argv[refFlag].slice('--ref='.length)
    : process.argv[refFlag + 1];
if (refFlag !== -1 && (!REF || REF.startsWith('--'))) {
  console.error('--ref needs a revision, as --ref main or --ref=main.');
  process.exit(2);
}
const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const COMPONENTS = 'libs/core/src/components';
const UTIL = 'setupTruncationTooltip';
// The util's own wrapper for elements that come and go, which calls it for each one.
const UTIL_CALLS = [UTIL, 'bindTruncationTooltips'];
// A numeric (or variable) line-clamp, so a reset such as `-webkit-line-clamp: unset` isn't truncation.
const TRUNCATES =
  /text-overflow\s*:\s*ellipsis|-webkit-line-clamp\s*:\s*(?:\d|var\()/;

// Truncation that predates this check, each owed a fix, by component directory and selector. These
// do not fail -- the point is to stop a NEW one appearing, not to block everything until the backlog
// is clear. Nothing here enforces that the lists only shrink: adding an entry takes a selector out
// of the check, so an addition needs the same review as an exemption. An entry fails as stale once
// its selector stops truncating.
const KNOWN = {
  'pds-combobox': {
    '.pds-combobox__button-trigger-text':
      'the trigger text, clipped. A wiring job: the trigger takes focus itself, so it can be the focusEl, with manageTabIndex: false',
    '.pds-combobox__listbox--truncate .pds-combobox__option-text':
      "an option's text, clipped by the `truncate` prop. Not a wiring job: options keep focus on the trigger and are tracked with aria-activedescendant, so the util's focus path never fires and a hover-only tooltip would leave keyboard users where they are",
  },
  'pds-filters/pds-filter': {
    '.pds-filter__button-content': "a filter trigger's content, clipped",
    '.pds-filter__button-text': "a filter trigger's text, clipped",
  },
};

// Truncation that a tooltip would not help, and why. Keep the reason specific enough to argue with.
const EXEMPT = {
  'pds-input': {
    '.pds-input__field:placeholder-shown':
      "clips the placeholder, which is a hint, not the field's value or content. A long hint belongs in helper text, not in a tooltip over an empty field",
  },
};

// Truncation whose answer is a decision rather than a patch. Each needs an owner, not an exemption.
const UNDECIDED = {
  'pds-toast': {
    '.pds-toast__message':
      'a toast with the default duration dismisses itself, so hover-to-read may be the wrong affordance. One with duration={0} stays put and could take the util -- needs a ruling, not a fix',
  },
};

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    return e.isDirectory() ? walk(path) : [path];
  });

const paths = (
  REF
    ? git('ls-tree', '-r', '--name-only', REF, '--', COMPONENTS)
        .split('\n')
        .filter(Boolean)
    : walk(COMPONENTS)
)
  // Tests, docs and stories talk about truncation without doing it.
  .filter((p) => !/\/(test|docs|stories)\//.test(p));
const read = (path) =>
  REF ? git('show', `${REF}:${path}`) : readFileSync(path, 'utf8');

// Comments name things without doing them: `// text-overflow: ellipsis`, or a comment that mentions
// the util. The `[^:]` keeps a `//` inside a url() from reading as a comment.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

// The selectors each truncating declaration sits under, read by tracking the block nesting: a
// selector list split over lines, a one-line block, an element selector and `&` all resolve.
const resolve = (parents, part) =>
  parents.length === 0
    ? [part]
    : parents.map((p) =>
        part.includes('&') ? part.replace(/&/g, p) : `${p} ${part}`
      );

const truncatingSelectors = (src) => {
  const stack = [];
  const found = [];
  let pending = '';
  const declaration = () => {
    if (TRUNCATES.test(pending))
      found.push(...(stack[stack.length - 1] ?? ['(top level)']));
  };
  // SCSS interpolation (`#{$name}`) is part of the text around it, not a block: its braces are
  // kept in `pending` so `.foo-#{$bar} { ... }` resolves to that selector.
  let interpolation = 0;
  for (const ch of stripComments(src)) {
    if (interpolation > 0) {
      pending += ch;
      if (ch === '{') interpolation += 1;
      else if (ch === '}') interpolation -= 1;
    } else if (ch === '{' && pending.endsWith('#')) {
      pending += ch;
      interpolation = 1;
    } else if (ch === '{') {
      const parts = pending
        .split(',')
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      const parents = stack[stack.length - 1] ?? [];
      // An at-rule (@media, @include ... { }) keeps its parent's selectors. One with none to keep,
      // a top-level @mixin, is named itself, so truncation inside it is still reported.
      stack.push(
        parts.length && /^@/.test(parts[0])
          ? parents.length
            ? parents
            : [parts.join(', ')]
          : parts.flatMap((p) => resolve(parents, p))
      );
      pending = '';
    } else if (ch === '}') {
      declaration();
      stack.pop();
      pending = '';
    } else if (ch === ';') {
      declaration();
      pending = '';
    } else {
      pending += ch;
    }
  }
  return [...new Set(found)];
};

const unitOf = (path) => dirname(path).slice(COMPONENTS.length + 1);
const units = [...new Set(paths.filter((p) => p.endsWith('.scss')).map(unitOf))]
  .filter(Boolean)
  .sort();

const report = units.map((unit) => {
  const own = paths.filter((p) => unitOf(p) === unit);
  const selectors = [
    ...new Set(
      own
        .filter((p) => p.endsWith('.scss'))
        .flatMap((p) => truncatingSelectors(read(p)))
    ),
  ];
  // A call, outside comments: an import or a comment that names the util isn't adoption.
  const adopts = own.some(
    (p) => /\.tsx?$/.test(p) && UTIL_CALLS.some((call) => stripComments(read(p)).includes(`${call}(`))
  );
  return { unit, selectors, adopts };
});

const entry = (list, unit, selector) => list[unit]?.[selector];
const reasonFor = (unit, selector) =>
  entry(EXEMPT, unit, selector) ??
  entry(UNDECIDED, unit, selector) ??
  entry(KNOWN, unit, selector);
const stateFor = (c, selector) => {
  if (entry(EXEMPT, c.unit, selector)) return 'exempt';
  if (entry(UNDECIDED, c.unit, selector)) return 'undecided';
  if (entry(KNOWN, c.unit, selector)) return 'owed';
  return c.adopts ? 'ok' : 'MISSING';
};

const truncating = report.filter((c) => c.selectors.length);
const rows = truncating.flatMap((c) =>
  c.selectors.map((selector) => ({
    ...c,
    selector,
    state: stateFor(c, selector),
  }))
);
const missing = rows.filter((r) => r.state === 'MISSING');

// An entry that no longer describes the source is worse than no entry: it reads as considered and
// is not. Entries are checked per selector, so wiring one clipped element of a component leaves the
// entries for its others in place. A component that calls the util for one element can still owe it
// for another, so calling it doesn't make an entry stale on its own -- remove the entry for the
// element you wired.
const stale = [EXEMPT, UNDECIDED, KNOWN].flatMap((list) =>
  Object.entries(list).flatMap(([unit, selectors]) =>
    Object.keys(selectors).flatMap((selector) => {
      const c = report.find((x) => x.unit === unit);
      if (!c)
        return [
          {
            unit,
            selector,
            why: 'listed here but no such component directory -- remove the entry',
          },
        ];
      if (!c.selectors.includes(selector))
        return [
          { unit, selector, why: 'no longer truncates -- remove the entry' },
        ];
      return [];
    })
  )
);

const pad = (s, n) => String(s).padEnd(n);
const counts = (state) => rows.filter((r) => r.state === state);
console.log(
  `\n${REF ?? 'working tree'}: ${rows.length} truncating selectors in ${
    truncating.length
  } components; ${
    truncating.filter((c) => c.adopts).length
  } of those components call ${UTIL}.\n`
);
for (const r of rows) {
  console.log(`  ${pad(r.state, 10)} ${pad(r.unit, 24)} ${r.selector}`);
  const reason = reasonFor(r.unit, r.selector);
  if (reason) console.log(`  ${pad('', 10)} ${pad('', 24)} ${reason}`);
}

if (counts('owed').length) {
  console.log(
    `\n${
      counts('owed').length
    } owed a fix, recorded so a new one stands out (not a failure).`
  );
}
if (counts('undecided').length) {
  console.log(
    `${counts('undecided').length} awaiting a ruling (not a failure).`
  );
}

if (stale.length) {
  console.log(`\nAllowlist no longer matches the source:`);
  for (const s of stale) console.log(`  ${s.unit}  ${s.selector}: ${s.why}`);
}

if (missing.length) {
  console.log(
    `\n${missing.length} selector(s) truncate in a component that doesn't call ${UTIL}:`
  );
  for (const r of missing) console.log(`  ${r.unit}  ${r.selector}`);
  console.log(
    `\nCall ${UTIL} from the component, as pds-copytext does. If a tooltip wouldn't help, add the selector to EXEMPT in ${process.argv[1].replace(
      process.cwd() + '/',
      ''
    )} with the reason, for review like any exemption.`
  );
}

const failures = missing.length + stale.length;
if (failures === 0)
  console.log(
    `\nNo new truncation without a way to read it. ${
      counts('owed').length
    } still owed, ${counts('undecided').length} awaiting a ruling.\n`
  );
process.exit(failures === 0 ? 0 : 1);
