import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

export const config: Config = {
  buildEs5: 'prod',
  extras: {},
  namespace: 'sage-core',
  plugins: [sass()],
  taskQueue: 'async',
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
      type: 'docs-readme',
      footer: ' ',
    },
    {
      type: 'docs-vscode',
      file: 'vscode-data.json',
    },
    reactOutputTarget({
      componentCorePackage: '@sage/core',
      includeDefineCustomElements: true,
      proxiesFile: '../../dist/core-react/proxies.ts',
    }),
  ],
  testing: {
    allowableMismatchedPixels: 200,
  },
};
