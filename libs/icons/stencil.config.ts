import { Config } from '@stencil/core';

// Plugins
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'sage-icons',
  plugins: [sass()],
  outputTargets: [
    {
      type: 'dist',
      empty: false
    },
    {
      type: 'dist-custom-elements',
      dir: './components'

    },
    {
      type: 'docs-readme',
      footer: '',
    },
    {
      type: 'docs-json',
      file: './dist/docs.json',
    },
    {
      type: 'www',
      empty: false,
      serviceWorker: null, // disable service workers
    },
  ]
};
