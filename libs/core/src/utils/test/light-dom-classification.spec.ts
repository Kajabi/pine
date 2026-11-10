import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const COMPONENTS_DIR = resolve(__dirname, '../../components');

function findComponentFiles(dir: string, results: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      if (entry === 'test') continue;
      findComponentFiles(fullPath, results);
    } else if (entry.endsWith('.tsx') && !entry.includes('.spec.') && !entry.includes('.e2e.') && !entry.startsWith('mock-')) {
      results.push(fullPath);
    }
  }
  return results;
}

// The `@Component({...})` config, so a `shadow: true` in a comment or example elsewhere doesn't count.
function componentConfig(source: string): string | undefined {
  const start = source.indexOf('@Component(');
  if (start === -1) return undefined;
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(open, i + 1);
  }
  return undefined;
}

// The JSDoc directly above `@Component`, so a stray `@lightDom` elsewhere in the file doesn't count.
const classJsDoc = (source: string) => /\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*@Component\(/.exec(source)?.[1] ?? '';

const usesShadowDom = (config: string) => /shadow:\s*(true|\{)/.test(config);
const isClassified = (source: string) => /@lightDom\s+(renders-markup|host-only)\b/.test(classJsDoc(source));

// Published in docs.json so consumers can tell which light-DOM components add elements of their own.
// host-only: render() only sets classes, styles or attributes on <Host>; it adds no elements.
// renders-markup: render() wraps the slotted content in its own elements, which Stencil won't
// restore if code outside the component rewrites the light DOM.
describe('light DOM classification', () => {
  it('tags every shadow:false/scoped component with @lightDom renders-markup or host-only', () => {
    const unclassified = findComponentFiles(COMPONENTS_DIR)
      .filter((file) => {
        const source = readFileSync(file, 'utf8');
        const config = componentConfig(source);
        return config !== undefined && !usesShadowDom(config) && !isClassified(source);
      })
      .map((file) => file.replace(`${COMPONENTS_DIR}/`, ''));

    expect(unclassified).toEqual([]);
  });
});
