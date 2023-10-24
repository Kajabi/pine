const isCi = process.env.CI !== ''
if (!isCi) {
  require('husky').install;
}
