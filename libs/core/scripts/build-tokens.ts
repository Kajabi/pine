import fs from 'fs-extra';
import * as tokens from '../tokens/tokens.json';

/**
 * Takes the JSON data and converts it to formatted CSS
 * custom properties.
 * 
 * @param tokens Tokens data in JSON format.
 * @param base Base string to format custom properties.
 * @returns Formatted CSS with all custom properties.
 */
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
  }, ``);

/**
 * Reads the index.scss file if it exists and adds an import statement per category name.
 * If the file doesn't exist, it will be created.
 * 
 * @param categoryName The name of the token category.
 */
const formatIndexFile = (categoryName: string) => {
	const indexFile = `${process.cwd()}/src/global/styles/tokens/index.scss`;
	const importLine = `@use '${categoryName}';\n`;
	if (!fs.existsSync(indexFile)) {
		fs.writeFileSync(indexFile, importLine);
	} else {
		const data = fs.readFileSync(indexFile);
		if (data.includes(importLine)) {
			return;
		} else {
			fs.appendFileSync(indexFile, importLine);
		}
	}
}

/**
 * Saves formatted tokens to their own SCSS partial files.
 * 
 * @param categoryName The name of the token category.
 * @param tokens Formatted tokens data as CSS custom properties.
 */
const saveTokens = async (categoryName: string, tokens: string) => {
  try {
		const path = `${process.cwd()}/src/global/styles/tokens`;
		
    await fs.writeFile(`${path}/_${categoryName}.scss`, tokens);
		await formatIndexFile(categoryName);
  } catch (e) {
		console.log("There was an error while saving a file.\n", e)
  }
}

/**
 * Runs the process to build tokens from JSON and save them to their
 * appropriate files.
 * 
 * @param data Tokens data in JSON format.
 */
const build = (data: object) => {

	try {
		Object.keys(data).map((tokenFile) => {
			const cssVariables = tokensToCss(tokens[tokenFile], `--${tokenFile}`);
			const cssClass = `:root {\n${cssVariables.replaceAll("--", "  --")}}\n`
			saveTokens(tokenFile, cssClass)
		})
		
	} catch (e) {
		console.log(
			"Provide a correct argument - a relative path to design tokens.\n",
			e
		)
	}
}

build(tokens);