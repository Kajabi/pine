import { register, permutateThemes } from '@tokens-studio/sd-transforms';
import {generateCoreFiles, generateComponentFiles, generateSemanticFiles } from './generators/index.mjs';
import StyleDictionary from 'style-dictionary';
import { getReferences, usesReferences } from "style-dictionary/utils";
import { promises } from 'fs';

register(StyleDictionary, {
  /* options here if needed */
});

const basePath = `src/global/styles/tokens`;
const buildPath = `${basePath}/`;

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
    const brandName = themeName === 'light' || themeName === 'dark'
      ? 'kajabi_products'
      : themeName;

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
              destination: `brand/${brandName}/${brandName}.scss`,
              format: 'css/variables',
              filter: (token) => {
                // Include core tokens
                if (token.filePath.includes('base/core')) {
                  return true;
                }
                // Include semantic tokens
                if (token.filePath.includes('base/semantic')) {
                  // For non-themeable tokens, always include
                  if (!token.attributes.themeable) {
                    return true;
                  }
                  // For themeable tokens, only include if this is kajabi_products
                  if (brandName === 'kajabi_products') {
                    return true;
                  }
                }
                // Include themeable tokens for this brand
                if (token.attributes.themeable && token.filePath.includes(`brand/${brandName}`)) {
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

  const configs = [...themeConfigs, componentConfig];

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
