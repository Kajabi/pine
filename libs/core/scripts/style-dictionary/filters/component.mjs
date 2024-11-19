import fs from 'fs-extra';

const basePath = `src/global/styles/tokens`;

// filters tokens by themable and from which tokenset they originate
// must match per component name, in this repository we currently only have "button"
export const componentFilter =
  (cat) =>
    (token) => token.filePath.startsWith(`${basePath}/components/${cat}.json`);
