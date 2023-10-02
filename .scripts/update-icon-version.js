const simpleGit = require('simple-git');
const path =  require('path');
const { execSync } = require('node:child_process')
const fs = require('fs-extra');

const baseIconsPath = path.join(process.cwd(), 'libs', 'icons')
const srcIconsBasePath = path.join(baseIconsPath, 'src');
const srcSvgBasePath = path.join(srcIconsBasePath, 'svg');
const changelogsPath = path.join(baseIconsPath, 'changelogs');

/**
 * Creates an instance of the SimpleGit object
 * @param options - list of SimpleGitOptions
 * @returns SimpleGit client
 */
const gitClient = (options={baseDir: srcSvgBasePath, binary: 'git'} ) => {
  return simpleGit(options);
}

/**
 *
 * @param {*} nextVersionType - The type of version that will be performed
 * @param {*} preid  - The prereleaese identifier if type is `pre*`
 */
const run = async (nextVersionType = null, preid='') => {
  let git = gitClient();

  await git.add(srcSvgBasePath);
  const statusResults = await git.status([srcSvgBasePath]);

  const { created, deleted, modified, renamed } = statusResults;

  if ( nextVersionType === null ) {
    if ( deleted.length > 0 || renamed.length > 0) {
      nextVersionType = 'major';
    } else if (modified.length > 0 || created.length > 0 ) {
      nextVersionType = 'minor';
    }
  }

  try {
    if (nextVersionType === null) {
      console.error('Version has not been set please check raw logs to resolve issue');
      process.exit();
    }

    git = git.cwd(process.cwd())

    await git.stash(['save', '--include-untracked']);
    const iconPkgVersion = await getNextVersion(nextVersionType, preid);
    await git.stash(['pop']);

    if (iconPkgVersion == null)
      throw Error('Icon package version could not be determined')

    await updateChangelogFile(iconPkgVersion)
    await git.add([
      srcSvgBasePath, // svgs
      changelogsPath, // Changelogs
      path.join(srcIconsBasePath, 'index.html'), // updated homepage with new changelog file
      path.join(srcIconsBasePath, 'icon-data.json'), // icon data
    ])

    const msg = `created: ${created.length}, modified: ${modified.length}, renamed: ${renamed.length}, deleted: ${deleted.length}`
    await git.commit(`ci(icons): v${iconPkgVersion}, ${msg}`)
    await git.tag([`@pine-ds/icons@${iconPkgVersion}`, '-a', '-m', msg]);

    const output = [nextVersionType];
    if (preid != '' )
      output.push(preid)

    console.log(output.join(','));
  }
  catch (e) {
    console.error(`Error occurred: ${e}`);
    // await git.stash(['drop']); // Delete the stash created in the Run process;
  }
}

/**
 *
 * Will get the next version based on the type of
 * version.
 * @param nextVersionType - The type of version to run e.g major, minor
 * @returns string - the next version that the package will be
 */
const getNextVersion = async (nextVersionType, preid) => {
  let command = `npm version ${nextVersionType} --workspace libs/icons --no-git-tag-version`

  if (nextVersionType.startsWith('pre')) {
    command =  command.concat(` --preid ${preid}`);
  }

  try {
    const _npmVersionProcess = execSync(command)
    const libsPackageJSON = path.join(process.cwd(), 'libs', 'icons', 'package.json')
    const version = require(libsPackageJSON).version;

    return version;

  }
  catch (err) {
    throw Error(`An Error occurred during Versioning: ${err.stderr.toString()}`);
  }
}

/**
 * Adds the version number to the created Changelog
 *
 * @param iconPkgVersion - The version number that will be added to the Changelog header
 */
const updateChangelogFile = async (iconPkgVersion) => {
  const date = new Date();
  const strDate = [date.getFullYear().toString(), (date.getMonth() + 1).toString().padStart(2,'0'), date.getDate().toString().padStart(2,'0')].join('-');

  const changelogFilename = `${strDate}-changelog.html`
  const fullChangelogFilename = path.join(changelogsPath, changelogFilename)

  const html = fs.readFileSync(fullChangelogFilename, 'utf8')
    .replace(/{{version}}/g, `v${iconPkgVersion}`)

  // Write file to changelogs directory
  fs.writeFileSync(fullChangelogFilename, html);
}

let [,,versionType, preVersionId] = process.argv;

if ((versionType?.startsWith('pre')) && (preVersionId === '' )) {
  throw Error('When using a pre version type, you must include a preVersionId e.g alpha, beta, rc, etc')
}

if (versionType !== '') {
  run(versionType, preVersionId);
}
else {
  run();
}
