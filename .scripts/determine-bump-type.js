const simpleGit = require('simple-git');
const path =  require('path');
const { exec } = require('node:child_process')

const srcSvgBasePath = path.join(process.cwd(), 'libs', 'icons', 'src', 'svg');

/**
 * Creates an instance of the SimpleGit object
 * @param options - list of SimpleGitOptions
 * @returns SimpleGit client
 */
const gitClient = (options= {baseDir: srcSvgBasePath, binary: 'git'} ) => {
  return simpleGit(options);
 }

 const run = async (rootDir) => {
   const git = gitClient();

   const statusResults = await git.status([srcSvgBasePath]);

   await git.add(srcSvgBasePath);

   const { created, deleted, modified, renamed } = statusResults;

   if ( deleted.length > 0 || renamed.length > 0) {
      process.env.BUMP_TYPE = 'major';
   } else if (modified.length > 0 || created.length > 0 ) {
      process.env.BUMP_TYPE = 'minor';
   }

   // We don't want these staged in case of failure
   await exec('git restore --staged libs/icons/src/svg');
   console.log(process.env.BUMP_TYPE)
}

 run(path.join(__dirname, '..'));


