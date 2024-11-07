import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';
import PineTheme from './PineTheme';

addons.setConfig({
  panelPosition: 'right',
  theme: PineTheme
});
