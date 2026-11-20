import { closest } from '../suggest.mjs';

/**
 * Mirrors `getSrc` in `@pine-ds/icons`: only a trimmed, non-empty string with a `/` or `.` is used as the URL;
 * anything else falls back to `name`. A `src` expression can't be known, so it counts as winning.
 */
function srcWins(value) {
  if (value.kind === 'expression') return true;
  if (value.kind !== 'string') return false;
  const src = value.text.trim();
  return src.length > 0 && /[/.]/.test(src);
}

/**
 * `pds-icon` lowercases `name` before it looks the icon up. A `src` that wins, a JSX spread that may carry one, and
 * `addIcons`, which can register names outside the icon set, all skip the check.
 */
function nameFindings(element, snippet, context) {
  if (snippet.usesAddIcons || element.hasSpread || element.attributes.some((a) => a.name === 'src' && srcWins(a.value))) return [];
  return element.attributes
    .filter((a) => a.name === 'name' && a.value.kind === 'string' && a.value.text !== '')
    .filter((a) => !context.iconNames.has(a.value.text.toLowerCase()))
    .map((a) => {
      const suggestion = closest(a.value.text, context.iconNames);
      return {
        line: a.line ?? element.line,
        message: `<${element.written} name="${a.value.text}"> names an icon that @pine-ds/icons ${context.iconsVersion} doesn't have.`,
        hint: suggestion ? `Did you mean "${suggestion}"?` : 'Pick a name from the icon list on the Icon docs page.',
      };
    });
}

function importFindings(element, snippet, context) {
  return element.attributes
    .filter((a) => a.name === 'icon' && a.value.kind === 'expression' && snippet.iconImports?.has(a.value.identifier))
    .filter((a) => !context.iconExports.has(snippet.iconImports.get(a.value.identifier)))
    .map((a) => {
      const imported = snippet.iconImports.get(a.value.identifier);
      const suggestion = closest(imported, context.iconExports);
      return {
        line: a.line ?? element.line,
        message: `icon={${a.value.identifier}} imports "${imported}" from @pine-ds/icons/icons, which @pine-ds/icons ${context.iconsVersion} doesn't export.`,
        hint: suggestion ? `Did you mean "${suggestion}"?` : 'Import an icon that @pine-ds/icons/icons exports.',
      };
    });
}

export default {
  id: 'unknown-icon',
  scope: 'snippet',
  languages: ['webComponent', 'react'],
  check(snippet, context) {
    return snippet.elements.flatMap((element) => [
      ...(element.tag === 'pds-icon' ? nameFindings(element, snippet, context) : []),
      ...(snippet.language === 'react' ? importFindings(element, snippet, context) : []),
    ]);
  },
};
