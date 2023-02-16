import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'prod') {
  dotenv.config({ path: `${process.cwd()}/libs/icons/.env` })
}

/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
import chalk from 'chalk'; // Terminal string styling done right
import path from 'path';
import fs from 'fs-extra';
import mkdirp from 'mkdirp';
import cliui  from 'cliui';
import { simpleGit, SimpleGit } from 'simple-git';

import { FigmaIcon, FigmaIconConfig } from './types';

const info = chalk.white;
const error = chalk.red.bold;
const detail = chalk.yellowBright;
const log = console.log;

const ui = cliui({width: 80});

let figmaClient;

const run = async (rootDir: string) => {
  try {
    const config: FigmaIconConfig = await loadFigmaIconConfig(rootDir);
    figmaClient =  client(config.figmaAccessToken);

    const data = await processData(rootDir, config);

    log(`${makeResultsTable(data.downloaded)}\n`);

    console.log('Icon Count: ', data.icons.length, 'Result Count: ', data.downloaded.length);
    createJsonIconList(data.icons, config.outputPath);
  }
  catch (e) {
    log(error(e));
    process.exit(1);
  }
}

/**
 * Creates the axios client with the appropriate
 * headers and url.
 *
 * @param apiToken required token to pass in the headers
 * @returns Axios client object
 */
const client = (apiToken) => {
  const figmaBaseApiURL = 'https://api.figma.com/v1';
  const instance = axios.create({
    baseURL: figmaBaseApiURL,
    headers: {
      'Content-Type': 'application/json',
      'X-Figma-Token': apiToken
    }
  })

  instance.interceptors.request.use((conf) => {
    conf.startTime = new Date().getTime();

    return conf;
  });

  return instance;
};

/**
 * Creates JSON data file that contains additional
 * metadata
 *
 * @example
 * ```
 * {
 *  "category": "features",
 *  "name": "access-key",
 *  "tags": [
 *    "access",
 *    "key",
 *    "license",
 *    "object",
 *    "password",
 *    "secure"
 *  ]
 * }
 * ```
 *
 * @param icons - array of FigmaIcons
 * @param outputDir - output directory to save the JSON data
 */
const createJsonIconList = (icons: Array<FigmaIcon>, outputDir: string) => {
  try {
    icons = icons.sort((a,b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    const outputObj = {
      icons: icons.map((icon) => {
          let tags;

          if (icon.tags) {
            tags = icon.tags?.split(',').map((tag) => (tag.trim())).sort();
          }
          else {
            tags = icon.name.split('-');
          }

          return {
            name: icon.name,
            category: icon.frame || null,
            tags: tags.sort(),
          }
        }
      )};

    const srcJsonStr = JSON.stringify(outputObj, null, 2) + '\n';
    fs.writeFileSync(path.join(outputDir, '..', 'icon-data.json'), srcJsonStr);

  }
  catch (e) {
    logErrorMessage('createJsonIconList', e);
  }
}

/**
 *
 * Creates the directory that will
 * contain the SVGs
 *
 * @param outputDir - The directory name to create
 */
const createOutputDirectory = async (outputDir: string) => {
  return new Promise<void>((resolve) => {
    const directory = path.resolve(outputDir);

    if(!fs.existsSync(directory)) {
      log(info(`Directory ${outputDir} does not exist`));

      if (mkdirp.sync(directory)) {
        log(info(`Created directory ${outputDir}`))
        resolve();
      }
    }
    else {
      resolve();
    }
  })
}

/**
 *
 * Downloads the images
 *
 * @param icon - The FigmaIcon object
 * @param outputDir - The directory that the svg will be downloaded
 * @returns a object with the name and size of the svg
 */
const downloadImage = (icon: FigmaIcon, outputDir: string) => {
  const nameClean = icon.name.toLowerCase();;
  const directory = outputDir;

  const imagePath = path.resolve(directory, `${nameClean}.svg`);
  const writer = fs.createWriteStream(imagePath);

  // log('Image url: ', info(icon.url), 'Frame: ', info(icon.frame));
  // log('Image Path: ', info(imagePath));

  axios.get(icon.url, {responseType: 'stream'})
    .then((res) => {
      res.data.pipe(writer)
    })
    .catch((err) => {
      log('Icon name: ', detail(icon.name))
      log('Error details ', '\nMessage: ', error(err.message), '\nUrl: ', detail(err.config.url))
      log(chalk.red.bold('Something went wrong fetching the image from S3, please try again'),)
    });

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      // log(info(`Saved ${name}.svg`, fs.statSync(imagePath).size))
      icon.filesize = fs.statSync(imagePath).size;
      resolve({
        name: `${icon.name}.svg`,
        size: fs.statSync(imagePath).size
      })
    })
    writer.on('error', (err) => {
      console.log('error writting file', err)
      reject(err)
    })
  })
}

/**
 * Extract all the icons from figma page data.
 *
 * @param pageData - an object containing the Page details
 * @param ignoreFrames - an array of names to be ignored
 * @param componentMetadata - an object containing additional details for the icon
 * @returns An array of FigmaIcons
 */
const extractIcons = (pageData, ignoreFrames: string[], componentMetadata) => {
  const iconFrames = pageData.children;

  const iconLibrary: Array<FigmaIcon> = [];

  iconFrames.forEach((frame) => {
    if ( ['COMPONENT_SET', 'FRAME'].includes(frame.type) && (!ignoreFrames.includes(frame.name)) ) {
      const components = frame.children;

      components.forEach( (component) => {
        // if ( componentMetadata[component.id] === undefined) {
        //   console.log('Frame: ', frame.name, 'Component Id: ', component.id, 'Metadata: ', componentMetadata[component.id])
        // }

        const icon = {
          id: component.id,
          frame: frame.name.toLowerCase().replaceAll(' ', '-'),
          name: !isNaN(component.name) ?  `number-${component.name}`: component.name
        };

        if (componentMetadata[component.id] !== undefined ) {
          icon["tags"] = componentMetadata[component.id].description
        }

        iconLibrary.push(icon)
      });
    }
  });

  return iconLibrary;
}

/**
 *
 * Process that finds and downloads SVGs
 *
 * @param page - Page object in figma
 * @param fileId - The unique Id for the Figma File
 */
const fetchAndDownloadIcons = async (page, fileId: string, config: FigmaIconConfig, componentMetadata) => {
  try {
    const iconLibrary = extractIcons(page, config.ignoreFrames, componentMetadata);

    log(chalk.yellowBright(iconLibrary.length), info('icons have been extracted'))

    const icons: Array<FigmaIcon> = await fetchImageUrls(fileId, iconLibrary)

    await createOutputDirectory(config.outputPath);
    fs.emptyDirSync(config.outputPath);

    const allIcons = icons.map((icon) => downloadImage(icon, config.outputPath));

    const results = await Promise.all(allIcons).then((res) => { return res; });

    return {
      icons: iconLibrary,
      downloaded: results,
    }

  } catch (e) {
    logErrorMessage('fetchAndDonwloadIcons', e);
  }
}

/**
 * Process that will make an API call to retrieve
 * the FigmaFile data
 *
 * @oaram fileId - string: the fileId of the Figma File / Branch
 * @returns - JSON data
 */
const fetchFigmaData = (fileId: string) => {
  const requestPath = `files/${fileId}?branch_data=true`;

  const data = figmaClient.get(requestPath)
    .then((resp) => {
      return resp.data;
    })
    .catch((err) => {
      log(error('Error occurred fetching Figma Data, error: ', err));
    });

  return data;
}

/**
 *
 * Sends a request to get a collection
 * icon urls to download
 *
 * @param fileId - The FileId that contains the icons
 * @param icons - An array of @see FigmaIcon
 * @returns - Array<FigmaIcon> with urls
 */
const fetchImageUrls = (fileId: string, icons: Array<FigmaIcon>) => {
  return new Promise<FigmaIcon[]>((resolve) => {
    const iconIds = icons.map(icon => icon.id).join(',')

    figmaClient.get(`images/${fileId}?ids=${iconIds}&format=svg`)
      .then((res) => {
        const imageUrls: string[] = res.data.images;
        log(info(`Image Api returned ${chalk.yellowBright(Object.keys(res.data.images).length)} image urls\n`));

        icons.forEach(icon => {
          icon.url = imageUrls[icon.id]
        })

        resolve(icons);
      })
      .catch((err) => {
        log(error('Unable to get icons: ', err));
        process.exit(1);
      });
  })
}

/**
 * Locate the page in the Figma Data
 *
 * @param document - Figma document data
 * @param pageName - Name of the page to find
 * @returns a Node with the Page data
 */
const findPage = (document, pageName: string,) => {
  const iconPage = document.children.find(c => c.name === pageName);

  if (!iconPage) {
    log(error('No Page found, please check the name "', chalk.white.bgRedBright(pageName), '"'));
    process.exit(1);
    // throw error(`No Page found, please check the name "${chalk.white.bgRedBright(pageName)}"`)
  }

  return iconPage
};

/**
 * Loads the figma-icon-config
 *
 * @params rootDir - The source directory
 * @returns FigmaIconConfig object
 */
const loadFigmaIconConfig = async (rootDir: string) => {
  try {
    const configFile =  path.resolve(path.join(rootDir, 'figma-icon-config.json'));

    if ( fs.existsSync(configFile)) {
      log(info('Config file located at: ', detail(configFile)));

      const strConfig = await fs.readFile(configFile, 'utf-8');
      const config = JSON.parse(strConfig) as FigmaIconConfig;

      let hasError = false;

      hasError ||= setFigmaAccessToken(config);
      hasError ||= setFigmaFileId(config);

      if (hasError) {
        logErrorMessage('loadFigmaIconConfig', null);
        process.exit(1);
      }

      return config;
    }
  }
  catch (e) {
    logErrorMessage('loadFigmaIconConfig', e);
    process.exit(1);
  }
}

/**
 * The main process that invokes the Figma Export process
 *
 * @params rootDir - The initial starting directory
 * @params config - The config data
 */
const processData = async (rootDir: string, config: FigmaIconConfig) => {
  try {
    config.outputPath = path.join(rootDir, config.outputPath);

    let figmaFileId = config.figmaFileId;
    let figmaData = await fetchFigmaData(figmaFileId);

    if ( config.branchName && figmaData.branches.length > 0) {
      const branch = figmaData.branches.find(b => b.name === config.branchName)

      if (!branch) {
        // throw error(`No branch found with the name "${chalk.white.bgRed(config.branchName)}"`);
        log(error('No branch found with the name'), chalk.white.bgRed(config.branchName));
        process.exit(1);
      }

      figmaFileId = branch.key;
      log(info('Found branch!! Retrieving data for Branch:',detail(config.branchName), ', Branch File id:',detail(figmaFileId)));

      figmaData = await fetchFigmaData(figmaFileId);
    }

    const page = findPage(figmaData.document, config.pageName);

    const response = await fs.emptyDir(config.outputPath)
    .then(() => {
      return fetchAndDownloadIcons(page, figmaFileId, config, figmaData.components);
    })

    return response;
  } catch (e) {
    logErrorMessage('processData', e);
  }
}

/***************************/
/*  Kicks off the Process  */
/***************************/
run(path.join(__dirname, '../..'));

/**
 *
 * Helper Methods
 *
 *
 */

/**
 *
 * Generates a string that represents the number
 * of KiB
 *
 * @param size - number -
 * @returns string
 */
const formatSize = (size) => {
  return (size / 1024).toFixed(2) + ' KiB'
}

/**
 *
 * Logs an error message
 * @param methodName - the name of the method the error occurred in
 * @param err - the error
 */
const logErrorMessage = (methodName: string, err) => {
  log('Error in ' , detail(methodName), '\n Message: ', error(err));
}

/**
 *
 * Outputs a table of Name and Filesize for each
 * file downloaded
 *
 * @param results - Collection of name and filesize
 *
 */
const makeResultsTable = (results) => {
  ui.div(
    makeRow(
      chalk.cyan.bold(`File`),
      chalk.cyan.bold(`Size`),
    ) + `\n\n` +
    results.map(asset => makeRow(
      asset.name.includes('-duplicate-name')
        ? chalk.red.bold(asset.name)
        : chalk.green(asset.name),
      formatSize(asset.size)
    )).join(`\n`)
  )
  return ui.toString()
}

const makeRow = (a, b) => {
  return `  ${a}\t    ${b}\t`
}

/**
 * Reads and Sets the Figma access token
 *
 * @params config - FigmaIconConfig object
 *
 * @returns boolean - hasError occurred
 */
const setFigmaAccessToken = (config: FigmaIconConfig) => {
  let hasError = false;

  // Figma Token check
  // Config file overrides Environment variable
  switch(true) {
    // Use Environment variable
    case (!!process.env.FIGMA_ACCESS_TOKEN == true):
      log(info('Using Figma Access Token in ', detail('ENVIRONMENT variable')));
      config.figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
      break;

    case (!!config.figmaAccessToken == true):
      log(info('Using Figma Access Token in ', detail('CONFIGURATION file')));
      break;

    case (!config.figmaAccessToken && !process.env.FIGMA_ACCESS_TOKEN) == true:
      hasError ||= true;
      log(error('No Figma Access Token has been provided!!!!!'));
      break;
  }

  return hasError;
}

/**
 * Sets the Figma file id
 *
 * @params config - FigmaIconConfig object
 * @returns boolean - hasError occurred
 */
const setFigmaFileId = (config: FigmaIconConfig) => {
  let hasError = false

  // Figma File Id check
  // Config file overrides Environment Variable
  switch(true) {
    // Use Environment variable
    case (!!process.env.FIGMA_FILE_ID == true):
      log(info('Using Figma File Id in ',detail('ENVIROMENT variable')));
      config.figmaFileId = process.env.FIGMA_FILE_ID
      break;

    // Use provided token in config
    case (!!config.figmaFileId == true):
      log(info('Using Figma File Id in ',detail('Configuration file')));
      break;


    // Render error and exit process
    case (!config.figmaFileId  && !process.env.FIGMA_FILE_ID) == true:
      hasError ||= true;
      log(error('No Figma File Id has been provided!!!!'))

      break;
  }

  return hasError;
}
