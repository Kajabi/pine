import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import PineTheme from './PineTheme';
import packageJson from '../package.json';

addons.setConfig({
  panelPosition: 'right',
  theme: PineTheme
});


// Add version number next to the logo
const version = packageJson.version;
const addVersionToSidebar = () => {
  const sidebarHeader = document.querySelector('.sidebar-header');

  if (sidebarHeader && !document.querySelector('.pine-version')) {
    const versionElement = document.createElement('div');
    versionElement.className = 'pine-version';
    versionElement.textContent = `v${version}`;
    versionElement.style.cssText = `
      color: var(--pine-color-text-secondary);
      font: var(--pine-typography-body-sm-medium);
      display: inline-flex;
      align-items: center;
      margin-inline-start: var(--pine-dimension-xs);
    `;

    sidebarHeader.appendChild(versionElement);
    return true;
  }
  return false;
};

// Retry logic with linear backoff
let attempts = 0;
const maxAttempts = 5;

const tryAddVersion = () => {
  if (addVersionToSidebar() || attempts >= maxAttempts) {
    return;
  }
  attempts++;
  setTimeout(tryAddVersion, 100 * attempts);
};

tryAddVersion();
