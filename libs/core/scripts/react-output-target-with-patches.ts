import { reactOutputTarget } from '@stencil/react-output-target';
import * as fs from 'fs';
import * as path from 'path';

/**
 * The vendor output target's own type. Deliberately derived from `reactOutputTarget`
 * rather than imported as `OutputTargetCustom` from `@stencil/core/internal`: the
 * workspace resolves two different copies of `@stencil/core` (the root hoists one for
 * `@stencil/react-output-target`, `libs/core` pins its own), so importing the type
 * directly makes this module straddle both copies and fail to typecheck. Deriving it
 * from the vendor keeps us on whichever copy the vendor itself uses.
 */
type VendorReactOutputTarget = ReturnType<typeof reactOutputTarget>;

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
 * If a `@stencil/react-output-target` upgrade changes the vendor source such that a
 * patch no longer applies, this module throws. Stencil soft-catches a custom output
 * target's error into a build diagnostic, so `stencil build` still finishes and leaves
 * the unpatched file on disk, but it reports the error and exits non-zero — so CI fails
 * rather than publishing an unpatched binding. That loud failure is the point of this
 * module. Note `stencil build --watch` never exits, so there the failure is logged only;
 * the CI drift check on `libs/react/src` is the backstop for both cases.
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
 * into, mirroring exactly where the vendor actually writes.
 *
 * The vendor only absolutizes `proxiesFile` when the legacy `directivesProxyFile`
 * option is also set (see `normalizeOutputTarget` in the vendor source) — Pine does
 * not set it, so `proxiesFile` reaches the vendor's `copyResources()` exactly as
 * configured here: relative. It is handed to `config.sys.copy()` unresolved, so Node
 * resolves it against `process.cwd()`, NOT against `config.rootDir`.
 *
 * Resolving it the same way therefore points at the files the vendor really wrote.
 * Resolving against `config.rootDir` instead would agree only while the build happens
 * to run with `cwd === rootDir` (true today: `nx run @pine-ds/core:build` runs
 * `stencil build` from `libs/core/`). If that ever changes, this resolves to the
 * directory the vendor actually wrote — and if that directory does not exist,
 * `applyPatches` throws loudly instead of silently patching a stale copy.
 */
function resolveReactComponentLibDir(proxiesFile: string): string {
  return path.resolve(path.dirname(proxiesFile), 'react-component-lib');
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

    // Already patched, so re-applying would be a no-op. The vendor re-copies the
    // pristine template on every build we have observed, so reaching this branch means
    // the copy did not happen — and the vendor passes `warn: false` to `config.sys.copy`,
    // which swallows per-file copy errors. Say so out loud rather than reporting success,
    // so a silently broken vendor copy is visible instead of looking healthy.
    if (source.includes(patch.marker)) {
      console.warn(
        `⚠️  react-component-lib/${patch.file} already contains the Pine patch marker, so ` +
          `@stencil/react-output-target did not re-copy the vendor template this build. ` +
          `Leaving the existing file untouched; if this appears in a clean build, the vendor ` +
          `copy step may be failing silently.`
      );
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
): VendorReactOutputTarget {
  const base = reactOutputTarget(options);

  return {
    ...base,
    name: 'react-library-with-pine-patches',
    // Forward every argument through verbatim. Stencil's `generator` contract takes a
    // fourth `docs` argument that the vendor happens to ignore today; spreading means a
    // future vendor version that starts reading it still receives it.
    async generator(...args: Parameters<VendorReactOutputTarget['generator']>) {
      await base.generator(...args);
      applyPatches(resolveReactComponentLibDir(options.proxiesFile));
    },
  };
}
