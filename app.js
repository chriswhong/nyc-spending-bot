const moment = require('moment');
const checkbookApiCall = require('./checkbook-api-call');
const processTransactions = require('./process-transactions');
const sendTweets = require('./send-tweets');
// get yesterday's transactions.  Get record count from first API call, then paginate until complete
const passedDate = process.argv[2];
const dateString = passedDate || moment().subtract(1, 'days').format('YYYY-MM-DD');

const allTransactions = [];
let transactionCount = null;
let transactionsFrom = 1;

console.log(process.env.NODE_ENV);


// recursive function to paginate through checkbook NYC API
const getSpending = () => {
  console.log(`Making API call for ${dateString}, starting from record ${transactionsFrom}...`);
  checkbookApiCall(dateString, transactionsFrom)
    .then((data) => {
      console.log('Data received...');
      const { count, transactions } = data;
      transactionCount = count;
      allTransactions.push(...transactions);

      if (allTransactions.length < transactionCount) {
        transactionsFrom = allTransactions.length + 1;
        getSpending();
      } else {
        console.log(`All ${transactionCount} transactions downloaded...`);
        const tweetStrings = processTransactions(allTransactions, dateString);

        // only send tweets in production
        // otherwise, console log all the tweets
        if (process.NODE_ENV === 'production') {
          sendTweets(tweetStrings);
        } else {
          tweetStrings.forEach((status) => {
            console.log(status);
          });
        }
      }
    });
};

// kick things off
getSpending();
