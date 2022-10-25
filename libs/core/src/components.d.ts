/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface MyComponent {
        /**
          * The first name
         */
        "first": string;
        /**
          * The last name
         */
        "last": string;
        /**
          * The middle name
         */
        "middle": string;
    }
    interface SageImage {
        /**
          * The image's alt tag. If none is provided, it will default to an empty string.
         */
        "alt"?: string;
        /**
          * The height of the image in pixels. Setting this will devote space in the layout to prevent layout shifts when the image is loaded.
         */
        "height"?: number;
        /**
          * Indicates how the browser should load the image. Defaults to "eager".
         */
        "loading"?: 'eager' | 'lazy';
        /**
          * Determines the intended display size of an image within certian breakpoints. Has no effect if `srcset` is not set or value has no width descriptor
         */
        "sizes"?: string;
        /**
          * The image's source.
         */
        "src": string;
        /**
          * A set of image sources for the browser to use.
         */
        "srcset"?: string;
        /**
          * The width of the image in pixels. Setting this will devote space in the layout to prevent layout shifts when the image is loaded.
         */
        "width"?: number;
    }
    interface SageLink {
        /**
          * When enabled, opens link in a new tab.
          * @defaultValue false
         */
        "external": boolean;
        /**
          * The Font size follows t-shirt model sm: 12px md: 14px lg: 16px
          * @defaultValue lg
         */
        "fontSize": 'sm' | 'md' | 'lg';
        /**
          * The URL that the hyperlink points to.
         */
        "href": string;
        /**
          * Modifies the look of the link
         */
        "variant": 'inline' | 'plain';
    }
}
declare global {
    interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {
    }
    var HTMLMyComponentElement: {
        prototype: HTMLMyComponentElement;
        new (): HTMLMyComponentElement;
    };
    interface HTMLSageImageElement extends Components.SageImage, HTMLStencilElement {
    }
    var HTMLSageImageElement: {
        prototype: HTMLSageImageElement;
        new (): HTMLSageImageElement;
    };
    interface HTMLSageLinkElement extends Components.SageLink, HTMLStencilElement {
    }
    var HTMLSageLinkElement: {
        prototype: HTMLSageLinkElement;
        new (): HTMLSageLinkElement;
    };
    interface HTMLElementTagNameMap {
        "my-component": HTMLMyComponentElement;
        "sage-image": HTMLSageImageElement;
        "sage-link": HTMLSageLinkElement;
    }
}
declare namespace LocalJSX {
    interface MyComponent {
        /**
          * The first name
         */
        "first"?: string;
        /**
          * The last name
         */
        "last"?: string;
        /**
          * The middle name
         */
        "middle"?: string;
    }
    interface SageImage {
        /**
          * The image's alt tag. If none is provided, it will default to an empty string.
         */
        "alt"?: string;
        /**
          * The height of the image in pixels. Setting this will devote space in the layout to prevent layout shifts when the image is loaded.
         */
        "height"?: number;
        /**
          * Indicates how the browser should load the image. Defaults to "eager".
         */
        "loading"?: 'eager' | 'lazy';
        /**
          * Determines the intended display size of an image within certian breakpoints. Has no effect if `srcset` is not set or value has no width descriptor
         */
        "sizes"?: string;
        /**
          * The image's source.
         */
        "src"?: string;
        /**
          * A set of image sources for the browser to use.
         */
        "srcset"?: string;
        /**
          * The width of the image in pixels. Setting this will devote space in the layout to prevent layout shifts when the image is loaded.
         */
        "width"?: number;
    }
    interface SageLink {
        /**
          * When enabled, opens link in a new tab.
          * @defaultValue false
         */
        "external"?: boolean;
        /**
          * The Font size follows t-shirt model sm: 12px md: 14px lg: 16px
          * @defaultValue lg
         */
        "fontSize"?: 'sm' | 'md' | 'lg';
        /**
          * The URL that the hyperlink points to.
         */
        "href": string;
        /**
          * Modifies the look of the link
         */
        "variant"?: 'inline' | 'plain';
    }
    interface IntrinsicElements {
        "my-component": MyComponent;
        "sage-image": SageImage;
        "sage-link": SageLink;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "my-component": LocalJSX.MyComponent & JSXBase.HTMLAttributes<HTMLMyComponentElement>;
            "sage-image": LocalJSX.SageImage & JSXBase.HTMLAttributes<HTMLSageImageElement>;
            "sage-link": LocalJSX.SageLink & JSXBase.HTMLAttributes<HTMLSageLinkElement>;
        }
    }
}
