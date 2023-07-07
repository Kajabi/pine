import type { JSX as PdsIconsJSX } from 'pineicons';

import { createReactComponent } from './react-component-lib';

import { defineCustomElement as definePdsIcon } from 'pineicons/components/pds-icon'

// pineicons
export const PdsIconInner = /*@__PURE__*/ createReactComponent<PdsIconsJSX.PdsIcon, HTMLPdsIconElement>(
  'pds-icon',
  undefined,
  undefined,
  definePdsIcon
);
