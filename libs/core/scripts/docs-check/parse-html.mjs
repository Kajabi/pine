import { MockDocument, parseHtmlToFragment } from '@stencil/core/mock-doc';

const ELEMENT_NODE = 1;
const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

/**
 * Parses a web component snippet as an HTML fragment and lists its HTML elements in document order.
 * SVG and MathML elements are skipped. Stencil's mock-doc keeps no source positions, so elements carry no line.
 * `usesAddIcons` is true when the snippet mentions `addIcons` anywhere, such as in a script.
 *
 * @returns {{ elements: import('./check.mjs').SnippetElement[], usesAddIcons: boolean }}
 */
export function parseHtml(code) {
  const fragment = parseHtmlToFragment(code, new MockDocument());
  const elements = [];
  const visit = (node) => {
    if (node.nodeType === ELEMENT_NODE && node.namespaceURI === HTML_NAMESPACE) {
      const tag = node.nodeName.toLowerCase();
      const attributes = [];
      for (let i = 0; i < node.attributes.length; i++) {
        const { name, value } = node.attributes.item(i);
        attributes.push({ name, value: { kind: 'string', text: value }, line: null, overridable: false });
      }
      elements.push({ written: tag, reactName: null, tag, line: null, attributes, hasSpread: false });
      if (tag === 'template' && node.content) visit(node.content);
    }
    node.childNodes?.forEach(visit);
  };
  fragment.childNodes.forEach(visit);
  return { elements, usesAddIcons: code.includes('addIcons') };
}
