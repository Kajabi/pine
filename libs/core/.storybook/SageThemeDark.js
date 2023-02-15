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

  brandTitle: 'Sage Design System',
  brandUrl: 'https://sage.kajabi.com/pages/index',
  brandImage: '/images/sage-logo-dark-mode.png',
  brandTarget: '_self',
});
