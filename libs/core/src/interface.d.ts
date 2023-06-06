import type { Components as PdsIconsComponents, JSX as PdsIconsJSX } from '@pine-ds/icons';

export * from './components';
export * from './index';


declare module './components' {
  export namespace Components {
    export type PdsIcon = PdsIconsComponents.PdsIcon;
  }
}

declare module './components' {
  export namespace JSX {
    export type PdsIcon = PdsIconsJSX.PdsIcon;
  }
}
