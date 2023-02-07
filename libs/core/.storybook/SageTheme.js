import { create } from '@storybook/theming';

export default create({
  base: 'light',

  colorPrimary: 'white',
  colorSecondary: '#86d5bc',

  // UI
  appBg: '#f9fafa',
  appContentBg: 'white',
  appBorderColor: '#eceeef',
  appBorderRadius: 6,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'black',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'white',
  barSelectedColor: 'black',
  barBg: '#86d5bc',

  // Form colors
  inputBg: 'white',
  inputBorder: '#4B9611',
  inputTextColor: 'black',
  inputBorderRadius: 6,

  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://sage.kajabi.com/assets/sage-9181479df32f89419639c8fe4d56618dffb23657ba578afa8f766913d10f1c5a.svg',
  brandTarget: '_self',
});
