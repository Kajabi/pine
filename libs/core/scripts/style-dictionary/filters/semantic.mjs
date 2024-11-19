 import fs from 'fs-extra';

 import { basePath } from '../utils.mjs';

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
  (themeable = false) =>
  (token) => {
    // const themeDimensions = ["brand"];
    const tokenThemable = Boolean(token.attributes.themeable);

    const brandDimensions = fs.readdirSync(`${basePath}/brand`);
    return (
      themeable === tokenThemable &&
      [...brandDimensions, "semantic"].some((cat) => {
          return (
            token.filePath.startsWith(`${basePath}/base/${cat}`) ||
            token.filePath.startsWith(`${basePath}/brand/${cat}`)
          );
        }
      )
    );
  };
