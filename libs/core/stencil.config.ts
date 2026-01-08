import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

// Plugins
import { sass } from '@stencil/sass';

// Custom output targets
import customElementsManifestOutputTarget from './scripts/custom-elements-manifest-generator';

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
    // Custom Elements Manifest generator (CEM v1.0.0 spec)
    // Used by Storybook, VS Code, JetBrains IDEs, and other tooling
    customElementsManifestOutputTarget('./dist/custom-elements.json'),
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
