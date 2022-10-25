const readline = require('readline');

/**
 * A function that enables command-line based query system.
 * 
 * @param {string} query - question to be asked.
 * @returns - a promise with the value entered by the user.
 */
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

/**
 * Function that converts 
 * @param {*} userEnteredDateString - User entered date string in format YYYY-MM-DD
 */
const dateToEpoch = (userEnteredDateString) => {
  const date = new Date(userEnteredDateString);
  const epochTimeStamp = Math.floor(date.getTime() / 1000);

  return epochTimeStamp;
}

module.exports = {
  askQuestion,
  dateToEpoch
}