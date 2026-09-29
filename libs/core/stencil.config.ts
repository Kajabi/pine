import { Config } from '@stencil/core';

// Plugins
import { sass } from '@stencil/sass';

// Custom output targets
import reactOutputTargetWithPatches from './scripts/react-output-target-with-patches';
import vscodeCustomDataOutputTarget from './scripts/vscode-custom-data-generator';

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
    // Wraps @stencil/react-output-target so Pine's hand-authored patches to the
    // generated react-component-lib/ survive every rebuild. See
    // ./scripts/react-output-target-with-patches.ts.
    reactOutputTargetWithPatches({
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
