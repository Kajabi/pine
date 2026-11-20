import { dashCase } from '../context.mjs';
import { closest } from '../suggest.mjs';

function propFor(name, component, language) {
  if (language !== 'react') return component.byAttr.get(name);
  return component.byName.get(name) ?? component.byAttr.get(name) ?? component.byAttr.get(dashCase(name));
}

export default {
  id: 'invalid-value',
  scope: 'snippet',
  languages: ['webComponent', 'react'],
  check(snippet, context) {
    return snippet.elements
      .filter((element) => element.known)
      .flatMap((element) => {
        const component = context.components.get(element.tag);
        return element.attributes.flatMap((a) => {
          const allowed = a.value.kind === 'string' && !a.overridable ? propFor(a.name, component, snippet.language)?.values : null;
          if (!allowed || allowed.includes(a.value.text)) return [];
          const suggestion = closest(a.value.text, allowed);
          const list = allowed.map((value) => `"${value}"`).join(', ');
          return [{
            line: a.line ?? element.line,
            message: `<${element.written} ${a.name}="${a.value.text}">: ${element.tag} accepts only ${list}.`,
            hint: suggestion ? `Did you mean "${suggestion}"?` : `Use one of ${list}.`,
          }];
        });
      });
  },
};
