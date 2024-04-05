import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
registerTransforms(StyleDictionary);
const sd = new StyleDictionary({
    source: ["src/global/styles/tokens/core/tokens.json"],
    platforms: {
        css: {
            transformGroup: "tokens-studio",
            transforms: ["name/kebab", "color/hex"],
            buildPath: "src/global/styles/tokens/semantic/",
            files: [{
                    "destination": "_tokens.scss",
                    "format": "css/variables"
                }],
            prefix: "pine"
        }
    }
});
await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
