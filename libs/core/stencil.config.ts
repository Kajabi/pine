import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

// Plugins
import { sass } from '@stencil/sass';

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
      file: './dist/docs.json', // Used to extract documentation data for Storybook
    },
    {
      type: 'docs-readme',
      footer: '',
    },
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
