/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface SageIcon {
        /**
          * The name of the icon to use from the built-in set.
         */
        "name"?: string;
        /**
          * The size of the icon. This can be 'small', 'normal', 'medium', large, or a custom value (40px, 1rem, etc)
         */
        "size"?: | 'small'   // 12px
    | 'normal'  // 16px
    | 'medium'  // 20px
    | 'large'   // 24px
    | 'auto'
    | string;
    }
}
declare global {
    interface HTMLSageIconElement extends Components.SageIcon, HTMLStencilElement {
    }
    var HTMLSageIconElement: {
        prototype: HTMLSageIconElement;
        new (): HTMLSageIconElement;
    };
    interface HTMLElementTagNameMap {
        "sage-icon": HTMLSageIconElement;
    }
}
declare namespace LocalJSX {
    interface SageIcon {
        /**
          * The name of the icon to use from the built-in set.
         */
        "name"?: string;
        /**
          * The size of the icon. This can be 'small', 'normal', 'medium', large, or a custom value (40px, 1rem, etc)
         */
        "size"?: | 'small'   // 12px
    | 'normal'  // 16px
    | 'medium'  // 20px
    | 'large'   // 24px
    | 'auto'
    | string;
    }
    interface IntrinsicElements {
        "sage-icon": SageIcon;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "sage-icon": LocalJSX.SageIcon & JSXBase.HTMLAttributes<HTMLSageIconElement>;
        }
    }
}
