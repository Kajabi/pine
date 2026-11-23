import { isGlobalAttribute } from '../global-attributes.mjs';
import { closest } from '../suggest.mjs';

/**
 * Web component snippets only. The React wrappers also set every prop as a DOM property, so a React prop can work
 * without being an attribute at all, and no list here could tell those apart from typos.
 */
export default {
  id: 'unknown-attribute',
  scope: 'snippet',
  languages: ['webComponent'],
  check(snippet, context) {
    return snippet.elements
      .filter((element) => element.known)
      .flatMap((element) => {
        const component = context.components.get(element.tag);
        return element.attributes
          .filter((a) => !component.byAttr.has(a.name) && !isGlobalAttribute(a.name))
          .map((a) => {
            const suggestion = closest(a.name, component.byAttr.keys());
            return {
              line: a.line ?? element.line,
              message: `<${element.written} ${a.name}>: ${element.tag} has no ${a.name} attribute, and it isn't a global attribute.`,
              hint: suggestion ? `Did you mean ${suggestion}?` : `Check the Properties table on the ${element.tag} docs page.`,
            };
          });
      });
  },
};
