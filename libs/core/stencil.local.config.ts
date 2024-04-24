import { readFileSync } from 'fs';
import { Config } from '@stencil/core';

import { config as configProd } from './stencil.config';

export const config: Config = {
  ...configProd,
  devServer: {
    openBrowser: false,
    port: 7300,
    https: {
      cert: readFileSync('pineLocalDev.pem', 'utf8'),
      key: readFileSync('pineLocalDev-key.pem', 'utf8'),
    },
  }};
