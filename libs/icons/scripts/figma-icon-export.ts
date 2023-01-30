import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'prod') {
  dotenv.config({ path: `${process.cwd()}/libs/icons/.env` })
}

const axios = require('axios');
import chalk from 'chalk'; // Terminal string styling done right
import path from 'path';
import fs from 'fs-extra';
import mkdirp from 'mkdirp';
import cliui  from 'cliui';

import { FigmaIcon, FigmaIconConfig } from "./figma_icons/types";

const info = chalk.white;
const error = chalk.red.bold;
const detail = chalk.yellowBright;
const log = console.log;

const ui = cliui({width: 80});

let figmaClient;

// Config will be read from file
// figma-icon-config.json
let config: FigmaIconConfig;

/**
 *
 * The main entry point
 *
 * @param rootDir - The root directory
 */
 const run = async (rootDir: string) => {
  try {
    await loadFigmaIconConfig(rootDir)
    figmaClient = client(config.figmaAccessToken);

    await processData(rootDir);
  }
  catch (e) {
    log(error(e));
    process.exit(1);
  }
}

/**
 * Creates an Axios HTTP client
 *
 * @param apiToken - Figma access token
 * @returns Axios client
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
 *
 * Creates the directory that will
 * contain the SVGs
 *
 */
const createOutputDirectory = () => {
  return new Promise<void>((resolve) => {
    const directory = path.resolve(config.outputPath);

    if(!fs.existsSync(directory)) {
      log(info(`Directory ${config.outputPath} does not exist`));

      if (mkdirp.sync(directory)) {
        log(info(`Created directory ${config.outputPath}`))
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
 * @param url - The URL to the SVG
 * @param name  - Name of the SVG
 * @returns a object with the name and size of the svg
 */
const downloadImage = (url: string, name: string) => {
  let nameClean = name.toLowerCase();;
  let directory = config.outputPath;

  const imagePath = path.resolve(directory, `${nameClean}.svg`);
  const writer = fs.createWriteStream(imagePath);

  // log('Image url: ', info(url));
  // log('Image Path: ', info(imagePath));

  axios.get(url, {responseType: 'stream'})
    .then((res) => {
      res.data.pipe(writer)
    })
    .catch((err) => {
      log(name)
      log(err.message)
      log(err.config.url)
      log(chalk.red.bold('Something went wrong fetching the image from S3, please try again'),)
    });

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      // log(info(`Saved ${name}.svg`, fs.statSync(imagePath).size))
      resolve({
        name: `${name}.svg`,
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
 * Process that will get all the information
 * to export the icon into a local directory
 *
 * @param rootDir - The starting location
 */
const processData = (rootDir: string) => {
  config.outputPath = path.join(rootDir, config.outputPath);

  fetchFigmaData(config.figmaFileId)
    .then((data: any) => {

      if (config.branchName && data.branches.length > 0) {
        const branch = data.branches.find(b => b.name === config.branchName)
        if (!branch) {
          log(error('No branch found with the name '), chalk.white.bgRed(config.branchName));
          process.exit(1);
        }

        const branchFileId = branch.key;
        log(info('Found branch!! Retrieving data for Branch:',detail(config.branchName), ', Branch File id:',detail(branchFileId)));

        fetchFigmaData(branchFileId)
          .then((branchData: any) => {
            const page = findPage(branchData.document, config.pageName);
            fetchAndDownloadIcons(page, branchFileId);
          });
      }
      else {
        const page = findPage(data.document, config.pageName);
        fetchAndDownloadIcons(page, config.figmaFileId)
      }
    })
    .catch((err) => {
      log(error('Error has occurred, err: ', err));
    });
}

/**
 * Extract all the icons from figma page data.
 *
 * @param pageData - an object containing the Page details
 * @returns An array of FigmaIcons
 */
const extractIcons = (pageData) => {
  const iconArray = pageData.children;

  let iconLibrary: Array<FigmaIcon> = [];

  iconArray.forEach((obj) => {

    if ( ['COMPONENT_SET', 'FRAME'].includes(obj.type) && (!config.ignoreFrames.includes(obj.name)) ) {
      const icons = obj.children;
      icons.forEach( (icon) => ( iconLibrary.push({ id: icon.id, name: !isNaN(icon.name) ?  `number-${icon.name}`: icon.name})));
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
 const fetchAndDownloadIcons = async (page, fileId: string) => {
  const iconLibrary = extractIcons(page);
  log(chalk.yellowBright(iconLibrary.length), info('icons have been extracted'))

  await fetchImageUrls(fileId, iconLibrary).then((icons: Array<FigmaIcon>) => {
    createOutputDirectory()
      .then(() => {
        Promise.all([fs.emptyDir(config.outputPath)])
          .then(() => {
            const allIcons = icons.map((icon) => downloadImage(icon.url, icon.name))
            Promise.all(allIcons).then((res) => {
              log(`${makeResultsTable(res)}\n`)
            })
          })
      });
  })
}

/**
 *
 * Retrieves the data in JSON format from
 * Figma API
 *
 * @param fileId - The unique id for the file
 * @returns Object with the Figma data
 */
 const fetchFigmaData = (fileId: string) => {
  return new Promise((resolve) => {
    const requestPath = `files/${fileId}?branch_data=true`;

    figmaClient.get(requestPath).then((resp) => {
      resolve(resp.data);
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  })
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
  return new Promise((resolve) => {
    const iconIds = icons.map(icon => icon.id).join(',')
    figmaClient.get(`images/${fileId}?ids=${iconIds}&format=svg`)
      .then((res) => {
        const imageUrls = res.data.images;
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
const findPage = (document, pageName: string) => {
  const iconPage = document.children.find(c => c.name === pageName);

  if (!iconPage) {
    log(error('No Page found, please check the name "', chalk.white.bgRedBright(config.pageName), '"'));
    process.exit(1);
  }
  return iconPage
};

const formatSize = (size) => {
  return (size / 1024).toFixed(2) + ' KiB'
}

/**
 *
 * Loads the config file
 *
 * @param rootDir - The root directory
 */
const loadFigmaIconConfig = async (rootDir: string) => {
  try {
    const configFile = path.resolve(path.join(rootDir, 'figma-icon-config.json'));

    if ( fs.existsSync(configFile)) {
      log(info('Config file located at: ',detail(configFile)));

      const strConfig = await fs.readFile(configFile, 'utf-8');
      config = JSON.parse(strConfig) as FigmaIconConfig;

      let hasError =  false;

      hasError ||= setFigmaAccessToken();
      hasError ||= setFigmaFileId();

      if (hasError) { process.exit(1); }
    }
  }
  catch (e) {
    log(error('Error occurred in "loadFigmaIconConfig, err: ', e));
    process.exit(1);
  }
}


/***************************/
/*  Kicks off the Process  */
/***************************/
run(path.join(__dirname, '..'));


/**************************/
/*                        */
/*                        */
/*   Helper Functions     */
/*                        */
/*                        */
/**************************/
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

const setFigmaAccessToken = () => {
  let hasError = false;
  // Figma Token check
  // Config file overrides Environment variable
  switch(true) {
    // Use Environment variable
    case (!!process.env.FIGMA_ACCESS_TOKEN == true):
      log(info('Using Figma Access Token in ',detail('ENVIROMENT variable')));
      config.figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN
      break;

    // Use provided token in config
    case (!!config.figmaAccessToken == true):
      log(info('Using Figma Access Token in ',detail('Configuration file')));
      break;


    // Render error and exit process
    case (!config.figmaAccessToken  && !process.env.FIGMA_ACCESS_TOKEN) == true:
      hasError ||= true;
      log(error('No Figma Access Token has been provided!!!!'))
      break;
  }

  return hasError;
}

const setFigmaFileId = () => {
  let hasError = false;
  // Figma File Id check
  // Config file overrides Environment variable
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
