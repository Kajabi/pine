import { register, permutateThemes } from '@tokens-studio/sd-transforms';
import {generateCoreFiles, generateComponentFiles, generateSemanticFiles } from './generators/index.mjs';
import StyleDictionary from 'style-dictionary';
import { getReferences, usesReferences } from "style-dictionary/utils";
import { promises } from 'fs';

register(StyleDictionary, {
  /* options here if needed */
});

const basePath = `src/global/styles/tokens`;

async function run() {
  const $themes = JSON.parse(await promises.readFile(`${basePath}/$themes.json`, 'utf-8'));
  const themes = permutateThemes($themes, { separator: '-' });

	const tokenSets = [
		...new Set(
			Object.values(themes)
				.reduce((acc, sets) => [...acc, ...sets], [])
		),
	];

	const themeableSets = tokenSets.filter(set => {
    return !Object.values(themes).every(sets => sets.includes(set));
	});

  const configs = Object.entries(themes).map(([theme, tokensets]) => ({
    log: {
      verbosity: 'verbose',
    },
    source: tokensets.map(tokenset => `${basePath}/${tokenset}.json`),
    preprocessors: ['tokens-studio'], // <-- since 0.16.0 this must be explicit
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['attribute/themeable', 'name/kebab', 'color/hex', 'ts/resolveMath', 'size/px'],
				buildPath: `${basePath}/`,
        files: [
          ...generateCoreFiles(),
					...generateSemanticFiles(theme),
          ...generateComponentFiles(),
        ],
				prefix: 'pine'
      },
    },
  }));

  for (const cfg of configs) {
    const sd = new StyleDictionary(cfg);

    /**
     * This transform checks for each token whether that token's value could change
     * due to Tokens Studio theming.
     * Any tokenset from Tokens Studio marked as "enabled" in the $themes.json is considered
     * a set in which any token could change if the theme changes.
     * Any token that is inside such a set or is a reference with a token in that reference chain
     * that is inside such a set, is considered "themeable",
     * which means it could change by theme switching.
     *
     * This metadata is applied to the token so we can use it as a way of filtering outputs
     * later in the "format" stage.
     */
    sd.registerTransform({
      name: "attribute/themeable",
      type: "attribute",
      transform: (token) => {
        function isPartOfEnabledSet(token) {
          const pathRegex = new RegExp(`^${basePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "g");
          const set = token.filePath
            .replace(pathRegex, "")
            .replace(/^\/+/g, "")
            .replace(/.json$/g, "");

          return themeableSets.includes(set);
        }

        // Set token to themeable if it's part of an enabled set
        if (isPartOfEnabledSet(token)) {
          return {
            themeable: true,
          };
        }

        // Set token to themeable if it's using a reference and inside the reference chain
        // any one of them is from a themeable set
        if (usesReferences(token.original.value)) {
          const refs = getReferences(token.original.value, sd.tokens);
          if (refs.some((ref) => isPartOfEnabledSet(ref))) {
            return {
              themeable: true,
            };
          }
        }
      },
    });

    await sd.cleanAllPlatforms();
    await sd.buildAllPlatforms();
  }
}

run();
