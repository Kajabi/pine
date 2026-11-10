// Prints the failing tests from Jest's --json results. Nx cuts long task output short, so a
// failure late in the run can leave the log without a test name; this reads the results file
// instead. Usage: node summarize-jest-results.mjs <results.json>...
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { relative } from 'node:path';

const MAX_MESSAGE_LINES = 40;
// GitHub shows at most 10 error annotations per step.
const MAX_ANNOTATIONS = 10;
const ANSI = /\u001b\[[0-9;]*m/g;

const clean = message => message.replace(ANSI, '').trimEnd();
const firstLines = message => {
  const lines = clean(message).split('\n');
  return lines.length > MAX_MESSAGE_LINES
    ? [...lines.slice(0, MAX_MESSAGE_LINES), `… ${lines.length - MAX_MESSAGE_LINES} more lines`].join('\n')
    : lines.join('\n');
};
// Workflow commands need newlines and % escaped to stay on one line.
const escapeData = text => text.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const escapeProperty = text => escapeData(text).replace(/:/g, '%3A').replace(/,/g, '%2C');
// The step summary is Markdown with HTML, so a title like `renders a <nav>` would lose the tag.
const escapeCell = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|');

const files = process.argv.slice(2);
const failures = [];
let found = 0;

for (const file of files) {
  if (!existsSync(file)) continue;
  found += 1;
  const results = JSON.parse(readFileSync(file, 'utf8'));
  for (const suite of results.testResults) {
    if (suite.status !== 'failed') continue;
    const path = relative(process.cwd(), suite.name);
    const failed = suite.assertionResults.filter(test => test.status === 'failed');
    if (failed.length === 0) {
      // The suite itself failed to run: a compile error, or a crashed worker. --json puts the
      // error in the suite's message.
      failures.push({ path, title: 'Test suite failed to run', message: suite.message ?? '' });
      continue;
    }
    for (const test of failed) {
      failures.push({ path, title: test.fullName, message: test.failureMessages.join('\n') });
    }
  }
}

if (found === 0) {
  console.log(`No Jest results file found (${files.join(', ')}). The run failed before the tests finished, so see the log above.`);
  process.exit(0);
}
if (failures.length === 0) {
  console.log('Jest reported no failing tests. The failure came from elsewhere, so see the log above.');
  process.exit(0);
}

console.log(`${failures.length} failing test${failures.length === 1 ? '' : 's'}:\n`);
// Past the limit, the last annotation says how many more there are.
const annotated = failures.length > MAX_ANNOTATIONS ? MAX_ANNOTATIONS - 1 : failures.length;
failures.forEach(({ path, title, message }, index) => {
  const body = firstLines(message);
  console.log(`● ${path} › ${title}\n\n${body}\n`);
  if (index < annotated) {
    console.log(`::error file=${escapeProperty(path)},title=${escapeProperty(title)}::${escapeData(body)}`);
  }
});
if (annotated < failures.length) {
  console.log(`::error title=More failing tests::${failures.length - annotated} more failing tests; see this step's log or the job summary.`);
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = failures.map(({ path, title }) => `| \`${path}\` | ${escapeCell(title)} |`);
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    ['### Failing tests', '', '| File | Test |', '| --- | --- |', ...rows, ''].join('\n'),
  );
}
