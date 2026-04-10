#!/usr/bin/env node

/**
 * Verifies that package-lock.json is in sync with all package.json files
 * in the npm workspaces monorepo.
 *
 * Checks:
 *   1. Lockfile exists and is valid JSON with lockfileVersion 3
 *   2. Every workspace package.json has a corresponding lockfile entry
 *   3. Dependency specifiers match exactly between package.json and lockfile
 *
 * Usage: node scripts/verify-lockfile-sync.cjs
 * Exit codes: 0 = in sync, 1 = out of sync or error
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEP_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${filePath}: ${err.message}`);
    process.exit(1);
  }
}

function getWorkspacePackages(rootPkg) {
  const patterns = rootPkg.workspaces || [];
  const packages = [{ key: '', dir: ROOT }]; // root package

  for (const pattern of patterns) {
    // Patterns are simple globs like "apps/*" and "libs/*"
    const baseDir = path.join(ROOT, pattern.replace('/*', ''));
    if (!fs.existsSync(baseDir)) continue;

    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const pkgJsonPath = path.join(baseDir, entry.name, 'package.json');
      if (!fs.existsSync(pkgJsonPath)) continue;

      // Lockfile uses POSIX forward-slash paths (e.g., "libs/core")
      const key = pattern.replace('/*', '') + '/' + entry.name;
      packages.push({ key, dir: path.join(baseDir, entry.name) });
    }
  }

  return packages;
}

function compareDeps(pkgDeps, lockDeps, pkgName, field) {
  const errors = [];
  const pkgEntries = pkgDeps || {};
  const lockEntries = lockDeps || {};

  for (const [dep, range] of Object.entries(pkgEntries)) {
    if (!(dep in lockEntries)) {
      errors.push(`  ${pkgName} > ${field} > ${dep}: in package.json ("${range}") but missing from lockfile`);
    } else if (lockEntries[dep] !== range) {
      errors.push(`  ${pkgName} > ${field} > ${dep}: package.json has "${range}" but lockfile has "${lockEntries[dep]}"`);
    }
  }

  for (const [dep] of Object.entries(lockEntries)) {
    if (!(dep in pkgEntries)) {
      errors.push(`  ${pkgName} > ${field} > ${dep}: in lockfile but missing from package.json`);
    }
  }

  return errors;
}

// --- Main ---

const rootPkg = readJSON(path.join(ROOT, 'package.json'));
const lockfilePath = path.join(ROOT, 'package-lock.json');

if (!fs.existsSync(lockfilePath)) {
  console.error('package-lock.json not found. Run "npm install" to generate it.');
  process.exit(1);
}

const lockfile = readJSON(lockfilePath);

// Lockfile version guard
if (lockfile.lockfileVersion !== 3) {
  console.error(
    `Expected lockfileVersion 3, found ${lockfile.lockfileVersion}.\n` +
    'This script requires npm 7+ lockfile format. Regenerate with: npm install'
  );
  process.exit(1);
}

const workspaces = getWorkspacePackages(rootPkg);

// False negative guard
if (workspaces.length === 0) {
  console.error('No workspace packages found. Check that package.json "workspaces" is configured correctly.');
  process.exit(1);
}

const allErrors = [];

for (const { key, dir } of workspaces) {
  const pkg = readJSON(path.join(dir, 'package.json'));
  const lockEntry = lockfile.packages[key];
  const displayName = key || '(root)';

  if (!lockEntry) {
    allErrors.push(`  ${displayName}: missing from lockfile packages map`);
    continue;
  }

  for (const field of DEP_FIELDS) {
    const errors = compareDeps(pkg[field], lockEntry[field], displayName, field);
    allErrors.push(...errors);
  }
}

if (allErrors.length > 0) {
  console.error('Lockfile is out of sync with package.json:\n');
  allErrors.forEach(e => console.error(e));
  console.error('\nRun "npm install" to regenerate the lockfile, then commit it.');
  process.exit(1);
}

console.log(`Lockfile sync verified (${workspaces.length} packages checked).`);
