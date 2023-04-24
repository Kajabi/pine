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
    interface SageCheckbox {
        /**
          * Determines whether or not the checkbox is checked.
         */
        "checked": boolean;
        /**
          * String used for checkbox `id` attribute and label `for` attribute.
         */
        "componentId": string;
        /**
          * Determines whether or not the checkbox is disabled.
         */
        "disabled": boolean;
        /**
          * String used for helper message below checkbox.
         */
        "helperMessage": string;
        /**
          * If `true`, the checkbox will visually appear as indeterminate. Only JavaScript can set the objects `indeterminate` property. See [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes).
         */
        "indeterminate": boolean;
        /**
          * Determines whether or not the checkbox is invalid.
         */
        "invalid": boolean;
        /**
          * String used for label text next to checkbox.
         */
        "label": string;
        /**
          * String used for checkbox `name` attribute.
         */
        "name": string;
        /**
          * Determines whether or not the checkbox is required.
         */
        "required": boolean;
        /**
          * The value of the checkbox that is submitted with a form.
         */
        "value": string;
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
        "index": number;
        /**
          * Sets the related tab name, this name must match a `sage-tabpanel`'s tab name property
         */
        "name": string;
        "parentComponentId": string;
        "selected": boolean;
        "variant": string;
    }
    interface SageTabpanel {
        /**
          * Sets the related tab name, this name must match a `sage-tab`'s tab name property
         */
        "name": string;
        "parentComponentId": string;
        "selected": boolean;
        "variant": string;
    }
    interface SageTabs {
        "activeTabIndex": number;
        /**
          * Sets the starting active tab name and maintains the name as the component re-renders
         */
        "activeTabName": string;
        /**
          * Sets unique id on tabs component
         */
        "componentId": string;
        /**
          * Sets the aria-label attached to the tablist element
         */
        "tablistLabel": string;
        /**
          * Sets tabs variant styles as outlined in Figma documentation
         */
        "variant": 'primary' | 'availability' | 'filter';
    }
}
export interface SageCheckboxCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSageCheckboxElement;
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
    interface HTMLSageCheckboxElement extends Components.SageCheckbox, HTMLStencilElement {
    }
    var HTMLSageCheckboxElement: {
        prototype: HTMLSageCheckboxElement;
        new (): HTMLSageCheckboxElement;
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
        "sage-checkbox": HTMLSageCheckboxElement;
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
    interface SageCheckbox {
        /**
          * Determines whether or not the checkbox is checked.
         */
        "checked"?: boolean;
        /**
          * String used for checkbox `id` attribute and label `for` attribute.
         */
        "componentId"?: string;
        /**
          * Determines whether or not the checkbox is disabled.
         */
        "disabled"?: boolean;
        /**
          * String used for helper message below checkbox.
         */
        "helperMessage"?: string;
        /**
          * If `true`, the checkbox will visually appear as indeterminate. Only JavaScript can set the objects `indeterminate` property. See [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes).
         */
        "indeterminate"?: boolean;
        /**
          * Determines whether or not the checkbox is invalid.
         */
        "invalid"?: boolean;
        /**
          * String used for label text next to checkbox.
         */
        "label"?: string;
        /**
          * String used for checkbox `name` attribute.
         */
        "name"?: string;
        /**
          * Emits a boolean indicating whether the checkbox is currently checked or unchecked.
         */
        "onSageCheckboxChange"?: (event: SageCheckboxCustomEvent<boolean>) => void;
        /**
          * Determines whether or not the checkbox is required.
         */
        "required"?: boolean;
        /**
          * The value of the checkbox that is submitted with a form.
         */
        "value"?: string;
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
        "index"?: number;
        /**
          * Sets the related tab name, this name must match a `sage-tabpanel`'s tab name property
         */
        "name": string;
        "onTabClick"?: (event: SageTabCustomEvent<object>) => void;
        "parentComponentId"?: string;
        "selected"?: boolean;
        "variant"?: string;
    }
    interface SageTabpanel {
        /**
          * Sets the related tab name, this name must match a `sage-tab`'s tab name property
         */
        "name": string;
        "parentComponentId"?: string;
        "selected"?: boolean;
        "variant"?: string;
    }
    interface SageTabs {
        "activeTabIndex"?: number;
        /**
          * Sets the starting active tab name and maintains the name as the component re-renders
         */
        "activeTabName": string;
        /**
          * Sets unique id on tabs component
         */
        "componentId": string;
        /**
          * Sets the aria-label attached to the tablist element
         */
        "tablistLabel": string;
        /**
          * Sets tabs variant styles as outlined in Figma documentation
         */
        "variant": 'primary' | 'availability' | 'filter';
    }
    interface IntrinsicElements {
        "my-component": MyComponent;
        "sage-button": SageButton;
        "sage-checkbox": SageCheckbox;
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
            "sage-checkbox": LocalJSX.SageCheckbox & JSXBase.HTMLAttributes<HTMLSageCheckboxElement>;
            "sage-image": LocalJSX.SageImage & JSXBase.HTMLAttributes<HTMLSageImageElement>;
            "sage-input": LocalJSX.SageInput & JSXBase.HTMLAttributes<HTMLSageInputElement>;
            "sage-link": LocalJSX.SageLink & JSXBase.HTMLAttributes<HTMLSageLinkElement>;
            "sage-tab": LocalJSX.SageTab & JSXBase.HTMLAttributes<HTMLSageTabElement>;
            "sage-tabpanel": LocalJSX.SageTabpanel & JSXBase.HTMLAttributes<HTMLSageTabpanelElement>;
            "sage-tabs": LocalJSX.SageTabs & JSXBase.HTMLAttributes<HTMLSageTabsElement>;
        }
    }
}
