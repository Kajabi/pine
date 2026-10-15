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

const usesShadowDom = (source: string) => /shadow:\s*true/.test(source) || /shadow:\s*\{/.test(source);
const isClassified = (source: string) => /@lightDom\s+(renders-markup|host-only)/.test(source);

describe('light DOM classification (DSS-350)', () => {
  it('tags every shadow:false/scoped component with @lightDom renders-markup or host-only', () => {
    const unclassified = findComponentFiles(COMPONENTS_DIR)
      .filter((file) => {
        const source = readFileSync(file, 'utf8');
        return /@Component\(/.test(source) && !usesShadowDom(source) && !isClassified(source);
      })
      .map((file) => file.replace(`${COMPONENTS_DIR}/`, ''));

    // A Pine upgrade that adds a shadow:false/scoped component without classifying
    // it here is exactly the drift kajabi-products' hand-maintained light-DOM list
    // (common/utils/hotwired/pine_light_dom.js) is guarding against on their side.
    expect(unclassified).toEqual([]);
  });
});
