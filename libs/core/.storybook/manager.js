import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import PineTheme from './PineTheme';

addons.setConfig({
  panelPosition: 'right',
  theme: PineTheme
});
