/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { TextareaChangeEventDetail } from "./components/sage-textarea/textarea-interface";
export namespace Components {
    interface PdsButton {
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
    interface PdsCheckbox {
        /**
          * It determines whether or not the checkbox is checked.
         */
        "checked": boolean;
        /**
          * String used for checkbox `id` attribute and label `for` attribute.
         */
        "componentId": string;
        /**
          * It determines whether or not the checkbox is disabled.
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
          * It determines whether or not the checkbox is invalid.
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
          * It determines whether or not the checkbox is required.
         */
        "required": boolean;
        /**
          * The value of the checkbox that is submitted with a form.
         */
        "value": string;
    }
    interface PdsChip {
        /**
          * Determines whether a dot should be displayed on the chip.
          * @defaultValue false
         */
        "dot": boolean;
        /**
          * Sets the text label content of the chip.
         */
        "label": string;
        /**
          * Determines whether the chip should be rendered in a larger size.
          * @defaultValue false
         */
        "large": boolean;
        /**
          * Sets the color scheme of the chip.
          * @defaultValue 'neutral'
         */
        "sentiment": 'accent' | 'danger' | 'info' | 'neutral' | 'success' | 'warning';
        /**
          * Sets the style variant of the chip.
          * @defaultValue 'text'
         */
        "variant": 'text' | 'tag' | 'dropdown';
    }
    interface PdsDivider {
        /**
          * Adds offset margin/padding to expand the width (horizontal) or the height (vertical) of divider.
         */
        "offset": 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
        /**
          * Sets divider to display vertically
          * @defaultValue false
         */
        "vertical": boolean;
    }
    interface PdsImage {
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
    interface PdsInput {
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
          * Text to be displayed as the input label
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
    interface PdsLink {
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
    interface SageSwitch {
        /**
          * Determines the input 'checked' state
         */
        "checked": boolean;
        /**
          * Identifies this input with a unique string, and associates the input with its label
         */
        "componentId": string;
        /**
          * Determines the input 'disabled' state, preventing user interaction
         */
        "disabled"?: boolean;
        /**
          * Displays message text describing an invalid state
         */
        "errorMessage"?: string;
        /**
          * Displays help text for additional description of an input
         */
        "helperMessage": string;
        /**
          * Determines the input 'invalid' state, signifying an error is present
         */
        "invalid"?: boolean;
        /**
          * Displays text to describe the input
         */
        "label": string;
        /**
          * Identifies form data and unifies a group of radio inputs for toggling a single property/value
         */
        "name": string;
        /**
          * Determines the 'required' state of the input
         */
        "required"?: boolean;
        /**
          * Specifies the underlying input element type
          * @defaultValue 'checkbox'
         */
        "type": 'checkbox' | 'radio';
        /**
          * Provides input with a string submitted in form data, and can be used to distinguish radio inputs
         */
        "value": string;
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
    interface SageTextarea {
        /**
          * A unique identifier for the textarea
         */
        "componentId"?: string;
        /**
          * Indicates whether or not the textarea is disabled
          * @defaultValue false
         */
        "disabled": boolean;
        /**
          * Specifies the error text and provides an error-themed treatment to the field
         */
        "errorMessage"?: string;
        /**
          * Displays a hint or description of the textarea
         */
        "hintMessage"?: string;
        /**
          * Indicates whether or not the textarea is invalid or throws an error
          * @defaultValue false
         */
        "invalid": boolean;
        /**
          * Text to be displayed as the textarea label
         */
        "label"?: string;
        /**
          * Specifies the name, submitted with the form name/value pair. This value will mirror the componentId
         */
        "name": string;
        /**
          * Specifies a short hint that describes the expected value of the textarea
         */
        "placeholder"?: string;
        /**
          * Indicates whether or not the textarea is readonly
          * @defaultValue false
         */
        "readonly": boolean;
        /**
          * Indicates whether or not the textarea is required
          * @defaultValue false
         */
        "required": boolean;
        /**
          * Sets number of rows of text visible without needing to scroll in the textarea
         */
        "rows"?: number;
        /**
          * The value of the textarea
         */
        "value"?: string;
    }
    interface SageTooltip {
        /**
          * Id used to reference the component
         */
        "componentId": string;
        /**
          * Content for the tooltip. If HTML is required, use the content slot
         */
        "content": string;
        /**
          * Determines whether or not the tooltip has an arrow
          * @defaultValue true
         */
        "hasArrow"?: boolean;
        /**
          * Hides the tooltip by disabling the opened property
         */
        "hideTooltip": () => Promise<void>;
        /**
          * Enable this option when using the content slot
          * @defaultValue false
         */
        "htmlContent": boolean;
        /**
          * Determines whether or not the tooltip is visible
          * @defaultValue false
         */
        "opened": boolean;
        /**
          * Determines the preferred position of the tooltip
          * @defaultValue "right"
         */
        "placement": 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
        /**
          * Shows the tooltip by enabling the opened property
         */
        "showTooltip": () => Promise<void>;
    }
}
export interface PdsCheckboxCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPdsCheckboxElement;
}
export interface PdsChipCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPdsChipElement;
}
export interface PdsInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLPdsInputElement;
}
export interface SageSwitchCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSageSwitchElement;
}
export interface SageTabCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSageTabElement;
}
export interface SageTextareaCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSageTextareaElement;
}
export interface SageTooltipCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSageTooltipElement;
}
declare global {
    interface HTMLPdsButtonElement extends Components.PdsButton, HTMLStencilElement {
    }
    var HTMLPdsButtonElement: {
        prototype: HTMLPdsButtonElement;
        new (): HTMLPdsButtonElement;
    };
    interface HTMLPdsCheckboxElement extends Components.PdsCheckbox, HTMLStencilElement {
    }
    var HTMLPdsCheckboxElement: {
        prototype: HTMLPdsCheckboxElement;
        new (): HTMLPdsCheckboxElement;
    };
    interface HTMLPdsChipElement extends Components.PdsChip, HTMLStencilElement {
    }
    var HTMLPdsChipElement: {
        prototype: HTMLPdsChipElement;
        new (): HTMLPdsChipElement;
    };
    interface HTMLPdsDividerElement extends Components.PdsDivider, HTMLStencilElement {
    }
    var HTMLPdsDividerElement: {
        prototype: HTMLPdsDividerElement;
        new (): HTMLPdsDividerElement;
    };
    interface HTMLPdsImageElement extends Components.PdsImage, HTMLStencilElement {
    }
    var HTMLPdsImageElement: {
        prototype: HTMLPdsImageElement;
        new (): HTMLPdsImageElement;
    };
    interface HTMLPdsInputElement extends Components.PdsInput, HTMLStencilElement {
    }
    var HTMLPdsInputElement: {
        prototype: HTMLPdsInputElement;
        new (): HTMLPdsInputElement;
    };
    interface HTMLPdsLinkElement extends Components.PdsLink, HTMLStencilElement {
    }
    var HTMLPdsLinkElement: {
        prototype: HTMLPdsLinkElement;
        new (): HTMLPdsLinkElement;
    };
    interface HTMLSageSwitchElement extends Components.SageSwitch, HTMLStencilElement {
    }
    var HTMLSageSwitchElement: {
        prototype: HTMLSageSwitchElement;
        new (): HTMLSageSwitchElement;
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
    interface HTMLSageTextareaElement extends Components.SageTextarea, HTMLStencilElement {
    }
    var HTMLSageTextareaElement: {
        prototype: HTMLSageTextareaElement;
        new (): HTMLSageTextareaElement;
    };
    interface HTMLSageTooltipElement extends Components.SageTooltip, HTMLStencilElement {
    }
    var HTMLSageTooltipElement: {
        prototype: HTMLSageTooltipElement;
        new (): HTMLSageTooltipElement;
    };
    interface HTMLElementTagNameMap {
        "pds-button": HTMLPdsButtonElement;
        "pds-checkbox": HTMLPdsCheckboxElement;
        "pds-chip": HTMLPdsChipElement;
        "pds-divider": HTMLPdsDividerElement;
        "pds-image": HTMLPdsImageElement;
        "pds-input": HTMLPdsInputElement;
        "pds-link": HTMLPdsLinkElement;
        "sage-switch": HTMLSageSwitchElement;
        "sage-tab": HTMLSageTabElement;
        "sage-tabpanel": HTMLSageTabpanelElement;
        "sage-tabs": HTMLSageTabsElement;
        "sage-textarea": HTMLSageTextareaElement;
        "sage-tooltip": HTMLSageTooltipElement;
    }
}
declare namespace LocalJSX {
    interface PdsButton {
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
    interface PdsCheckbox {
        /**
          * It determines whether or not the checkbox is checked.
         */
        "checked"?: boolean;
        /**
          * String used for checkbox `id` attribute and label `for` attribute.
         */
        "componentId"?: string;
        /**
          * It determines whether or not the checkbox is disabled.
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
          * It determines whether or not the checkbox is invalid.
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
        "onPdsCheckboxChange"?: (event: PdsCheckboxCustomEvent<boolean>) => void;
        /**
          * It determines whether or not the checkbox is required.
         */
        "required"?: boolean;
        /**
          * The value of the checkbox that is submitted with a form.
         */
        "value"?: string;
    }
    interface PdsChip {
        /**
          * Determines whether a dot should be displayed on the chip.
          * @defaultValue false
         */
        "dot"?: boolean;
        /**
          * Sets the text label content of the chip.
         */
        "label"?: string;
        /**
          * Determines whether the chip should be rendered in a larger size.
          * @defaultValue false
         */
        "large"?: boolean;
        /**
          * Event when close button is clicked on tag variant.
         */
        "onPdsTagCloseClick"?: (event: PdsChipCustomEvent<any>) => void;
        /**
          * Sets the color scheme of the chip.
          * @defaultValue 'neutral'
         */
        "sentiment"?: 'accent' | 'danger' | 'info' | 'neutral' | 'success' | 'warning';
        /**
          * Sets the style variant of the chip.
          * @defaultValue 'text'
         */
        "variant"?: 'text' | 'tag' | 'dropdown';
    }
    interface PdsDivider {
        /**
          * Adds offset margin/padding to expand the width (horizontal) or the height (vertical) of divider.
         */
        "offset"?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
        /**
          * Sets divider to display vertically
          * @defaultValue false
         */
        "vertical"?: boolean;
    }
    interface PdsImage {
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
    interface PdsInput {
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
          * Text to be displayed as the input label
         */
        "label"?: string;
        /**
          * Specifies the name. Submitted with the form name/value pair
         */
        "name"?: string;
        /**
          * Emitted when a keyboard input occurred
         */
        "onPdsInput"?: (event: PdsInputCustomEvent<InputEvent>) => void;
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
    interface PdsLink {
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
    interface SageSwitch {
        /**
          * Determines the input 'checked' state
         */
        "checked"?: boolean;
        /**
          * Identifies this input with a unique string, and associates the input with its label
         */
        "componentId": string;
        /**
          * Determines the input 'disabled' state, preventing user interaction
         */
        "disabled"?: boolean;
        /**
          * Displays message text describing an invalid state
         */
        "errorMessage"?: string;
        /**
          * Displays help text for additional description of an input
         */
        "helperMessage"?: string;
        /**
          * Determines the input 'invalid' state, signifying an error is present
         */
        "invalid"?: boolean;
        /**
          * Displays text to describe the input
         */
        "label": string;
        /**
          * Identifies form data and unifies a group of radio inputs for toggling a single property/value
         */
        "name"?: string;
        /**
          * Emits an event on input change
         */
        "onSageSwitchChange"?: (event: SageSwitchCustomEvent<InputEvent>) => void;
        /**
          * Determines the 'required' state of the input
         */
        "required"?: boolean;
        /**
          * Specifies the underlying input element type
          * @defaultValue 'checkbox'
         */
        "type"?: 'checkbox' | 'radio';
        /**
          * Provides input with a string submitted in form data, and can be used to distinguish radio inputs
         */
        "value"?: string;
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
    interface SageTextarea {
        /**
          * A unique identifier for the textarea
         */
        "componentId"?: string;
        /**
          * Indicates whether or not the textarea is disabled
          * @defaultValue false
         */
        "disabled"?: boolean;
        /**
          * Specifies the error text and provides an error-themed treatment to the field
         */
        "errorMessage"?: string;
        /**
          * Displays a hint or description of the textarea
         */
        "hintMessage"?: string;
        /**
          * Indicates whether or not the textarea is invalid or throws an error
          * @defaultValue false
         */
        "invalid"?: boolean;
        /**
          * Text to be displayed as the textarea label
         */
        "label"?: string;
        /**
          * Specifies the name, submitted with the form name/value pair. This value will mirror the componentId
         */
        "name"?: string;
        /**
          * Event emitted whenever the value of the textarea changes
         */
        "onSageTextareaChange"?: (event: SageTextareaCustomEvent<TextareaChangeEventDetail>) => void;
        /**
          * Specifies a short hint that describes the expected value of the textarea
         */
        "placeholder"?: string;
        /**
          * Indicates whether or not the textarea is readonly
          * @defaultValue false
         */
        "readonly"?: boolean;
        /**
          * Indicates whether or not the textarea is required
          * @defaultValue false
         */
        "required"?: boolean;
        /**
          * Sets number of rows of text visible without needing to scroll in the textarea
         */
        "rows"?: number;
        /**
          * The value of the textarea
         */
        "value"?: string;
    }
    interface SageTooltip {
        /**
          * Id used to reference the component
         */
        "componentId"?: string;
        /**
          * Content for the tooltip. If HTML is required, use the content slot
         */
        "content"?: string;
        /**
          * Determines whether or not the tooltip has an arrow
          * @defaultValue true
         */
        "hasArrow"?: boolean;
        /**
          * Enable this option when using the content slot
          * @defaultValue false
         */
        "htmlContent"?: boolean;
        /**
          * Emitted after a tooltip is closed
         */
        "onSageTooltipHide"?: (event: SageTooltipCustomEvent<any>) => void;
        /**
          * Emitted after a tooltip is shown
         */
        "onSageTooltipShow"?: (event: SageTooltipCustomEvent<any>) => void;
        /**
          * Determines whether or not the tooltip is visible
          * @defaultValue false
         */
        "opened"?: boolean;
        /**
          * Determines the preferred position of the tooltip
          * @defaultValue "right"
         */
        "placement"?: 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
    }
    interface IntrinsicElements {
        "pds-button": PdsButton;
        "pds-checkbox": PdsCheckbox;
        "pds-chip": PdsChip;
        "pds-divider": PdsDivider;
        "pds-image": PdsImage;
        "pds-input": PdsInput;
        "pds-link": PdsLink;
        "sage-switch": SageSwitch;
        "sage-tab": SageTab;
        "sage-tabpanel": SageTabpanel;
        "sage-tabs": SageTabs;
        "sage-textarea": SageTextarea;
        "sage-tooltip": SageTooltip;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "pds-button": LocalJSX.PdsButton & JSXBase.HTMLAttributes<HTMLPdsButtonElement>;
            "pds-checkbox": LocalJSX.PdsCheckbox & JSXBase.HTMLAttributes<HTMLPdsCheckboxElement>;
            "pds-chip": LocalJSX.PdsChip & JSXBase.HTMLAttributes<HTMLPdsChipElement>;
            "pds-divider": LocalJSX.PdsDivider & JSXBase.HTMLAttributes<HTMLPdsDividerElement>;
            "pds-image": LocalJSX.PdsImage & JSXBase.HTMLAttributes<HTMLPdsImageElement>;
            "pds-input": LocalJSX.PdsInput & JSXBase.HTMLAttributes<HTMLPdsInputElement>;
            "pds-link": LocalJSX.PdsLink & JSXBase.HTMLAttributes<HTMLPdsLinkElement>;
            "sage-switch": LocalJSX.SageSwitch & JSXBase.HTMLAttributes<HTMLSageSwitchElement>;
            "sage-tab": LocalJSX.SageTab & JSXBase.HTMLAttributes<HTMLSageTabElement>;
            "sage-tabpanel": LocalJSX.SageTabpanel & JSXBase.HTMLAttributes<HTMLSageTabpanelElement>;
            "sage-tabs": LocalJSX.SageTabs & JSXBase.HTMLAttributes<HTMLSageTabsElement>;
            "sage-textarea": LocalJSX.SageTextarea & JSXBase.HTMLAttributes<HTMLSageTextareaElement>;
            "sage-tooltip": LocalJSX.SageTooltip & JSXBase.HTMLAttributes<HTMLSageTooltipElement>;
        }
    }
}
