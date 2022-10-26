import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'sage-icons',
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
      type: 'www',
      empty: false,
      serviceWorker: null, // disable service workers
    },
  ],
};
