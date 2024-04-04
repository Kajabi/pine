import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
registerTransforms(StyleDictionary);

const sd = new StyleDictionary({
  source: ["src/global/styles/tokens/core/*.json"],
  platforms: {
    css: {
      transformGroup: "tokens-studio",
      transforms: ["name/kebab", "ts/shadow/css/shorthand"],
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