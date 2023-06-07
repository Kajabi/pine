import fs from 'fs-extra';
import chalk from 'chalk';
import { join } from 'path'
import { optimize } from 'svgo';

import { JsonData, SvgData, reservedKeywords } from './helpers';

import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

const log = console.log;
const error = chalk.red.bold;

const libraryName = 'sage-icons';

/**
 * Builds the icons for distribution
 *
 * @param rootDir - The source directory
 * @param optimizeeFiles - Flag to indicate if we have files to optimize in `tmp/svg` folder.
 */
export const run = async(rootDir: string, optimizeFiles = false) => {
  try {
    const packageJsonPath  = join(rootDir, 'package.json');
    const distDir = join(rootDir, 'dist');
    const distSageIconsDir = join(distDir, libraryName);
    const distSvgDir = join(distDir, 'svg');
    const iconDir = join(rootDir, 'icons');

    const optimizedOutputDir = join(rootDir, 'src');
    const optimizedOutputSvgDir = join(optimizedOutputDir, 'svg');

    const srcDir = join(rootDir, 'tmp');
    let srcSvgDir = join(srcDir, 'svg');

    // We will use the current svgs in the repo (src/svg) as the
    // source during CI builds.  optimizeFiles will be FALSE.
    //
    // When running Figma icon process we will use `tmp/svg` folder.
    // optimizeFiles will be TRUE
    srcSvgDir = optimizeFiles ? srcSvgDir :  optimizedOutputSvgDir;

    log('Source SVG Directory: ', srcSvgDir);

    await cleanDirectories(iconDir, distDir, distSvgDir, distSageIconsDir);

    const packageData = await fs.readJson(packageJsonPath);
    const version = packageData.version as string;

    log('Getting SVGs...');
    const srcSvgData = await getSvgs(srcSvgDir, distSvgDir, distSageIconsDir, optimizedOutputSvgDir, optimizeFiles);

    if (optimizeFiles) {
      log('Optimized OuputSvgDir: ', optimizedOutputSvgDir)
      await fs.emptyDir(optimizedOutputSvgDir);

      log('Optimizing SVGs...');
      await optimizeSvgs(srcSvgData);
    }

    await Promise.all([
      createDataJson(version, optimizedOutputDir, distDir, srcSvgData),
      createIconPackage(version, iconDir, srcSvgData),
    ])

    const svgSymbolsContent = await createSvgSymbols(version, distDir, srcSvgData);

    await createCheatSheet(version, rootDir,  distDir, svgSymbolsContent, srcSvgData);

    await copyToTesting(rootDir, distDir, srcSvgData);
  }
  catch (e) {
    log(error(e));
    process.exit(1);
  }

}

const cleanDirectories = async (iconDir, distDir, distSvgDir, distSageIconsDir) => {
  await Promise.all([fs.emptyDir(iconDir), fs.emptyDir(distDir)]);
    await fs.emptyDir(distSvgDir), await fs.emptyDir(distSageIconsDir);
}

const getSvgs = async (srcDir: string, distSvgDir: string, distSageIconsDir: string, outputSvgDir: string, isOptimizing: boolean): Promise<SvgData[]> => {
  const optimizedSvgDir = join(distSageIconsDir, 'svg');
  await fs.emptyDir(optimizedSvgDir);

  const svgFiles = (await fs.readdir(srcDir)).filter((filename) => {
    return !filename.startsWith('.') && filename.endsWith('.svg');
  });

  const svgData = await Promise.all(
    svgFiles.map(async (fileName) => {
      // fileName: airplane-outline.svg

      if (fileName.toLowerCase() !== fileName) {
        throw new Error(`svg filename "${fileName}" must be all lowercase`);
      }

      // srcFilePath: /tmp/svg/airplane-outline.svg
      const srcFilePath = join(srcDir, fileName);

      // distSvgFilePath: /dist/svg/airplane-outline.svg
      const distSvgFilePath = join(distSvgDir, fileName);

      // optimizedFilePath: /dist/sage-icons/svg/airplane-outline.svg
      const optimizedFilePath = join(optimizedSvgDir, fileName);

      // optimizedLocalSvgFilePath: /src/svg/airplane-outline.svg
      const optimizedLocalSvgFilePath = join(outputSvgDir, fileName);

      const dotSplit = fileName.split('.');
      if (dotSplit.length > 2) {
        throw new Error(`svg filename "${fileName}" cannot contain more than one period`);
      }

      // iconName: airplane-outline
      const iconName = dotSplit[0];

      if (reservedKeywords.has(iconName)) {
        throw new Error(`svg icon name "${iconName}" is a reserved JavaScript keyword`);
      }

      // fileNameMjs: airplane-outline.mjs
      const fileNameMjs = iconName + '.mjs';

      // fileNameCjs: airplane-outline.mjs
      const fileNameCjs = iconName + '.js';

      // exportName: airplaneOutline
      const exportName = camelCase(iconName);

      const title = startCase(
        fileName.replace('.svg', '').replace('-outline', '').replace('-sharp', '').replace(/-/g, ' '),
      );

      return {
        distSvgFilePath,
        exportName,
        fileName,
        fileNameCjs,
        fileNameMjs,
        iconName,
        optimizedFilePath,
        optimizedSvgContent:  isOptimizing ? null : await fs.readFile(srcFilePath, 'utf8'),
        optimizedLocalSvgFilePath,
        srcFilePath,
        srcSvgContent: await fs.readFile(srcFilePath, 'utf8'),
        title,
      };
    }),
  );

  return svgData.sort((a, b) => {
    if (a.exportName < b.exportName) return -1;
    if (a.exportName > b.exportName) return 1;
    return 0;
  });
}

/**
 * Optimizes the SVGs that are located in
 * the src/svg folder
 *
 *
 */
const optimizeSvgs = async (srcSvgData: Array<SvgData>) => {
  const optimizePass = {};
  const webComponentPass = {
    multipass: true,
    plugins: [
      'removeStyleElement',
      'removeScriptElement',
      'removeDimensions',
      'removeUselessDefs',
      {
        name: 'removeAttrs',
        params: {
          attrs: "(fill|stroke|clip-rule)"
        }
      },
      {
        name: 'addClassesToSVGElement',
        params: {
          className: 'sageicon'
        }
      },
    ],
  };

  const sourcePass = {
    multipass: true,
    plugins: [
      'removeStyleElement',
      'removeScriptElement',
      'removeDimensions',
      'removeUselessDefs',
      {
        name: 'removeAttrs',
        params: {
          attrs: "(fill|stroke|clip-rule)"
        }
      },
      {
        name: 'addClassesToSVGElement',
        params: {
          className: 'sageicon'
        }
      },
    ]
  };

  const validatePass = {
    multipass: true,
    plugins: [],
  };

  await Promise.all(
    srcSvgData.map( async (svgData) => {
      return optimizeSvg(optimizePass, webComponentPass, sourcePass, validatePass, svgData);
    }),
  );
}

const optimizeSvg = async (optimizePass: Record<string, unknown>, webComponentPass: Record<string, unknown>, sourcePass: Record<string, unknown>, validatePass: Record<string, unknown>, svgData: SvgData) => {
  const srcSvgContent = await fs.readFile(svgData.srcFilePath, 'utf8');

  const optimizedSvg = await optimize(srcSvgContent, Object.assign(optimizePass, { path: svgData.srcFilePath }));

  const optimizedCode = optimizedSvg.data

  const webComponentSvg = await optimize(optimizedCode, Object.assign( webComponentPass, { path: svgData.srcFilePath }));
  const sourceSvg = await optimize(optimizedCode, Object.assign(sourcePass, { path: svgData.srcFilePath }));

  svgData.optimizedSvgContent = webComponentSvg.data;

  try {
    optimize(svgData.optimizedSvgContent, Object.assign(validatePass,{ path: svgData.srcFilePath }));
  }
  catch (err) {
    log(error(`${err.message}: ${svgData.srcFilePath}`));
  }

  await fs.writeFile(svgData.optimizedFilePath, svgData.optimizedSvgContent);
  await fs.writeFile(svgData.distSvgFilePath, sourceSvg.data);
  await fs.writeFile(svgData.optimizedLocalSvgFilePath, sourceSvg.data);
}

const copyToTesting = async (rootDir: string, distDir: string, srcSvgData: Array<SvgData>) => {
  const testDir = join(rootDir, 'www');
  const testBuildDir = join(testDir, 'build');
  const testSvgDir = join(testBuildDir, 'svg');

  await fs.ensureDir(testSvgDir);

  await Promise.all(
    srcSvgData.map(async (svgData) => {
      const testSvgFilePath = join(testSvgDir, svgData.fileName);
      await fs.writeFile(testSvgFilePath, svgData.optimizedSvgContent);
    }),
  );

  const distCheatsheetFilePath = join(distDir, 'cheatsheet.html');
  const testCheatsheetFilePath = join(testDir, 'cheatsheet.html');
  await fs.copyFile(distCheatsheetFilePath, testCheatsheetFilePath);
}

const createCheatSheet = async (version: string, rootDir: string, distDir: string, svgSymbolsContent: string, srcSvgData: Array<SvgData>) => {
  const CheatSheetTmpFilePath = join(rootDir, 'scripts', 'cheatsheet-template.html');
  const distCheatsheetFilePath = join(distDir, 'cheatsheet.html');

  const c = srcSvgData.map(
    (svgData) => `<a href="./svg/${svgData.fileName}"><svg><use href="#${svgData.iconName}" xlink:href="#${svgData.iconName}"/></svg></a>`,
  );

  c.push(svgSymbolsContent);

  const html = (await fs.readFile(CheatSheetTmpFilePath, 'utf8'))
    .replace(/{{version}}/g, version)
    .replace(/{{count}}/g, srcSvgData.length.toString())
    .replace(/{{content}/g, c.join('\n'));

  await fs.writeFile(distCheatsheetFilePath, html);
}

const createDataJson = async (version: string, srcDir: string, distDir: string, srcSvgData: Array<SvgData>) => {
  const srcDataJsonPath = join(srcDir, 'icon-data.json');
  const distDataJsonPath = join(distDir, `${libraryName}.json`);

  let data: JsonData;

  try {
    data = await fs.readJson(srcDataJsonPath);
  }
  catch (e) {
    data = {} as any;
  }

  data.icons = data.icons || [];

  // Add any new icons
  srcSvgData.forEach((svgData) => {
    if (!data.icons.some((i) => i.name === svgData.iconName)) {
      data.icons.push({
        name: svgData.iconName,
      })
    }
  });

  // remove deleted icons
  data.icons = data.icons.filter((dataIcon) => {
    return srcSvgData.some((svgData) => dataIcon.name === svgData.iconName);
  });

  // Sort the icons
  data.icons = data.icons.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  data.icons.forEach((icon) => {
    icon.tags = icon.tags || icon.name.split('-');
    icon.tags = icon.tags.sort();
  });

  const srcJsonStr = JSON.stringify(data, null, 2) + '\n';
  await fs.writeFile(srcDataJsonPath, srcJsonStr);

  const distJsonData = {
    name: libraryName,
    version,
    icons: data.icons,
  };

  const distJsonStr = JSON.stringify(distJsonData, null, 2) + '\n';
  await fs.writeFile(distDataJsonPath, distJsonStr);
}

const createIconPackage = async (version: string, iconDir: string, srcSvgData: Array<SvgData>) => {
  const iconPkgJsonFilePath = join(iconDir, 'package.json');

  await Promise.all([
    createEsmIcons(version, iconDir, srcSvgData),
    createCjsIcons(version, iconDir, srcSvgData),
    createDtsIcons(version, iconDir, srcSvgData),
  ]);

  const iconPkgJson = {
    name: '@sage/icons',
    version,
    module: 'index.mjs',
    main: 'index.js',
    typings: 'index.d.ts',
    private: true
  };

  const jsonStr = JSON.stringify(iconPkgJson, null, 2) + '\n';
  await fs.writeFile(iconPkgJsonFilePath, jsonStr);
}

const createEsmIcons = async (version: string, iconDir: string, srcSvgData: Array<SvgData>) => {
  const iconEsmFilePath = join(iconDir, 'index.mjs');

  const o = [`/* Sage-icons v${version}, ES Modules */`, ``];

  srcSvgData.forEach((svgData) => {
    o.push(`export const ${svgData.exportName} = ${getDataUrl(svgData)}`);
  });

  await fs.writeFile(iconEsmFilePath, o.join('\n') + '\n');
}

const createCjsIcons = async (version: string, iconDir: string, srcSvgData: Array<SvgData>) => {
  const iconCjsFilePath = join(iconDir, 'index.js');

  const o = [`/* Sage-icons v${version}, CommonJs */`, ``];

  srcSvgData.forEach((svgData) => {
    o.push(`exports.${svgData.exportName} = ${getDataUrl(svgData)}`);
  });

  await fs.writeFile(iconCjsFilePath, o.join('\n') + '\n');
}

const createDtsIcons = async (version: string, iconDir: string, srcSvgData: Array<SvgData>) => {
  const iconDtsFilePath = join(iconDir, 'index.d.ts');

  const o = [`/* Sage-icons v${version}, Types */`, ``];

  srcSvgData.forEach((svgData) => {
    o.push(`export declare var ${svgData.exportName}: string`);
  });

  await fs.writeFile(iconDtsFilePath, o.join('\n') + '\n');
}

const createSvgSymbols = async (version: string, distDir: string, srcSvgData: Array<SvgData>) => {
  srcSvgData = srcSvgData.sort((a, b) => {
    if (a.iconName < b.iconName) return -1;
    if (a.iconName > b.iconName) return 1;
    return 0;
  });

  const symbolsSvgFilePath = join(distDir, `${libraryName}.symbols.svg`);

  const lines = [
    `<svg data-sageicons="${version}" style="display:none">`,
    `<style>`,
    `.sageicon {`,
    `  fill: currentColor;`,
    `}`,
    `.sageicon-fill-none {`,
    `  fill: none;`,
    `}`,
    `.sageicon-stroke-width {`,
    `  stroke-width: 32px;`,
    `}`,
    `</style>`,
  ];

  srcSvgData.forEach((svgData) => {
    const svg = svgData.optimizedSvgContent
      .replace(`<svg xmlns="http://www.w3.org/2000/svg"`, `<symbol id="${svgData.iconName}"`)
      .replace(`</svg>`, `</symbol>`);
    lines.push(svg);
  });

  lines.push(`</svg/`, ``);

  const content = lines.join('\n');

  await fs.writeFile(symbolsSvgFilePath, content);

  return content;
}

const getDataUrl = (svgData: SvgData) => {
  let svg = svgData.optimizedSvgContent;
  if ( svg.includes(`'`)) {
    throw new Error(`Single quotes are NOT allowed!!!!!  ${svgData.fileName}`);
  }

  if (svg.includes('\n') || svg.includes('\r')) {
    throw new Error(`New lines are NOT allowed!!!!! ${svgData.fileName}`);
  }

  svg = svg.replace(/"/g, "'");

  return `"data:image/svg+xml;utf8,${svg}"`;
}
