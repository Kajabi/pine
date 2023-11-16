/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface DocArgsTable {
        "of": string;
    }
    interface DocCanvas {
        /**
          * A unique identifier used for the underlying component `id` attribute.
         */
        "componentId": string;
        "mdxSource"?: string;
        /**
          * React code snippet for the component
         */
        "react"?: string;
        /**
          * Web Component code snippet for the component
         */
        "webComponent"?: string;
    }
    interface DocSource {
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
}
declare global {
    interface HTMLDocArgsTableElement extends Components.DocArgsTable, HTMLStencilElement {
    }
    var HTMLDocArgsTableElement: {
        prototype: HTMLDocArgsTableElement;
        new (): HTMLDocArgsTableElement;
    };
    interface HTMLDocCanvasElement extends Components.DocCanvas, HTMLStencilElement {
    }
    var HTMLDocCanvasElement: {
        prototype: HTMLDocCanvasElement;
        new (): HTMLDocCanvasElement;
    };
    interface HTMLDocSourceElement extends Components.DocSource, HTMLStencilElement {
    }
    var HTMLDocSourceElement: {
        prototype: HTMLDocSourceElement;
        new (): HTMLDocSourceElement;
    };
    interface HTMLElementTagNameMap {
        "doc-args-table": HTMLDocArgsTableElement;
        "doc-canvas": HTMLDocCanvasElement;
        "doc-source": HTMLDocSourceElement;
    }
}
declare namespace LocalJSX {
    interface DocArgsTable {
        "of"?: string;
    }
    interface DocCanvas {
        /**
          * A unique identifier used for the underlying component `id` attribute.
         */
        "componentId"?: string;
        "mdxSource"?: string;
        /**
          * React code snippet for the component
         */
        "react"?: string;
        /**
          * Web Component code snippet for the component
         */
        "webComponent"?: string;
    }
    interface DocSource {
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
    interface IntrinsicElements {
        "doc-args-table": DocArgsTable;
        "doc-canvas": DocCanvas;
        "doc-source": DocSource;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "doc-args-table": LocalJSX.DocArgsTable & JSXBase.HTMLAttributes<HTMLDocArgsTableElement>;
            "doc-canvas": LocalJSX.DocCanvas & JSXBase.HTMLAttributes<HTMLDocCanvasElement>;
            "doc-source": LocalJSX.DocSource & JSXBase.HTMLAttributes<HTMLDocSourceElement>;
        }
    }
}
