import * as dotenv from 'dotenv';

import { run as optimizeSvgs} from '../optimize-svgs'
import { collectionCopy } from '../collection-copy';

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
import { simpleGit, SimpleGitOptions, StatusResult } from 'simple-git';

import { FigmaIcon, FigmaIconConfig, IconFileDetail, SvgDiffResult } from './types';

const info = chalk.white;
const error = chalk.red.bold;
const detail = chalk.yellowBright;
const log = console.log;

const baseDir = process.cwd();
const scriptsDir = path.join(baseDir, 'scripts');
const srcDir = path.join(baseDir, 'src');
const srcSvgBasePath = path.join(srcDir, 'svg');

const date = new Date();
const strDate = [date.getFullYear().toString(), (date.getMonth() + 1).toString().padStart(2,'0'), date.getDate().toString().padStart(2, '0')].join('-');

let figmaClient;

const run = async (rootDir: string) => {
  try {
    const config: FigmaIconConfig = await loadFigmaIconConfig(rootDir);
    figmaClient =  client(config.figmaAccessToken);

    const data = await processData(rootDir, config);

    await optimizeSvgs(rootDir, true);

    const git = gitClient();
    await git.add(srcSvgBasePath);

    const statusResults: StatusResult = await git.status([srcSvgBasePath]);
    const filesChanged = statusResults.files;

    if (filesChanged.length <= 0) {
      log(detail('No changes were found. Exiting the process!!!!'))

      removeTmpDirectory(config);

      return;
    }

    log('Copying collections...');
    await collectionCopy(rootDir);

    log(`${makeResultsTable(data.downloaded)}\n`);

    console.log('Icon Count: ', data.icons.length, 'Result Count: ', data.downloaded.length);
    createJsonIconList(data.icons, srcDir);

    await createChangelogHTML(statusResults);

    removeTmpDirectory(config)

    // restore staged files in case of failure
    const { exec } = require('node:child_process')
    exec(`git restore --staged ${srcSvgBasePath}`)
  }
  catch (e) {
    log(error(e));
    process.exit(1);
  }
}

/**
 * Reads the file contents to read the Svg File and stores
 * into a property to be used later
 *
 * @param status - staus indicator, this could be D - deleted, M - modified, or empty - new
 * @param filePath - relattive path to the file
 * @returns - SvgDiffResult
 */
const buildBeforeAndAfterSvg = async (status: string, filePath: string, previousFilePath: string = null):  Promise<SvgDiffResult> => {
  const filename = path.basename(filePath);
  const previousFileName = previousFilePath && path.basename(previousFilePath);

  let beforeSvg = null;
  let afterSvg = null;

  switch(status) {
    case 'D':
      beforeSvg = await getFileContentsFromGit(filePath);
      break;

    case 'M':
      beforeSvg = await getFileContentsFromGit(filePath);
      afterSvg = await getFileContentsFromDisk(filename)
      break;

    case 'R':
        beforeSvg = await getFileContentsFromGit(previousFilePath);
        afterSvg = await getFileContentsFromDisk(filename)
        break;

    case '':
      afterSvg = await getFileContentsFromDisk(filename);
      break;
  }


  return {
    previousFileName,
    filename,
    status,
    before: beforeSvg,
    after: afterSvg,
  }
}

/**
 * Generates a Header and table
 *
 * @param sectionName - name used for the Header
 * @param data  - an array of {@link SVGDiffResult}
 * @returns The string of html used to represent a section e.g Added in the Changelog
 */
const buildHTMLSection = (sectionName: string, data: Array<SvgDiffResult>) => {
  const content = `<h2>${sectionName}</h2>`
  const table: string = buildHTMLTable(data, sectionName == 'Renamed');

  return [content, table].join('\n')
}

/**
 * Generates a HTML Table
 *
 * @param data  an array of {@link SvgDiffResult}
 * @returns - The html table markup
 */
const buildHTMLTable = (data: Array<SvgDiffResult>, isRenamed = false) => {
  const tableRows = data.map((diff) => `<tr>
  ${ isRenamed ? `<td>${diff.previousFileName}</td>` : ''}
  <td>${diff.filename}</td>
  <td>${diff.before || ''}</td>
  <td>${diff.after || ''}</td>
</tr>`);

  const tableBody = `<tbody>
    ${tableRows.join('')}
  </tbody>`

  const table = `<table>
  <thead>
    <tr>
      ${ isRenamed ? `<td>Previous Filename</td>` : ''}
      <td>${ isRenamed ? `New Filename</td>` : 'FileName'}</td>
      <td>Before</td>
      <td>After</td>
    </tr>
  </thead>
  ${tableBody}
</table>`

  return table;
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
 * Creates the Changelog.html file based on the
 * latest data pulled from Figma
 *
 * @returns The results from SimpleGit.status()
 */
const createChangelogHTML = async (statusResults: StatusResult) => {
  const {modified, created, deleted, renamed} =  await processStatusResults(statusResults);

  // Adding or Deleting will be Major version bump
  // Modifying will be a MINOR version bump

  const html = fs.readFileSync(path.join(scriptsDir, 'figma_icons', 'changelog-template.html'), 'utf8')
    .replace(/{{date}}/g, strDate)
    .replace(/{{modified}}/g, statusResults.modified.length.toString())
    .replace(/{{deleted}}/g, statusResults.deleted.length.toString())
    .replace(/{{created}}/g, statusResults.created.length.toString())
    .replace(/{{renamed}}/g, statusResults.renamed.length.toString())
    .replace(/{{content}}/g, [created, modified, deleted, renamed].join('\n'));

  const changelogFilename = `${strDate}-changelog.html`
  const changelogPath = path.join(baseDir, 'changelogs');
  const fullChangelogFilename = path.join(changelogPath, changelogFilename)

  // Write file to changelogs directory
  fs.writeFileSync(fullChangelogFilename, html);

  const arrChangelogs = fs.readdirSync(changelogPath);

  const changelogRecords = []
  let numberOfChangelogs = 0;

  arrChangelogs.reverse().forEach((filename, idx) => {
    if ( path.extname(filename) === '.html') {
      if (idx < 10 ) {
        changelogRecords.push(`<a href="changelogs/${filename}">${path.basename(filename)}</a>`)
      }
      numberOfChangelogs++
    }
  })
  log('Number of Changelog files found: ', detail(numberOfChangelogs));

  const indexHtml = fs.readFileSync(path.join(baseDir, 'src','index-template.html'), 'utf8')
    .replace(/{{changelogs}}/g, changelogRecords.join(' <br/>'));

  // Copy index.html file to www worker folder
  fs.writeFileSync(path.join(baseDir, 'src', 'index.html'), indexHtml);

  if ( fs.ensureDir(path.join(baseDir, 'www')) ) {
    const wwwChangelogPath = path.join(baseDir, 'www', 'changelogs');
    const wwwChangelogFile = path.join(wwwChangelogPath, changelogFilename);

    // Create Changelogs folder in `www` worker folder
    fs.mkdirSync(wwwChangelogPath, { recursive: true })
    fs.copyFileSync(fullChangelogFilename, wwwChangelogFile)
  }

  return statusResults;
}

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
    fs.writeFileSync(path.join(outputDir, 'icon-data.json'), srcJsonStr);

  }
  catch (e) {
    logErrorMessage('createJsonIconList', e);
  }
}

/**
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
      if (err.message === 'Socket connection timeout') {
        log(detail('Create new Figma access Token'),)
      }

      log('Icon name: ', detail(icon.name))
      log('Error details ', '\nMessage: ', error(err.message), '\nUrl: ', detail(err.config.url))
      log(chalk.red.bold('Something went wrong fetching the image from S3, please try again'),)
      log(chalk.red.bold(err),)
    });

  return new Promise<IconFileDetail>((resolve, reject) => {
    writer.on('finish', () => {
      // log(info(`Saved ${name}.svg`, fs.statSync(imagePath).size))
      icon.filesize = fs.statSync(imagePath).size;
      resolve({
        name: `${icon.name}.svg`,
        size: fs.statSync(imagePath).size
      })
    });

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
    if ( ['COMPONENT_SET', 'FRAME'].includes(frame.type) && (!frame.name.startsWith('_') && !ignoreFrames?.includes(frame.name)) ) {
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

    await createOutputDirectory(config.downloadPath);
    fs.emptyDirSync(config.downloadPath);

    const allIcons = icons.map((icon) => downloadImage(icon, config.downloadPath));

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
 * @returns - JSON data from Figma API - See  {@link https://www.figma.com/developers/api#get-files-endpoint | GET File}
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
 * Sends a request to get a collection
 * icon urls to download
 *
 * @param fileId - The FileId that contains the icons
 * @param icons - An array of @see {@link FigmaIcon}
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
 * Reads the file contents using git cat-file
 * See {@link https://git-scm.com/docs/git-cat-file} for more details
 *
 * @param filePath - the relative path to the file on disk
 * @returns string
 */
const getFileContentsFromGit = async (filePath: string) => {
  return await gitClient().catFile(['blob', `HEAD:${filePath}`]);
}

/**
 * Reads the file contents located on disk
 * @param filename - the name of the file
 * @returns string
 */
const getFileContentsFromDisk = async (filename: string) => {
  return await fs.readFileSync(path.join(srcSvgBasePath, filename), 'utf8');
}

/**
 * Creates an instance of the SimpleGit object
 * @param options - list of SimpleGitOptions
 * @returns SimpleGit client
 */
 const gitClient = (options: Partial<SimpleGitOptions> = {baseDir: srcSvgBasePath, binary: 'git'} ) => {
  return simpleGit(options);
 }

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
    config.downloadPath = path.join(rootDir, config.downloadPath);

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

    const response = await fs.emptyDir(config.downloadPath)
    .then(() => {
      return fetchAndDownloadIcons(page, figmaFileId, config, figmaData.components);
    })

    return response;
  } catch (e) {
    logErrorMessage('processData', e);
  }
}

/**
 * Processes the SimpleGit status results and builds
 * the HTML Section data
 *
 * @param results - list of results from SimpleGit.status
 * @returns object - string html data for modifed, created, deleted
 */
const processStatusResults = async (results: StatusResult) => {
  const { modified: m, created: n, deleted: d, renamed: r } = results;

  let created, deleted, modified, renamed

  if (n.length > 0) {
    created = await Promise.all(n.map((path) => { return buildBeforeAndAfterSvg('', path)}));
    created = buildHTMLSection('Added', created);
  }

  if (d.length > 0) {
    deleted = await Promise.all(d.map((path) => ( buildBeforeAndAfterSvg('D', path))));
    deleted = buildHTMLSection('Deleted', deleted);
  }

  if (m.length > 0) {
    modified = await Promise.all(m.map((path) => ( buildBeforeAndAfterSvg('M', path))));
    modified = buildHTMLSection('Modified', modified);
  }

  if (r.length > 0) {
    renamed = await Promise.all(r.map((path) => ( buildBeforeAndAfterSvg('R', path.to, path.from))));
    renamed = buildHTMLSection('Renamed', renamed);
  }

  return { created, deleted, modified, renamed }
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
 * Logs an error message
 * @param methodName - the name of the method the error occurred in
 * @param err - the error
 */
const logErrorMessage = (methodName: string, err) => {
  log('Error in ' , detail(methodName), '\n Message: ', error(err));
}

/**
 * Outputs a table of Name and Filesize for each
 * file downloaded
 *
 * @param results - Collection of name and filesize
 */
const makeResultsTable = (results) => {
  const ui = cliui({width: 80});

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
 * Removes the tmp directory created during
 * the download process from the FigmaAPI
 *
 * @param config - FigmaIconConfig object
 */
const removeTmpDirectory = (config: FigmaIconConfig) => {
  log('Removing tmp directory')
  const tmpDir = path.join(config.downloadPath, '..');
  fs.rmSync(tmpDir, { force: true, recursive: true });
}
/**
 * Reads and Sets the Figma access token
 *
 * @params config - FigmaIconConfig object
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
