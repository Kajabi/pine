import { reactName } from '../context.mjs';
import { closest } from '../suggest.mjs';

export default {
  id: 'unknown-component',
  languages: ['webComponent', 'react'],
  check(snippet, context) {
    return snippet.elements
      .filter((element) => !element.known)
      .map((element) => {
        if (element.tag === null) {
          const suggestion = closest(element.reactName, context.tags.map(reactName));
          const aliased = element.written !== element.reactName && !element.written.endsWith(`.${element.reactName}`);
          const shown = aliased ? `<${element.written}> (${element.reactName})` : `<${element.written}>`;
          return {
            line: element.line,
            message: `${shown} isn't a Pine React component: no tag in docs.json maps to it.`,
            hint: suggestion ? `Did you mean <${suggestion}>?` : 'Use a component from @pine-ds/react.',
          };
        }
        const suggestion = closest(element.tag, context.tags);
        return {
          line: element.line,
          message: `<${element.written}> isn't a Pine component: docs.json has no ${element.tag}.`,
          hint: suggestion ? `Did you mean <${suggestion}>?` : 'Use a pds-* tag that exists in @pine-ds/core.',
        };
      });
  },
};
