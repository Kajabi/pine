#!/usr/bin/env node

/**
 * VSCode Settings Patcher for Pine Design System
 *
 * This script automatically configures VSCode to use Pine's HTML custom data
 * for web component autocomplete. It runs as a postinstall hook.
 *
 * Features:
 * - Detects monorepo vs external package context
 * - Creates .vscode directory if needed
 * - Backs up existing settings.json before modifying
 * - Merges html.customData without duplicates
 * - Fails gracefully (won't break npm install)
 */

const fs = require('fs');
const path = require('path');

function patchVSCodeSettings() {
  try {
    // Find project root (where npm install was run)
    // When running as postinstall, process.cwd() is the consuming project's root
    // But when run from node_modules, we need to traverse up
    let projectRoot = process.cwd();

    // If we're inside node_modules, traverse up to find project root
    if (projectRoot.includes('node_modules')) {
      projectRoot = projectRoot.split('node_modules')[0].replace(/[/\\]$/, '');
    }

    // Detect context: monorepo vs external package
    const isMonorepo = fs.existsSync(path.join(projectRoot, 'libs/core/package.json'));

    // Determine the correct path to the HTML custom data file
    const customDataPath = isMonorepo
      ? './libs/core/dist/vscode.html-data.json'
      : './node_modules/@pine-ds/core/dist/vscode.html-data.json';

    const vscodeDir = path.join(projectRoot, '.vscode');
    const settingsPath = path.join(vscodeDir, 'settings.json');
    const backupPath = path.join(vscodeDir, 'settings.json.backup');

    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
      console.log('[pine-ds] Created .vscode directory');
    }

    // Read existing settings or start fresh
    let settings = {};
    let existingContent = null;
    if (fs.existsSync(settingsPath)) {
      existingContent = fs.readFileSync(settingsPath, 'utf8');
      try {
        settings = JSON.parse(existingContent);
      } catch (e) {
        console.warn('[pine-ds] Warning: Could not parse existing settings.json, starting fresh');
        settings = {};
      }
    }

    // Check if we need to add the custom data path
    const existingCustomData = settings['html.customData'] || [];
    if (!existingCustomData.includes(customDataPath)) {
      // Backup only if we're about to make changes
      if (existingContent !== null) {
        fs.writeFileSync(backupPath, existingContent);
        console.log(`[pine-ds] Backed up existing settings to ${path.relative(projectRoot, backupPath)}`);
      }

      // Merge html.customData
      settings['html.customData'] = [...existingCustomData, customDataPath];

      // Write updated settings
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
      console.log(`[pine-ds] VSCode settings updated with Pine HTML custom data: ${customDataPath}`);
      console.log('[pine-ds] Restart VSCode for autocomplete to take effect');
    } else {
      console.log('[pine-ds] Pine HTML custom data already configured in VSCode settings');
    }
  } catch (error) {
    // Don't fail the install if VSCode setup fails
    console.warn('[pine-ds] Warning: Could not set up VSCode HTML custom data:', error.message);
    console.warn('[pine-ds] You can manually add html.customData to your .vscode/settings.json');
  }
}

patchVSCodeSettings();
