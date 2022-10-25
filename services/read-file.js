const fs = require('fs');
const es = require('event-stream');

const { filterAndStoreToken, getPortfolio } = require('./desired-tokens');

/**
 * Function that reads the transaction file and parses the data in parallel.
 * 
 * @param {string} desiredFilePath - path of the transaction file
 * @param {string} desiredTokenName - token requested by the user
 * @param {date} desiredDate - date requested by the user
 */
const readAndParse = (desiredFilePath, desiredTokenName, desiredDate) => {
  let lineNr = 0;
  let s = fs.createReadStream(desiredFilePath)
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
      lineNr += 1;

      /** Ignore the first line as it would be the header. */
      if (lineNr !== 1) {
        filterAndStoreToken(line, desiredTokenName, desiredDate);
      }
    })
      .on('error', function (err) {
        console.log('Error while reading file.', err);
      })
      .on('end', function () {
        console.log('Finished reading the entire file!')
        getPortfolio();
      })
    );
}

module.exports = {
  readAndParse
}