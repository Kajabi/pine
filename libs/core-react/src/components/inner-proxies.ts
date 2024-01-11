import type { JSX as PdsIconsJSX } from '@pine-ds/icons';
import { defineCustomElement as definePdsIcon } from '@pine-ds/icons/components/pds-icon.js';

import { createReactComponent } from './react-component-lib';

// @pine-ds/icons
export const PdsIconInner = /*@__PURE__*/ createReactComponent<PdsIconsJSX.PdsIcon, HTMLPdsIconElement>(
  'pds-icon',
  undefined,
  undefined,
  definePdsIcon
);
