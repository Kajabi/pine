import type { Config, OutputTargetCustom } from '@stencil/core/internal';
import { reactOutputTarget } from '@stencil/react-output-target';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Pine-local patches for the generated React component library.
 *
 * `@stencil/react-output-target` copies its own `react-component-lib/` directory
 * over `libs/react/src/components/react-component-lib/` on every single build, so
 * anything hand-edited there is silently reverted to the vendor version the next
 * time anyone runs `build.stencil`. Every patch Pine needs on top of the vendor
 * template is declared here and re-applied immediately after the vendor output
 * target runs, so the deviation survives rebuilds without anyone having to
 * remember to `git checkout --` the file.
 *
 * If a `@stencil/react-output-target` upgrade changes the vendor source such that
 * a patch no longer applies, the build FAILS rather than quietly emitting an
 * unpatched file — that loud failure is the whole point of this module.
 */
interface ReactComponentLibPatch {
  /** File to patch, relative to the generated `react-component-lib/` directory. */
  file: string;
  /**
   * Substring that proves the patch is already applied. Makes re-application a
   * no-op so incremental/watch builds don't thrash the file.
   */
  marker: string;
  /** Exact vendor source to replace. Must appear exactly once in the unpatched file. */
  find: string;
  /** Source to replace `find` with. */
  replace: string;
  /** Why Pine deviates from the vendor template. Surfaced in build failures. */
  why: string;
}

const PATCHES: ReactComponentLibPatch[] = [
  {
    file: 'createComponent.tsx',
    marker: 'Guard against double-registration',
    find: `  if (defineCustomElement !== undefined) {
    defineCustomElement();
  }`,
    replace: `  if (defineCustomElement !== undefined) {
    // Guard against double-registration when CDN and @pine-ds/react are both loaded
    if (typeof customElements !== 'undefined' && !customElements.get(tagName)) {
      defineCustomElement();
    }
  }`,
    why:
      'Apps that load Pine from the CDN *and* import @pine-ds/react would otherwise call ' +
      'customElements.define() twice for the same tag name. The second call throws a ' +
      'NotSupportedError that escapes React rendering and takes down the host app.',
  },
];

/**
 * Resolve the directory `@stencil/react-output-target` copies `react-component-lib/`
 * into. It mirrors the vendor's own calculation: the directory is a sibling of the
 * configured `proxiesFile`.
 */
function resolveReactComponentLibDir(config: Config, proxiesFile: string): string {
  const base = config.rootDir ?? process.cwd();
  const absoluteProxiesFile = path.isAbsolute(proxiesFile) ? proxiesFile : path.join(base, proxiesFile);
  return path.join(path.dirname(absoluteProxiesFile), 'react-component-lib');
}

/**
 * Re-apply every Pine patch to the freshly generated React component library.
 * @throws if a patch cannot be applied, so a vendor template change fails the build
 * loudly instead of shipping an unpatched file.
 */
function applyPatches(reactComponentLibDir: string): void {
  for (const patch of PATCHES) {
    const filePath = path.join(reactComponentLibDir, patch.file);

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `[react-output-target-with-patches] Expected generated file not found: ${filePath}\n` +
          `Pine patches this file after @stencil/react-output-target copies it. If the vendor ` +
          `output target no longer emits it, update PATCHES in ` +
          `libs/core/scripts/react-output-target-with-patches.ts.`
      );
    }

    const source = fs.readFileSync(filePath, 'utf-8');

    // Already patched (e.g. an incremental build that didn't re-copy the file).
    if (source.includes(patch.marker)) {
      continue;
    }

    const occurrences = source.split(patch.find).length - 1;
    if (occurrences !== 1) {
      throw new Error(
        `[react-output-target-with-patches] Could not apply the Pine patch to ${patch.file}: ` +
          `expected exactly 1 match for the vendor source, found ${occurrences}.\n\n` +
          `Why Pine patches this: ${patch.why}\n\n` +
          `This almost always means @stencil/react-output-target changed its template. ` +
          `Re-derive the patch against the new vendor source in ` +
          `node_modules/@stencil/react-output-target/react-component-lib/${patch.file} and update ` +
          `PATCHES in libs/core/scripts/react-output-target-with-patches.ts.`
      );
    }

    fs.writeFileSync(filePath, source.replace(patch.find, patch.replace));
    console.log(`✅ Re-applied Pine patch to react-component-lib/${patch.file}`);
  }
}

/**
 * Wraps `reactOutputTarget` so Pine's hand-authored patches are re-applied in the
 * same build step that regenerates the files, rather than depending on an npm-script
 * `&&` chain (which `stencil build --watch` and direct `stencil build` calls bypass).
 */
export default function reactOutputTargetWithPatches(
  options: Parameters<typeof reactOutputTarget>[0]
): OutputTargetCustom {
  const base = reactOutputTarget(options);

  return {
    ...base,
    name: 'react-library-with-pine-patches',
    async generator(config, compilerCtx, buildCtx) {
      await base.generator(config, compilerCtx, buildCtx);
      applyPatches(resolveReactComponentLibDir(config, options.proxiesFile));
    },
  };
}
