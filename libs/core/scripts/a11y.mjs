#!/usr/bin/env node
/**
 * Accessibility gate runner.
 *
 * Serves the static Storybook build, drives `@storybook/test-runner` over every
 * story (the axe audit itself lives in `.storybook/test-runner.js`), and diffs
 * the result against `.storybook/a11y-baseline.json`.
 *
 * Usage:
 *   node scripts/a11y.mjs                    # gate: fail on violations not in the baseline
 *   node scripts/a11y.mjs --update-baseline  # record current violations as the new baseline
 *   node scripts/a11y.mjs --url <url>        # audit an already-running Storybook
 *
 * `storybook-static` must exist — build it first with `npm run build.storybook`
 * (which needs `npm run build.stencil`, since Storybook reads `dist/docs.json`).
 *
 * Exit codes: 0 clean, 1 new violations (or a runner failure).
 */
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const CORE_ROOT = resolve(currentDir, '..');
const STATIC_DIR = join(CORE_ROOT, 'storybook-static');
const BASELINE_PATH = join(CORE_ROOT, '.storybook', 'a11y-baseline.json');

const args = process.argv.slice(2);
const updateBaseline = args.includes('--update-baseline');
const urlArgIndex = args.indexOf('--url');
const externalUrl = urlArgIndex !== -1 ? args[urlArgIndex + 1] : undefined;

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.md': 'text/markdown; charset=utf-8',
};

/**
 * Minimal static file server for `storybook-static`. Deliberately dependency
 * free — the gate should not pull a web server into the dependency tree just to
 * hand Chromium some files on localhost.
 */
function startStaticServer(root) {
  const server = createServer((req, res) => {
    const requestPath = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    let filePath = join(root, normalize(requestPath).replace(/^(\.\.[/\\])+/, ''));

    // Never serve outside the static root, whatever the request path claims.
    if (!filePath.startsWith(root + sep) && filePath !== root) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html');
    }

    if (!existsSync(filePath)) {
      res.writeHead(404).end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(filePath)] ?? 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  });

  return new Promise((resolvePromise) => {
    server.listen(0, '127.0.0.1', () => {
      resolvePromise({ server, url: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

/** Arguments this script owns; everything else is forwarded to `test-storybook`. */
function passthroughArgs() {
  const forwarded = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--update-baseline') continue;
    if (args[i] === '--url') {
      i += 1; // skip its value too
      continue;
    }
    forwarded.push(args[i]);
  }
  return forwarded;
}

function runTestRunner(url, resultsDir) {
  return new Promise((resolvePromise) => {
    const child = spawn('npx', ['test-storybook', '--url', url, '--maxWorkers', '2', ...passthroughArgs()], {
      cwd: CORE_ROOT,
      stdio: 'inherit',
      env: {
        ...process.env,
        PINE_A11Y_RESULTS_DIR: resultsDir,
        ...(updateBaseline ? { PINE_A11Y_UPDATE: '1' } : {}),
      },
    });
    child.on('close', (code) => resolvePromise(code ?? 1));
  });
}

/** Merges the per-story shards each test-runner worker wrote. */
function collectResults(resultsDir) {
  if (!existsSync(resultsDir)) return {};
  const merged = {};
  for (const file of readdirSync(resultsDir)) {
    if (!file.endsWith('.json')) continue;
    const { storyId, ruleIds } = JSON.parse(readFileSync(join(resultsDir, file), 'utf8'));
    merged[storyId] = ruleIds;
  }
  return merged;
}

function writeBaseline(results) {
  const stories = {};
  for (const storyId of Object.keys(results).sort()) {
    if (results[storyId].length > 0) stories[storyId] = results[storyId];
  }

  const violationCount = Object.values(stories).reduce((n, ids) => n + ids.length, 0);
  const baseline = {
    $schema: 'Story ID -> axe rule IDs that already failed when the gate landed.',
    $docs: 'See CONTRIBUTING.md § Accessibility gate. Entries may be removed, never added by hand.',
    generatedAt: new Date().toISOString().slice(0, 10),
    storyCount: Object.keys(stories).length,
    violationCount,
    stories,
  };

  writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
  return baseline;
}

/** Baseline entries for stories that ran clean — the gate has ratcheted down. */
function staleEntries(results) {
  const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) : { stories: {} };
  const stale = [];
  for (const [storyId, ruleIds] of Object.entries(baseline.stories ?? {})) {
    const observed = new Set(results[storyId] ?? []);
    // A story that did not run at all is not evidence of anything.
    if (!(storyId in results)) continue;
    const fixed = ruleIds.filter((id) => !observed.has(id));
    if (fixed.length > 0) stale.push({ storyId, fixed });
  }
  return stale;
}

async function main() {
  if (!externalUrl && !existsSync(STATIC_DIR)) {
    console.error(`\nstorybook-static not found at ${STATIC_DIR}.\n` + 'Build it first:\n\n  npm run build.stencil && npm run build.storybook\n');
    process.exit(1);
  }

  const resultsDir = mkdtempSync(join(tmpdir(), 'pine-a11y-'));
  let server;
  let url = externalUrl;

  try {
    if (!url) {
      ({ server, url } = await startStaticServer(STATIC_DIR));
      console.log(`Serving ${STATIC_DIR} at ${url}`);
    }

    const exitCode = await runTestRunner(url, resultsDir);
    const results = collectResults(resultsDir);

    if (updateBaseline) {
      const baseline = writeBaseline(results);
      console.log(
        `\nBaseline written to ${BASELINE_PATH}\n` +
          `  ${baseline.storyCount} story/stories with violations, ${baseline.violationCount} distinct story/rule pair(s)\n` +
          `  ${Object.keys(results).length} story/stories audited\n`,
      );
      process.exit(exitCode === 0 ? 0 : exitCode);
    }

    const stale = staleEntries(results);
    if (stale.length > 0) {
      console.log('\nBaseline entries that no longer reproduce (these violations are fixed):');
      for (const { storyId, fixed } of stale) console.log(`  ${storyId}: ${fixed.join(', ')}`);
      console.log('\nRun `npm run test.a11y -- --update-baseline` to prune them.\n');
    }

    if (exitCode === 0) {
      console.log(`\nAccessibility gate passed — ${Object.keys(results).length} story/stories audited, no new violations.\n`);
    }
    process.exit(exitCode);
  } finally {
    server?.close();
    rmSync(resultsDir, { recursive: true, force: true });
  }
}

main();
