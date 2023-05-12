import fs from 'fs-extra';
import tokens from '../tokens/tokens.json';

// This is specific to ordering short-hand
// CSS properties that require a specific order
const propertyOrder = {
	"border": ['width', 'style', 'color'],
	"box-shadow": ['x', 'y', 'blur', 'spread', 'color']
};

/**
 * Runs the process to build tokens from JSON and save them to their
 * appropriate files.
 *
 * @param data Tokens data in JSON format
 */
const build = (data: object) => {

	try {
		Object.keys(data).map((cssPropertyName) => {
			const cssVariables = tokensToCss(data[cssPropertyName], cssPropertyName, `--${cssPropertyName}`, ).replaceAll('', '');
			const cssClass = `:root {\n${cssVariables.replaceAll("--", "  --sage-")}}\n`
			saveTokens(cssPropertyName, cssClass)
		})

	} catch (e) {
		console.log(
			"Provide a correct argument - a relative path to design tokens.\n",
			e
		)
	}
}

/*** Helper Methods ***/

/**
 * Generates the custom shorthand for the CSS Custom Property.
 *
 * @param customPropName Name of the Custom Property
 * @param cssPropertyName Name of the CSS Property
 * @param value The value attribute of the custom property
 * @returns String. Formatted custom properties with appropriate shorthand values
 */
const buildShorthand = (customPropName: string, cssPropertyName, value) => {
  if (!value.hasOwnProperty('value')) {
    return '';
  }

  const {type, ...attrs} = value;

  if ( !Array.isArray(attrs.value)) {
    const {type, ...data} = attrs.value;
    return customPropName + `: ${determinePropertyOrder(cssPropertyName, data)}`;
  }

  const flattened = attrs.value.flat();

  const newCustomProperty = customPropName + `: ${
    flattened.map(v => {
      const {type, ...data} = v;

      return determinePropertyOrder(cssPropertyName, data);
    }).join(', ')}
  `
  return newCustomProperty;
}

/**
 * Generates a list of values in a defined order determined by a look-up
 * in `propertyOrder` or in order which the data keys are listed.
 *
 * @param cssProperty Name of the CSS Property
 * @param data An object of key / value pairs
 * @returns String. Formatted properties concatenated by a space
 */
const determinePropertyOrder = (cssProperty, data) => {
  if (Object.keys(propertyOrder).includes(cssProperty)) {
    const propNames = propertyOrder[cssProperty];
    const propValues = [];
    propNames.forEach(prop => {
      propValues.push(data[prop])
    })
    return getValues(propValues)
  }
  else {
    return getValues(data)
  }
}

/**
 * Reads the index.scss file if it exists and adds an import statement per category name.
 * If the file doesn't exist, it will be created.
 *
 * @param categoryName The name of the token category
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
 * Receives values of CSS property names and joins them.
 * 
 * @param data Array data to be joined
 * @returns CSS property values joined by a space
 */
const getValues = (data) => Object.values(data).join(' ');

/**
 * Saves formatted tokens to their own SCSS partial files.
 *
 * @param categoryName The name of the token category
 * @param tokens Formatted tokens data as CSS custom properties
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
 * Takes the JSON data and converts it to formatted CSS
 * custom properties.
 *
 * @param tokens Tokens data in JSON format
 * @param cssPropertyName Name of the css property
 * @param base Base string to format custom properties
 * @returns Formatted CSS with all custom properties
 */
const tokensToCss = (tokens: object, cssPropertyName, base = `-`, prevBase = '') =>
  Object.entries(tokens).reduce((css, [key, value]) => {
		let newBase = base + `-${key}`;
		if (!['description', 'type'].includes(key)) {
			newBase = newBase.replace(/\-value/, '');
			if (typeof value !== "object") {
				return css + newBase + `: ${value};\n`
			}

			// Prevents a duplicate entry based on recursion
			if ( newBase !== prevBase) {
				if (['box-shadow', 'border'].find(v => newBase.includes(v)  && newBase.indexOf('-radius') < 0)) {
					const shorthand = `${buildShorthand(newBase, cssPropertyName, value)}`;
					if ( shorthand !== '')
						return css + shorthand.trim() + ';\n' + tokensToCss(value, cssPropertyName, newBase, newBase);
				}
			}

			return css + tokensToCss(value, cssPropertyName, newBase)
		}
		return css
  }, ``);

build(tokens['core']);
