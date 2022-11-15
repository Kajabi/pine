import fs from 'fs-extra';
import { join } from 'path';

const libraryName = 'sage-icons';

const collectionCopy = async (rootDir: string) => {
  const optimizedSrc = join(rootDir, 'dist', libraryName, 'svg');
  const collectionDest = join(rootDir, 'dist', 'collection', 'components', 'icon', 'svg');

  await fs.copy(optimizedSrc, collectionDest);

  // we don't want to copy the src/svgs to the collection (distribution)
  await fs.remove(join(rootDir, 'dist', 'collection', 'svg'));

  // don't want to copy the test svgs to the collection either
  await fs.remove(join(rootDir, 'dist', 'collection', 'components', 'test'));

  const cePackaageDir = join(rootDir, 'components');
  const cePackageJsonPath = join(cePackaageDir, 'package.json');
  const ceCjsPath = join(cePackaageDir, 'index.cjs.js');

  const emptyCjs = `/*empty cjs*/`;
  await fs.writeFile(ceCjsPath, emptyCjs);

  const cePackaageJson = {
    name: '@sage/components',
    description: 'Sage Icons custom element',
    main: './index.cjs.js',
    module: '.index.js',
    types: './index.d.ts',
    private: true,
  };

  await fs.writeFile(cePackageJsonPath, JSON.stringify(cePackaageJson, null, 2));
}

collectionCopy(join(__dirname, '..'));
