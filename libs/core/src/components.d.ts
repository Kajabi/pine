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
    interface SageButton {
        /**
          * Toggles disabled state of button
          * @defaultValue false
         */
        "disabled"?: boolean;
        /**
          * Displays icon before text when icon string matches an icon name
         */
        "icon"?: string;
        /**
          * Provides button with a submittable name
         */
        "name"?: string;
        /**
          * Provides button with a type
          * @defaultValue button
         */
        "type"?: 'button' | 'reset' | 'submit';
        /**
          * Provides button with a submittable value
         */
        "value"?: string;
        /**
          * Sets button variant styles as outlined in Figma documentation
         */
        "variant": 'primary' | 'secondary' | 'accent' | 'disclosure' | 'destructive';
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
          * Indicates how the browser should load the image.
         */
        "loading"?: 'eager' | 'lazy';
        /**
          * Determines the intended display size of an image within certian breakpoints. Has no effect if `srcset` is not set or value has no width descriptor.
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
    interface SageInput {
        /**
          * Indicates whether or not the input field is disabled
         */
        "disabled"?: boolean;
        /**
          * Specifies the error text and provides an error-themed treatment to the field
         */
        "errorText"?: string;
        /**
          * Displays a hint or description of the input field
         */
        "hint"?: string;
        /**
          * A unique identifier for the input field
         */
        "inputId": string;
        /**
          * Indicates whether or not the input field is invalid or throws an error
         */
        "invalid"?: boolean;
        /**
          * Text to be displayed as the form label
         */
        "label"?: string;
        /**
          * Specifies the name. Submitted with the form name/value pair
         */
        "name"?: string;
        /**
          * Specifies a short hint that describes the expected value of the input field
         */
        "placeholder"?: string;
        /**
          * Indicates whether or not the input field is readonly
         */
        "readonly"?: boolean;
        /**
          * Indicates whether or not the input field is required
         */
        "required"?: boolean;
        /**
          * Determines the type of control that will be displayed `'email'`, `'number'`, `'password'`, `'tel'`, `'text'`
          * @defaultValue "text"
         */
        "type": string;
        /**
          * The value of the input "text"
         */
        "value"?: string;
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
    interface SageTab {
        "activeTab": string;
        "parentComponent": string;
        "selected": boolean;
        "tab": string;
        "variant": string;
    }
    interface SageTabpanel {
        "activeTab": string;
        "ariaControlledBy": string;
        "parentComponent": string;
        "selected": boolean;
        "tab": string;
    }
    interface SageTabs {
        /**
          * Sets default active tab, optional
         */
        "activeTab"?: string;
        /**
          * Sets unique id on tabs component, required
         */
        "componentId": string;
        /**
          * Sets the aria-label attached to the tablist element, required
         */
        "tablistLabel": string;
        /**
          * Sets tabs variant styles as outlined in Figma documentation, optional
          * @defaultValue primary
         */
        "variant"?: 'primary' | 'availability' | 'filter';
    }
}
export interface SageInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSageInputElement;
}
export interface SageTabCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSageTabElement;
}
declare global {
    interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {
    }
    var HTMLMyComponentElement: {
        prototype: HTMLMyComponentElement;
        new (): HTMLMyComponentElement;
    };
    interface HTMLSageButtonElement extends Components.SageButton, HTMLStencilElement {
    }
    var HTMLSageButtonElement: {
        prototype: HTMLSageButtonElement;
        new (): HTMLSageButtonElement;
    };
    interface HTMLSageImageElement extends Components.SageImage, HTMLStencilElement {
    }
    var HTMLSageImageElement: {
        prototype: HTMLSageImageElement;
        new (): HTMLSageImageElement;
    };
    interface HTMLSageInputElement extends Components.SageInput, HTMLStencilElement {
    }
    var HTMLSageInputElement: {
        prototype: HTMLSageInputElement;
        new (): HTMLSageInputElement;
    };
    interface HTMLSageLinkElement extends Components.SageLink, HTMLStencilElement {
    }
    var HTMLSageLinkElement: {
        prototype: HTMLSageLinkElement;
        new (): HTMLSageLinkElement;
    };
    interface HTMLSageTabElement extends Components.SageTab, HTMLStencilElement {
    }
    var HTMLSageTabElement: {
        prototype: HTMLSageTabElement;
        new (): HTMLSageTabElement;
    };
    interface HTMLSageTabpanelElement extends Components.SageTabpanel, HTMLStencilElement {
    }
    var HTMLSageTabpanelElement: {
        prototype: HTMLSageTabpanelElement;
        new (): HTMLSageTabpanelElement;
    };
    interface HTMLSageTabsElement extends Components.SageTabs, HTMLStencilElement {
    }
    var HTMLSageTabsElement: {
        prototype: HTMLSageTabsElement;
        new (): HTMLSageTabsElement;
    };
    interface HTMLElementTagNameMap {
        "my-component": HTMLMyComponentElement;
        "sage-button": HTMLSageButtonElement;
        "sage-image": HTMLSageImageElement;
        "sage-input": HTMLSageInputElement;
        "sage-link": HTMLSageLinkElement;
        "sage-tab": HTMLSageTabElement;
        "sage-tabpanel": HTMLSageTabpanelElement;
        "sage-tabs": HTMLSageTabsElement;
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
    interface SageButton {
        /**
          * Toggles disabled state of button
          * @defaultValue false
         */
        "disabled"?: boolean;
        /**
          * Displays icon before text when icon string matches an icon name
         */
        "icon"?: string;
        /**
          * Provides button with a submittable name
         */
        "name"?: string;
        /**
          * Provides button with a type
          * @defaultValue button
         */
        "type"?: 'button' | 'reset' | 'submit';
        /**
          * Provides button with a submittable value
         */
        "value"?: string;
        /**
          * Sets button variant styles as outlined in Figma documentation
         */
        "variant"?: 'primary' | 'secondary' | 'accent' | 'disclosure' | 'destructive';
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
          * Indicates how the browser should load the image.
         */
        "loading"?: 'eager' | 'lazy';
        /**
          * Determines the intended display size of an image within certian breakpoints. Has no effect if `srcset` is not set or value has no width descriptor.
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
    interface SageInput {
        /**
          * Indicates whether or not the input field is disabled
         */
        "disabled"?: boolean;
        /**
          * Specifies the error text and provides an error-themed treatment to the field
         */
        "errorText"?: string;
        /**
          * Displays a hint or description of the input field
         */
        "hint"?: string;
        /**
          * A unique identifier for the input field
         */
        "inputId"?: string;
        /**
          * Indicates whether or not the input field is invalid or throws an error
         */
        "invalid"?: boolean;
        /**
          * Text to be displayed as the form label
         */
        "label"?: string;
        /**
          * Specifies the name. Submitted with the form name/value pair
         */
        "name"?: string;
        /**
          * Emitted when a keyboard input occurred
         */
        "onSageInput"?: (event: SageInputCustomEvent<InputEvent>) => void;
        /**
          * Specifies a short hint that describes the expected value of the input field
         */
        "placeholder"?: string;
        /**
          * Indicates whether or not the input field is readonly
         */
        "readonly"?: boolean;
        /**
          * Indicates whether or not the input field is required
         */
        "required"?: boolean;
        /**
          * Determines the type of control that will be displayed `'email'`, `'number'`, `'password'`, `'tel'`, `'text'`
          * @defaultValue "text"
         */
        "type"?: string;
        /**
          * The value of the input "text"
         */
        "value"?: string;
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
    interface SageTab {
        "activeTab"?: string;
        "onTabClick"?: (event: SageTabCustomEvent<object>) => void;
        "parentComponent"?: string;
        "selected"?: boolean;
        "tab"?: string;
        "variant"?: string;
    }
    interface SageTabpanel {
        "activeTab"?: string;
        "ariaControlledBy"?: string;
        "parentComponent"?: string;
        "selected"?: boolean;
        "tab"?: string;
    }
    interface SageTabs {
        /**
          * Sets default active tab, optional
         */
        "activeTab"?: string;
        /**
          * Sets unique id on tabs component, required
         */
        "componentId"?: string;
        /**
          * Sets the aria-label attached to the tablist element, required
         */
        "tablistLabel"?: string;
        /**
          * Sets tabs variant styles as outlined in Figma documentation, optional
          * @defaultValue primary
         */
        "variant"?: 'primary' | 'availability' | 'filter';
    }
    interface IntrinsicElements {
        "my-component": MyComponent;
        "sage-button": SageButton;
        "sage-image": SageImage;
        "sage-input": SageInput;
        "sage-link": SageLink;
        "sage-tab": SageTab;
        "sage-tabpanel": SageTabpanel;
        "sage-tabs": SageTabs;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "my-component": LocalJSX.MyComponent & JSXBase.HTMLAttributes<HTMLMyComponentElement>;
            "sage-button": LocalJSX.SageButton & JSXBase.HTMLAttributes<HTMLSageButtonElement>;
            "sage-image": LocalJSX.SageImage & JSXBase.HTMLAttributes<HTMLSageImageElement>;
            "sage-input": LocalJSX.SageInput & JSXBase.HTMLAttributes<HTMLSageInputElement>;
            "sage-link": LocalJSX.SageLink & JSXBase.HTMLAttributes<HTMLSageLinkElement>;
            "sage-tab": LocalJSX.SageTab & JSXBase.HTMLAttributes<HTMLSageTabElement>;
            "sage-tabpanel": LocalJSX.SageTabpanel & JSXBase.HTMLAttributes<HTMLSageTabpanelElement>;
            "sage-tabs": LocalJSX.SageTabs & JSXBase.HTMLAttributes<HTMLSageTabsElement>;
        }
    }
}
