#!/usr/bin/env node
// A component that clips its text with an ellipsis owes the reader a way to see the rest of it.
// `setupTruncationTooltip` in libs/core/src/utils/truncation-tooltip.ts is that way, so this
// compares the components whose styles truncate against the components that call it.
//
// The two sets are read from the source rather than listed here, so a new component that truncates
// is caught the day it lands instead of whenever someone next thinks to look. The exceptions below
// are the whole allowlist, each with its reason, and this fails when one of them stops being true
// -- an allowlist nobody rechecks is how a rule quietly stops applying.

import { readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

// Reads the working tree by default, which is what CI wants: the checkout under test. Pass
// --ref <rev> to read a revision instead, so a branch can be measured without checking it out --
// and so a run is never silently reporting on half-finished local work.
const refArg = process.argv.indexOf('--ref');
const REF = refArg === -1 ? null : process.argv[refArg + 1];
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const COMPONENTS = 'libs/core/src/components';
const UTIL = 'setupTruncationTooltip';
const TRUNCATES = /text-overflow:\s*ellipsis|-webkit-line-clamp/;

// Truncation that predates this check, each owed a fix. These do not fail -- the point is to stop a
// NEW one appearing, not to block everything until the backlog is clear. The list can only shrink:
// once a component calls the util, its entry here becomes stale and the check fails until it goes.
// Caveat this check cannot resolve: it asks whether THIS component calls the util, so it cannot see
// recovery inherited by composing one that does. pds-alert is the case in point -- read its entry.
const KNOWN = {
  'pds-alert':
    'clips the small description in its own styles AND renders it as <pds-text truncate>, which already calls the util. So the likely fix is deleting the duplicate host-level clipping rather than adding a second tooltip over the same text -- needs a browser check of whether pds-text\'s tooltip fires through it',
  'pds-combobox':
    "an option's text clipped by the `truncate` prop. Not a wiring job: options keep focus on the trigger and are tracked with aria-activedescendant, so the util's focus path never fires and a hover-only tooltip would leave keyboard users where they are",
  'pds-filters': "a filter trigger's text, clipped",
  'pds-multiselect': 'the trigger text and each selected item, clipped',
};

// Truncation that a tooltip would not help, and why. Keep the reason specific enough to argue with.
const EXEMPT = {
  'pds-input':
    'truncates the placeholder (:placeholder-shown), not a value -- there is no fuller text to reveal',
};

// Truncation whose answer is a decision rather than a patch. Each needs an owner, not an exemption.
const UNDECIDED = {
  'pds-toast':
    'a toast dismisses itself, so hover-to-read may be the wrong affordance -- needs a ruling, not a fix',
};

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    return e.isDirectory() ? walk(path) : [path];
  });

const tree = REF ? git('ls-tree', '-r', '--name-only', REF, '--', COMPONENTS).split('\n').filter(Boolean) : null;

const files = (dir) => (REF ? tree.filter((p) => p.startsWith(dir + '/')) : walk(dir));
const read = (path) => (REF ? git('show', `${REF}:${path}`) : readFileSync(path, 'utf8'));

const components = [
  ...new Set(
    (REF ? tree : walk(COMPONENTS))
      .map((p) => p.slice(COMPONENTS.length + 1).split('/')[0])
      .filter((name) => name && !name.startsWith('_') && !name.includes('.')),
  ),
].sort();

// The selector a truncating declaration sits in, so a failure says what to look at.
const selectorsIn = (path) => {
  const lines = read(path).split('\n');
  const found = [];
  lines.forEach((line, i) => {
    if (!TRUNCATES.test(line)) return;
    for (let j = i; j >= 0; j--) {
      const selector = lines[j].match(/^\s*([.&#:[][^{};]*?)\s*\{\s*$/);
      if (selector) return found.push(selector[1].trim());
    }
    found.push('(selector not found)');
  });
  return found;
};

const report = components.map((name) => {
  const paths = files(join(COMPONENTS, name)).filter(
    // Tests and docs talk about truncation without doing it.
    (p) => !/\/(test|docs|stories)\//.test(p),
  );
  const styles = paths.filter((p) => p.endsWith('.scss'));
  const selectors = styles.flatMap(selectorsIn);
  const adopts = paths.some((p) => /\.tsx?$/.test(p) && read(p).includes(UTIL));
  return { name, truncates: selectors.length > 0, selectors: [...new Set(selectors)], adopts };
});

const truncating = report.filter((c) => c.truncates);
const listed = (n) => EXEMPT[n] || UNDECIDED[n] || KNOWN[n];
const missing = truncating.filter((c) => !c.adopts && !listed(c.name));
const known = truncating.filter((c) => !c.adopts && KNOWN[c.name]);
const undecided = truncating.filter((c) => !c.adopts && UNDECIDED[c.name]);

// An exemption that no longer describes the component is worse than no exemption: it reads as
// considered and is not. Fail on both directions of drift.
const stale = Object.keys({ ...EXEMPT, ...UNDECIDED, ...KNOWN }).flatMap((name) => {
  const c = report.find((x) => x.name === name);
  if (!c) return [{ name, why: 'listed here but no such component -- remove the entry' }];
  if (!c.truncates) return [{ name, why: 'no longer truncates -- remove the entry' }];
  if (c.adopts) return [{ name, why: `now calls ${UTIL} -- remove the entry` }];
  return [];
});

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${REF ? REF : 'working tree'}: ${truncating.length} of ${report.length} components truncate; ${truncating.filter((c) => c.adopts).length} call ${UTIL}.\n`);
for (const c of truncating) {
  const state = c.adopts
    ? 'ok'
    : EXEMPT[c.name]
      ? 'exempt'
      : UNDECIDED[c.name]
        ? 'undecided'
        : KNOWN[c.name]
          ? 'owed'
          : 'MISSING';
  console.log(`  ${pad(state, 10)} ${pad(c.name, 18)} ${c.selectors.join(', ')}`);
  const reason = EXEMPT[c.name] ?? UNDECIDED[c.name] ?? KNOWN[c.name];
  if (reason && !c.adopts) console.log(`  ${pad('', 10)} ${pad('', 18)} ${reason}`);
}

if (known.length) {
  console.log(`\n${known.length} owed a fix, recorded so a new one stands out (not a failure):`);
  for (const c of known) console.log(`  ${c.name}`);
}

if (undecided.length) {
  console.log(`\n${undecided.length} awaiting a ruling (not a failure):`);
  for (const c of undecided) console.log(`  ${c.name}: ${UNDECIDED[c.name]}`);
}

if (stale.length) {
  console.log(`\nAllowlist no longer matches the source:`);
  for (const s of stale) console.log(`  ${s.name}: ${s.why}`);
}

if (missing.length) {
  console.log(`\n${missing.length} component(s) truncate without ${UTIL}:`);
  for (const c of missing) console.log(`  ${c.name}  (${c.selectors.join(', ')})`);
  console.log(
    `\nCall ${UTIL} from the component, as pds-copytext does, or add it to EXEMPT in ${process.argv[1].replace(process.cwd() + '/', '')} with the reason it does not need one.`,
  );
}

const failures = missing.length + stale.length;
if (failures === 0)
  console.log(
    `\nNo new truncation without a way to read it. ${known.length} still owed, ${Object.keys(UNDECIDED).length} awaiting a ruling.\n`,
  );
process.exit(failures === 0 ? 0 : 1);
