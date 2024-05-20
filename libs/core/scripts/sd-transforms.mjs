import { registerTransforms } from '@tokens-studio/sd-transforms';
import fs from 'fs-extra';
import StyleDictionary from 'style-dictionary';

registerTransforms(StyleDictionary);

const basePath = `src/global/styles/tokens`;

const getConfig = (sets) => {
	return {
		source: sets.map(tokenSet => `${basePath}/${tokenSet}/${tokenSet}.json`),
		platforms: {
			css: {
				transformGroup: 'tokens-studio',
				transforms: ['name/kebab', 'color/hex'],
				buildPath: `${basePath}/`,
				// Create multiple outputs for each tokenset
				files: sets.map(tokenSet => ({
					// Make sure only the tokens originating from this set are output
					filter: token => token.filePath === `${basePath}/${tokenSet}/${tokenSet}.json`,
					destination: `${tokenSet}/_${tokenSet}.scss`,
					format: 'css/variables'
				})),
				options: {
					showFileHeader: false
				},
        prefix: 'pine'
			}
		},
	};
};

const sortTokens = async (sets) => {
	const tokens = JSON.parse(fs.readFileSync(`${basePath}/tokens.json`, 'utf8'));

  // Split tokensets from original JSON file into their own files
	sets.forEach(tokenSet => {
		fs.ensureDirSync(`${basePath}/${tokenSet}/`);
		if (tokens.hasOwnProperty(tokenSet)) {
			const tokensSubset = JSON.stringify(
				structuredClone(tokens[tokenSet]),
				null,
				2
			);
			fs.writeFileSync(
				`${basePath}/${tokenSet}/${tokenSet}.json`,
				tokensSubset
			);
		}
	});

	const cfg = getConfig(sets);
	const sd = new StyleDictionary(cfg);

	await sd.cleanAllPlatforms();
	await sd.buildAllPlatforms();
};

const tokenSets = ['core', 'semantic'];

sortTokens(tokenSets);