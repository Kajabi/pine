import { create } from '@storybook/theming';

export default create({
  base: 'dark',

  colorPrimary: 'black',
  colorSecondary: '#60666C',

  // UI
  appBg: '#040506',
  appContentBg: 'black',
  appBorderColor: '#60666C',
  appBorderRadius: 6,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: 'white',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'white',
  barSelectedColor: 'white',
  barBg: '#040506',

  // Form colors
  inputBg: '#202327',
  inputBorder: '#43474B',
  inputTextColor: '#ECEEEF',
  inputBorderRadius: 10,

  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: '/images/sage-logo-dark-mode.png',
  brandTarget: '_self',
});
