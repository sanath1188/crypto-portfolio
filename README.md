# crypto-portfolio
An app that takes data in form of deposits/withdrawals and calculates the portfolio value

## Design decisions
- All config level values are stored in the _config/default.json_ file
- Used readline library to create a Q&A interface
- Used event-stream library to be able to read the file quickly as it splits the file and reads the chunks in parallel without clocking the CPU
  - A function called _filterAndStoreToken_ keeps storing the transaction information as and when every line in the file is parsed
    This starts filtering only the tokens that need to parsed and stores them as key value pairs in the _tokensToBeProcessed_ object
  - Once the entire file is parsed, the getPortfolio function is triggered. At this point, the _tokensToBeProcessed_ object has all the tokens that 
    need to processed. I'm using promise.all to ensure all the API calls happen in parallel too.

## Things to improve
- Store the file metadata (file name and modified time) in the env somewhere. Read through the entire file again ONLY if either of the metadata change.
- Can code the project in typescript to ensure better use of ENUMs and enabling data type integrity.
- Add regex to ensure validity of values input (like date)

## How to run the application
- Clone the project and checkout to the main branch
- Place the transaction.csv file in the root of the project and ensure the correct file name is given in the _config/default.json_ file. The csv file should be of the format: https://general-project-assets.s3.ap-south-1.amazonaws.com/crypto_portfolio/transaction_file_sample.png
- Install node 14.16.0 (It should just about run with any version >12)
- Run the command: npm i
- Run the command: npm i -g nodemon
- Run the command: nodemon index.js
- You'll be prompted to enter the token name and date in sequence. Hit enter to skip. If no value is provided, the app will calculate the entire portfolio value for all tokens.
- If the token name is provided, the app calculates the portfolio value for the specfiic token.
- If the date is provided, the app calculates the portfolio value for the specific date.
- If both are provided, the app calculates the portfolio value for the specific token on the specific date.
- Use the YYYY-MM-DD format to enter the date
- The output comes in the format: 
  - {
  -    USD: 20318.7,
  -    token: 'BTC',
  -    value: 1200425.1521679235,
  -    portFolioValue: 24391078539.35439
  - }
  - {
  -   USD: 1497.54,
  -   token: 'ETH',
  -   value: 901704.2831248266,
  -   portFolioValue: 1350338232.1507528
  - }
  - {
  -   USD: 0.4694,
  -   token: 'XRP',
  -   value: 903332.9813728357,
  -   portFolioValue: 424024.50145640905
  - }
    where portfolioValue in each object is the corresponding portfolio value for the token name.