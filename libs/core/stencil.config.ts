import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

// Plugins
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'sage-core',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
      generateTypeDeclarations: true,
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
      componentCorePackage: '@sage/core',
      includeDefineCustomElements: true,
      includePolyfills: true,
      proxiesFile: '../../libs/react/src/components/proxies.ts',
    }),
  ],
  buildEs5: 'prod',
  plugins: [sass()],
  taskQueue: 'async',
};
