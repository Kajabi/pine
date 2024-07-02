import { registerTransforms } from '@tokens-studio/sd-transforms';
import fs from 'fs-extra';
import StyleDictionary from 'style-dictionary';

registerTransforms(StyleDictionary);

const basePath = `src/global/styles/tokens`;

// Dynamically get token set names from folder names
const getTokenSetNamesFromFolders = (path) => {
	let tokenSets = [];
	fs.readdirSync(path, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => tokenSets.push(dirent.name));

	return tokenSets;
}

// Set up Style Dictionary config
const getConfig = (sets) => {
	return {
		source: sets.map(tokenSet => `${basePath}/${tokenSet}/${tokenSet}.json`),
		platforms: {
			css: {
				transformGroup: 'tokens-studio',
				transforms: ['name/kebab', 'color/hex'],
				buildPath: `${basePath}/`,
				// Create multiple outputs for each token set
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

const tokenSets = getTokenSetNamesFromFolders(basePath);
const cfg = getConfig(tokenSets);
const sd = new StyleDictionary(cfg);

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
