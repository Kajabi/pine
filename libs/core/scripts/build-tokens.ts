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
		await formatIndexFile(categoryName);
  } catch (e) {
		console.log("There was an error while saving a file.\n", e)
  }
}

const formatIndexFile = (categoryName: string) => {
	const indexFile = `${process.cwd()}/src/global/styles/tokens/index.scss`;
	const importLine = `@use '${categoryName}';\n`;
	if (!fs.existsSync(indexFile)) {
		fs.writeFileSync(indexFile, importLine);
	} else {
		fs.readFile(indexFile, (err, data) => {
			if (err) throw err;
			if (data.includes(importLine)) {
				return;
			} else {
				fs.appendFileSync(indexFile, importLine);
			}
		});
	}
}

const build = (data: object) => {

	try {
		Object.keys(data).map((tokenFile) => {
			const cssVariables = tokensToCss(tokens[tokenFile], `--${tokenFile}`);
			const cssClass = `:root {\n${cssVariables.replaceAll("--", "  --")}}\n`
			saveTokens(tokenFile, cssClass)
			// console.log(cssClass);
		})
		
	} catch (e) {
		console.log(
			"Provide a correct argument - a relative path to design tokens.\n",
			e
		)
	}
}

build(tokens);