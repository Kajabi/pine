import fs from 'fs-extra';
import * as tokens from '../tokens/tokens.json';

const tokensToCss = (tokens: object, base = `-`) =>
  Object.entries(tokens).reduce((css, [key, value]) => {
		let newBase = base + `-${key}`;
		if (!['description', 'type'].includes(key)) {
			newBase = newBase.replace(/\-value/, '');
			if (typeof value !== "object") {
				return css + newBase + `: ${value};\n`
			}
			return css + tokensToCss(value, newBase)
		} 
		return css
  }, ``)

const saveTokens = async (categoryName: string, tokens: string) => {
  try {
		const path = `${process.cwd()}/src/global/styles/tokens`;

    await fs.writeFile(`${path}/_${categoryName}.scss`, tokens);
		await fs.appendFile(`${path}/index.scss`, `@use '${categoryName}';\n`);
  } catch (e) {
    console.log("There was an error while saving a file.\n", e)
  }
}

const build = (data: object) => {

	try {
		// const tokensPath = format({ root: "./", base: normalize(args[0]) })
		// const tokens = require(tokensPath)
		// const { name } = parse(tokensPath)

		Object.keys(data).map((tokenFile) => {
			const cssVariables = tokensToCss(tokens[tokenFile], `--${tokenFile}`);
			const cssClass = `:root {\n${cssVariables.replaceAll("--", "  --")}}\n`
			saveTokens(tokenFile, cssClass)
			console.log(cssClass);
		})
		
	} catch (e) {
		console.log(
			"Provide a correct argument - a relative path to design tokens.\n",
			e
		)
	}
}

build(tokens);