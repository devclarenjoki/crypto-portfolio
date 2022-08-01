Let us assume you are a crypto investor. You have made transactions over a period of time which is logged in a CSV file. Write a command line program that does the following

Given no parameters, return the latest portfolio value per token in USD
Given a token, return the latest portfolio value for that token in USD
Given a date, return the portfolio value per token in USD on that date
Given a date and a token, return the portfolio value of that token in USD on that date
The CSV file has the following columns

timestamp: Integer number of seconds since the Epoch
transaction_type: Either a DEPOSIT or a WITHDRAWAL
token: The token symbol
amount: The amount transacted

## Getting Started
1. Clone the repository to your machine
2. Run `npm install`
3. Run `npm start`

## How to get individual values
1. Given a date and a token, return the portfolio value of that token in USD on that date
`node index.js --date=6/4/2018 --token=BTC`

Given a date, return the portfolio value per token in USD on that date
`node index.js --date=6/4/2018`


Given a token, return the latest portfolio value for that token in USD
`node index.js --token=BTC`

Given no parameters, return the latest portfolio value per token in USD
`node index.js`

## Design Decisions
1. I used promise to fetch data asynchronously.
2. I used line reader to read streams of data without storing it in memory. This is efficient in saving on storage space and also reducing data processing time since data is processed as soon as you have it.
3. I used fs file module that works with both readable and writable data.
4. I used to restart the scri[t on each change.
