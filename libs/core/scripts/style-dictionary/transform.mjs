import { register, permutateThemes } from '@tokens-studio/sd-transforms';
import {generateCoreFiles, generateComponentFiles, generateSemanticFiles } from './generators/index.mjs';
import StyleDictionary from 'style-dictionary';
import { getReferences, usesReferences } from "style-dictionary/utils";
import { promises } from 'fs';

register(StyleDictionary, {
  /* options here if needed */
});

const basePath = `src/global/styles/tokens`;
const buildPath = `${basePath}/_output/`;

async function run() {
  const $themes = JSON.parse(await promises.readFile(`${basePath}/$themes.json`, 'utf-8'));
  const themes = permutateThemes($themes, { separator: '-' });
  console.log('Generated themes:', themes);

	const tokenSets = [
		...new Set(
			Object.values(themes)
				.reduce((acc, sets) => [...acc, ...sets], [])
		),
	];

	const themeableSets = tokenSets.filter(set => {
    return !Object.values(themes).every(sets => sets.includes(set));
	});

  // Theme-specific configuration
  const themeConfigs = Object.entries(themes).map(([theme, tokensets]) => {
    const [themeName] = theme.toLowerCase().split('-');

    return {
      log: {
        verbosity: 'verbose',
      },
      source: tokensets.map(tokenset => `${basePath}/${tokenset}.json`),
      preprocessors: ['tokens-studio'],
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          transforms: ['attribute/themeable', 'name/kebab', 'color/hex', 'ts/resolveMath', 'size/px'],
          buildPath: buildPath,
          files: [
            // Core and semantic files for the brand
            {
              destination: `${themeName}/styles/${themeName}.scss`,
              format: 'css/variables',
              filter: (token) => {
                // Include core tokens
                if (token.filePath.includes('base/core')) {
                  return true;
                }
                // Include semantic tokens
                if (token.filePath.includes('base/semantic')) {
                  return true; // Include all semantic tokens for all themes
                }
                // Include themeable tokens for this brand
                if (token.attributes.themeable && (
                  token.filePath.includes(`${themeName}.json`) ||
                  token.filePath.includes(`${themeName}/`)
                )) {
                  return true;
                }
                return false;
              },
              options: {
                outputReferences: true
              }
            }
          ],
          prefix: 'pine'
        },
      },
    };
  });

  // Base configuration for semantic files
  const baseConfig = {
    log: {
      verbosity: 'verbose',
    },
    source: [
      `${basePath}/base/core.json`,
      `${basePath}/base/semantic.json`
    ],
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['attribute/themeable', 'name/kebab', 'color/hex', 'ts/resolveMath', 'size/px'],
        buildPath: buildPath,
        files: [
          // Core tokens
         ...generateCoreFiles(),
          // Non-themeable semantic tokens
          ...generateSemanticFiles()
        ],
        prefix: 'pine'
      },
    },
  };

  // Component-specific configuration
  const componentConfig = {
    log: {
      verbosity: 'verbose',
    },
    source: [
      `${basePath}/base/core.json`,
      `${basePath}/base/semantic.json`,
      `${basePath}/components/*.json`
    ],
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['attribute/themeable', 'name/kebab', 'color/hex', 'ts/resolveMath', 'size/px'],
        buildPath: buildPath,
        files: [...generateComponentFiles()],
        prefix: 'pine'
      },
    },
  };

  // Build base files first
  const sd = new StyleDictionary(baseConfig);

  // Build component files
  const componentSd = new StyleDictionary(componentConfig);

  // Build theme files
  const themeSds = themeConfigs.map(config => new StyleDictionary(config));

  // Register transform for all configurations
  const allSds = [sd, componentSd, ...themeSds];
  for (const sd of allSds) {
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
  }

  // Build all platforms in order
  await sd.buildAllPlatforms();
  await componentSd.buildAllPlatforms();
  for (const themeSd of themeSds) {
    await themeSd.buildAllPlatforms();
  }
}

run();
