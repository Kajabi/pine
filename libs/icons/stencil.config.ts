import { Config } from '@stencil/core';

// Plugins
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'pds-icons',
  devServer: {
    openBrowser: false,
    port: 7200
  },
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
      copy: [
        { src: '../changelogs', dest: 'changelogs'}
      ]
    },
  ]
};
