import { Config } from '@stencil/core';

// @ts-ignore
// Plugins
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'doc-components',
  devServer: {
    port: 7200,
  }
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
      generateTypeDeclarations: true,
      includeGlobalScripts: false
    },
    {
      type: 'docs-readme',
      footer: '',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: "new",
  },
  buildEs5: 'prod',
  plugins: [sass()],
  taskQueue: 'async',
};
