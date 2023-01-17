import type { Components as SageIconsComponents, JSX as SageIconsJSX } from '@sage/icons';

export * from './components';
export * from './index';


declare module './components' {
  export namespace Components {
    export type SageIcon = SageIconsComponents.SageIcon;
  }
}

declare module './components' {
  export namespace JSX {
    export type SageIcon = SageIconsJSX.SageIcon;
  }
}
