const config = require('config');

const { askQuestion } = require("./utils/util");
const { readAndParse } = require("./services/read-file");

/** IIFE function so as to use awaits */
(async function() {
  console.log('Hit enter to skip current query!');

  const tokenName = await askQuestion('Token name: ');
  const date = await askQuestion('Date in YYYY-MM-DD format: ');

  console.log('calculating value....');
  readAndParse(config.cryptoFile.path, tokenName.trim(), date.trim());
})()