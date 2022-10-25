const config = require('config');
const axios = require('axios');

const { TRANSACTION_TYPE } = require("../interfaces/crypto-file");
const { dateToEpoch } = require('../utils/util');

const { TIMESTAMP, TYPE, TOKEN, AMOUNT } = config.cryptoFile.columnIndex;

const tokensToBeProcessed = {};

/**
 * Function that filters and stores tokens to be processed.
 * 
 * @param {string} line - a row that contains the transaction
 * @param {string} desiredTokenName - token requested by the user
 * @param {string} desiredDate - date requested by the user
 */
const filterAndStoreToken = function (line, desiredTokenName, desiredDate) {
  const transactionTime = line.split(',')[TIMESTAMP];
  const transactionType = line.split(',')[TYPE];
  const tokenName = line.split(',')[TOKEN];
  const value = Number(line.split(',')[AMOUNT]);

  /** Latest portfolio value per token in USD. */
  if (!desiredTokenName && !desiredDate) {
    updateTokenList(tokenName, value, transactionType);
  }

  /** Specific token portfolio on specific date. */
  if (desiredTokenName && desiredDate) {
    if (tokenName === desiredTokenName && checkDateValidity(desiredDate, transactionTime)) {
      updateTokenList(tokenName, value, transactionType);
    }
  } else if (desiredTokenName && !desiredDate) {

    /** Portfolio value for specific token overall. */
    if (tokenName === desiredTokenName) {
      updateTokenList(tokenName, value, transactionType);
    }
  } else if (!desiredTokenName && desiredDate) {
    if (checkDateValidity(desiredDate, transactionTime)) {
      updateTokenList(tokenName, value, transactionType);
    }
  }
}

/**
 * Function that checks validatity of the token transaction within the desired date
 * provided by the user.
 * 
 * @param {string} desiredDate - Date entered by the user in format YYYY-MM-DD
 * @param {string} tokenDate - epoch value of the day & time the transaction was made
 * @returns 
 */
const checkDateValidity = (desiredDate, tokenDate) => {
  let startEpochDate = dateToEpoch(desiredDate);
  let endEpochDate = startEpochDate + 86400;

  return tokenDate >= startEpochDate && tokenDate <= endEpochDate;
}

/**
 * Function that updates the token list based on transaction type.
 * 
 * @param {string} tokenName - name of the token
 * @param {number} value - amount processed
 * @param {string} transactionType - type of transaction
 */
const updateTokenList = (tokenName, value, transactionType) => {
  if (transactionType === TRANSACTION_TYPE.WITHDRAWAL) {
    storeToken(tokenName, -value);
  }

  if (transactionType === TRANSACTION_TYPE.DEPOSIT) {
    storeToken(tokenName, value);
  }
}

/**
 * Function that actually stores the token amount.
 * 
 * @param {string} tokenName - name of the token.
 * @param {number} value - amount transacted.
 */
const storeToken = (tokenName, value) => {
  tokensToBeProcessed[tokenName] = tokensToBeProcessed[tokenName] ? tokensToBeProcessed[tokenName] + value : value
}

/**
 * Function that returns the desired tokens.
 */
const getDesiredTokens = () => {
  return tokensToBeProcessed;
}

/**
 * Function that prints the portfolio value of all the tokens that need to be processed.
 * 
 */
const getPortfolio = async () => {
  let promises = [];

  Object.keys(tokensToBeProcessed).forEach((key, index) => {
    promises.push(
      new Promise(async (resolve, reject) => {
        let result = await axios.get(`${config.cryptoCompare.url}fsym=${key}&tsyms=USD&api_key=${config.cryptoCompare.key}`);
        result.data.token = key;
        result.data.value = tokensToBeProcessed[key];
        resolve(result);
      })
    );
  });

  Promise.all(promises).then(convertedTokens => {
    convertedTokens.forEach((convertedToken) => {
      let data = convertedToken.data;
      data.portfolioValue = data.USD * data.value;
      console.log(data);
    })
  })
}

module.exports = {
  filterAndStoreToken,
  getDesiredTokens,
  getPortfolio
}