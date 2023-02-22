import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';
import SageTheme from './SageTheme';

addons.setConfig({
  panelPosition: 'right',
  theme: SageTheme
});
