import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

// @ts-ignore
// Plugins
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'pine-core',
  globalStyle: 'src/global/styles/app.scss',
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
      type: 'docs-json',
      file: './dist/docs.json', // Used to extract documentation data for Storybook
    },
    {
      type: 'docs-readme',
      footer: '',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    reactOutputTarget({
      componentCorePackage: '@pine-ds/core',
      includeDefineCustomElements: true,
      includePolyfills: true,
      proxiesFile: '../../libs/react/src/components/proxies.ts',
    }),
  ],
  buildEs5: 'prod',
  plugins: [sass()],
  taskQueue: 'async',
};
