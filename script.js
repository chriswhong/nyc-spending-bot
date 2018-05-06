const moment = require('moment');
const checkbookApiCall = require('./checkbook-api-call');
// get yesterday's transactions.  Get record count from first API call, then paginate until complete

const dateString = moment().subtract(1, 'days').format('YYYY-MM-DD');

const allTransactions = []
let transactionCount = null;
let transactionsFrom = 1


const getSpending = () => {
  checkbookApiCall('2018-05-02', transactionsFrom)
    .then((data) => {
      const { count, transactions } = data;
      transactionCount = count;
      allTransactions.push(...transactions);

      console.log(transactionCount, allTransactions.length)
      if (allTransactions.length < transactionCount) {
        transactionsFrom = allTransactions.length + 1;
        getSpending();
      } else {
        console.log('I have all of the transactions!')
      }
    });
};

// kick things off
getSpending();
