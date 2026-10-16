import { Config } from '@stencil/core';
import { existsSync, readFileSync } from 'fs';
import { request } from 'node:http';
import { resolve } from 'path';
import { reactOutputTarget } from '@stencil/react-output-target';

// Plugins
import { sass } from '@stencil/sass';

// Custom output targets
import vscodeCustomDataOutputTarget from './scripts/vscode-custom-data-generator';

// #region agent log
const debugRunId = process.env.DEBUG_RUN_ID || 'pre-fix';
const debugLog = (message: string, data: Record<string, unknown>, hypothesisId: string) => {
  const payload = {
    sessionId: 'debug-session',
    runId: debugRunId,
    hypothesisId,
    location: 'libs/core/stencil.config.ts',
    message,
    data,
    timestamp: Date.now(),
  };

  if (typeof fetch === 'function') {
    fetch('http://127.0.0.1:7243/ingest/3744f2d7-8ec9-48ce-9313-5076103493e4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
    return;
  }

  try {
    const url = new URL('http://127.0.0.1:7243/ingest/3744f2d7-8ec9-48ce-9313-5076103493e4');
    const req = request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => res.resume()
    );
    req.on('error', () => {});
    req.write(JSON.stringify(payload));
    req.end();
  } catch {
    // swallow logging errors
  }
};

debugLog('stencil-config-load', {
  cwd: process.cwd(),
  argv: process.argv,
  ci: process.env.CI,
  nxTarget: process.env.NX_TASK_TARGET_TARGET,
}, 'H1');

const componentsPkgPath = resolve(__dirname, 'components/package.json');
const scriptsPkgPath = resolve(__dirname, 'scripts/custom-elements/package.json');
const componentsExists = existsSync(componentsPkgPath);
const scriptsExists = existsSync(scriptsPkgPath);
const componentsName = componentsExists ? JSON.parse(readFileSync(componentsPkgPath, 'utf8')).name : null;
const scriptsName = scriptsExists ? JSON.parse(readFileSync(scriptsPkgPath, 'utf8')).name : null;

debugLog('stencil-package-presence', {
  componentsPkgPath,
  scriptsPkgPath,
  componentsExists,
  scriptsExists,
  componentsName,
  scriptsName,
}, 'H2');

if (componentsExists && scriptsExists && componentsName === scriptsName) {
  debugLog('stencil-duplicate-package-name', {
    duplicateName: componentsName,
  }, 'H3');
}
// #endregion

export const config: Config = {
  namespace: 'pine-core',
  globalStyle: 'src/global/styles/app.scss',
  devServer: {
    openBrowser: false,
    port: 7300,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      dir: 'components',
      copy: [{
        src: '../scripts/custom-elements',
        dest: 'components',
        warn: true
      }],
      customElementsExportBehavior: 'single-export-module',
      includeGlobalScripts: false,
    },
    {
      type: 'docs-json',
      file: './custom-elements.json', // Used for Storybook 10 web-components integration
    },
    {
      type: 'docs-json',
      file: './dist/docs.json', // Used by custom @pine-ds/doc-components in component MDX files
    },
    {
      type: 'docs-readme',
      footer: '',
    },
    // Built-in docs-vscode (basic)
    // {
    //   type: 'docs-vscode',
    //   file: 'vscode-data.json',
    // },
    // Custom VS Code data generator (enhanced with full spec support)
    // Output to dist/ so it's included in the npm package
    vscodeCustomDataOutputTarget('./dist/vscode.html-data.json'),
    {
      type: 'dist-hydrate-script',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    reactOutputTarget({
      componentCorePackage: '@pine-ds/core',
      includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      proxiesFile: '../react/src/components/proxies.ts',
      excludeComponents: [
        'pds-icon'
      ]
    }),
  ],
  buildEs5: 'prod',
  plugins: [sass()],
  taskQueue: 'async'
};
